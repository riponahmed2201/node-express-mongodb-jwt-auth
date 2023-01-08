const { body } = require('express-validator');

//Check mandatory fields
const UserPasswordUpdateRequest = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage('User is required!'),
    body("email").exists().trim().notEmpty().isString().withMessage('Email is required!'),
    body("password").exists().trim().notEmpty().isString().withMessage('Password is required!')
];

module.exports = UserPasswordUpdateRequest;