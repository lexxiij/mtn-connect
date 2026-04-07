# AI guidelines for MeetTheNeedConnects

This file is for AI assistants working in this repo so things stay consistent.

## Repo layout

- `mtnConnect/` — Angular 19 app. All the app code is under `mtnConnect/src/app/`.
- Root `package.json` — has workspace deps like FullCalendar. The actual Angular app is inside `mtnConnect/`.

## Tech stack

- Angular 19, standalone components, TypeScript
- Template-driven forms using `FormsModule` and `NgForm`
- `RouterLink` for navigation
- FullCalendar for the events calendar (see `event-list`)
- RxJS for async stuff, `HttpClient` for HTTP calls when the backend gets connected

## Conventions

1. **Attendee type** — the shared interface lives in `mtnConnect/src/app/models/attendee.model.ts`. Don't redefine it in components or services, just import it from there.
2. **Services** — reusable logic and API calls go in `mtnConnect/src/app/services/`. Components should call services, not make API calls themselves.
3. **Components** — standalone, use the `app` prefix. Each feature gets its own folder under `app/` (like `event-list`, `register`, `adminattendee-list`).
4. **Routes** — all in `mtnConnect/src/app/app.routes.ts`. Add new routes there and make sure the component is imported.
5. **Forms** — using template-driven forms with `ngModel` and validation. Submit handlers get `NgForm`. Keep validation in the template and put API calls in a service.

## Key files

| Purpose | File(s) |
|---|---|
| Routes | `mtnConnect/src/app/app.routes.ts` |
| Attendee model | `mtnConnect/src/app/models/attendee.model.ts` |
| Attendee service | `mtnConnect/src/app/services/admin-attendees.service.ts` |
| Event calendar | `mtnConnect/src/app/event-list/` |
| Registration form | `mtnConnect/src/app/register/` |
| Admin attendee list | `mtnConnect/src/app/adminattendee-list/` |

## Running commands

Angular CLI commands like `ng serve`, `ng build`, `ng test` have to be run from inside `mtnConnect/` — that's where `angular.json` is. Running them from the root won't work.
