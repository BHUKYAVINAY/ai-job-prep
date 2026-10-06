const mongoose = require("mongoose");


/**
 * @name userSchema
 * @description Mongoose schema for storing user account information.
 */
const userSchema =
    new mongoose.Schema(
        {
            username: {
                type: String,
                required: [
                    true,
                    "Username is required"
                ],
                unique: true,
                trim: true
            },


            email: {
                type: String,
                required: [
                    true,
                    "Email is required"
                ],
                unique: true,
                trim: true,
                lowercase: true
            },


            password: {
                type: String,
                required: [
                    true,
                    "Password is required"
                ]
            }
        },
        {
            timestamps: true
        }
    );


/**
 * @name userModel
 * @description Mongoose model for users.
 */
const userModel =
    mongoose.model(
        "User",
        userSchema
    );


module.exports = userModel;