module.exports = {
    apps: [
      {
        name: 'appServer',
        script: './appServer.js',
        watch: false,
        exec_mode: 'fork',
      },
      {
        name: 'authServer',
        script: './authServer.js',
        watch: false,
        exec_mode: 'fork',
      },
    ],
  };
  