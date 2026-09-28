const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");


/**
 * @name authUser
 * @description Middleware that authenticates the user using a JWT stored in the authentication cookie.
 * Checks whether the token exists, verifies that it is not blacklisted, and validates the JWT.
 * @access Private
 */
async function authUser(req, res, next) {

    try {

        /**
         * Get authentication token from cookies.
         */
        const token = req.cookies.token;


        // 1. Check token exists
        if (!token) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }


        // 2. Check whether token is blacklisted
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token: token
        });


        // If token IS found in blacklist → reject
        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Token is invalid"
            });
        }


        // 3. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // 4. Store decoded user information
        req.user = decoded;


        // 5. Continue to controller
        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }
}


module.exports = {
    authUser
};