import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/components/portal-shell/portal-shell.component')
        .then(m => m.PortalShellComponent),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/landing/landing.routes').then(m => m.LANDING_ROUTES)
      },
      {
        path: 'identity-document-update',
        loadChildren: () =>
          import('./features/identity-document-update/identity-document-update.routes')
            .then(m => m.IDENTITY_DOCUMENT_UPDATE_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
