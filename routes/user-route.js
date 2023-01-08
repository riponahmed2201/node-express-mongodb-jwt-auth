const express = require("express");

//Middleware
const ValidateRequestHandler = require("../middlewares/validation-request-handler");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

//Request
const UserRegisterRequest = require("../requests/user-register-request");
const UserLoginRequest = require("../requests/user-login-request");

//Controller
const { registerUser, loginUser, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout } = require("../controllers/user-controller");

const userRouter = express.Router();
 
userRouter.get('/', ValidateRequestHandler, getAllUser);
userRouter.put('/', ValidateRequestHandler, authMiddleware, updateUser);

userRouter.post('/register', UserRegisterRequest, ValidateRequestHandler, registerUser);
userRouter.post('/login', UserLoginRequest, loginUser);

//handle refresh token
userRouter.get('/refresh-token', handleRefreshToken);

//Logout
userRouter.get('/logout', logout);

userRouter.put('/blocked/:id', ValidateRequestHandler, authMiddleware, isAdmin, blockUser);
userRouter.put('/unblocked/:id', ValidateRequestHandler, authMiddleware, isAdmin, unBlockUser);

userRouter.get('/:id', ValidateRequestHandler, authMiddleware, isAdmin, getSingleUser);
userRouter.delete('/:id', ValidateRequestHandler, deleteUser);

module.exports = userRouter;