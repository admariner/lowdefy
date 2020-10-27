/*
  Copyright 2020 Lowdefy, Inc

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

import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import mockBlockProps from './mockBlockProps';
import blockDefaults from './blockDefaults';

const mockBlock = (meta) => {
  // mock Match.random to generate consistent ids
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 0.123456789;
  global.Math = mockMath;

  let container = {};
  const callAction = jest.fn();
  const makeCssClass = jest.fn();
  const registerMethod = jest.fn();
  const pushItem = jest.fn();
  const unshiftItem = jest.fn();
  const removeItem = jest.fn();
  const moveItemDown = jest.fn();
  const moveItemUp = jest.fn();
  const methods = {
    callAction,
    makeCssClass,
    registerMethod,
    pushItem,
    unshiftItem,
    removeItem,
    moveItemDown,
    moveItemUp,
  };
  const makeCssImp = (style, op) => JSON.stringify({ style, options: op });
  let nodeMock = {};
  let renderOptions = {
    createNodeMock: () => nodeMock,
  };

  const before = () => {
    // clear all keys in note mock but keep object pointer
    Object.keys(nodeMock).forEach((key) => {
      delete nodeMock[key];
    });
    container.div = document.createElement('div');
    document.body.appendChild(container.div);
    makeCssClass.mockReset();
    makeCssClass.mockImplementation(makeCssImp);
    callAction.mockReset();
    registerMethod.mockReset();
    pushItem.mockReset();
    unshiftItem.mockReset();
    removeItem.mockReset();
    moveItemDown.mockReset();
    moveItemUp.mockReset();
  };
  const after = () => {
    unmountComponentAtNode(container.div);
    container.div.remove();
    container.div = null;
  };
  const getProps = (config) => mockBlockProps(config, meta);
  return { after, before, container, methods, getProps, renderOptions, nodeMock };
};

export default mockBlock;
