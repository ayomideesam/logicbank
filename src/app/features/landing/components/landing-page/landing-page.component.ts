import { Component, inject, signal } from '@angular/core';
import { PortalHeaderComponent } from '../../../../layout/components/portal-header/portal-header.component';
import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { LandingDataService } from '../../services/landing-data.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [PortalHeaderComponent, ServiceCardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  private landingDataService = inject(LandingDataService);

  isSearchActive = signal(false);
  services = this.landingDataService.services;

  onSearchToggle(active: boolean): void {
    this.isSearchActive.set(active);
  }
}


