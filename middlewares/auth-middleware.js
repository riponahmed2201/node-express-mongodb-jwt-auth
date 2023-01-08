
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/user-model");

const authMiddleware = asyncHandler(async (req, res, next) => {

    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers?.authorization.split(" ")[1];

        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                req.user = user;

                return next();
            }

        } catch (error) {
            return next(error);
        }
    } else {
        let customError = new Error("Authorization token not found!");
        customError.statusCode = 400;
        return next(customError);
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.user;

        const adminUser = await User.findOne({ email });

        if (adminUser.role !== "admin") throw new Error("Access denied");
        else next();

    } catch (error) {
        return next(error);
    }
});

module.exports = { authMiddleware, isAdmin };