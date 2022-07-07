const config = require('../../config/config');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const protectedMiddleware = catchAsync(async (req, res, next) => {
    // 1) Get token and check of it's there
    let token;

    const {
        headers: { authorization },
    } = req;

    const device = req.headers['user-agent'];

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                401,
                'You are not logged in! Please log in to get access.'
            )
        );
    }

    const decoded = await jwt.verify(token, config.JWT_KEY);

    const currentUser = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
    });

    if (!currentUser) {
        return next(
            new AppError(
                401,
                'The user belonging to this token does no longer exist.'
            )
        );
    }

    const session = await Sessions.findOne({
        where: { tokenId: decoded.tokenId },
    });

    if (session.dataValues.loggedOut) {
        return next(
            new AppError(
                401,
                'You are not logged in! Please log in to get access.'
            )
        );
    } else if (device !== session.dataValues.device) {
        return next(
            new AppError(
                401,
                'You are not logged in! Please log in to get access. (Device is not correct)'
            )
        );
    }
    req.user = currentUser;
    req.decodedToken = decoded;
    next();
});

module.exports = protectedMiddleware;
