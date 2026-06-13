# Security Policy

The security of Nudge — and of the people who self-host it — is taken seriously.

## Supported versions

Nudge is pre-1.0 and under active development. Only the latest `main` is supported.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |
| < 0.1   | ❌        |

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report it privately through
[GitHub Security Advisories](../../security/advisories/new). You can expect an
initial response within a few days. Once the issue is confirmed and fixed, we are
happy to credit you (unless you prefer to stay anonymous).

## Secrets & configuration

Nudge is **self-hosted and fully configurable**. To keep it safe:

- 🔑 **Never commit secrets.** All sensitive values (API keys, the WhatsApp
  endpoint token, your phone number) live in a local `.env` file, which is
  **git-ignored**.
- 📄 `.env.example` documents every supported variable with safe placeholder
  values — it is the only env file that belongs in the repository.
- 🤖 Automated dependency updates are enabled via Dependabot.
- 🧪 Secret scanning and push protection are recommended (enabled by default on
  public GitHub repositories).

If you ever find a secret committed by mistake, treat it as compromised: rotate
it immediately and report it.
