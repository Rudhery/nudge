# Architecture Decision Records

This folder holds **ADRs** — short documents that capture an important
architectural decision, its context, and its consequences. They explain *why*
the project is built the way it is, so the reasoning isn't lost over time.

Format inspired by [Michael Nygard's ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Index

| #    | Title                       | Status   |
| ---- | --------------------------- | -------- |
| [0001](0001-architecture.md) | Architecture & Tech Stack | Accepted |

## Adding a new ADR

1. Copy [`template.md`](template.md) to `NNNN-short-title.md` (next number).
2. Fill it in and open a PR.
3. Add a row to the index above.

A decision that replaces an older one sets the old ADR's status to
`Superseded by ADR-NNNN` rather than deleting it.
