module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'sessions',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tokenId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            loggedOut: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            loggedInAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.fn('now'),
            },
            loggedOutAt: {
                type: DataTypes.DATE,
            },
            ip: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            device: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            indexes: [{ fields: ['userId', 'tokenId'], unique: true }],
        }
    );
