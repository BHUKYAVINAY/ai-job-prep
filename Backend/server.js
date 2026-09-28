require("dotenv").config();

const dns = require("dns");

const connectedToDB = require("./src/config/database");
const app = require("./src/app");


/**
 * @description Configures DNS servers used by the Node.js application.
 */
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


/**
 * @description Establishes a connection with the MongoDB database.
 */
connectedToDB();


/**
 * @description Starts the Express server on port 3000.
 */
app.listen(3000, () => {

    console.log("Server started at port 3000");

});