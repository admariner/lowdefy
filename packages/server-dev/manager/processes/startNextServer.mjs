/*
  Copyright 2020-2022 Lowdefy, Inc

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

import spawnProcess from '../utils/spawnProcess.mjs';

function startServerProcess(context) {
  context.shutdownServer();

  const nextServer = spawnProcess({
    logger: context.logger,
    command: 'node',
    args: [context.bin.next, 'start'],
    silent: false,
    processOptions: {
      env: {
        ...process.env,
        PORT: context.options.port,
      },
    },
  });
  context.logger.debug(`Started next server with pid ${nextServer.pid}.`);
  nextServer.on('exit', (code, signal) => {
    // TODO: Needed?
    context.logger.debug(`nextServer exit ${nextServer.pid}, signal: ${signal}, code: ${code}`);
  });
  nextServer.on('error', (error) => {
    context.logger.error(error);
  });
  context.nextServer = nextServer;
}

export default startServerProcess;
