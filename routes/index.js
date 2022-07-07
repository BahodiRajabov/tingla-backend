const auth = require('./auth');
const users = require('./users');
const docs = require('./docs');

module.exports = (app) => {
    // DOCS
    app.use('/api/docs', docs);

    // USERS
    app.use('/api/auth', auth);
    app.use('/api/users', users);
};
