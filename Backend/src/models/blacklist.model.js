const mongoose = require("mongoose");


/**
 * @name blacklistTokenSchema
 * @description Schema for storing JWT tokens that have been blacklisted after logout.
 */
const blacklistTokenSchema = new mongoose.Schema({

    /**
     * @description JWT token that has been added to the blacklist.
     */
    token: {
        type: String,
        required: [true, "Token is required to be added in blacklist"]
    }

}, {
    timestamps: true
});


/**
 * @name tokenBlacklistModel
 * @description Mongoose model for managing blacklisted authentication tokens.
 */
const tokenBlacklistModel = mongoose.model(
    "Blacklist",
    blacklistTokenSchema
);


module.exports = tokenBlacklistModel;