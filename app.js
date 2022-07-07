const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const globalErrorHandler = require('./controllers/error');
const AppError = require('./utils/appError');
const indexRouter = require('./routes');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (_, res) => res.redirect('/api/docs'));

indexRouter(app);

app.use('/*', (req, res, next) => {
    console.log("error route");
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
