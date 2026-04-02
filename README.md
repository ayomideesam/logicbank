# LogicBank – Digital Account Maintenance Web Portal

![Angular](https://img.shields.io/badge/Angular-19.2.x-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.x-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![License](https://img.shields.io/badge/License-Private-lightgrey)

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
