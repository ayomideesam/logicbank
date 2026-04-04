import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityDocumentService } from './services/identity-document.service';

/** Ensures the user has accepted consent before reaching verify/terms/upload steps. */
export const consentGuard: CanActivateFn = () => {
  const idService = inject(IdentityDocumentService);
  const router = inject(Router);
  if (!idService.form().consentAccepted) {
    return router.createUrlTree(['/identity-document-update']);
  }
  return true;
};

/** Ensures the user has verified their account before reaching the upload step. */
export const verifiedGuard: CanActivateFn = () => {
  const idService = inject(IdentityDocumentService);
  const router = inject(Router);
  const form = idService.form();
  if (!form.consentAccepted) {
    return router.createUrlTree(['/identity-document-update']);
  }
  if (!idService.accountVerified()) {
    return router.createUrlTree(['/identity-document-update/verify']);
  }
  return true;
};
