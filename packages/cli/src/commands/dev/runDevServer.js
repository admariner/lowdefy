/*
  Copyright 2020-2023 Lowdefy, Inc

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

import { spawnProcess } from '@lowdefy/node-utils';
import createStdOutLineHandler from '../../utils/createStdOutLineHandler.js';

async function runDevServer({ context, directory }) {
  await spawnProcess({
    args: ['run', 'start'],
    command: context.pnpmCmd,
    stdOutLineHandler: createStdOutLineHandler({ context }),
    processOptions: {
      cwd: directory,
      env: {
        ...process.env,
        LOWDEFY_BUILD_REF_RESOLVER: context.options.refResolver,
        LOWDEFY_DIRECTORY_CONFIG: context.directories.config,
        LOWDEFY_LOG_LEVEL: context.options.logLevel,
        LOWDEFY_LICENSE_ENTITLEMENTS: JSON.stringify(context.license.entitlements),
        LOWDEFY_SERVER_DEV_OPEN_BROWSER: !!context.options.open,
        LOWDEFY_SERVER_DEV_WATCH: JSON.stringify(context.options.watch),
        LOWDEFY_SERVER_DEV_WATCH_IGNORE: JSON.stringify(context.options.watchIgnore),
        PORT: context.options.port,
      },
    },
    silent: false,
  });
}

export default runDevServer;
