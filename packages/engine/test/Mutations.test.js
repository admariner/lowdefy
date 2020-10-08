import MutationsClass from '../src/Mutations';

const mockMutResponses = {
  mut_one: {
    data: {
      requestMutation: {
        id: 'req_one',
        success: true,
        response: 1,
      },
    },
  },
  mut_error: new Error('mock error'),
};

const mockMutate = jest.fn();
const mockMutateImp = ({ variables }) => {
  const { requestMutationInput } = variables;
  const { mutationId } = requestMutationInput;
  return new Promise((resolve, reject) => {
    if (mutationId === 'mut_error') {
      reject(mockMutResponses[mutationId]);
    }
    resolve(mockMutResponses[mutationId]);
  });
};
const client = { mutate: mockMutate };

const rootBlock = {
  mutations: [
    {
      mutationId: 'mut_one',
    },
    {
      mutationId: 'mut_error',
    },
  ],
};

const blockId = 'one';
const branch = 'master';
const input = {};
const lowdefyGlobal = {};
const pageId = 'one';
const state = {};
const urlQuery = {};

beforeEach(() => {
  mockMutate.mockReset();
  mockMutate.mockImplementation(mockMutateImp);
});

test('callMutation', async () => {
  const context = {
    blockId,
    branch,
    client,
    input,
    lowdefyGlobal,
    mutations: {},
    pageId,
    rootBlock,
    state,
    update: jest.fn(),
    urlQuery,
  };
  const Mutations = new MutationsClass(context);
  await Mutations.callMutation({ mutationId: 'mut_one' });
  expect(context.mutations).toEqual({
    mut_one: {
      error: [null],
      loading: false,
      response: 1,
    },
  });
});

test('callMutation error', async () => {
  const context = {
    blockId,
    branch,
    client,
    input,
    lowdefyGlobal,
    mutations: {},
    pageId,
    rootBlock,
    state,
    update: jest.fn(),
    urlQuery,
  };
  const Mutations = new MutationsClass(context);
  await expect(Mutations.callMutation({ mutationId: 'mut_error' })).rejects.toThrow();
  expect(context.mutations).toEqual({
    mut_error: {
      error: [new Error('mock error')],
      loading: false,
      response: null,
    },
  });
  await expect(Mutations.callMutation({ mutationId: 'mut_error' })).rejects.toThrow();
  expect(context.mutations).toEqual({
    mut_error: {
      error: [new Error('mock error'), new Error('mock error')],
      loading: false,
      response: null,
    },
  });
});

test('callMutation that is not on root block', async () => {
  const context = {
    blockId,
    branch,
    client,
    input,
    lowdefyGlobal,
    mutations: {},
    pageId,
    rootBlock,
    state,
    update: jest.fn(),
    urlQuery,
  };
  const Mutations = new MutationsClass(context);
  await expect(Mutations.callMutation({ mutationId: 'mut_does_not_exist' })).rejects.toThrow(
    'Configuration Error: Mutation mut_does_not_exist not defined on context.'
  );
  expect(context.mutations).toEqual({
    mut_does_not_exist: {
      error: [
        new Error('Configuration Error: Mutation mut_does_not_exist not defined on context.'),
      ],
      loading: false,
      response: null,
    },
  });
});

test('callMutation on root block with no mutations', async () => {
  const context = {
    blockId,
    branch,
    client,
    input,
    lowdefyGlobal,
    mutations: {},
    pageId,
    rootBlock: {},
    state,
    update: jest.fn(),
    urlQuery,
  };
  const Mutations = new MutationsClass(context);
  await expect(Mutations.callMutation({ mutationId: 'mut_does_not_exist' })).rejects.toThrow(
    'Configuration Error: Mutation mut_does_not_exist not defined on context.'
  );
  expect(context.mutations).toEqual({
    mut_does_not_exist: {
      error: [
        new Error('Configuration Error: Mutation mut_does_not_exist not defined on context.'),
      ],
      loading: false,
      response: null,
    },
  });
});

test('update function should be called', async () => {
  const updateFunction = jest.fn();
  const context = {
    blockId,
    branch,
    client,
    input,
    lowdefyGlobal,
    mutations: {},
    pageId,
    rootBlock,
    state,
    update: updateFunction,
    urlQuery,
  };
  const Mutations = new MutationsClass(context);
  await Mutations.callMutation({ mutationId: 'mut_one' });
  expect(updateFunction).toHaveBeenCalledTimes(1);
});
