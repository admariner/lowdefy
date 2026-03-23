# Migration: Custom Block Plugin Architecture (`types.js`, `meta.js`, `withBlockDefaults`)

## Context

In Lowdefy v5, the dev server loads each plugin's `types.js` via Node.js `require()` at startup (in `createCustomPluginTypesMap.mjs`). If your plugin's `types.js` imports from `blocks.js` — which imports React components that import CSS files — Node.js crashes:

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".css"
```

The fix is architectural: block metadata must be separated from block components into dedicated `meta.js` files, so `types.js` never touches React or CSS.

Additionally, `blockDefaultProps` (direct assignment) is replaced by the `withBlockDefaults()` HOC wrapper.

This migration targets local plugin source code (JS/JSX), not YAML configs.

## Scope

`plugins` — scan JS files in local block plugin directories.

## What to Do

For each custom block plugin package:

### 1. Create a `meta.js` file for each block

For each block that has `BlockName.meta = { ... }` on the component, extract the meta object into a new file at `blocks/BlockName/meta.js`.

The meta.js file must be a pure data export — no React, no CSS, no library imports:

```javascript
export default {
  category: 'display',
  icons: [],
};
```

If the block has `valueType`, include it:

```javascript
export default {
  category: 'input',
  valueType: 'array',
  icons: [],
};
```

### 2. Remove `.meta` assignment from block components

Delete the static `.meta` assignment from each block component file:

```javascript
// DELETE these lines:
BlockName.meta = {
  category: 'display',
  icons: [],
};
```

### 3. Create a `metas.js` barrel file

In the plugin's `src/` directory, create `metas.js` that re-exports all meta files. Mirror the structure of `blocks.js` but point to `meta.js` instead of component files:

```javascript
export { default as MyBlock } from './blocks/MyBlock/meta.js';
export { default as MyOtherBlock } from './blocks/MyOtherBlock/meta.js';
```

### 4. Rewrite `types.js` to use `extractBlockTypes`

Replace the old pattern that imports from `blocks.js`:

```javascript
// OLD — crashes in v5 (blocks.js imports React components with CSS)
import * as blocks from './blocks.js';
const icons = {};
Object.keys(blocks).forEach((block) => {
  icons[block] = blocks[block].meta.icons || [];
});
export default { blocks: Object.keys(blocks), icons };
```

With the new pattern:

```javascript
import { extractBlockTypes } from '@lowdefy/block-utils';
import * as metas from './metas.js';

export default extractBlockTypes(metas);
```

For **mixed plugins** that export blocks alongside actions, connections, or operators — keep the non-block exports but replace the block logic. See the mixed plugin example below.

### 5. `blockDefaultProps` vs `withBlockDefaults`

**If your plugin depends on `@lowdefy/block-utils` v5+ (from the new experimental releases):**

Replace `blockDefaultProps` with `withBlockDefaults`:

```javascript
// OLD
import { blockDefaultProps } from '@lowdefy/block-utils';
BlockName.defaultProps = blockDefaultProps;
export default BlockName;

// NEW
import { withBlockDefaults } from '@lowdefy/block-utils';
export default withBlockDefaults(BlockName);
```

**If your plugin still depends on `@lowdefy/block-utils` v4.x:** Keep `blockDefaultProps` — `withBlockDefaults` does not exist in v4. Only migrate this when you update `@lowdefy/block-utils` to v5+.

### 5b. Rename `style.css` → `style.module.css`

Next.js 16 with Turbopack rejects global CSS imports from component files (`import './style.css'`). CSS must be imported as CSS Modules.

For each block that imports a `.css` file:

1. Rename the file: `style.css` → `style.module.css`
2. Update the import: `import './style.css'` → `import './style.module.css'`
3. If the CSS has global selectors (class names, element selectors), wrap them in `:global { ... }` to preserve global scoping:

```css
/* style.module.css */
:global {
  .my-block-class {
    padding: 16px;
  }
  .my-block-class .child {
    color: red;
  }
}
```

### 6. Update `package.json` exports

Add the `./metas` export:

```json
{
  "exports": {
    "./*": "./dist/*",
    "./blocks": "./dist/blocks.js",
    "./metas": "./dist/metas.js",
    "./types": "./dist/types.js"
  }
}
```

### 7. Update dependency versions

Update all `@lowdefy/*` dependencies to match the target Lowdefy version you're upgrading to. Also update `antd` if your plugin imports from it directly.

```json
{
  "dependencies": {
    "@lowdefy/block-utils": "5.0.0",
    "@lowdefy/helpers": "5.0.0",
    "@lowdefy/blocks-antd": "5.0.0",
    "antd": "6.3.1"
  }
}
```

**Key version changes:**

- All `@lowdefy/*` packages → match your target Lowdefy version
- `antd` → `6.3.1` (v5 uses antd v6, not v4). Only needed if your plugin imports from `antd` directly. If you only import from `@lowdefy/blocks-antd`, antd is a transitive dep and doesn't need to be listed.
- `react` / `react-dom` → keep at `18.2.0`

**Check which plugins import antd directly:**

```bash
grep -rn "from 'antd'" plugins/*/src/ --include='*.js'
```

Only those plugins need `antd` in their direct dependencies.

## Files to Check

Glob in plugin directories: `**/src/types.js`, `**/src/blocks.js`, `**/src/blocks/**/*.js`

Grep patterns:

- `import.*from.*blocks.js` in `types.js` files — the crash trigger
- `blockDefaultProps` — old default props pattern
- `\.meta\s*=\s*\{` — meta assigned on component
- `\.defaultProps\s*=\s*blockDefaultProps` — old pattern

## Examples

### Before — `types.js` (blocks-only plugin)

```javascript
import * as blocks from './blocks.js';

const icons = {};
Object.keys(blocks).forEach((block) => {
  icons[block] = blocks[block].meta.icons ?? [];
});
export default {
  blocks: Object.keys(blocks),
  icons,
};
```

### After — `types.js` (blocks-only plugin)

```javascript
import { extractBlockTypes } from '@lowdefy/block-utils';
import * as metas from './metas.js';

export default extractBlockTypes(metas);
```

### Before — `types.js` (mixed plugin with blocks + actions + connections)

```javascript
import * as actions from './actions.js';
import * as blocks from './blocks.js';
import * as connections from './connections.js';

const icons = {};
Object.keys(blocks).forEach((block) => {
  icons[block] = blocks[block].meta.icons || [];
});
export default {
  actions: Object.keys(actions),
  blocks: Object.keys(blocks),
  icons,
  connections: Object.keys(connections),
  requests: Object.keys(connections)
    .map((connection) => Object.keys(connections[connection].requests))
    .flat(),
};
```

### After — `types.js` (mixed plugin)

```javascript
import { extractBlockTypes } from '@lowdefy/block-utils';
import * as actions from './actions.js';
import * as connections from './connections.js';
import * as metas from './metas.js';

const blockTypes = extractBlockTypes(metas);
export default {
  ...blockTypes,
  actions: Object.keys(actions),
  connections: Object.keys(connections),
  requests: Object.keys(connections)
    .map((connection) => Object.keys(connections[connection].requests))
    .flat(),
};
```

### Before — block component

```javascript
import React from 'react';
import { blockDefaultProps } from '@lowdefy/block-utils';
import '@ag-grid-community/styles/ag-grid.css';

const MyGrid = ({ blockId, events, methods, properties }) => (
  <div id={blockId} className="ag-theme-alpine">
    {/* ... */}
  </div>
);

MyGrid.defaultProps = blockDefaultProps;
MyGrid.meta = {
  category: 'display',
  icons: [],
};

export default MyGrid;
```

### After — block component (v4 block-utils)

```javascript
import React from 'react';
import { blockDefaultProps } from '@lowdefy/block-utils';
import '@ag-grid-community/styles/ag-grid.css';

const MyGrid = ({ blockId, events, methods, properties }) => (
  <div id={blockId} className="ag-theme-alpine">
    {/* ... */}
  </div>
);

MyGrid.defaultProps = blockDefaultProps;

export default MyGrid;
```

### New file — `blocks/MyGrid/meta.js`

```javascript
export default {
  category: 'display',
  icons: [],
};
```

### New file — `metas.js`

```javascript
export { default as MyGrid } from './blocks/MyGrid/meta.js';
export { default as MyOtherBlock } from './blocks/MyOtherBlock/meta.js';
```

### Before — `package.json` exports

```json
{
  "exports": {
    "./*": "./dist/*",
    "./blocks": "./dist/blocks.js",
    "./types": "./dist/types.js"
  }
}
```

### After — `package.json` exports

```json
{
  "exports": {
    "./*": "./dist/*",
    "./blocks": "./dist/blocks.js",
    "./metas": "./dist/metas.js",
    "./types": "./dist/types.js"
  }
}
```

## Edge Cases

- **Mixed plugins** (blocks + actions + connections): only replace the block-related logic in `types.js`. Action and connection imports can stay as-is — they don't import React/CSS
- **Blocks with no `.meta` property**: create a minimal `meta.js` with `{ category: 'display', icons: [] }`
- **Input blocks with `valueType`**: include `valueType` in the meta.js (e.g., `{ category: 'input', valueType: 'array', icons: [] }`)
- **`withBlockDefaults` availability**: only available in `@lowdefy/block-utils` v5+. If your plugin depends on v4.x, keep using `blockDefaultProps` with `.defaultProps` assignment. Only switch to `withBlockDefaults` after upgrading the dependency.
- **`extractBlockTypes` availability**: only available in `@lowdefy/block-utils` v5+. If on v4.x, use the manual pattern: `import * as metas from './metas.js'; const blocks = Object.keys(metas); const icons = {}; for (const name of blocks) { icons[name] = metas[name].icons ?? []; } export default { blocks, icons };`
- **Global CSS imports (`import './style.css'`)**: Next.js 16 with Turbopack rejects global CSS from component files. Rename to `.module.css` and wrap selectors in `:global { ... }` to preserve global scoping. Third-party CSS (e.g., `@ag-grid-community/styles/ag-grid.css`) is handled by Next.js `transpilePackages` and doesn't need renaming.
- **Third-party CSS imports** in block components (e.g., `@ag-grid-community/styles/ag-grid.css`): these are fine — the key fix is ensuring `types.js` never reaches them via its import chain
- Don't forget to rebuild the plugin after making changes (`pnpm build`)

## Verification

1. No `types.js` should import from `blocks.js`:

   ```
   grep -rn "import.*from.*blocks.js" --include='*.js' */src/types.js
   ```

2. No `.defaultProps = blockDefaultProps` should remain:

   ```
   grep -rn "\.defaultProps = blockDefaultProps" --include='*.js' */src/
   ```

3. No `.meta = {` should remain on block components:

   ```
   grep -rn "\.meta = {" --include='*.js' */src/blocks/
   ```

4. Each block plugin's `package.json` should have a `"./metas"` export

5. Build each plugin and start the dev server — blocks should load without CSS import errors
