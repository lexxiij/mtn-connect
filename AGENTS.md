# Agent / AI guidelines for MeetTheNeedConnects

This file helps AI assistants and developers work consistently in this repo.

## Repo layout

- **`mtnConnect/`** — Angular 19 app (the only app in this repo). All app code lives under `mtnConnect/src/app/`.
- **Root `package.json`** — Workspace/root deps (e.g. FullCalendar); the Angular app is in `mtnConnect/`.

## Tech stack

- Angular 19, standalone components, TypeScript.
- Template-driven forms (`FormsModule`, `NgForm`), `RouterLink` for navigation.
- FullCalendar for the events calendar (`event-list`).
- RxJS available for async work; HTTP via Angular `HttpClient` when backend is added.

## Conventions

1. **Attendee type** — Use the shared interface from **`mtnConnect/src/app/models/attendee.model.ts`** (exported as `attendee`). Do not redefine attendee-like interfaces in components or services; import and reuse this type.
2. **Services** — Reusable logic and future API calls go in **`mtnConnect/src/app/services/`**. Components should call services for data and side effects, not hold API logic themselves.
3. **Components** — Standalone; use the `app` prefix. One feature per folder under `app/` (e.g. `event-list`, `register`, `adminattendee-list`).
4. **Routes** — Defined in **`mtnConnect/src/app/app.routes.ts`**. Add new routes there and ensure the component is imported.
5. **Forms** — Registration and attendee forms use template-driven forms with `ngModel` and validation; submit handlers receive `NgForm`. Keep validation in the template and minimal logic in the component; API calls go in a service.

## Key files

| Purpose              | File(s) |
|----------------------|--------|
| Routes               | `mtnConnect/src/app/app.routes.ts` |
| Attendee shape       | `mtnConnect/src/app/models/attendee.model.ts` |
| Attendee service     | `mtnConnect/src/app/services/admin-attendees.service.ts` |
| Event calendar       | `mtnConnect/src/app/event-list/` |
| Registration form    | `mtnConnect/src/app/register/` |
| Admin attendee list  | `mtnConnect/src/app/adminattendee-list/` |

## Running commands

All Angular CLI commands (`ng serve`, `ng build`, `ng test`, `ng generate`) must be run from **`mtnConnect/`** (the directory containing `angular.json`). The repo root does not contain an Angular project.
