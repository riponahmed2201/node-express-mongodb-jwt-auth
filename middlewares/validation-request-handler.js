const { validationResult } = require('express-validator');

const ValidateRequestHandler = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            errors: errors.array()
        });
    }

    return next();
};

module.exports = ValidateRequestHandler;