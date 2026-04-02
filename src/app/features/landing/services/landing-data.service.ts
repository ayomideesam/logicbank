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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.95 0L11.29 0.03L15.1 3.84L16.45 2.5C19.7 4.07 22.04 7.24 22.4 11H23.9C23.39 4.84 18.24 0 11.95 0ZM11.95 4C10.02 4 8.45 5.57 8.45 7.5C8.45 9.43 10.02 11 11.95 11C13.88 11 15.45 9.43 15.45 7.5C15.45 5.57 13.88 4 11.95 4ZM0 13C0.51 19.16 5.66 24 11.95 24L12.61 23.97L8.8 20.16L7.45 21.5C4.2 19.94 1.86 16.76 1.5 13H0ZM11.95 13C8.08 13 4.95 14.57 4.95 16.5V18H18.95V16.5C18.95 14.57 15.82 13 11.95 13Z" fill="white"/>
                </svg>`
            ),
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
               <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C5.8 0 4 1.8 4 4C4 6.2 5.8 8 8 8C10.2 8 12 6.2 12 4C12 1.8 10.2 0 8 0ZM8 10C3.6 10 0 11.8 0 14V16H9.5C9.2 15.2 9 14.4 9 13.5C9 12.3 9.3 11.2 9.9 10.1C9.3 10.1 8.7 10 8 10ZM15 16C13.6 16 12.5 14.9 12.5 13.5C12.5 13.1 12.6 12.7 12.8 12.4L11.7 11.3C11.3 11.9 11 12.7 11 13.5C11 15.7 12.8 17.5 15 17.5V19L17.2 16.8L15 14.5V16ZM15 9.5V8L12.8 10.2L15 12.4V11C16.4 11 17.5 12.1 17.5 13.5C17.5 13.9 17.4 14.3 17.2 14.6L18.3 15.7C18.7 15.1 19 14.3 19 13.5C19 11.3 17.2 9.5 15 9.5Z" fill="white"/>
               </svg>
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
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0H8V7L5.5 5.5L3 7V0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H14C14.5304 20 15.0391 19.7893 15.4142 19.4142C15.7893 19.0391 16 18.5304 16 18V2C16 1.46957 15.7893 0.960859 15.4142 0.585786C15.0391 0.210714 14.5304 0 14 0ZM10 10C10.3956 10 10.7822 10.1173 11.1111 10.3371C11.44 10.5568 11.6964 10.8692 11.8478 11.2346C11.9991 11.6001 12.0387 12.0022 11.9616 12.3902C11.8844 12.7781 11.6939 13.1345 11.4142 13.4142C11.1345 13.6939 10.7781 13.8844 10.3902 13.9616C10.0022 14.0387 9.60009 13.9991 9.23463 13.8478C8.86918 13.6964 8.55682 13.44 8.33706 13.1111C8.1173 12.7822 8 12.3956 8 12C8 11.4696 8.21071 10.9609 8.58579 10.5858C8.96086 10.2107 9.46957 10 10 10ZM14 18H6V17C6 15.67 8.67 15 10 15C11.33 15 14 15.67 14 17V18Z" fill="white"/>
                </svg>
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
