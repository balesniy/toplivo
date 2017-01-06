const path = require('path');

const root = process.cwd();

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret:   'mysecret',
  server: {
    siteHost: 'http://localhost:3000'
  },
  mongoose: {
    uri:     'mongodb://balesniy:balesniy123@ds151208.mlab.com:51208/heroku_b5pkdnsv',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize:      5
      }
    }
  },
  mailer: {
    transport: 'gmail',
    gmail: {
      user: 'alex.balesniy',
      password: 'sokolova123'
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        fromEmail: 'alex.balesniy@gmail.com',
        fromName:  'toplivo.club',
        signature: "<em>С уважением,<br>Топливный клуб</em>"
      },
      // newsletters
      informer: {
        fromEmail: 'someother@email.com',
        fromName:  'Newsletters',
        signature: "<em>Have fun!</em>"
      }
    }
  },

  crypto:   {
    hash: {
      length:     128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1
    }
  },
  template: {
    // template.root uses config.root
    root: path.join(root, 'templates')
  },
  root:     root
};
