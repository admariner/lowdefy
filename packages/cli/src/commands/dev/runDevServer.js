/*
  Copyright 2020-2021 Lowdefy, Inc

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

async function runDevServer({ context }) {
  // TODO: Pass packageManager as option
  await spawnProcess({
    logger: context.print,
    args: ['run', 'start'],
    command: context.packageManager, // npm or yarn
    processOptions: {
      cwd: context.directories.devServer,
      env: {
        ...process.env,
        LOWDEFY_PACKAGE_MANAGER: context.packageManager,
        LOWDEFY_DIRECTORY_CONFIG: context.directories.config,
        PORT: context.options.port,
      },
    },
    silent: false,
  });
}

export default runDevServer;