require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectedToDB = require("./src/config/database");
connectedToDB();

const app = require("./src/app");

app.listen(3000, () => {
    console.log("Server started at port 3000");
});