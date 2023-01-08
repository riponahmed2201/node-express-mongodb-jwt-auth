const { body } = require('express-validator');

//Check mandatory fields
const UserLoginRequest = [
    body("email").exists().trim().notEmpty().isString().withMessage('Email is required!'),
    body("password").exists().trim().notEmpty().isString().withMessage('Password is required!')
];

module.exports = UserLoginRequest;