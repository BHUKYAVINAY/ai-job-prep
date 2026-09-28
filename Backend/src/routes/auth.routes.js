const { Router } = require("express");

const {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
} = require("../controllers/auth.controller");

const { authUser } = require("../middlewares/auth.middleware");


/**
 * @name authRouter
 * @description Router for handling user authentication and authorization routes.
 */
const authRouter = Router();


/**
 * @route POST /register
 * @description Registers a new user.
 * @access Public
 */
authRouter.post("/register", registerUserController);


/**
 * @route POST /login
 * @description Authenticates a user and generates an authentication token.
 * @access Public
 */
authRouter.post("/login", loginUserController);


/**
 * @route GET /logout
 * @description Logs out the current user and clears the authentication token.
 * @access Public
 */
authRouter.get("/logout", logoutUserController);


/**
 * @route GET /get-me
 * @description Fetches the details of the currently authenticated user.
 * @access Private
 */
authRouter.get("/get-me", authUser, getMeController);


module.exports = authRouter;