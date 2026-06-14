# Nudge — server

The Go backend for [Nudge](../README.md): a single binary that exposes the REST
API, runs the reminder **scheduler**, and (eventually) delivers nudges through the
self-hosted **whatsmeow** endpoint.

See [ADR 0001](../docs/adr/0001-architecture.md) for the rationale.

## Layout

```
server/
├─ cmd/nudge/      # main.go — entrypoint
├─ internal/
│  ├─ config/      # env loading (+ optional .env)
│  ├─ task/        # model + SQLite store
│  ├─ api/         # router, handlers, auth + CORS middleware
│  ├─ scheduler/   # ticker: find due reminders → dispatch
│  └─ notify/      # Notifier interface + LogNotifier
└─ go.mod
```

## Run

```bash
cd server
go run ./cmd/nudge
```

The server starts on `:8080` with a SQLite database at `./data/nudge.db`. With no
`API_KEY` set it runs unauthenticated (development mode).

## Test

```bash
go test ./...
go vet ./...
```

## Configuration

All configuration is via environment variables (a local `.env` is loaded if
present). See [`.env.example`](../.env.example). **No secrets are committed**
(see [SECURITY.md](../SECURITY.md)).

| Variable             | Default            | Purpose |
| -------------------- | ------------------ | ------- |
| `API_PORT`           | `8080`             | HTTP port |
| `API_KEY`            | _(empty)_          | Bearer token; empty = unauthenticated dev mode |
| `DATABASE_PATH`      | `./data/nudge.db`  | SQLite file |
| `SCHEDULER_INTERVAL` | `30s`              | How often to check for due reminders |
| `REMINDER_RECIPIENT` | _(empty)_          | Who receives nudges (used by the WhatsApp notifier — issue #9) |
| `WEB_DIR`            | _(empty)_          | If set, serves the built web app from this directory |
| `CORS_ORIGIN`        | `*`                | Allowed CORS origin for the API |

## API

| Method | Path                        | Description |
| ------ | --------------------------- | ----------- |
| GET    | `/healthz`                  | liveness    |
| GET    | `/api/tasks`                | list tasks  |
| POST   | `/api/tasks`                | create a task |
| GET    | `/api/tasks/{id}`           | get one     |
| PATCH  | `/api/tasks/{id}`           | update fields |
| POST   | `/api/tasks/{id}/complete`  | mark done   |
| DELETE | `/api/tasks/{id}`           | delete      |

Requests use JSON; when `API_KEY` is set, send `Authorization: Bearer <API_KEY>`.

> Reminders are currently delivered by a **LogNotifier** (they are logged).
> WhatsApp delivery via whatsmeow is tracked in
> [issue #9](https://github.com/Rudhery/nudge/issues/9).
