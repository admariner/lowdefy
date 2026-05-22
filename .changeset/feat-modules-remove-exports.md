---
'@lowdefy/build': minor
---

feat: Remove static `exports` declaration from modules.

The `exports:` block in `module.lowdefy.yaml` is no longer required. Modules can now generate page, connection, and API endpoint ids dynamically — via `_build.array.map`, `_module.var`, or resolver functions — without declaring them upfront. Cross-module references are validated against the merged id sets after full resolve, with clearer, page-scoped error messages naming the broken reference and its source page.

A leftover `exports:` block has no effect on the build and is silently ignored. A codemod (`modules-remove-exports`) is provided to strip the dead field from your manifests.
