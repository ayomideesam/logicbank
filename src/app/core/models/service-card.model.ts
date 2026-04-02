import { SafeHtml } from '@angular/platform-browser';

export interface ServiceCardData {
  id: string;
  iconSvg: SafeHtml;
  title: string;
  requirements: string[];
  linkText: string;
  route: string;
}
