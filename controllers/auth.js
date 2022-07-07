require('dotenv').config();
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const { v4: uuidv4 } = require('uuid');
const { User, Sessions, CodeSessions } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const config = require('../config/config');
const sendMessage = require('../services/sendSms');

exports.generateToken = catchAsync(async (req, res, next) => {
    const { user } = req;

    const tokenId = uuidv4();
    const token = jwt.sign({ id: user.id, tokenId }, config.JWT_KEY);

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const device = req.headers['user-agent'];

    await Sessions.create({
        userId: user.id,
        tokenId,
        device,
        ip,
    });

    res.status(201).json({
        success: true,
        token,
        data: { user },
    });
});

exports.sendCode = catchAsync(async (req, res, next) => {
    const { phoneNumber, appSignature } = req.body;
    const code = `${Date.now() * Math.random() * 1000000}`.substring(0, 6);
    const messageSent = await sendMessage(
        phoneNumber,
        `Test message: ${code}

        ${appSignature}`
    );
    console.log(messageSent);
    if (!messageSent.success) return next(new AppError(400, `Error: from sms provider`));

    const codeSession = await CodeSessions.create({
        code,
        phoneNumber,
    });

    res.status(200).json({
        success: true,
        data: {
            codeSessionId: codeSession.id,
        },
    });
});

exports.verifyCode = catchAsync(async (req, res, next) => {
    const { code, codeSessionId, phoneNumber } = req.body;

    const codeSession = await CodeSessions.findByPk(codeSessionId);

    if (Date.now() - codeSession.dataValues.createdAt >= 60 * 1000) {
        return next(new AppError(400, 'CODE_SESSION_EXPIRED'));
    }

    if (codeSession.dataValues.attempts > config.CODE_ATTEMPTS) {
        return next(new AppError(400, 'CODE_ATTEMPTS_LIMIT'));
    }

    if (
        codeSession.dataValues.phoneNumber !== phoneNumber ||
        codeSession.dataValues.code != code
    ) {
        CodeSessions.update(
            { attempts: Sequelize.literal('attempts + 1') },
            { where: { id: codeSessionId } }
        );
        return next(new AppError(400, 'INVALID_VERIFICATION_CODE'));
    }

    next();
});

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    req.user = user;

    next();
});

exports.login = catchAsync(async (req, res, next) => {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
        return next(new AppError(401, 'Incorrect phoneNumber or password'));
    }

    req.user = user;

    next();
});

exports.logout = catchAsync(async (req, res) => {
    const { user, decodedToken } = req;

    await Sessions.update(
        { loggedOut: true, loggedOutAt: new Date() },
        {
            where: { userId: user.id, tokenId: decodedToken.tokenId },
        }
    );

    res.status(200).json({ success: true });
});

/*
app => {
    code generate
    create session for verification code {
        id
        code
        createdAt
        eattempts
    }

    code_session_id => app
}

app => {
    code_session_id
    code
    ...
}

*/
