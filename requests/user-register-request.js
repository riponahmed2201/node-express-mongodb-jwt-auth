const { body } = require('express-validator');

//Check mandatory fields
const UserRegisterRequest = [
    body("firstName").exists().trim().notEmpty().isString().withMessage('First name is required!'),
    body("lastName").exists().trim().notEmpty().isString().withMessage('Last name is required!'),
    body("email").exists().trim().notEmpty().isString().withMessage('Email is required!'),
    body("mobile").exists().trim().notEmpty().isString().withMessage('Mobile is required!'),
    body("password").exists().trim().notEmpty().isString().withMessage('Password is required!')
];

module.exports = UserRegisterRequest;