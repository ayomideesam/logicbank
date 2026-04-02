import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PortalHeaderComponent } from '../../../../layout/components/portal-header/portal-header.component';
import {
  IdentityDocumentService,
  IdDocumentType
} from '../../services/identity-document.service';

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg'];

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [PortalHeaderComponent],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent {
  private router = inject(Router);
  readonly idService = inject(IdentityDocumentService);

  // ── Form field signals ────────────────────────────────────────────────────
  nin = signal('');
  docNumber = signal('');
  docType = signal<IdDocumentType | ''>('');

  // ── Dropdown state ────────────────────────────────────────────────────────
  dropdownOpen = signal(false);
  readonly docTypeOptions: IdDocumentType[] = ['Voters Card'];

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  selectDocType(type: IdDocumentType): void {
    this.docType.set(type);
    this.dropdownOpen.set(false);
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
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only PDF and JPG files are supported.';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_FILE_SIZE_MB} MB.`;
    }
    return '';
  }

  // ── File select handlers (via input click) ────────────────────────────────
  onFrontFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    this.frontFileError.set(err);
    if (!err) this.idService.setFrontFile(file);
  }

  onBackFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    this.backFileError.set(err);
    if (!err) this.idService.setBackFile(file);
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
      this.frontFileError.set(err);
      if (!err) this.idService.setFrontFile(file);
    } else if (slot === 'back') {
      this.backFileError.set(err);
      if (!err) this.idService.setBackFile(file);
    } else {
      this.utilityFileError.set(err);
      if (!err) this.idService.setUtilityBillFile(file);
    }
  }

  // ── Terms ─────────────────────────────────────────────────────────────────
  onTermsCheckboxClick(): void {
    this.idService.patchForm({ termsAccepted: !this.termsAccepted() });
  }

  onTermsLinkClick(): void {
    // persist current field state before navigating
    this.idService.patchForm({
      nin: this.nin(),
      documentType: this.docType(),
      documentNumber: this.docNumber()
    });
    this.router.navigate(['/identity-document-update/terms']);
  }

  // ── Form validity ─────────────────────────────────────────────────────────
  readonly canSubmit = computed(() => {
    const f = this.form();
    return (
      this.nin().trim().length > 0 &&
      this.docType() !== '' &&
      this.docNumber().trim().length > 0 &&
      f.frontFile !== null &&
      f.backFile !== null &&
      f.utilityBillFile !== null &&
      f.termsAccepted
    );
  });

  // ── Navigation ────────────────────────────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/identity-document-update/verify']);
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;
    this.idService.patchForm({
      nin: this.nin(),
      documentType: this.docType(),
      documentNumber: this.docNumber()
    });
    // On success navigate to landing
    this.idService.resetAll();
    this.router.navigate(['/']);
  }
}
