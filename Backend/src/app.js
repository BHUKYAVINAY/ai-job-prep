const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");


/**
 * @name app
 * @description Express application instance.
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
 * @description Enables CORS for the frontend application.
 */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


/**
 * @route /api/auth
 * @description Authentication-related API routes.
 */
app.use("/api/auth", authRouter);


/**
 * @route /api/interview
 * @description Interview report-related API routes.
 */
app.use("/api/interview", interviewRouter);


/**
 * @description Handles unknown routes.
 */
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


/**
 * @description Global error handler.
 */
app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(err.status || 500).json({
        message:
            err.message ||
            "Internal server error"
    });
});


module.exports = app;