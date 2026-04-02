import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityDocumentService } from '../../services/identity-document.service';

@Component({
  selector: 'app-consent-form',
  standalone: true,
  imports: [],
  templateUrl: './consent-form.component.html',
  styleUrl: './consent-form.component.css'
})
export class ConsentFormComponent {
  private router = inject(Router);
  private idService = inject(IdentityDocumentService);

  onReject(): void {
    this.idService.resetAll();
    this.router.navigate(['/']);
  }

  onAgree(): void {
    this.idService.patchForm({ consentAccepted: true });
    this.router.navigate(['/identity-document-update/verify']);
  }
}
