const main = require('./swagger.json');

const usersRoutes = require('./routes/users.json');

const usersModels = require('./models/users.json');

const paths = {
    ...usersRoutes,
};

const definitions = {
    ...usersModels,
};

module.exports = {
    ...main,
    definitions,
    paths,
};
