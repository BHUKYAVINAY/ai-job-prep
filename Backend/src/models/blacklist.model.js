const mongoose = require("mongoose");


/**
 * @name blacklistTokenSchema
 * @description Schema for storing blacklisted JWT tokens.
 */
const blacklistTokenSchema =
    new mongoose.Schema(
        {
            token: {
                type: String,
                required: [
                    true,
                    "Token is required"
                ],
                unique: true
            }
        },
        {
            timestamps: true
        }
    );


/**
 * @name tokenBlacklistModel
 * @description Mongoose model for blacklisted tokens.
 */
const tokenBlacklistModel =
    mongoose.model(
        "Blacklist",
        blacklistTokenSchema
    );


module.exports =
    tokenBlacklistModel;