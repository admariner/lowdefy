// @shelf/jest-mongodb loads this file with require(), which on Node >=22 returns the
// module namespace for ESM files, so options must be a named export (not default).
export const mongodbMemoryServerOptions = {
  instance: {
    dbName: 'test',
  },
  autoStart: false,
};
