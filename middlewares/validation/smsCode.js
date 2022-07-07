const Joi = require('joi');

const schema = (key) =>
    Joi.object().keys({
        phoneNumber: Joi.string().length(12).required(),
        appSignature: Joi.string().required(),
    });

const validateSign = async (req, res, next) => {
    try {
        const validatedBody = await schema(req.required).validateAsync(
            req.body
        );

        req.body = validatedBody;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateSign;
