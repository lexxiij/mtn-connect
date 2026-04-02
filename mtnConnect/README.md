# MeetTheNeedConnects

MeetTheNeedConnects is a **Career Development Portal** in development. This version focuses on:

- **Event listing** — View training events (e.g. Forklift, CDL) on a calendar.
- **RSVP / registration** — Users register for a training with contact info, county, and how they heard about the program.
- **Contact** — Contact information for the program.
- **Attendees (admin)** — List and manage registrations (CRUD-style UI).

## Setup

All commands below are run from the **`mtnConnect/`** directory (where `angular.json` lives).

```bash
cd mtnConnect
npm install
ng serve
```

Open [http://localhost:4200/](http://localhost:4200/).

## Project structure

- **`src/app/`** — Angular app code.
  - **`app.routes.ts`** — Route definitions (`/`, `/home`, `/events`, `/register`, `/contact`, `/attendees`).
  - **`models/attendee.model.ts`** — Shared TypeScript interface for attendee/registration data. **Single source of truth** for attendee shape; components and services should import from here.
  - **`services/`** — Shared logic (e.g. `AdminAttendeesService` for attendee-related API calls).
  - **`event-list/`**, **`register/`**, **`contact/`**, **`adminattendee-list/`**, **`home/`** — Feature components (each with `.ts`, `.html`, `.css`).
- **`public/`** — Static assets.

## API (planned)

- **POST** `/api/attendees` — Submit registration; body matches the `attendee` interface.
- **GET** `/api/attendees` — List attendees (e.g. for admin view).

Environment: any API base URL can be configured via environment or app config when the backend is added.

## Development server

From **`mtnConnect/`**:

```bash
ng serve
```

## Code scaffolding

```bash
ng generate component component-name
ng generate --help
```

## Build

```bash
ng build
```

Output: `dist/mtn-connect/`.

## Tests

```bash
ng test
```

E2E: `ng e2e` (configure a framework as needed).

## Additional resources

- [Angular CLI](https://angular.dev/tools/cli)
- [Angular Docs](https://angular.dev)
