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

import fs from 'fs';
import path from 'path';
import { serializer } from '@lowdefy/helpers';

// Read the endpoint artifacts persisted by writeApi (build/api/<endpointId>.json).
// The full build keeps endpoints in memory on components.api, but the dev context is
// rebuilt from disk, so getBuildContext hydrates them here. validateCallApiRefs needs
// each config's endpointId and type, both of which are present in the artifact.
function readBuildApiArtifacts(buildDirectory) {
  const apiDirectory = path.join(buildDirectory, 'api');
  let fileNames;
  try {
    fileNames = fs.readdirSync(apiDirectory);
  } catch (error) {
    // writeApi only creates the directory when endpoints are defined — absent means none.
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const content = fs.readFileSync(path.join(apiDirectory, fileName), 'utf8');
      return serializer.deserialize(JSON.parse(content));
    });
}

export default readBuildApiArtifacts;
