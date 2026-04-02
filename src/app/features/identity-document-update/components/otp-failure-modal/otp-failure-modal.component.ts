import { Component, output } from '@angular/core';

@Component({
  selector: 'app-otp-failure-modal',
  standalone: true,
  templateUrl: './otp-failure-modal.component.html',
  styleUrl: './otp-failure-modal.component.css'
})
export class OtpFailureModalComponent {
  readonly close = output<void>();
  readonly cancelRequest = output<void>();

  onClose(): void {
    this.close.emit();
  }

  onCancelRequest(): void {
    this.cancelRequest.emit();
  }
}
