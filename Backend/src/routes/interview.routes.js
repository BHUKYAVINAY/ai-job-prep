const express = require("express");

const {
    authUser
} = require("../middlewares/auth.middleware");

const {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} = require("../controllers/interview.controller");

const upload =
    require("../middlewares/file.middleware");


const interviewRouter =
    express.Router();


/**
 * @route POST /api/interview
 * @description Generates an AI interview report.
 * @access Private
 */
interviewRouter.post(
    "/",
    authUser,
    upload.single("resume"),
    generateInterviewReportController
);


/**
 * @route GET /api/interview/report/:interviewId
 * @description Gets a single interview report.
 * @access Private
 */
interviewRouter.get(
    "/report/:interviewId",
    authUser,
    getInterviewReportByIdController
);


/**
 * @route GET /api/interview
 * @description Gets all interview reports.
 * @access Private
 */
interviewRouter.get(
    "/",
    authUser,
    getAllInterviewReportsController
);


/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generates a tailored resume PDF.
 * @access Private
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authUser,
    generateResumePdfController
);


module.exports =
    interviewRouter;