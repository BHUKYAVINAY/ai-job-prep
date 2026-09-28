const express = require("express");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");


/**
 * @name app
 * @description Express application instance for the backend API.
 */
const app = express();


/**
 * @description Parses incoming JSON request bodies.
 */
app.use(express.json());


/**
 * @description Parses cookies attached to incoming requests.
 */
app.use(cookieParser());


/**
 * @description Enables Cross-Origin Resource Sharing (CORS)
 * for the frontend application.
 */
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


/**
 * @route /api/auth
 * @description Authentication-related API routes.
 */
app.use("/api/auth", authRouter);


module.exports = app;