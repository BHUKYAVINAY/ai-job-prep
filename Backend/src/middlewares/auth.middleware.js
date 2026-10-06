const jwt = require("jsonwebtoken");

const tokenBlacklistModel =
    require("../models/blacklist.model");


/**
 * @name authUser
 * @description Authenticates the user using JWT stored in cookies.
 * @access Private
 */
async function authUser(
    req,
    res,
    next
) {
    try {
        const token =
            req.cookies?.token;


        // Check whether token exists.
        if (!token) {
            return res.status(401).json({
                message:
                    "Token not provided"
            });
        }


        // Check whether token is blacklisted.
        const isTokenBlacklisted =
            await tokenBlacklistModel.findOne({
                token
            });


        if (isTokenBlacklisted) {
            return res.status(401).json({
                message:
                    "Token is invalid"
            });
        }


        // Verify JWT.
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store decoded user information.
        req.user = decoded;


        next();

    } catch (error) {
        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message:
                "Invalid or expired token"
        });
    }
}


module.exports = {
    authUser
};