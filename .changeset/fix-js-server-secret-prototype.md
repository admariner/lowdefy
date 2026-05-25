---
'@lowdefy/build': patch
---

fix: Correct `secrets` → `secret` in the server `_js` function prototype.

The generated `serverJsMap.js` previously destructured `{ secrets }`, which
never matched the binding name (`secret`) passed at runtime by the `_js`
operator. As a result, any user `_js` function that referenced `secrets` in
its argument destructuring received `undefined`. The prototype now
destructures `secret`, matching the runtime binding.
