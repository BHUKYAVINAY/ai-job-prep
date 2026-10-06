const { PDFParse } = require("pdf-parse");

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service");

const interviewReportModel =
    require("../models/interviewReport.model");


/**
 * @name generateInterviewReportController
 * @description Generates an AI-powered interview report.
 * @access Private
 */
async function generateInterviewReportController(
    req,
    res
) {
    try {
        // Check uploaded resume.
        if (!req.file) {
            return res.status(400).json({
                message:
                    "Resume PDF is required"
            });
        }


        const {
            selfDescription,
            jobDescription
        } = req.body;


        if (!jobDescription) {
            return res.status(400).json({
                message:
                    "Job description is required"
            });
        }


        if (!selfDescription) {
            return res.status(400).json({
                message:
                    "Self description is required"
            });
        }


        // Parse PDF.
        const parser =
            new PDFParse({
                data: req.file.buffer
            });


        const pdfData =
            await parser.getText();


        const resumeContent =
            pdfData.text;


        // Generate report using AI.
        const interviewReportByAi =
            await generateInterviewReport({
                resume: resumeContent,
                selfDescription,
                jobDescription
            });


        // Save report in MongoDB.
        const interviewReport =
            await interviewReportModel.create({
                user: req.user.id,

                resume: resumeContent,

                selfDescription,

                jobDescription,

                ...interviewReportByAi
            });


        return res.status(201).json({
            message:
                "Interview report generated successfully",

            interviewReport
        });

    } catch (error) {
        console.error(
            "Generate interview report error:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Failed to generate interview report"
        });
    }
}


/**
 * @name getInterviewReportByIdController
 * @description Fetches a single interview report belonging to the logged-in user.
 * @access Private
 */
async function getInterviewReportByIdController(
    req,
    res
) {
    try {
        const {
            interviewId
        } = req.params;


        const interviewReport =
            await interviewReportModel.findOne({
                _id: interviewId,
                user: req.user.id
            });


        if (!interviewReport) {
            return res.status(404).json({
                message:
                    "Interview report not found"
            });
        }


        return res.status(200).json({
            message:
                "Interview report fetched successfully",

            interviewReport
        });

    } catch (error) {
        console.error(
            "Get interview report error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch interview report"
        });
    }
}


/**
 * @name getAllInterviewReportsController
 * @description Fetches all interview reports belonging to the logged-in user.
 * @access Private
 */
async function getAllInterviewReportsController(
    req,
    res
) {
    try {
        const interviewReports =
            await interviewReportModel
                .find({
                    user: req.user.id
                })
                .sort({
                    createdAt: -1
                })
                .select(
                    "-resume " +
                    "-selfDescription " +
                    "-jobDescription " +
                    "-__v " +
                    "-technicalQuestions " +
                    "-behavioralQuestions " +
                    "-skillGaps " +
                    "-preparationPlan"
                );


        return res.status(200).json({
            message:
                "Interview reports fetched successfully",

            interviewReports
        });

    } catch (error) {
        console.error(
            "Get all interview reports error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch interview reports"
        });
    }
}


/**
 * @name generateResumePdfController
 * @description Generates a tailored resume PDF for an interview report.
 * @access Private
 */
async function generateResumePdfController(
    req,
    res
) {
    try {
        const {
            interviewReportId
        } = req.params;


        const interviewReport =
            await interviewReportModel.findOne({
                _id: interviewReportId,
                user: req.user.id
            });


        if (!interviewReport) {
            return res.status(404).json({
                message:
                    "Interview report not found"
            });
        }


        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;


        const pdfBuffer =
            await generateResumePdf({
                resume,
                jobDescription,
                selfDescription
            });


        res.set({
            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`
        });


        return res.send(pdfBuffer);

    } catch (error) {
        console.error(
            "Generate resume PDF error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to generate resume PDF"
        });
    }
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};