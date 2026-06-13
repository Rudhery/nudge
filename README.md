<div align="center">

# 🔔 Nudge

**Your personal life hub — that nudges you on WhatsApp.**

Organize your tasks, finances and notes in one calm, assistant-like app,
and let it ping you on WhatsApp exactly when something needs your attention.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fe5196.svg)](https://www.conventionalcommits.org)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

</div>

---

## ✨ What is Nudge?

Nudge is a self-hosted personal organizer built around a simple idea:

> A tool that *looks* complex can actually be simple.

It started as a to-do list that reminds me of things over WhatsApp, and grows
into a single, friendly place for the small systems we all run our lives on —
**tasks**, **finances** and **notes** — with an interactive, assistant-like UI.

It is **fully configurable**, **self-hosted**, and uses **no AI** — just clean
engineering and a delightful interface.

## 🧩 Modules

| Module       | Status         | Description                                   |
| ------------ | -------------- | --------------------------------------------- |
| ✅ Tasks     | 🚧 In progress | To-dos with due dates and WhatsApp reminders  |
| 📝 Notes     | 🗓️ Planned     | Quick personal notes                          |
| 💰 Finance   | 🗓️ Planned     | Track expenses and income                     |

Each module is independent — adding one never touches the others.

## 🔔 How the reminders work

The hardest part of any reminder app is *delivering the nudge when the app is
closed*. Nudge sidesteps that completely: a small backend scheduler sends the
reminder through **your own WhatsApp number** (via a self-hosted
[whatsmeow](https://github.com/tulir/whatsmeow) endpoint) — so it arrives even
with your phone in your pocket.

```
  App (you)  ──create task──►  Backend + scheduler  ──at the right time──►  WhatsApp 🔔
```

No WhatsApp Business API, no third-party fees — just your own number.

## 🛠️ Tech stack (being finalized)

The architecture is intentionally kept **simple**. The proposed stack:

- **Frontend:** React + Tailwind + shadcn/ui, packaged for Android with Capacitor (also a PWA)
- **Backend:** Go + SQLite
- **Reminders:** self-hosted whatsmeow endpoint

> 📌 The architecture decision is being captured as an ADR — see the
> [open issues](../../issues).

## 🚀 Getting started

> 🚧 Coming soon — the project is in its foundation phase.

## 🗺️ Roadmap

See the [milestones](../../milestones) for the planned releases:

- **v0.1.0** — Tasks MVP (with WhatsApp reminders)
- **v0.2.0** — Notes
- **v0.3.0** — Finance

## 🤝 Contributing

This is a personal project, but it is built **in the open** as an example of a
clean engineering workflow. Contributions and ideas are welcome — start with the
[contributing guide](CONTRIBUTING.md).

## 🔒 Security

Found a vulnerability or a leaked secret? Please read the
[security policy](SECURITY.md).

## 📄 License

[MIT](LICENSE) © Rudhery Hotz
