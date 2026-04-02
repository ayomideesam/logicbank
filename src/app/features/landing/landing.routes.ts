import { Routes } from '@angular/router';

export const LANDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing-page/landing-page.component')
        .then(m => m.LandingPageComponent)
  }
];
