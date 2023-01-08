const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

const { successResponseHandler } = require("../helpers/success-response-handler");

const User = require('../models/user-model');
const validateMongoDbId = require("../utils/validationMongodbId");

const registerUser = asyncHandler(async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email });

        if (!findUser) {

            const addNewUser = await User.create(req.body);

            return await successResponseHandler(res, 200, "User Created successfully!", "details", addNewUser);

        } else throw new Error("User already exists");

    } catch (error) {
        throw error;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check if user exists or not
        const findUser = await User.findOne({ email });

        if (findUser && await findUser.isPasswordMatched(password)) {

            const refreshToken = await generateRefreshToken(findUser?._id);
            const updateUser = await User.findByIdAndUpdate(findUser?._id, { refreshToken: refreshToken, }, { new: true });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            });

            const userInfo = {
                _id: findUser?._id,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                email: findUser?.email,
                mobile: findUser?.mobile,
                role: findUser?.role,
                token: await generateToken(findUser?._id)
            };

            await successResponseHandler(res, 200, "User login successfully", "userDetails", userInfo);

        } else throw new Error("Invalid Credentials");
    } catch (error) {
        throw error;
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    try {
        const cookie = req.cookies;

        if (!cookie?.refreshToken) {
            let customError = new Error("No refresh token in cookies");
            customError.statusCode = 404;
            throw customError;
        }

        const refreshToken = cookie.refreshToken;

        const userInfo = await User.findOne({ refreshToken });

        if (!userInfo) {
            let customError = new Error("No refresh token in present in db or not matched");
            customError.statusCode = 404;
            throw customError;
        }

        let accessToken;

        // pore custom function korte hobe verifyToken() ai name a 
        await jwt.verify(refreshToken, process.env.JWT_SECRET, async (error, decoded) => {
            if (error || userInfo.id !== decoded.id) {
                let customError = new Error("There is something wrong with refresh token!");
                customError.statusCode = 404;
                throw customError;
            }

            accessToken = await generateToken(userInfo?._id);
        });

        return await successResponseHandler(res, 200, "User access token!", "accessToken", accessToken);

    } catch (error) {
        throw error;
    }
});


const logout = asyncHandler(async (req, res) => {
    try {
        const cookie = req.cookies;

        if (!cookie?.refreshToken) {
            let customError = new Error("No refresh token in cookies");
            customError.statusCode = 404;
            throw customError;
        }

        const refreshToken = cookie.refreshToken;

        const userInfo = await User.findOne({ refreshToken });

        if (!userInfo) {

            res.clearCookie("refreshToken", { httpOnly: true, secure: true });

            return await successResponseHandler(res, 204, "Access Forbidden", null, null);
        }

        await User.findOneAndUpdate(refreshToken, { refreshToken: "" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });

        return await successResponseHandler(res, 204, "Logout successfully!", null, null);

    } catch (error) {
        throw error;
    }
});

//Update to the user 
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email, mobile } = req.body;

        await validateMongoDbId(req.body.id);

        const userInfo = await User.findById(req.body.id);

        if (!userInfo) {
            let customError = new Error("User not found");
            customError.statusCode = 404;
            throw customError;
        }

        const user = new User(userInfo);

        let isChanged = false;

        if (firstName && firstName !== userInfo.firstName) {
            isChanged = true;
            user.firstName = firstName;
        }

        if (lastName && lastName !== userInfo.lastName) {
            isChanged = true;
            user.lastName = lastName;
        }

        if (email && email !== userInfo.email) {
            isChanged = true;
            user.email = email;
        }

        if (mobile && mobile !== userInfo.mobile) {
            isChanged = true;
            user.mobile = mobile;
        }

        if (isChanged) {
            const updateUserInfo = await user.save();
            return await successResponseHandler(res, 200, "User updated successfully!", "details", updateUserInfo);
        }

        return await successResponseHandler(res, 200, "User updated successfully!", "details", userInfo);

    } catch (error) {
        throw new Error(error);
    }
});

//Get all user
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        return await successResponseHandler(res, 200, "User list fetch successfully!", "details", getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

//Get a single user
const getSingleUser = asyncHandler(async (req, res) => {
    try {
        await validateMongoDbId(req.params.id);

        const getUser = await User.findById(req.params.id);

        return await successResponseHandler(res, 200, "User info fetch successfully!", "details", getUser);

    } catch (error) {
        throw new Error(error);
    }
});

//Delete user
const deleteUser = asyncHandler(async (req, res) => {
    try {
        await validateMongoDbId(req.params.id);

        const getUser = await User.findByIdAndDelete(req.params.id);

        return await successResponseHandler(res, 200, "User deleted successfully!", "details", getUser);

    } catch (error) {
        throw new Error(error);
    }
});

//Block user
const blockUser = asyncHandler(async (req, res) => {
    try {
        await validateMongoDbId(req.params.id);

        const block = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });

        return await successResponseHandler(res, 200, "User blocked successfully!", "details", block);

    } catch (error) {
        throw new Error(error);
    }
});

//Un block user
const unBlockUser = asyncHandler(async (req, res) => {
    try {
        await validateMongoDbId(req.params.id);

        const unBlock = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });

        return await successResponseHandler(res, 200, "User unblocked successfully!", "details", unBlock);

    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { registerUser, loginUser, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout };