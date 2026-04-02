import { inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServiceCardData } from '../../../core/models/service-card.model';

// DomSanitizer lives here per ANGULAR-19-STANDARDS.md — services own sanitization, not components.
@Injectable({ providedIn: 'root' })
export class LandingDataService {
  private sanitizer = inject(DomSanitizer);

  private safe(path: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">${path}</svg>`
    );
  }

  readonly services = signal<ServiceCardData[]>([
    {
      id: 'account-conversion',
      iconSvg: this.safe(`
        <path d="M5 10h14M5 10l4-4M5 10l4 4M23 18H9M23 18l-4-4M23 18l-4 4"
          stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `),
      title: 'Account Conversion/ Migration',
      requirements: [
        'BVN',
        'NIN',
        'Proof of Identity (Notarized if applicable)',
        'Proof of Address (Notarized if applicable)'
      ],
      linkText: 'Convert your account',
      route: '/account-conversion'
    },
    {
      id: 'account-upgrade',
      iconSvg: this.safe(`
        <circle cx="14" cy="9" r="4" stroke="white" stroke-width="2"/>
        <path d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M21 7V3M21 3l-2.5 2.5M21 3l2.5 2.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `),
      title: 'Account Upgrade (Tier 1 and 2)',
      requirements: [
        'BVN',
        'NIN',
        'Proof of Identity'
      ],
      linkText: 'Upgrade Tier 1 or Tier 2 account',
      route: '/account-upgrade'
    },
    {
      id: 'address-update',
      iconSvg: this.safe(`
        <path d="M14 3C10.134 3 7 6.134 7 10c0 5.25 7 14 7 14s7-8.75 7-14c0-3.866-3.134-7-7-7z"
          stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="14" cy="10" r="2.5" stroke="white" stroke-width="2"/>
      `),
      title: 'Address Update',
      requirements: [
        'BVN',
        'NIN',
        'Proof of Identity',
        'Proof of Address'
      ],
      linkText: 'Update address',
      route: '/address-update'
    },
    {
      id: 'dob-update',
      iconSvg: this.safe(`
        <rect x="4" y="6" width="20" height="18" rx="2" stroke="white" stroke-width="2"/>
        <path d="M4 11h20" stroke="white" stroke-width="2"/>
        <path d="M9 4v4M19 4v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 16h2M13 16h2M17 16h2M9 20h2M13 20h2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      `),
      title: 'Date of Birth Update',
      requirements: [
        'BVN',
        'Valid ID Card',
        'Proof of Identity or Court Affidavit'
      ],
      linkText: 'Update your date of birth',
      route: '/dob-update'
    },
    {
      id: 'dormant-reactivation',
      iconSvg: this.safe(`
        <circle cx="14" cy="9" r="4" stroke="white" stroke-width="2"/>
        <path d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 7a4 4 0 1 1-3.6-3.96" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 3v4h-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `),
      title: 'Dormant Account Reactivation',
      requirements: [
        'BVN',
        'NIN',
        'Proof of Identity (Notarized if applicable)',
        'Proof of Address (Notarized if applicable)'
      ],
      linkText: 'Reactivate an account',
      route: '/dormant-reactivation'
    },
    {
      id: 'email-update',
      iconSvg: this.safe(`
        <rect x="3" y="6" width="22" height="16" rx="2" stroke="white" stroke-width="2"/>
        <path d="M3 8l11 8 11-8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `),
      title: 'Email Update',
      requirements: [
        'BVN',
        'NIN'
      ],
      linkText: 'Update your email address',
      route: '/email-update'
    },
    {
      id: 'identity-document-update',
      iconSvg: this.safe(`
        <rect x="3" y="6" width="22" height="16" rx="2" stroke="white" stroke-width="2"/>
        <circle cx="10" cy="13" r="3" stroke="white" stroke-width="1.5"/>
        <path d="M16 11h4M16 15h4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      `),
      title: 'Identity Document Update',
      requirements: [
        'BVN',
        'NIN',
        "Proof of Identity (NIN, International Passport, Driver's License or Voters' card)"
      ],
      linkText: 'Update identification document',
      route: '/identity-document-update'
    },
    {
      id: 'phone-update',
      iconSvg: this.safe(`
        <rect x="8" y="2" width="12" height="24" rx="3" stroke="white" stroke-width="2"/>
        <path d="M13 20h2" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M11 6h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      `),
      title: 'Phone Number Update',
      requirements: [
        'BVN',
        'NIN'
      ],
      linkText: 'Update your phone number',
      route: '/phone-update'
    },
    {
      id: 'bvn-update',
      iconSvg: this.safe(`
        <path d="M12 4C9 4 6 6 6 9c0 1.5.5 2.5 1 3.5C8 14 8 15 7 17l1 1c2-1 3-1 4-1s2 0 4 1l1-1c-1-2-1-3 0-4.5.5-1 1-2 1-3.5 0-3-3-5-6-5z"
          stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 10c.5.5 1 .8 2 .8s1.5-.3 2-.8M10 8h.01M16 8h.01" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M9 20h10M9 23h10" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      `),
      title: 'BVN Update',
      requirements: [
        'Proof of identity',
        'Affidavit'
      ],
      linkText: 'Update your BVN',
      route: '/bvn-update'
    }
  ]);
}
