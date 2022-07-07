const { Router } = require('express');
const auth = require('../controllers/auth');
const validateBody = require('../middlewares/validation/auth');
const validateSmsCode = require('../middlewares/validation/smsCode');
const required = require('../middlewares/validation/requried');
const protect = require('../middlewares/auth/protect');

const router = Router();

router.post('/sendCode', validateSmsCode, auth.sendCode);

router.post(
    '/signup',
    required.required,
    validateBody,
    auth.verifyCode,
    auth.signup,
    auth.generateToken
);

router.post(
    '/login',
    required.optional,
    validateBody,
    auth.verifyCode,
    auth.login,
    auth.generateToken
);

router.post('/logout', protect, auth.logout);

module.exports = router;
