---
'@lowdefy/build': patch
---

fix(build): Resolve `_ref` resolver and transformer JS paths against the module root.

Modules can now ship their own JS resolvers and transformers. Previously, a `_ref: { resolver: resolvers/x.js }` inside a module manifest failed with `Cannot find module` because the build resolved the JS path against the host app's config directory instead of the module root. Absolute paths in `resolver`, `transformer`, and `.js` content refs are also now honored verbatim. The existing package-root escape check that prevents module refs from reading outside their package is extended to cover both new fields.
