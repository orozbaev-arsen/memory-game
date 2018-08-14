// main modules
const express = require('express');
const io = require('socket.io');
const _ = require('lodash');
const http = require('http');
const path = require('path');
const fs = require('fs');

// additional modules
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const Database = require('./modules/db');
const Game = require('./modules/game');
const config = require('../config/server');
const actions = require('./socket');

const env = process.env.NODE_ENV || 'development';

// init app
const app = {
  path: {
    root: __dirname,
    router: '/',
  },
  config: config[env] || config.development,
  // modules
  models: null,
  game: null,
  server: null,
  express: null,
  socket: null,

  /**
   * get directory/file from root
   * @param file
   * @returns {Socket|*|string}
   */
  dir(file) {
    return path.join(this.path.root, file);
  },

  /**
   * initialize app
   * @param rootPath
   */
  async init(rootPath = false) {
    if (rootPath) {
      this.path.root = rootPath;
    }
    // initialize modules
    this.models = await Database(this, this.config.database || {});
    this.express = express();
    this.server = http.Server(this.express);
    this.socket = io(this.server);
    this.game = await Game(this, this.config);

    this.configure();
    this.routers();
    this.sockets();

    this.server.listen(this.config.port, () => {
      console.log('app init');
    });
  },
  /**
   * configure app
   */
  configure() {
    // view engine setup
    this.express.set('views', this.dir('views'));
    this.express.set('view engine', 'pug');

    // additional modules
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(this.dir('../dist')));
    this.express.use('/assets', express.static(this.dir('../frontend/assets')));
  },
  /**
   * sockets
   */
  sockets() {
    this.socket.on('connection', (socket) => {
      socket.emit('stats', this.game.stats);
      _.forEach(actions, (action, name) => {
        socket.on(name, (data) => {
          if (typeof action === 'function') {
            action(this, socket, data);
          }
        });
      });
    });
  },
  /**
   * set app routers
   */
  routers() {
    // home index
    if (this.config.home) {
      this.express.all('/', (req, res) => {
        res.redirect(`/${this.config.home}`);
      });
    }

    // auto router
    fs.readdirSync(this.dir('routers')).forEach((file) => {
      console.log('init http router', file);
      this.express.use(this.path.router + path.basename(file, '.js'), require(this.dir(`routers/${file}`)));
    });

    // catch 404 and forward to error handler
    this.express.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.express.use((err, req, res, next) => {
      // set locals, only providing error in development
      console.log('error', err);
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  },
};

module.exports = app;

