/* eslint-disable no-param-reassign */

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

import { type } from '@lowdefy/helpers';

async function buildAuth({ components }) {
  components.auth = {};
  if (
    type.isArray(components.config.auth.pages.public) ||
    components.config.auth.pages.protected === true
  ) {
    components.auth.include = components.config.auth.pages.public || [];
    components.auth.set = 'public';
    components.auth.default = 'protected';
  } else if (
    type.isArray(components.config.auth.pages.protected) ||
    components.config.auth.pages.public === true
  ) {
    components.auth.include = components.config.auth.pages.protected || [];
    components.auth.set = 'protected';
    components.auth.default = 'public';
  } else {
    components.auth.include = [];
    components.auth.set = 'public';
    components.auth.default = 'public';
  }
  return components;
}

export default buildAuth;
