import { Routes } from '@angular/router';
import { consentGuard, verifiedGuard } from './identity-document-update.guard';

export const IDENTITY_DOCUMENT_UPDATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/consent-form/consent-form.component').then(
        m => m.ConsentFormComponent
      )
  },
  {
    path: 'verify',
    canActivate: [consentGuard],
    loadComponent: () =>
      import('./components/account-verification/account-verification.component').then(
        m => m.AccountVerificationComponent
      )
  },
  {
    path: 'upload',
    canActivate: [verifiedGuard],
    loadComponent: () =>
      import('./components/document-upload/document-upload.component').then(
        m => m.DocumentUploadComponent
      )
  },
  {
    path: 'terms',
    canActivate: [consentGuard],
    loadComponent: () =>
      import('./components/terms-and-conditions/terms-and-conditions.component').then(
        m => m.TermsAndConditionsComponent
      )
  }
];
