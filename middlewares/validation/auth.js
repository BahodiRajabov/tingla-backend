const Joi = require('joi');

const schema = (key) =>
    Joi.object().keys({
        firstName: Joi.string().min(4)[key](),
        phoneNumber: Joi.string().length(12).required(),
        code: Joi.string().required(),
        codeSessionId: Joi.number().required(),
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
