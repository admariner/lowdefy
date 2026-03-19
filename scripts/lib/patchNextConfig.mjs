/*
  Copyright 2020-2026 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import fs from 'node:fs';
import path from 'node:path';

// Pin react/react-dom to the target dir's copies so linked @lowdefy/*
// packages share a single instance (prevents "invalid hook call" errors).
//
// Turbopack's resolveAlias does not handle absolute paths (it prepends "./"),
// so we resolve paths relative to __dirname at runtime in next.config.js.
function patchNextConfig({ targetDir }) {
  const nextConfigPath = path.join(targetDir, 'next.config.js');
  const content = fs.readFileSync(nextConfigPath, 'utf8');

  if (content.includes('turbopack: {},')) {
    fs.writeFileSync(
      nextConfigPath,
      content.replace(
        'turbopack: {},',
        [
          `turbopack: {`,
          `    resolveAlias: {`,
          `      react: './' + require('path').relative(__dirname, require('path').dirname(require.resolve('react/package.json'))),`,
          `      'react-dom': './' + require('path').relative(__dirname, require('path').dirname(require.resolve('react-dom/package.json'))),`,
          `    },`,
          `  },`,
        ].join('\n')
      )
    );
    return;
  }
}

export default patchNextConfig;
