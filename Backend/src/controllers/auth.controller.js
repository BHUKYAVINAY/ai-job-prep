const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description Registers a new user, hashes the password, creates a JWT token, and sets it in a cookie.
 * @access public
 */

async function registerUserController(req, res) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this Email address or Username"
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashPassword
    });

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token);

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


/**
 * @name loginUserController
 * @description Authenticates a user using email and password, generates a JWT token, and sets it in a cookie.
 * @access public
 */

async function loginUserController(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token);

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


/**
 * @name logoutUserController
 * @description Logs out the user by blacklisting the current JWT token and clearing the authentication cookie.
 * @access public
 */

async function logoutUserController(req, res) {

    const token = req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({
            token
        });
    }

    res.clearCookie("token");

    return res.status(200).json({
        message: "User logged out successfully"
    });
}


/**
 * @name getMeController
 * @description Fetches the details of the currently authenticated user.
 * @access private
 */

async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};