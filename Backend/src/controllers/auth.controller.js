const userModel = require("../models/user.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tokenBlacklistModel =
    require("../models/blacklist.model");


/**
 * @name createToken
 * @description Creates a JWT token for the authenticated user.
 * @param {Object} user - User document.
 * @returns {string} JWT token.
 */
function createToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
}


/**
 * @name registerUserController
 * @description Registers a new user.
 * @access Public
 */
async function registerUserController(
    req,
    res
) {
    try {
        const {
            username,
            email,
            password
        } = req.body;


        if (
            !username ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Please provide username, email and password"
            });
        }


        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message:
                    "JWT_SECRET is not configured"
            });
        }


        const isUserAlreadyExists =
            await userModel.findOne({
                $or: [
                    { username },
                    { email }
                ]
            });


        if (isUserAlreadyExists) {
            return res.status(400).json({
                message:
                    "Account already exists with this email address or username"
            });
        }


        const hashPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user =
            await userModel.create({
                username,
                email,
                password: hashPassword
            });


        const token =
            createToken(user);


        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:
                    24 * 60 * 60 * 1000
            }
        );


        return res.status(201).json({
            message:
                "User registered successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            message:
                "Registration failed"
        });
    }
}


/**
 * @name loginUserController
 * @description Authenticates a user and creates a JWT token.
 * @access Public
 */
async function loginUserController(
    req,
    res
) {
    try {
        const {
            email,
            password
        } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Please provide email and password"
            });
        }


        const user =
            await userModel.findOne({
                email
            });


        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid email or password"
            });
        }


        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordValid) {
            return res.status(400).json({
                message:
                    "Invalid email or password"
            });
        }


        const token =
            createToken(user);


        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:
                    24 * 60 * 60 * 1000
            }
        );


        return res.status(200).json({
            message:
                "User logged in successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message:
                "Login failed"
        });
    }
}


/**
 * @name logoutUserController
 * @description Logs out the current user by blacklisting the JWT token.
 * @access Public
 */
async function logoutUserController(
    req,
    res
) {
    try {
        const token =
            req.cookies?.token;


        if (token) {
            await tokenBlacklistModel.create({
                token
            });
        }


        res.clearCookie(
            "token",
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            }
        );


        return res.status(200).json({
            message:
                "User logged out successfully"
        });

    } catch (error) {
        console.error(
            "Logout error:",
            error
        );

        return res.status(500).json({
            message:
                "Logout failed"
        });
    }
}


/**
 * @name getMeController
 * @description Fetches details of the currently authenticated user.
 * @access Private
 */
async function getMeController(
    req,
    res
) {
    try {
        const user =
            await userModel.findById(
                req.user.id
            );


        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }


        return res.status(200).json({
            message:
                "User details fetched successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            "Get user error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch user details"
        });
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};