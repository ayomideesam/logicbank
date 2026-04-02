# LogicBank – Digital Account Maintenance Web Portal

![Angular](https://img.shields.io/badge/Angular-19.2.x-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.x-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify)
![License](https://img.shields.io/badge/License-Private-lightgrey)

**Live:** [https://logicbank.netlify.app](https://logicbank.netlify.app)
**Repository:** [https://github.com/ayomideesam/logicbank](https://github.com/ayomideesam/logicbank)

---

## Overview

**LogicBank** is a Digital Account Maintenance Web Portal built for **First Bank of Nigeria** — a leading commercial bank with over 12,000 active users and 790+ branches nationwide.

The portal delivers a fully self-service experience for customers who need to update their account information without visiting a branch. It was built as part of the **Senior Analyst, Frontend Development** technical assessment, implementing the complete **Identity Document Update (IDU)** flow end-to-end from a Figma design specification.

---

## Live Demo

| URL | Description |
|---|---|
| [https://logicbank.netlify.app](https://logicbank.netlify.app) | Production deployment on Netlify |

---

## Features

### 1. Account Management Landing Page
- 9 self-service cards displayed in a responsive 3-column grid
- Each card links to its respective flow (IDU flow fully implemented)
- Animated search / site-wide search toggle in the header
- First Bank Nigeria header with logo, navigation and Help button
- Full-width First Bank footer matching the live firstbanknigeria.com site
- Responsive layout — adapts from desktop → tablet → mobile

### 2. Data Consent Form (NDPR Compliance)
- Displays the Personal Data Processing Consent agreement
- User must explicitly accept before proceeding to account verification
- State is preserved if the user navigates away and returns

### 3. Account Verification
- 10-digit account number input
- Triggers a 6-digit OTP sent to the customer's registered phone/email
- 5-minute countdown timer — auto-disables OTP input on expiry
- Resend OTP button (suppressed while OTP is valid)
- OTP failure modal (wrong code) with actionable options
- On success: 2.5-second transition delay before loading the upload page
- Account number is preserved across back-navigation; OTP is re-validated on return

### 4. Document Upload Page
Fully validated multi-part form covering:

#### Identity Document Section
- **NIN** — National Identification Number text input
- **Document Type dropdown** — Voters Card, Passport, Identity Document
  - Switching type clears the previous document number and uploaded files
  - Default label reads "Identity Document" before a type is selected
- **Document Number** — dynamic label and placeholder per selected type
- **Front upload zone** — drag-and-drop or click-to-upload
- **Back upload zone** — drag-and-drop or click-to-upload
- Accepted formats: PDF and JPG (JPEG), 10 MB maximum
- Duplicate file prevention (front and back must be different files)
- File validation with user-facing error messages

#### Upload Guide Modal (3-Slide Carousel)
- Shown automatically the first time a user clicks an empty Front or Back upload zone
- 3 instructional slides with exact Figma-spec typography and layout:
  - **Slide 1** — Place document flat / passport photograph
  - **Slide 2** — Do not cover document data
  - **Slide 3** — Ensure no reflection
- Slide-specific SVG illustrations; Passport type shows a real photograph on slide 1
- Navigation arrows, dot indicators, close button
- "Got it, Proceed to Upload" button opens the system file picker
- Clicking an already-uploaded zone skips the guide and goes straight to replace
- Utility Bill zone bypasses the guide entirely

#### Utility Bill Section (Conditional)
- Shown only after "Upload now" is chosen in the Additional Document modal
- Drag-and-drop or click-to-upload
- Same validation rules as identity document uploads

#### Terms, Disclaimer and Submit
- Italic disclaimer text: "Document must be clear, legible and genuine. Upload uprightly"
- Accept Terms & Conditions checkbox (links to Terms page and returns with state intact)
- Submit / Update button — disabled until all required fields are complete

### 5. Terms & Conditions Page
- Full account maintenance terms text
- Back navigation returns to the upload form with all previously-entered data preserved

### 6. Submit Modal Flow (4 modals in sequence)

| Modal | Trigger | Actions |
|---|---|---|
| Additional Document Required | On first Submit | Skip for now / Upload now |
| Please Proceed to Update | Skip or after utility upload | Complete now |
| Outstanding Information | Complete now | Fill additional fields + Final Submit |
| Submission Successful / Failed | Final Submit (50/50 mock) | Close / Home |

### 7. Outstanding Information Section
Revealed inline after "Complete now":
- **Occupation** — dropdown (compulsory)
- **Nature of Business** — dropdown (compulsory)
- **Employer Name** — text input
- **Employer Address** — text input
- **Annual Turn-Over** — dropdown
- Final Submit disabled until both compulsory fields are completed
- Randomly resolves to Success or Failed modal (mock API)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2.x (Standalone Components) |
| Language | TypeScript 5.6.x |
| Rendering | SPA (SSR disabled for Netlify static hosting) |
| Styling | CSS (component-scoped, custom properties) |
| State Management | Angular Signals + computed() + effect() |
| Routing | Angular Router — lazy-loaded by route |
| Forms | Template-driven with signal-backed state |
| Build | Angular CLI 19.2.23 + @angular-devkit/build-angular |
| Deployment | Netlify (static hosting + SPA redirects) |
| Testing | Jasmine + Karma |
| Version Control | Git — `Akhigbe` (dev) → `main` (production) |

---

## Architecture Decisions

### Angular 19 Modern Patterns — Applied Throughout
- **Standalone components** — no NgModules anywhere
- **Signals** (`signal()`, `computed()`, `effect()`) for all reactive state
- **New control flow** — `@if`, `@for`, `@else` instead of `*ngIf` / `*ngFor`
- **inject()** function for dependency injection — no constructor injection except where `super()` is required
- **Lazy-loaded routes** — every feature module and component loaded on demand
- `@defer` / lazy-loading standards documented in the codebase

### Portal Shell Architecture
- `PortalShellComponent` owns the shared header and banner
- All routes render inside `<router-outlet>` — feature components are pure content (no duplicated chrome)
- Shell CSS custom property `--card-bg` cascades into `ServiceCardComponent` via the component tree

### State Persistence
- `IdentityDocumentService` (`providedIn: 'root'`) holds all form state across route transitions
- `resetAll()` — clears everything on Home navigation
- `resetVerificationOnly()` — clears OTP/verified state, preserves account number (used on back-nav from upload)
- `resetAccountVerification()` — clears account number too
- Form state survives: Terms navigation, back-nav, dropdown switches

### Upload Zone Click Architecture
- Hidden `<input type="file">` elements are siblings (not children) of `.upload-zone` — prevents event bubbling
- `triggerFileInput()` uses programmatic `.click()` on `display:none` inputs
- `openZone(slot)` decides: show guide modal → or go straight to file picker (replacement)

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── constants/             # App-wide constants
│   │   ├── guards/                # Route guards
│   │   ├── interceptors/          # HTTP interceptors
│   │   ├── models/                # Domain interfaces (service-card.model.ts)
│   │   └── services/              # Core services
│   ├── features/
│   │   ├── landing/
│   │   │   ├── components/landing-page/   # 9-card portal home
│   │   │   └── services/landing-data.service.ts
│   │   ├── data-consent/
│   │   │   └── components/consent-form/   # NDPR consent
│   │   └── identity-document-update/
│   │       ├── components/
│   │       │   ├── account-verification/  # OTP + account number
│   │       │   ├── consent-form/          # IDU-specific consent
│   │       │   ├── document-upload/       # Main form + upload zones + modals
│   │       │   ├── upload-guide-modal/    # 3-slide upload tutorial carousel
│   │       │   ├── terms-and-conditions/  # T&C page
│   │       │   └── otp-failure-modal/     # OTP error modal
│   │       ├── services/
│   │       │   └── identity-document.service.ts  # Central form state
│   │       └── identity-document-update.routes.ts
│   ├── layout/
│   │   └── components/
│   │       ├── portal-shell/      # App shell (header + banner + router-outlet)
│   │       ├── portal-header/     # First Bank header with search
│   │       └── portal-footer/     # Footer
│   └── shared/
│       ├── components/
│       │   ├── service-card/      # Landing page cards
│       │   ├── step-progress/     # Progress indicator
│       │   ├── otp-input/         # 6-digit OTP input
│       │   ├── file-uploader/     # Reusable file upload
│       │   └── modal/             # Base modal shell
│       ├── directives/
│       └── pipes/
├── assets/
│   └── img/
│       ├── footer.png             # Full-width footer image
│       ├── proof_of_passport.png  # Passport upload guide illustration
│       └── ...                    # Headers, logos, service card icons
└── styles.css                     # Global design tokens and reset
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `LandingPageComponent` | Account management service selection |
| `/identity-document-update` | `ConsentFormComponent` | NDPR data consent |
| `/identity-document-update/verify` | `AccountVerificationComponent` | Account number + OTP |
| `/identity-document-update/upload` | `DocumentUploadComponent` | Document form + upload + modals |
| `/identity-document-update/terms` | `TermsAndConditionsComponent` | Account maintenance T&C |
| `**` | redirect | Falls back to `/` |

---

## Getting Started

### Prerequisites
- Node.js `>= 20.19` or `>= 22.12`
- npm `>= 10.x`
- Angular CLI `19.2.x`

### Installation

```bash
# Clone the repository
git clone https://github.com/ayomideesam/logicbank.git
cd logicbank

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:4200`.

### Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server at localhost:4200 with HMR |
| `npm run build` | Production build to dist/logicbank |
| `npm run watch` | Build in watch mode (development) |
| `npm test` | Run unit tests via Karma |

---

## Deployment

The project is deployed on **Netlify** as a pure SPA (SSR disabled).

### `netlify.toml`
```toml
[build]
  command = "ng build --configuration=production"
  publish = "dist/logicbank/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The SPA redirect rule ensures Angular client-side routing works correctly on direct URL access and page refresh.

### Branch Strategy
| Branch | Purpose |
|---|---|
| `Akhigbe` | All active development — push all code changes here |
| `main` | Production — only updated by merging from `Akhigbe` |

**Never commit directly to `main`.** Workflow:
```bash
# 1. Do all work on Akhigbe
git checkout Akhigbe
# ... make changes, commit, push ...
git push origin Akhigbe

# 2. Merge to main for production
git checkout main
git merge Akhigbe --no-edit
git push origin main
git checkout Akhigbe
```

---

## Security

| Package | Fix Applied |
|---|---|
| `@angular/ssr` (critical — SSRF + Open Redirect) | Updated to `19.2.23` |
| `@angular-devkit/*` (high — ajv ReDoS, picomatch ReDoS) | Updated to `19.2.23` |
| `@angular/cli` (moderate) | Updated to `19.2.23` |
| `node-tar` via `pacote` (6 high — path traversal) | Build-tooling only; no impact on deployed users. Requires Angular CLI 21 upgrade to resolve fully. |

---

## Bug Fixes & Improvements Log

All changes committed on the `Akhigbe` branch:

| Commit | Change |
|---|---|
| `e0e56b4` | Fix production build: increase CSS budgets (`anyComponentStyle` 4 kB → 12 kB), update Angular toolchain to 19.2.23 (10 vulns fixed) |
| `bc381e5` | Update footer image, add passport illustration asset, upload zone HTML edits |
| `fd92b7f` | Fix guide modal trigger — move hidden file inputs outside upload-zone div (sibling, not child) to prevent event bubbling; clear document number on type switch |
| `8cf5efd` | Fix footer full-width (override global `max-width`), fix guide modal re-opening after "Got it", fix utility bill double-trigger (all caused by click event bubbling) |
| `f7c7b2a` | Add 3-slide upload guide modal carousel with exact Figma typography, SVGs, and passport photo |
| `412b5a0` | Fix document-upload page layout to match Figma (padding, max-width, back button + title in same row) |
| `4e58b1f` | Default doc number label/placeholder to "Identity Document" before type selected |
| `ff0ed45` | Back from upload pre-fills account number but forces fresh OTP re-validation |
| `0d94d79` | resetAll on back-to-consent clears account number, NIN, files and all form state |
| `31850cb` | Complete Now modal matches Figma; hide disclaimer/terms/submit when outstanding info shown |
| `727afa8` | Restore upload form state after Terms navigation; prevent duplicate front/back files |
| `63d8f4f` | Passport + Identity Document types; full 4-modal flow; outstanding information section |
| `ed741bb` | Clear irrelevant files when changing identity document type |
| `d3e03eb` | Hide resend/hint on valid OTP; 2.5 s delay before upload page |
| `be3a0f2` | Utility Bill doc type; conditional upload zones; account number refresh persistence; back-nav resets verification |
| `0d2d9a3` | Refactor: portal-shell owns header + banner — remove duplication from all feature components |
| `b5a72df` | Complete identity-document-update 4-step flow (initial build) |
| `b2bbf72` | Use First Bank logo as favicon |
| `ce05730` | Fix card background + header search layout to match Figma |
| `b832b6a` | Disable SSR — pure SPA build for Netlify static hosting |
| `1eae53f` | Enable HMR + add `@defer` / lazy-loading standards |
| `80805e1` | Extract service card data into `LandingDataService` |
| `8d051ca` | Scaffold senior-level Angular 19 project structure |

---

## Design Reference

**Figma:** [Identity Document Update Flow](https://www.figma.com/design/RiGj1uoXILAs4jRKzHiVmU/Digital-Account-Maintenance-Solution?node-id=173-21&m=dev)

---

## Author

Built by **Akhigbe Iruobe** as part of the **First Bank Nigeria — Senior Analyst, Frontend Development** technical assessment.

---

*© 2026 First Bank of Nigeria. All rights reserved.*


---

## Overview

**LogicBank** is a Digital Account Maintenance Web Portal built for **First Bank of Nigeria** — a prominent commercial bank with over 12,000 active users on its Core Banking System and a network of 790+ branches nationwide.

This application delivers a seamless self-service experience for customers who need to update their account information without visiting a branch. The portal focuses specifically on the **ID Document Upload Flow** as part of broader Account Maintenance Services.

---

## Features

### Identity Document Update Flow
The application guides customers through a fully validated, multi-step process:

1. **Account Management Landing Page** — Service selection portal with 9 account maintenance services
2. **Data Consent Form** — NDPR-compliant Personal Data Processing Consent
3. **Account Verification** — 10-digit account number entry with 6-digit OTP phone/email validation
4. **Identity Document Form** — NIN input, ID type selection (NIN, International Passport, Driver's License, Voter's Card), document number
5. **Document Upload** — Front and back ID document upload + Utility Bill upload (PDF/JPG, 10MB max)
6. **Outstanding Information** — Conditional capture of Occupation, Nature of Business, Employer details, Annual Turnover
7. **Terms & Conditions** — Account Maintenance Terms with accept/reject
8. **Submission & Result States** — Success, failure, and additional document request notifications
9. **Document Upload Guide** — Step-by-step carousel instructions for quality document capture

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2.x (Standalone Components) |
| Language | TypeScript 5.6.x |
| Styling | CSS / SCSS (component-scoped) |
| State Management | RxJS / Angular Signals |
| Routing | Angular Router (lazy-loaded feature modules) |
| Forms | Angular Reactive Forms |
| SSR | Angular Universal (`@angular/ssr`) |
| Testing | Jasmine + Karma |
| Build | Angular CLI 19.2.x |

---

## Getting Started

### Prerequisites
- Node.js `>= 20.19` or `>= 22.12`
- npm `>= 10.x`
- Angular CLI `19.2.x`

### Installation

```bash
# Clone the repository
git clone https://github.com/ayomideesam/logicbank.git
cd logicbank

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:4200`.

### Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server at localhost:4200 |
| `npm run build` | Production build |
| `npm run watch` | Build in watch mode (development) |
| `npm test` | Run unit tests via Karma |
| `npm run serve:ssr:logicbank` | Serve SSR production build |

---

## Project Structure

```
src/
├── app/
│   ├── core/                        # Singleton services, guards, interceptors, models
│   │   ├── constants/               # App-wide constants (routes, enums, config)
│   │   ├── guards/                  # Route guards (consent, auth)
│   │   ├── interceptors/            # HTTP interceptors (auth headers, error handling)
│   │   ├── models/                  # Core domain interfaces & types
│   │   └── services/                # Core services (API, OTP, document, storage)
│   ├── features/                    # Feature-sliced, lazy-loaded modules
│   │   ├── landing/                 # Account Management Portal landing page
│   │   ├── data-consent/            # NDPR Data Consent Form
│   │   └── identity-document-update/
│   │       ├── components/          # All step components for the update flow
│   │       ├── models/              # Feature-scoped interfaces
│   │       ├── services/            # Feature-scoped services
│   │       └── identity-document-update.routes.ts
│   ├── layout/                      # App shell: header, footer, portal layout
│   └── shared/                      # Reusable UI components, directives, pipes
│       ├── components/              # File uploader, OTP input, modals, step indicator
│       ├── directives/              # Custom directives
│       └── pipes/                   # Custom pipes
├── assets/                          # Static assets (images, icons, fonts)
└── environments/                    # Environment configuration files
```

---

## Design Reference

Figma Design: [Identity Document Update Flow](https://www.figma.com/design/RiGj1uoXILAs4jRKzHiVmU/Digital-Account-Maintenance-Solution?node-id=173-21&m=dev)

---

## Development Branch

Active development is on the **`Akhigbe`** branch.

```bash
git checkout Akhigbe
```

---

## Evaluation Criteria

This project is evaluated on:
- Implementation accuracy to Figma design and specifications
- Error handling (OTP failures, upload errors, form validation)
- Responsiveness across screen sizes
- Code quality (readability, state management, scalability)
- Performance (load time, resource usage)
- Documentation

---

## Author

Built as part of the **First Bank Nigeria — Senior Analyst, Frontend Development** technical assessment.

---

*© 2026 First Bank of Nigeria. All rights reserved.*

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
