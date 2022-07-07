const Sequelize = require('sequelize');
const UserModel = require('./User');
const SessionsModel = require('./Sessions');
const CodeSessionsModel = require('./CodeSessions');
const config = require('../config/config');

const sequelize = new Sequelize(
    config.DATABASE,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        port: +config.DB_PORT,
        dialect: 'postgres',
        protocol: 'postgres',
        define: {
            timestamps: false,
        },
        logging: false,
    }
);

const User = UserModel(sequelize, Sequelize);
const Sessions = SessionsModel(sequelize, Sequelize);
const CodeSessions = CodeSessionsModel(sequelize, Sequelize);

sequelize.sync().then(() => {
    console.log('db and tables have been created');
});

module.exports = { User, Sessions, CodeSessions };
