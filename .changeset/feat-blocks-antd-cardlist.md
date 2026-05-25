---
'@lowdefy/blocks-antd': minor
---

feat(blocks-antd): Add `CardList` display block.

Data-driven vertical list that renders each item into a headerless antd `Card` whose body comes from a Nunjucks template against the row. Backed by `react-virtuoso` so thousands of variable-height cards render smoothly with only the visible window in the DOM, and rows are `React.memo`'d via a stable `methodsRef` so unrelated parent re-renders don't bust the cache.

Properties: `data`, `html` (Nunjucks), `bordered`, `hoverable`, `size`, `gap`, `height`, `overscan`, `theme`, and an optional `search` object (`placeholder`, `fields`, `caseSensitive`, `debounce`, `sticky`, `allowClear`, `minLength`, `noResultsText`). Search defaults to matching every field path via `JSON.stringify`; supply `fields: ['user.name', 'email']` to restrict. Filtering preserves the original `index` in both the template context and the `onClick` payload. Built-in loading skeleton renders when `loading` is truthy. A text-only no-results placeholder (no image) appears when the filter matches zero items. Colors come from antd theme tokens so light/dark mode work out of the box.

Events: `onClick` (`{ index, item }`) and `onSearch` (`{ value, resultCount }`, fires on debounced query change when `search` is set).
