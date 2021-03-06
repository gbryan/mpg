const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const vehiclesRouter = require('./routes/vehicles');
const emissionsRouter = require('./routes/emissions');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// In dev environment, allow cross-origin requests.
if (!process.env.NODE_ENV || ['dev', 'development'].includes(process.env.NODE_ENV)) {
  const cors = require('cors');
  app.use(cors());
  app.options('*', cors());
}

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build/frontend')));

app.use('/', indexRouter);
app.use('/api/v1/vehicles', vehiclesRouter);
app.use('/api/v1/emissions', emissionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
