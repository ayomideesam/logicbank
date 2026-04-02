import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityDocumentService } from '../../services/identity-document.service';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {
  private router = inject(Router);
  private idService = inject(IdentityDocumentService);

  onAgree(): void {
    this.idService.patchForm({ termsAccepted: true });
    this.router.navigate(['/identity-document-update/upload']);
  }

  onReject(): void {
    this.router.navigate(['/identity-document-update/upload']);
  }

  goBack(): void {
    this.router.navigate(['/identity-document-update/upload']);
  }
}
