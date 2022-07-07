const { Op } = require('sequelize');
const { User, Sessions } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.sessions = catchAsync(async (req, res, next) => {
    const { _, decodedToken } = req;

    const currentSession = await Sessions.findAll({
        where: {
            loggedOut: false,
            tokenId: decodedToken.tokenId,
            userId: decodedToken.id,
        },
    });

    const allSessions = await Sessions.findAll({
        where: {
            loggedOut: false,
            tokenId: { [Op.not]: decodedToken.tokenId },
            userId: decodedToken.id,
        },
    });

    res.status(200).json({
        success: true,
        data: {
            current: currentSession,
            all: allSessions,
        },
    });
});

// Terminate session
exports.terminateSession = catchAsync(async (req, res, next) => {
    const {
        user,
        params: { id },
    } = req;

    const document = await Sessions.update(
        { loggedOut: true, loggedOut_at: new Date() },
        {
            where: { userId: user.id, id },
        }
    );

    if (!document) {
        return next(new AppError(404, 'No document found with that ID'));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// Terminate all sessions except current session
exports.terminateAllSessions = catchAsync(async (req, res, next) => {
    const { user, decodedToken } = req;

    const document = await Sessions.update(
        { loggedOut: true, loggedOut_at: new Date() },
        {
            where: {
                userId: user.id,
                tokenId: {
                    [Op.not]: decodedToken.tokenId,
                },
            },
        }
    );

    if (!document) {
        return next(new AppError(404, 'No document found with that ID'));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
