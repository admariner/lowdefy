/*
  Copyright 2020-2024 Lowdefy, Inc

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

import { type } from '@lowdefy/helpers';
import buildStage from './buildStage.js';
import buildControl from './buildControl.js';
import { validControlKey } from './controlKeys.js';

function buildGraph(stage, endpointContext) {
  if (type.isArray(stage)) {
    stage.forEach((item) => {
      buildGraph(item, endpointContext);
    });
  }
  if (type.isObject(stage)) {
    if (validControlKey(Object.keys(stage))) {
      buildControl(stage, endpointContext);
    } else {
      buildStage(stage, endpointContext);
    }
  }
  // TODO: thrown even when previous errors should throw
  // throw new Error(
  //   `Expected endpoint stage to be of type object or array, found ${JSON.stringify(
  //     type.typeOf(stage)
  //   )} lksjdf§:w`
  // );
}

export default buildGraph;
