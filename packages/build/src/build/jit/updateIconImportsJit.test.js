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

import { jest } from '@jest/globals';
import updateIconImportsJit from './updateIconImportsJit.js';

const mockWriteBuildArtifact = jest.fn();

beforeEach(() => {
  mockWriteBuildArtifact.mockReset();
  mockWriteBuildArtifact.mockResolvedValue(undefined);
});

test('updateIconImportsJit adds new icon to existing package entry and writes artifacts', async () => {
  const iconImports = [
    { icons: ['AiFillHome'], package: 'react-icons/ai' },
    { icons: [], package: 'react-icons/io5' },
  ];
  const context = { writeBuildArtifact: mockWriteBuildArtifact };
  const newIcons = [{ icon: 'IoAddCircle', package: 'react-icons/io5' }];

  await updateIconImportsJit({ newIcons, iconImports, context });

  // iconImports mutated in place
  expect(iconImports[1].icons).toContain('IoAddCircle');

  // Both artifacts written
  expect(mockWriteBuildArtifact).toHaveBeenCalledTimes(2);

  // iconImports.json
  const jsonCall = mockWriteBuildArtifact.mock.calls.find((c) => c[0] === 'iconImports.json');
  expect(jsonCall).toBeDefined();
  const written = JSON.parse(jsonCall[1]);
  expect(written[1].icons).toContain('IoAddCircle');

  // plugins/icons.js
  const jsCall = mockWriteBuildArtifact.mock.calls.find((c) => c[0] === 'plugins/icons.js');
  expect(jsCall).toBeDefined();
  expect(jsCall[1]).toContain('IoAddCircle');
});

test('updateIconImportsJit adds icons for package not yet in imports', async () => {
  const iconImports = [{ icons: [], package: 'react-icons/ai' }];
  const context = { writeBuildArtifact: mockWriteBuildArtifact };
  const newIcons = [{ icon: 'MdDelete', package: 'react-icons/md' }];

  await updateIconImportsJit({ newIcons, iconImports, context });

  const mdEntry = iconImports.find((e) => e.package === 'react-icons/md');
  expect(mdEntry).toBeDefined();
  expect(mdEntry.icons).toContain('MdDelete');
});

test('updateIconImportsJit merges multiple new icons', async () => {
  const iconImports = [
    { icons: ['AiFillHome'], package: 'react-icons/ai' },
    { icons: [], package: 'react-icons/io5' },
  ];
  const context = { writeBuildArtifact: mockWriteBuildArtifact };
  const newIcons = [
    { icon: 'IoAddCircle', package: 'react-icons/io5' },
    { icon: 'AiFillStar', package: 'react-icons/ai' },
  ];

  await updateIconImportsJit({ newIcons, iconImports, context });

  expect(iconImports[0].icons).toContain('AiFillHome');
  expect(iconImports[0].icons).toContain('AiFillStar');
  expect(iconImports[1].icons).toContain('IoAddCircle');
});

test('updateIconImportsJit generates valid icons.js import file', async () => {
  const iconImports = [{ icons: [], package: 'react-icons/io5' }];
  const context = { writeBuildArtifact: mockWriteBuildArtifact };
  const newIcons = [{ icon: 'IoAddCircle', package: 'react-icons/io5' }];

  await updateIconImportsJit({ newIcons, iconImports, context });

  const jsCall = mockWriteBuildArtifact.mock.calls.find((c) => c[0] === 'plugins/icons.js');
  const content = jsCall[1];
  expect(content).toContain("import { IoAddCircle } from 'react-icons/io5';");
  expect(content).toContain('export default {');
  expect(content).toContain('IoAddCircle,');
});

test('updateIconImportsJit does not duplicate icons on concurrent calls', async () => {
  const iconImports = [{ icons: ['IoAddCircle'], package: 'react-icons/io5' }];
  const context = { writeBuildArtifact: mockWriteBuildArtifact };
  // Simulates a concurrent JIT build trying to add the same icon
  const newIcons = [{ icon: 'IoAddCircle', package: 'react-icons/io5' }];

  await updateIconImportsJit({ newIcons, iconImports, context });

  const io5Icons = iconImports[0].icons.filter((i) => i === 'IoAddCircle');
  expect(io5Icons).toHaveLength(1);
});
