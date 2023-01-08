const { body } = require('express-validator');

//Check mandatory fields
const UserUpdateRequest = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage('User is required!'),
    body("firstName").exists().trim().notEmpty().isString().withMessage('First name is required!'),
    body("lastName").exists().trim().notEmpty().isString().withMessage('Last name is required!'),
    body("email").exists().trim().notEmpty().isString().withMessage('Email is required!'),
    body("mobile").exists().trim().notEmpty().isString().withMessage('Mobile is required!'),
];

module.exports = UserUpdateRequest;