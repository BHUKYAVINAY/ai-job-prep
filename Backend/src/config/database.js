const mongoose = require("mongoose");


/**
 * @name connectedToDB
 * @description Connects the application to MongoDB.
 * @access Private
 */
async function connectedToDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is not defined in .env"
            );
        }

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("Connected to database");
    } catch (err) {
        console.error(
            "Database connection failed:",
            err.message
        );

        process.exit(1);
    }
}


module.exports = connectedToDB;