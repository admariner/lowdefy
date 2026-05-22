---
'@lowdefy/api': minor
'@lowdefy/errors': minor
'@lowdefy/operators': minor
---

feat(api): Add `callApi({ endpointId, payload })` to the request-resolver argument bag.

Request resolvers (the JS resolvers shipped by connection plugins — e.g. `plugin-http`'s `get`, `plugin-mongodb`'s `find`) now receive a `callApi` function in their argument bag. Calling it invokes another Lowdefy endpoint in-process with the same semantics as the routine `:call_api` step: depth cap (10), caller's user identity, isolated routine context, inherited parser closure (`_user`, `_secret`, `_env`, `_payload`), and `InternalApi` endpoints reachable. Returns the target routine's response or throws on failure — `UserError` for `:throw`/`:reject`, original Lowdefy error class preserved otherwise.

Supporting improvements landed alongside:

- `_state` is now scoped to the routine frame. `:set_state` writes no longer leak across routine boundaries. Two sibling `:call_api` invocations see independent state.
- `UserError` now accepts and forwards `cause`. `controlThrow` (`:throw`) and `controlReject` (`:reject`) construct `UserError` so routine-step and JS-boundary surfaces carry the same class for user-authored failures.
- `callRequestResolver` passes all Lowdefy errors (those with `isLowdefyError === true`) through unchanged. Only raw errors are wrapped into `RequestError` / `ServiceError`. A deep `callApi` chain no longer accumulates redundant `cause` nesting.
- `runRoutine` guards against double `handleError` invocations when the same error crosses multiple `runRoutine` boundaries on a `callApi` chain.
- The endpoint-invocation sequence (`depth check → load config → authorize → child routineContext → runRoutine`) is factored into a shared `invokeEndpoint` helper used by both the routine `:call_api` step and the new `callApi` function.

**Behavior change:** any app that accidentally relied on `:set_state` writes leaking across routine boundaries (e.g., a routine called via `:call_api` reading state set by its caller) will break. The leakage was a bug, not a contract — there is no backwards-compatibility shim.
