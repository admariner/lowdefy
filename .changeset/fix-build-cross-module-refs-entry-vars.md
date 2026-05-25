---
'@lowdefy/build': patch
---

fix(build): Resolve cross-module refs in module entry vars and connections.

Cross-module operators (`_ref { module, component }`, `_module.pageId/connectionId/endpointId/id { module }`) inside a module entry's `vars` or `connections` in `lowdefy.yaml` previously failed the build with "no module with that entry id was registered" because the entry subtrees were walked before any module was registered. They now resolve correctly against the app-level module registry — apps can compose components from one module into another's slot without forcing a dependency declaration on the host module.

**Behavior change:** required-var validation now sees through `_ref` to the resolved value. A required var supplied via a `_ref` that resolves to `null` previously passed validation (the raw `_ref` object was non-none) and now correctly fails.
