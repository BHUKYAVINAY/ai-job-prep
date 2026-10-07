const {
    Router
} = require("express");

const {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
} = require("../controllers/auth.controller");

const {
    authUser
} = require("../middlewares/auth.middleware");


/**
 * @name authRouter
 * @description Router for authentication-related routes.
 */
const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @description Registers a new user.
 * @access Public
 */
authRouter.post(
    "/register",
    registerUserController
);


/**
 * @route POST /api/auth/login
 * @description Authenticates a user.
 * @access Public
 */
authRouter.post(
    "/login",
    loginUserController
);


/**
 * @route GET /api/auth/logout
 * @description Logs out the current user.
 * @access Public
 */
authRouter.get(
    "/logout",
    logoutUserController
);


/**
 * @route GET /api/auth/get-me
 * @description Gets the currently authenticated user.
 * @access Private
 */
authRouter.get(
    "/get-me",
    authUser,
    getMeController
);


module.exports = authRouter;