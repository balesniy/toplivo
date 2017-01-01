const path = require('path');

const root = process.cwd();

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret:   'mysecret',
  template: {
    // template.root uses config.root
    root: path.join(root, 'templates')
  },
  root:     root
};
