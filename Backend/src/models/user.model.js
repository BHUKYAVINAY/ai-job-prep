const mongoose = require("mongoose");


/**
 * @name userSchema
 * @description Mongoose schema for storing user account information.
 */
const userSchema = new mongoose.Schema({

    /**
     * @name username
     * @description Unique username of the user.
     * @type String
     * @required true
     * @unique true
     */
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },


    /**
     * @name email
     * @description Unique email address of the user.
     * @type String
     * @required true
     * @unique true
     */
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },


    /**
     * @name password
     * @description Hashed password of the user.
     * @type String
     * @required true
     */
    password: {
        type: String,
        required: [true, "Password is required"]
    },

}, {
    timestamps: true
});


/**
 * @name userModel
 * @description Mongoose model for creating and managing User documents.
 */
const userModel = mongoose.model("User", userSchema);


module.exports = userModel;