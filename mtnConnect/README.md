# MeetTheNeedConnects

A career development web app built with Angular 19. Still in progress.

Current features:
- Event calendar — shows upcoming training events (Forklift, CDL, etc.)
- Registration form — users sign up for a training with their contact info
- Contact page
- Admin view — lets admins see and manage registrations

## Getting started

Run these from the `mtnConnect/` folder (that's where `angular.json` is):

```bash
cd mtnConnect
npm install
ng serve
```

Then open http://localhost:4200

## Project structure

```
src/app/
  app.routes.ts              - all routes
  models/attendee.model.ts   - shared attendee interface (import from here, don't redefine it)
  services/                  - shared services like AdminAttendeesService
  event-list/                - events calendar component
  register/                  - registration form
  contact/                   - contact page
  adminattendee-list/        - admin view for registrations
  home/                      - home page
```

## Useful commands

```bash
ng serve          # start dev server
ng build          # build for production
ng generate component component-name   # scaffold a new component
ng test           # run unit tests
```

## API (planned)

- `POST /api/attendees` — submit a registration
- `GET /api/attendees` — get all registrations (admin only)

The API base URL is set in `src/environments/environment.ts`.

## Docs

- [Angular docs](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
