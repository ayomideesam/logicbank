import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./components/account-verification/account-verification.component').then(
        m => m.AccountVerificationComponent
      )
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./components/document-upload/document-upload.component').then(
        m => m.DocumentUploadComponent
      )
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./components/terms-and-conditions/terms-and-conditions.component').then(
        m => m.TermsAndConditionsComponent
      )
  }
];
