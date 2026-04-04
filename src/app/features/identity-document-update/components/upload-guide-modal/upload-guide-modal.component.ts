import { Component, input, output, signal } from '@angular/core';
import { IdDocumentType } from '../../services/identity-document.service';

@Component({
  selector: 'app-upload-guide-modal',
  standalone: true,
  imports: [],
  templateUrl: './upload-guide-modal.component.html',
  styleUrl: './upload-guide-modal.component.css'
})
export class UploadGuideModalComponent {
  readonly docType = input.required<IdDocumentType | ''>();
  readonly confirmed = output<void>();
  readonly closed = output<void>();

  currentSlide = signal(0);
  readonly totalSlides = 3;

  get slideTexts(): string[] {
    const dt = this.docType() || 'Identity Document';
    return [
      `Place your ${dt} on a flat surface and make sure that the data is visible.`,
      `Make sure you do not cover your ${dt} data (finger, paperclip etc).`,
      `The ${dt} needs to be clear with no reflection, make sure all the data is readable.`
    ];
  }

  get currentText(): string {
    return this.slideTexts[this.currentSlide()];
  }

  prev(): void {
    if (this.currentSlide() > 0) this.currentSlide.update(v => v - 1);
  }

  next(): void {
    if (this.currentSlide() < this.totalSlides - 1) this.currentSlide.update(v => v + 1);
  }

  onClose(): void { this.closed.emit(); }
  onConfirm(): void { this.confirmed.emit(); }
}
