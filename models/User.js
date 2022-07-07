const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin', 'superadmin'),
            defaultValue: 'user',
        },
        age: {
            type: DataTypes.INTEGER,
        },
        isMale: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
    });

    return User;
};
