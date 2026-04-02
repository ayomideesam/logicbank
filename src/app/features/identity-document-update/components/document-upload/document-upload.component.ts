import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IdentityDocumentService,
  IdDocumentType
} from '../../services/identity-document.service';
import { UploadGuideModalComponent } from '../upload-guide-modal/upload-guide-modal.component';

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg'];

export const OCCUPATION_OPTIONS = [
  'Banker', 'Doctor', 'Engineer', 'Lawyer', 'Teacher',
  'Civil Servant', 'Entrepreneur', 'Accountant', 'Nurse', 'Other'
];

export const NATURE_OF_BUSINESS_OPTIONS = [
  'Employee', 'Self-Employed', 'Business Owner', 'Contractor', 'Retiree', 'Student', 'Other'
];

export const ANNUAL_TURNOVER_OPTIONS = [
  'Below 500,000', '500,000 - 1,000,000', '1,000,001 - 5,000,000',
  '5,000,001 - 10,000,000', '10,000,001 - 50,000,000', 'Above 50,000,000'
];

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [FormsModule, UploadGuideModalComponent],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})

export class DocumentUploadComponent {
  private router = inject(Router);
  readonly idService = inject(IdentityDocumentService);

  // ── Form field signals (restored from service so nav away+back keeps values) ──
  nin = signal(this.idService.form().nin);
  docNumber = signal(this.idService.form().documentNumber);
  docType = signal<IdDocumentType | ''>(this.idService.form().documentType);

  // ── Dropdown state ────────────────────────────────────────────────────────
  dropdownOpen = signal(false);
  readonly docTypeOptions: IdDocumentType[] = ['Voters Card', 'Passport', 'Identity Document'];

  toggleDropdown(): void { this.dropdownOpen.update(v => !v); }

  selectDocType(type: IdDocumentType): void {
    this.docType.set(type);
    this.dropdownOpen.set(false);
    // All doc types now show Front+Back — clear utility bill if lingering
    this.idService.patchForm({ frontFile: null, backFile: null, utilityBillFile: null });
    this.frontFileError.set('');
    this.backFileError.set('');
    this.utilityFileError.set('');
  }

  // ── File drag state ───────────────────────────────────────────────────────
  frontDragOver = signal(false);
  backDragOver = signal(false);
  utilityDragOver = signal(false);

  // ── File error state ──────────────────────────────────────────────────────
  frontFileError = signal('');
  backFileError = signal('');
  utilityFileError = signal('');

  // ── Computed from service ─────────────────────────────────────────────────
  readonly form = this.idService.form;
  readonly termsAccepted = computed(() => this.form().termsAccepted);
  readonly accountNumber = computed(() => this.form().accountNumber);

  // ── Validate file helper ──────────────────────────────────────────────────
  private validateFile(file: File): string {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Only PDF and JPG files are supported.';
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `File must be under ${MAX_FILE_SIZE_MB} MB.`;
    return '';
  }

  // ── Duplicate check helper ────────────────────────────────────────────────
  private isSameFile(a: File, b: { name: string; file: File } | null): boolean {
    if (!b) return false;
    return a.name === b.name && a.size === b.file.size;
  }

  // ── File select handlers ──────────────────────────────────────────────────
  onFrontFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    if (err) { this.frontFileError.set(err); return; }
    if (this.isSameFile(file, this.form().backFile)) {
      this.frontFileError.set('Front and Back documents must be different files.');
      return;
    }
    this.frontFileError.set('');
    this.idService.setFrontFile(file);
  }

  onBackFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    if (err) { this.backFileError.set(err); return; }
    if (this.isSameFile(file, this.form().frontFile)) {
      this.backFileError.set('Front and Back documents must be different files.');
      return;
    }
    this.backFileError.set('');
    this.idService.setBackFile(file);
  }

  onUtilityFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    this.utilityFileError.set(err);
    if (!err) this.idService.setUtilityBillFile(file);
  }

  // ── Drag-and-drop handlers ────────────────────────────────────────────────
  onDragOver(slot: 'front' | 'back' | 'utility', event: DragEvent): void {
    event.preventDefault();
    if (slot === 'front') this.frontDragOver.set(true);
    else if (slot === 'back') this.backDragOver.set(true);
    else this.utilityDragOver.set(true);
  }

  onDragLeave(slot: 'front' | 'back' | 'utility'): void {
    if (slot === 'front') this.frontDragOver.set(false);
    else if (slot === 'back') this.backDragOver.set(false);
    else this.utilityDragOver.set(false);
  }

  onDrop(slot: 'front' | 'back' | 'utility', event: DragEvent): void {
    event.preventDefault();
    this.onDragLeave(slot);
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    if (slot === 'front') {
      if (err) { this.frontFileError.set(err); return; }
      if (this.isSameFile(file, this.form().backFile)) {
        this.frontFileError.set('Front and Back documents must be different files.'); return;
      }
      this.frontFileError.set(''); this.idService.setFrontFile(file);
    } else if (slot === 'back') {
      if (err) { this.backFileError.set(err); return; }
      if (this.isSameFile(file, this.form().frontFile)) {
        this.backFileError.set('Front and Back documents must be different files.'); return;
      }
      this.backFileError.set(''); this.idService.setBackFile(file);
    } else { this.utilityFileError.set(err); if (!err) this.idService.setUtilityBillFile(file); }
  }

  // ── Terms ─────────────────────────────────────────────────────────────────
  onTermsCheckboxClick(): void {
    this.idService.patchForm({ termsAccepted: !this.termsAccepted() });
  }

  onTermsLinkClick(): void {
    this.idService.patchForm({ nin: this.nin(), documentType: this.docType(), documentNumber: this.docNumber() });
    this.router.navigate(['/identity-document-update/terms']);
  }

  // ── Form validity ─────────────────────────────────────────────────────────
  readonly canSubmit = computed(() => {
    const f = this.form();
    const type = this.docType();
    const base = this.nin().trim().length > 0 && type !== '' && this.docNumber().trim().length > 0 && f.termsAccepted;
    // All types require front + back
    return base && f.frontFile !== null && f.backFile !== null;
  });

  // Update button (shown after utility upload section appears)
  readonly canUpdate = computed(() => this.canSubmit() && this.form().utilityBillFile !== null);

  // ── Modal + flow state ────────────────────────────────────────────────────
  showAdditionalDocModal = signal(false);  // "Additional document required"
  showUtilityUpload = signal(false);        // Utility bill upload zone visible
  showCompleteNowModal = signal(false);     // "Please proceed to update information"
  showOutstandingInfo = signal(false);      // Outstanding information section
  showSuccessModal = signal(false);         // "Submission successful"
  showFailedModal = signal(false);          // "Update request failed"

  // ── Submit flow ───────────────────────────────────────────────────────────
  onSubmit(): void {
    if (!this.canSubmit()) return;
    this.idService.patchForm({ nin: this.nin(), documentType: this.docType(), documentNumber: this.docNumber() });
    // First submit always shows "Additional document required"
    this.showAdditionalDocModal.set(true);
  }

  onSkipForNow(): void {
    this.showAdditionalDocModal.set(false);
    this.showUtilityUpload.set(false);
    // Show "Please proceed to update information on your account"
    this.showCompleteNowModal.set(true);
  }

  onUploadNow(): void {
    this.showAdditionalDocModal.set(false);
    this.showUtilityUpload.set(true);
  }

  onUpdate(): void {
    // After uploading utility bill, show "Please proceed to update"
    this.showCompleteNowModal.set(true);
  }

  onCompleteNow(): void {
    this.showCompleteNowModal.set(false);
    this.showOutstandingInfo.set(true);
  }

  // ── Outstanding Information ───────────────────────────────────────────────
  occupationOpen = signal(false);
  natureOfBusinessOpen = signal(false);
  annualTurnoverOpen = signal(false);

  occupation = signal('');
  natureOfBusiness = signal('');
  employerName = signal('');
  employerAddress = signal('');
  annualTurnover = signal('');

  readonly occupationOptions = OCCUPATION_OPTIONS;
  readonly natureOfBusinessOptions = NATURE_OF_BUSINESS_OPTIONS;
  readonly annualTurnoverOptions = ANNUAL_TURNOVER_OPTIONS;

  selectOccupation(v: string): void { this.occupation.set(v); this.occupationOpen.set(false); }
  selectNatureOfBusiness(v: string): void { this.natureOfBusiness.set(v); this.natureOfBusinessOpen.set(false); }
  selectAnnualTurnover(v: string): void { this.annualTurnover.set(v); this.annualTurnoverOpen.set(false); }

  toggleOccupationOpen(): void { this.occupationOpen.update(v => !v); }
  toggleNatureOfBusinessOpen(): void { this.natureOfBusinessOpen.update(v => !v); }
  toggleAnnualTurnoverOpen(): void { this.annualTurnoverOpen.update(v => !v); }

  readonly canFinalSubmit = computed(() =>
    this.occupation().trim().length > 0 && this.natureOfBusiness().trim().length > 0
  );

  // Final submit is randomly success or failed (50/50 mock)
  onFinalSubmit(): void {
    if (!this.canFinalSubmit()) return;
    const success = Math.random() >= 0.5;
    if (success) {
      this.showSuccessModal.set(true);
    } else {
      this.showFailedModal.set(true);
    }
  }

  onSuccessClose(): void { this.showSuccessModal.set(false); }
  onSuccessHome(): void { this.idService.resetAll(); this.router.navigate(['/']); }
  onFailedClose(): void { this.showFailedModal.set(false); }
  onFailedHome(): void { this.idService.resetAll(); this.router.navigate(['/']); }

  // ── Upload guide modal ────────────────────────────────────────────────────
  showGuide = signal(false);
  guideSide = signal<'front' | 'back' | 'utility'>('front');

  /** Called when user clicks an empty upload zone. Shows guide for id doc zones,
   *  goes straight to file picker when a file already exists or zone is utility. */
  openZone(slot: 'front' | 'back' | 'utility'): void {
    if (slot === 'utility') {
      this.triggerFileInput('utility');
      return;
    }
    const hasFile = slot === 'front' ? this.form().frontFile : this.form().backFile;
    if (hasFile) {
      this.triggerFileInput(slot);
    } else {
      this.guideSide.set(slot);
      this.showGuide.set(true);
    }
  }

  closeGuide(): void { this.showGuide.set(false); }

  onGuideConfirmed(): void {
    this.showGuide.set(false);
    const side = this.guideSide();
    // Small delay lets the modal finish closing before the native file-picker opens
    setTimeout(() => this.triggerFileInput(side), 60);
  }

  private triggerFileInput(side: 'front' | 'back' | 'utility'): void {
    const id = side === 'front' ? 'frontFileInput'
             : side === 'back'  ? 'backFileInput'
             : 'utilityFileInput';
    (document.getElementById(id) as HTMLInputElement | null)?.click();
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  goBack(): void {
    // Keep account number pre-filled but force fresh validation on return
    this.idService.resetVerificationOnly();
    this.router.navigate(['/identity-document-update/verify']);
  }
}
