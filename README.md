# EventFlow

EventFlow is an original, MIT-licensed event and ticketing platform in active
development. This repository starts with the organizer dashboard, a usable
event-draft creation flow, and a separately documented Django Ninja API
foundation. It does **not** yet process payments or provide production
authentication, ticket issuance, or the remaining advanced ticketing modules.

## Current delivery

| Area | State |
| --- | --- |
| Next.js 16 / TypeScript strict frontend | Implemented |
| Responsive organizer dashboard and light/dark theme | Implemented |
| Event search, status filter, draft creation, local persistence | Implemented (browser-local demo data) |
| Public event page, ticket selection and 3-step checkout UI | MVP UI implemented; Stripe and orders remain next |
| Event and ticket models plus public `GET /api/v1/events` and `GET /api/v1/events/{slug}` | Implemented; published events only |
| Django 5.2 / Django Ninja REST API and OpenAPI docs | Health and event catalog endpoints |
| PostgreSQL / Redis / Celery / Nginx Compose foundation | Configuration included |
| CI, frontend unit tests, backend API tests | Included |
| Accounts, teams, Stripe checkout, ticket PDFs, check-in, reserved seats, reports, widgets | Planned; not implemented |

The dashboard uses illustrative sample metrics. Creating an organizer draft
stores it in this browser only; it is not connected to the API. Public event
pages use sample catalog data. Checkout is a non-payment demo: it does not
charge a card, create an order, send email, or issue a ticket.

Next.js 16 is used instead of the suggested Next.js 15 because the available
Next.js 15 release resolved to vulnerable dependencies during setup.

## Run locally

### Frontend

Requirements: Node.js 22 and npm.

```powershell
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### API

Requirements: Python 3.12.

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver
```

- Health: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- Interactive API docs: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
- OpenAPI JSON: [http://127.0.0.1:8000/api/v1/openapi.json](http://127.0.0.1:8000/api/v1/openapi.json)
- Published event catalog: `GET /api/v1/events`
- Published event detail: `GET /api/v1/events/{slug}`

The API uses SQLite for local development unless `POSTGRES_HOST` is set.

## Run the full stack with Docker Compose

Copy `.env.example` to `.env`, replace the secret and database password with
unique random values, then run:

```powershell
docker compose up --build
```

The Nginx entry point is [http://localhost](http://localhost); the API is routed
under `/api/v1/`. PostgreSQL data is kept in the named `postgres_data` volume.
The provided Django development server and default configuration are for local
development, **not production deployment**. Production requires hardened
settings, TLS, a production WSGI/ASGI server, real secrets, backups, and
deployment-specific operational review.

## Quality checks

From the project root:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Backend:

```powershell
cd backend
pytest
```

The CI workflow runs these checks on pushes to `main` and pull requests.

### Dependency audit

`npm audit --omit=dev` currently reports no production dependency advisories.
The full development dependency tree reports a high-severity ReDoS advisory in
`picomatch` ([GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)),
reachable through the lint/test toolchain. The advisory currently lists no
patched release, so a safe upstream fix is pending; do not apply the suggested
forced downgrade. Re-run `npm audit` before deployment and remove or upgrade
affected tooling when a patched release is available.

## Architecture

- `src/app/`: Next.js App Router UI and global theme.
- `src/lib/`: shared, validated frontend domain types.
- `backend/config/`: Django settings, Django Ninja REST API and Celery app.
- `infra/`: Nginx reverse-proxy configuration.
- `docker-compose.yml`: web, API, worker, PostgreSQL, Redis and Nginx services.

API contracts are defined with Django Ninja and exposed as OpenAPI. Long-running
work is intended for Celery workers; task workflows will be added with the
corresponding features.

## Roadmap

1. Foundation and dashboard (current): project setup, design tokens, event
   dashboard, draft form, health API, CI, containers.
2. Ticketing MVP: persisted events and tickets, public event pages, secure
   checkout, payments, QR/PDF tickets, and purchase-flow E2E tests.
3. Organizations, team roles, invitations, and permissions.
4. Recurrence, price tiers, add-ons, promotions, shared inventory, and waitlists.
5. Reserved seating, box office, check-in, and offline sync.
6. Reports, exports, widgets, email delivery, accessibility/performance audits.

## License

MIT. The implementation in this repository is original and does not include
Hi.Events source code.

See [design-system.md](./design-system.md) for visual tokens, component rules,
and accessibility guidance.
