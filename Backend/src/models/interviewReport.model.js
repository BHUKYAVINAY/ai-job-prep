const mongoose = require("mongoose");


/**
 * @typedef {Object} InterviewQuestion
 * @property {string} question
 * @property {string} intention
 * @property {string} answer
 */
const questionSchema =
    new mongoose.Schema(
        {
            question: {
                type: String,
                required: [
                    true,
                    "Question is required"
                ]
            },

            intention: {
                type: String,
                required: [
                    true,
                    "Intention is required"
                ]
            },

            answer: {
                type: String,
                required: [
                    true,
                    "Answer is required"
                ]
            }
        },
        {
            _id: false
        }
    );


/**
 * @typedef {Object} SkillGap
 * @property {string} skill
 * @property {"low"|"medium"|"high"} severity
 */
const skillGapSchema =
    new mongoose.Schema(
        {
            skill: {
                type: String,
                required: [
                    true,
                    "Skill is required"
                ]
            },

            severity: {
                type: String,
                required: [
                    true,
                    "Severity is required"
                ],
                enum: [
                    "low",
                    "medium",
                    "high"
                ]
            }
        },
        {
            _id: false
        }
    );


/**
 * @typedef {Object} PreparationPlan
 * @property {number} day
 * @property {string} focus
 * @property {string[]} tasks
 */
const preparationPlanSchema =
    new mongoose.Schema(
        {
            day: {
                type: Number,
                required: [
                    true,
                    "Day is required"
                ]
            },

            focus: {
                type: String,
                required: [
                    true,
                    "Focus is required"
                ]
            },

            tasks: {
                type: [String],
                required: [
                    true,
                    "Tasks are required"
                ]
            }
        },
        {
            _id: false
        }
    );


/**
 * @typedef {Object} InterviewReport
 * @property {string} jobDescription
 * @property {string} resume
 * @property {string} selfDescription
 * @property {number} matchScore
 * @property {string} title
 * @property {InterviewQuestion[]} technicalQuestions
 * @property {InterviewQuestion[]} behavioralQuestions
 * @property {SkillGap[]} skillGaps
 * @property {PreparationPlan[]} preparationPlan
 * @property {mongoose.Types.ObjectId} user
 */
const interviewReportSchema =
    new mongoose.Schema(
        {
            jobDescription: {
                type: String,
                required: [
                    true,
                    "Job description is required"
                ]
            },


            resume: {
                type: String
            },


            selfDescription: {
                type: String
            },


            matchScore: {
                type: Number,
                min: 0,
                max: 100
            },


            title: {
                type: String,
                required: [
                    true,
                    "Job title is required"
                ]
            },


            technicalQuestions: {
                type: [
                    questionSchema
                ],
                default: []
            },


            behavioralQuestions: {
                type: [
                    questionSchema
                ],
                default: []
            },


            skillGaps: {
                type: [
                    skillGapSchema
                ],
                default: []
            },


            preparationPlan: {
                type: [
                    preparationPlanSchema
                ],
                default: []
            },


            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
        {
            timestamps: true
        }
    );


/**
 * @name interviewReportModel
 * @description Mongoose model for interview reports.
 */
const interviewReportModel =
    mongoose.model(
        "InterviewReport",
        interviewReportSchema
    );


module.exports =
    interviewReportModel;