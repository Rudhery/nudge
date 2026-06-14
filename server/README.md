# Nudge — server

The Go backend for [Nudge](../README.md): a single binary that exposes the REST
API, runs the reminder **scheduler**, and delivers nudges through the
self-hosted **whatsmeow** endpoint.

See [ADR 0001](../docs/adr/0001-architecture.md) for the full rationale.

## Planned layout

```
server/
├─ cmd/nudge/      # main.go — entrypoint
├─ internal/
│  ├─ config/      # env loading
│  ├─ task/        # domain: model + SQLite store + service
│  ├─ api/         # router, handlers, auth middleware
│  ├─ scheduler/   # ticker: find due reminders → dispatch
│  └─ notify/      # Notifier interface + whatsmeow HTTP adapter
├─ migrations/     # SQL schema
└─ go.mod
```

## Status

> 🚧 Not implemented yet. This is the target structure from the ADR; the Tasks
> MVP backend is tracked in [issue #5](https://github.com/Rudhery/nudge/issues/5).

## Configuration

All configuration is via environment variables — copy [`.env.example`](../.env.example)
to `.env`. **No secrets are committed** (see [SECURITY.md](../SECURITY.md)).
