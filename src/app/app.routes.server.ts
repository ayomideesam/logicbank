import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Landing page — server-rendered for fast initial paint
    path: '',
    renderMode: RenderMode.Server
  },
  {
    // All other routes (interactive forms) — client-side rendered
    path: '**',
    renderMode: RenderMode.Client
  }
];
