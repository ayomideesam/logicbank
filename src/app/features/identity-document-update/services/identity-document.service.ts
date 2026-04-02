import { Injectable, signal, computed } from '@angular/core';

export type IdDocumentType = 'Voters Card' | 'Utility Bill';

export interface UploadedFile {
  file: File;
  name: string;
  sizeMb: string;
}

export interface IdentityDocumentFormState {
  accountNumber: string;
  nin: string;
  documentType: IdDocumentType | '';
  documentNumber: string;
  frontFile: UploadedFile | null;
  backFile: UploadedFile | null;
  utilityBillFile: UploadedFile | null;
  termsAccepted: boolean;
  consentAccepted: boolean;
}

@Injectable({ providedIn: 'root' })
export class IdentityDocumentService {
  private readonly _form = signal<IdentityDocumentFormState>({
    accountNumber: '',
    nin: '',
    documentType: '',
    documentNumber: '',
    frontFile: null,
    backFile: null,
    utilityBillFile: null,
    termsAccepted: false,
    consentAccepted: false
  });

  readonly form = computed(() => this._form());

  // ── Account verification step ─────────────────────────────────────────────
  private readonly _accountVerified = signal(false);
  readonly accountVerified = computed(() => this._accountVerified());

  private readonly _accountLoading = signal(false);
  readonly accountLoading = computed(() => this._accountLoading());

  private readonly _accountError = signal(false);
  readonly accountError = computed(() => this._accountError());

  // ── OTP step ─────────────────────────────────────────────────────────────
  private readonly _otpError = signal(false);
  readonly otpError = computed(() => this._otpError());

  private readonly _otpValidating = signal(false);
  readonly otpValidating = computed(() => this._otpValidating());

  private readonly _showOtpFailureModal = signal(false);
  readonly showOtpFailureModal = computed(() => this._showOtpFailureModal());

  // ── In-session flag (NOT persisted) — distinguishes fresh validation from page refresh ──
  private readonly _accountVerifiedInSession = signal(false);
  readonly accountVerifiedInSession = computed(() => this._accountVerifiedInSession());

  // ── Session persistence ───────────────────────────────────────────────────
  private static readonly ACCOUNT_KEY = 'idu_account';

  constructor() {
    try {
      const raw = sessionStorage.getItem(IdentityDocumentService.ACCOUNT_KEY);
      if (raw) {
        // Only the accountNumber is restored — verified state is never persisted.
        // This means after a page refresh the user sees their number pre-filled
        // but the component will auto-revalidate before showing the OTP section.
        this._form.update(s => ({ ...s, accountNumber: raw }));
      }
    } catch { /* non-browser environment */ }
  }

  // ── Patchers ─────────────────────────────────────────────────────────────
  patchForm(patch: Partial<IdentityDocumentFormState>): void {
    this._form.update(s => ({ ...s, ...patch }));
  }

  // ── Mock account validation (10-digit match) ─────────────────────────────
  async validateAccount(accountNumber: string): Promise<void> {
    this._accountLoading.set(true);
    this._accountError.set(false);
    await new Promise(r => setTimeout(r, 2500));
    this._accountLoading.set(false);
    // Any valid 10-digit number passes
    if (accountNumber.length === 10) {
      this._accountVerified.set(true);
      this._accountVerifiedInSession.set(true);
      try {
        // Store only the account number — NOT the verified flag
        sessionStorage.setItem(IdentityDocumentService.ACCOUNT_KEY, accountNumber);
      } catch { /* noop */ }
    } else {
      this._accountError.set(true);
    }
  }

  resetAccountVerification(): void {
    this._accountVerified.set(false);
    this._accountError.set(false);
    this._accountLoading.set(false);
    this._accountVerifiedInSession.set(false);
    // Clear account number from form so navigating back shows a clean field
    this._form.update(s => ({ ...s, accountNumber: '' }));
    try { sessionStorage.removeItem(IdentityDocumentService.ACCOUNT_KEY); } catch { /* noop */ }
  }

  // ── Mock OTP validation ───────────────────────────────────────────────────
  // '307394' always fails, anything else succeeds
  async validateOtp(otp: string): Promise<boolean> {
    this._otpValidating.set(true);
    this._otpError.set(false);
    await new Promise(r => setTimeout(r, 1000));
    this._otpValidating.set(false);
    if (otp === '307394') {
      this._otpError.set(true);
      this._showOtpFailureModal.set(true);
      return false;
    }
    return true;
  }

  clearOtpError(): void {
    this._otpError.set(false);
    this._showOtpFailureModal.set(false);
  }

  closeOtpFailureModal(): void {
    this._showOtpFailureModal.set(false);
  }

  // ── File helpers ─────────────────────────────────────────────────────────
  private toUploadedFile(file: File): UploadedFile {
    return {
      file,
      name: file.name,
      sizeMb: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    };
  }

  setFrontFile(file: File): void {
    this._form.update(s => ({ ...s, frontFile: this.toUploadedFile(file) }));
  }

  setBackFile(file: File): void {
    this._form.update(s => ({ ...s, backFile: this.toUploadedFile(file) }));
  }

  setUtilityBillFile(file: File): void {
    this._form.update(s => ({ ...s, utilityBillFile: this.toUploadedFile(file) }));
  }

  resetAll(): void {
    this._form.set({
      accountNumber: '',
      nin: '',
      documentType: '',
      documentNumber: '',
      frontFile: null,
      backFile: null,
      utilityBillFile: null,
      termsAccepted: false,
      consentAccepted: false
    });
    this._accountVerified.set(false);
    this._otpError.set(false);
    this._showOtpFailureModal.set(false);
    this._accountVerifiedInSession.set(false);
    try { sessionStorage.removeItem(IdentityDocumentService.ACCOUNT_KEY); } catch { /* noop */ }
  }
}
