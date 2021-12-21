module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.2.2',
      skipMD5: true,
    },
    instance: {
      dbName: 'hanji',
    },
    autoStart: false,
  },
};