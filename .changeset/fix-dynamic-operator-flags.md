---
'@lowdefy/operators-js': patch
---

fix: Prevent _date, _intl, and _number.toLocaleString operators from being evaluated at build time.

These operators depend on runtime context (current date/time, locale) and were incorrectly marked as static, causing them to be evaluated during the build and freezing their values.
