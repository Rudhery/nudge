# Contributing to Nudge

First off — thanks for taking the time to contribute! 🎉

Nudge is built **in the open** as a showcase of a clean, professional engineering
workflow. That means the *way* we work matters as much as the code: small issues,
focused branches, reviewed pull requests, and a readable history.

## 📋 Table of contents

- [Code of Conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Branching model](#branching-model)
- [Commit convention](#commit-convention)
- [Pull requests](#pull-requests)
- [Verified commits & privacy](#verified-commits--privacy)
- [Labels](#labels)
- [Code style](#code-style)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating,
you are expected to uphold it.

## Ways to contribute

- 🐛 **Report a bug** — open a [Bug report](../../issues/new/choose)
- 💡 **Suggest a feature** — open a [Feature request](../../issues/new/choose)
- 🛠️ **Pick up a task** — look for [`good first issue`](../../labels/good%20first%20issue)
- 📖 **Improve docs** — typos and clarifications are always welcome

> 💬 For open-ended questions, prefer a discussion or a `question` issue before
> writing code, so we agree on the approach first.

## Branching model

We keep it simple — a single long-lived branch (`main`) plus short-lived branches:

| Prefix      | Used for                          | Example                |
| ----------- | --------------------------------- | ---------------------- |
| `feat/`     | New feature                       | `feat/task-reminders`  |
| `fix/`      | Bug fix                           | `fix/timezone-offset`  |
| `docs/`     | Documentation                     | `docs/getting-started` |
| `chore/`    | Tooling / housekeeping            | `chore/update-deps`    |
| `refactor/` | Code change, no behavior change   | `refactor/task-store`  |

`main` is always releasable. Every change lands through a pull request.

## Commit convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short summary>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`.

Examples:

```
feat(tasks): add recurring reminders
fix(api): return 404 when a task is missing
docs(readme): document the reminder flow
```

This keeps the history readable and lets us automate the changelog later.

## Pull requests

1. **Open an issue first** for anything non-trivial, so the work is tracked.
2. Branch off `main` using the prefixes above.
3. Keep PRs **small and focused** — one logical change per PR.
4. Fill in the **PR template** and link the issue with `Closes #123`.
5. Make sure **all checks pass** (the PR title must be a valid Conventional Commit).
6. Request a review. We critique code, not people.

## Verified commits & privacy

To keep contributors' real e-mail addresses out of a public history, configure
git with your **GitHub `noreply` address**:

```bash
git config user.email "ID+username@users.noreply.github.com"
```

You can find yours under **GitHub → Settings → Emails**. This also makes your
commits show up as **verified** and linked to your profile.

**Never commit secrets.** Copy `.env.example` to `.env` for local config — `.env`
is git-ignored. See [SECURITY.md](SECURITY.md).

## Labels

Issues and PRs are organized with prefixed labels:

- `type:` — bug, feature, docs, chore, refactor, test, task
- `priority:` — low, medium, high, critical
- `status:` — in progress, blocked, needs review, on hold
- `area:` — tasks, finance, notes, notifications, backend, frontend, infra

Labels are managed **as code** in [`.github/labels.yml`](.github/labels.yml) and
synced automatically by a workflow.

## Code style

Formatting is enforced by [`.editorconfig`](.editorconfig). Language-specific
linters and formatters will be added together with the application code.
