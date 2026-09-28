const mongoose = require("mongoose");


/**
 * @name connectedToDB
 * @description Connects the application to MongoDB using the MongoDB connection URI.
 * @access Private
 */
async function connectedToDB() {

    try {

        /**
         * Establish connection with MongoDB.
         */
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to database");

    } catch (err) {

        console.log(err);

    }
}


module.exports = connectedToDB;