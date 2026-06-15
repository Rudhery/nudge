# Nudge — web

The frontend for [Nudge](../README.md): a calm, personal-assistant interface for
tasks, notes and finances.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS + shadcn/ui** (new-york style, warm "paper" theme)
- **lucide-react** icons, **framer-motion** for motion
- Mobile-first; packaged for Android with **Capacitor** later (also a PWA)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

## Structure

```
src/
  components/
    layout/      app shell + navigation
    tasks/       task list, item and quick-add
    ui/          shadcn/ui primitives
  pages/         one screen per module (Tasks, Notes, Finance)
  hooks/         data hooks (useTasks)
  lib/           api client, helpers (cn), module config
```

## Connecting to the API

The Tasks screen talks to the Go backend. Start the server, then run the web app —
Vite proxies `/api` to `http://localhost:8080` (see `vite.config.ts`).

```bash
# terminal 1 — backend
cd ../server && go run ./cmd/nudge

# terminal 2 — frontend
npm run dev
```

Local overrides go in `.env.local` (see [`.env.example`](.env.example)); leave
`VITE_API_URL` empty to use the dev proxy.

## Icons

All favicons, PWA and maskable icons are generated from a single master
(`scripts/icon-master.png`). Regenerate them after changing the art:

```bash
pip install Pillow
python scripts/generate-icons.py
```
