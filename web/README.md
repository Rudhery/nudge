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
  data/          mock data (until the API is wired up)
  lib/           helpers (cn, module config)
```

> The UI currently runs on mock data. It will be wired to the Go API once the
> architecture ADR (issue #4) is in place.
