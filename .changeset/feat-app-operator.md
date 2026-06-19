---
'@lowdefy/api': minor
'@lowdefy/build': minor
'@lowdefy/client': minor
'@lowdefy/operators': minor
'@lowdefy/operators-js': minor
'@lowdefy/server': minor
---

feat: Add `_app` operator and structured app metadata.

A new runtime operator `_app` reads the app's declared metadata —
`slug`, `name`, `version`, `description`, `license`, `lowdefyVersion`,
`gitSha`. It works on both client and server, including inside
`modules-mongodb` request filters, and inside `_js` functions via a
bound `lowdefyApp(p)` callable.

The root `lowdefy.yaml` schema gains two new optional fields:

- `slug` — a kebab-case identifier (`^[a-z][a-z0-9]*(-[a-z0-9]+)*$`),
  validated at build time. Build fails with a clear error if invalid.
- `description` — a free-form string.

`gitSha` resolves through a fallback chain: `LOWDEFY_GIT_SHA` env var
when set non-empty → `git rev-parse HEAD` → `null`. This lets apps
deployed without `.git` (Docker, Vercel, Netlify, Render, hermetic
PaaS sandboxes) pin the SHA explicitly by mapping their platform's
commit env var via shell expansion in the build command.

Build emits a new `appMeta.json` artifact alongside `app.json`. The
existing `app.git_sha` field is removed; consumers (internal telemetry)
read `gitSha` from `appMeta` instead.

See the `_app` operator reference for the full key set and examples.
