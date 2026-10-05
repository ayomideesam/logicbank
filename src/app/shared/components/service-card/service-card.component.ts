import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCardData } from '../../../core/models/service-card.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  @Input({ required: true }) card!: ServiceCardData;
}
