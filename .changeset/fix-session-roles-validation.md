---
'@lowdefy/api': patch
---

fix(api): Validate session.user.roles is an array of strings.

Misconfigured `auth.userFields` mapping roles to a non-array provider field (e.g., a string) caused silent authorization bypasses via `String.prototype.includes` substring matching. Session roles are now validated after session assembly, throwing a clear `ConfigError` pointing to the auth configuration. Added a defense-in-depth guard in `createAuthorize` for the same check.
