'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const stormpath = require('express-stormpath');
const Promise = require('bluebird');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

// stormpath init
// TODO(A): Change to all credentials to ENV VAR
//app.use(stormpath.init(app, {}));
app.on('stormpath.ready', function () {
  console.log('Stormpath Ready!');
});
// stormpath end

const services = require('./services');

app.use(compress())
  .options('*', cors())
  .enable('strict routing')
  /*.use(stormpath.init(app, {
    web: {
      oauth2: {
        password: {
          validationStrategy: 'stormpath'
        }
      }
    },
    preLoginHandler: function (formData, req, res, next) {
      console.log('Pre req params', req.params);
      console.log('Got login request', formData);
      next();
    },
    postLoginHandler: function (account, req, res, next) {
      console.log('Post req params', req.params);
      console.log('Post login request', account);
      next();
    }
  })) // stormpath init*/
  .use(cors())
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/', serveStatic( app.get('public') ))
  // set bodyParser to not strict so that API can recieve bare url string
  .use(bodyParser.json({strict: false}))
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);

module.exports = app;
