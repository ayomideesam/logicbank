import {
  Component, inject, signal, computed, effect, OnInit, OnDestroy, ElementRef, ViewChildren, QueryList
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe as NgDecimalPipe } from '@angular/common';
import { IdentityDocumentService } from '../../services/identity-document.service';
import { OtpFailureModalComponent } from '../otp-failure-modal/otp-failure-modal.component';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [FormsModule, NgDecimalPipe, OtpFailureModalComponent],
  templateUrl: './account-verification.component.html',
  styleUrl: './account-verification.component.css'
})

export class AccountVerificationComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  readonly idService = inject(IdentityDocumentService);

  // ── Account number field ──────────────────────────────────────────────────
  // Initialised from service so persisted value survives a page refresh
  accountNumber = signal(this.idService.form().accountNumber);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onAccountNumberInput(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    this.accountNumber.set(digits);
    this.idService.resetAccountVerification();

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (digits.length === 10) {
      this.debounceTimer = setTimeout(() => {
        this.idService.patchForm({ accountNumber: digits });
        this.idService.validateAccount(digits);
      }, 1500);
    }
  }

  // ── OTP boxes (6 slots) ───────────────────────────────────────────────────
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpDigits = signal<string[]>(['', '', '', '', '', '']);
  otpFull = computed(() => this.otpDigits().join(''));
  otpComplete = computed(() => this.otpFull().length === 6);

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(0, 1);
    input.value = val;
    const digits = [...this.otpDigits()];
    digits[index] = val;
    this.otpDigits.set(digits);
    this.idService.clearOtpError();

    if (val && index < 5) {
      const next = this.otpInputs.toArray()[index + 1];
      next?.nativeElement.focus();
    }

    if (this.otpComplete()) {
      this.submitOtp();
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const digits = [...this.otpDigits()];
      if (!digits[index] && index > 0) {
        digits[index - 1] = '';
        this.otpDigits.set(digits);
        this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
      }
    }
  }

  private async submitOtp(): Promise<void> {
    const success = await this.idService.validateOtp(this.otpFull());
    if (success) {
      // Show the success checkmark for 2.5s before navigating
      await new Promise(r => setTimeout(r, 2500));
      this.router.navigate(['/identity-document-update/upload']);
    }
  }

  // ── OTP resend timer ─────────────────────────────────────────────────────
  resendCountdown = signal(10);
  canResend = computed(() => this.resendCountdown() === 0);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private prevAccountVerified = false;

  constructor() {
    // Countdown starts only when accountVerified transitions false → true via
    // an active validateAccount() call — never on component init alone.
    effect(() => {
      const verified = this.idService.accountVerified();
      if (verified && !this.prevAccountVerified) {
        this.startResendCountdown();
      } else if (!verified) {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
        }
        this.resendCountdown.set(10);
      }
      this.prevAccountVerified = verified;
    });
  }

  ngOnInit(): void {
    // Page-refresh case: accountNumber was restored from sessionStorage but
    // verified = false. Auto-revalidate so the OTP section re-appears without
    // the user having to retype their number.
    const restored = this.accountNumber();
    if (restored.length === 10 && !this.idService.accountVerified()) {
      setTimeout(() => {
        this.idService.patchForm({ accountNumber: restored });
        this.idService.validateAccount(restored);
      }, 300);
    }
  }

  private startResendCountdown(): void {
    this.resendCountdown.set(10);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      const current = this.resendCountdown();
      if (current <= 0) {
        clearInterval(this.countdownInterval!);
        this.countdownInterval = null;
      } else {
        this.resendCountdown.update(v => +(v - 0.01).toFixed(2));
      }
    }, 10);
  }

  onResend(): void {
    if (!this.canResend()) return;
    this.otpDigits.set(['', '', '', '', '', '']);
    this.idService.clearOtpError();
    this.startResendCountdown();
    // Focus first OTP box
    setTimeout(() => this.otpInputs.toArray()[0]?.nativeElement.focus(), 50);
  }

  // ── Modal handlers ────────────────────────────────────────────────────────
  showOtpModal = this.idService.showOtpFailureModal;

  onModalClose(): void {
    this.idService.closeOtpFailureModal();
  }

  onCancelRequest(): void {
    this.idService.resetAll();
    this.router.navigate(['/']);
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  goBack(): void {    // Reset all verification state so returning here forces fresh entry
    this.idService.resetAccountVerification();    this.router.navigate(['/identity-document-update']);
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }
}
