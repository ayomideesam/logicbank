import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortalHeaderComponent } from '../portal-header/portal-header.component';

// Shell layout: renders the shared header + portal banner once.
// All child routes render inside <router-outlet> below the banner.
// The search-active class on the wrapper is forwarded via CSS custom
// property so service-card backgrounds still flip correctly.
@Component({
  selector: 'app-portal-shell',
  standalone: true,
  imports: [RouterOutlet, PortalHeaderComponent],
  templateUrl: './portal-shell.component.html',
  styleUrl: './portal-shell.component.css'
})
export class PortalShellComponent {
  searchActive = signal(false);

  onSearchToggle(active: boolean): void {
    this.searchActive.set(active);
  }
}
