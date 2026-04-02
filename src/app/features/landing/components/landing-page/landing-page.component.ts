import { Component, inject } from '@angular/core';
import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { LandingDataService } from '../../services/landing-data.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ServiceCardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  private landingDataService = inject(LandingDataService);
  services = this.landingDataService.services;
}


