const path = require('path');

const root = process.cwd();

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret:   'mysecret',
  mongoose: {
    uri:     'mongodb://localhost/app',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize:      5
      }
    }
  },
  template: {
    // template.root uses config.root
    root: path.join(root, 'templates')
  },
  root:     root
};
