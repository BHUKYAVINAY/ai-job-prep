const {
    GoogleGenAI
} = require("@google/genai");

const {
    z
} = require("zod");

const {
    zodToJsonSchema
} = require("zod-to-json-schema");

const puppeteer =
    require("puppeteer");


const ai =
    new GoogleGenAI({
        apiKey:
            process.env.GOOGLE_GENAI_API_KEY
    });


/**
 * @name interviewReportSchema
 * @description Zod schema for the AI-generated interview report.
 */
const interviewReportSchema =
    z.object({
        matchScore:
            z.number()
                .min(0)
                .max(100)
                .describe(
                    "Score between 0 and 100 indicating how well the candidate matches the job"
                ),


        technicalQuestions:
            z.array(
                z.object({
                    question:
                        z.string(),

                    intention:
                        z.string(),

                    answer:
                        z.string()
                })
            ),


        behavioralQuestions:
            z.array(
                z.object({
                    question:
                        z.string(),

                    intention:
                        z.string(),

                    answer:
                        z.string()
                })
            ),


        skillGaps:
            z.array(
                z.object({
                    skill:
                        z.string(),

                    severity:
                        z.enum([
                            "low",
                            "medium",
                            "high"
                        ])
                })
            ),


        preparationPlan:
            z.array(
                z.object({
                    day:
                        z.number(),

                    focus:
                        z.string(),

                    tasks:
                        z.array(
                            z.string()
                        )
                })
            ),


        title:
            z.string()
    });


/**
 * @name generateInterviewReport
 * @description Generates an interview report using Gemini AI.
 */
async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw new Error(
            "GOOGLE_GENAI_API_KEY is not configured"
        );
    }


    const prompt = `
Generate an interview preparation report for the candidate.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

Analyze the candidate against the job description.

Generate:
1. Match score from 0 to 100
2. Technical interview questions
3. Behavioral interview questions
4. Skill gaps
5. Day-wise preparation plan
6. Job title

The questions should be relevant to the candidate's resume and the job description.

Answers should explain what the candidate should discuss during the interview.
`;


    const response =
        await ai.models.generateContent({
            model:
                // "gemini-3-flash-preview",
                "gemini-3.8-flash",

            contents:
                prompt,

            config: {
                responseMimeType:
                    "application/json",

                responseSchema:
                    zodToJsonSchema(
                        interviewReportSchema
                    )
            }
        });


    if (!response.text) {
        throw new Error(
            "AI returned an empty response"
        );
    }


    const parsedResponse =
        JSON.parse(response.text);


    return interviewReportSchema.parse(
        parsedResponse
    );
}


/**
 * @name generatePdfFromHtml
 * @description Converts HTML content into a PDF using Puppeteer.
 */
async function generatePdfFromHtml(
    htmlContent
) {
    const browser =
        await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        });


    try {
        const page =
            await browser.newPage();


        await page.setContent(
            htmlContent,
            {
                waitUntil:
                    "networkidle0"
            }
        );


        const pdfBuffer =
            await page.pdf({
                format: "A4",

                printBackground: true,

                margin: {
                    top: "20mm",
                    bottom: "20mm",
                    left: "15mm",
                    right: "15mm"
                }
            });


        return pdfBuffer;

    } finally {
        await browser.close();
    }
}


/**
 * @name generateResumePdf
 * @description Generates an ATS-friendly resume and converts it into PDF.
 */
async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema =
        z.object({
            html:
                z.string()
        });


    const prompt = `
Create a professional, ATS-friendly resume using the following information.

Original Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Requirements:

- Tailor the resume to the target job.
- Highlight relevant skills and experience.
- Do not invent qualifications, jobs, education, or experience.
- Keep the resume concise.
- Target 1-2 pages.
- Use simple professional HTML.
- Make the HTML suitable for conversion to PDF.
- Make it ATS friendly.
- Use clear sections such as:
  Summary,
  Skills,
  Education,
  Experience,
  Projects,
  Certifications if applicable.
- Do not mention that AI generated the resume.
- Return only the HTML inside the "html" field.
`;


    const response =
        await ai.models.generateContent({
            model:
                "gemini-3-flash-preview",

            contents:
                prompt,

            config: {
                responseMimeType:
                    "application/json",

                responseSchema:
                    zodToJsonSchema(
                        resumePdfSchema
                    )
            }
        });


    if (!response.text) {
        throw new Error(
            "AI returned an empty resume"
        );
    }


    const jsonContent =
        JSON.parse(response.text);


    const validatedContent =
        resumePdfSchema.parse(
            jsonContent
        );


    const pdfBuffer =
        await generatePdfFromHtml(
            validatedContent.html
        );


    return pdfBuffer;
}


module.exports = {
    generateInterviewReport,
    generateResumePdf
};






// // 
// const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");


// // --------------------------------------------------
// // Gemini AI Configuration
// // --------------------------------------------------

// if (!process.env.GOOGLE_GENAI_API_KEY) {
//     throw new Error(
//         "GOOGLE_GENAI_API_KEY is not configured"
//     );
// }

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// });


// // Use one model for all Gemini requests
// const GEMINI_MODEL =
//     process.env.GEMINI_MODEL || "gemini-3.8-flash";


// // --------------------------------------------------
// // Interview Report Schema
// // --------------------------------------------------

// /**
//  * @name interviewReportSchema
//  * @description Zod schema for the AI-generated interview report.
//  */
// const interviewReportSchema = z.object({
//     matchScore: z.number()
//         .min(0)
//         .max(100)
//         .describe(
//             "Score between 0 and 100 indicating how well the candidate matches the job"
//         ),

//     technicalQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string()
//         })
//     ),

//     behavioralQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string()
//         })
//     ),

//     skillGaps: z.array(
//         z.object({
//             skill: z.string(),
//             severity: z.enum([
//                 "low",
//                 "medium",
//                 "high"
//             ])
//         })
//     ),

//     preparationPlan: z.array(
//         z.object({
//             day: z.number(),
//             focus: z.string(),
//             tasks: z.array(
//                 z.string()
//             )
//         })
//     ),

//     title: z.string()
// });


// // --------------------------------------------------
// // Gemini Request With Retry
// // --------------------------------------------------

// /**
//  * @name generateWithRetry
//  * @description Generates Gemini content and retries temporary
//  *              service-unavailable errors.
//  */
// async function generateWithRetry({
//     contents,
//     config,
//     maxRetries = 3
// }) {
//     let lastError;

//     for (let attempt = 0; attempt <= maxRetries; attempt++) {
//         try {
//             console.log(
//                 `Gemini request attempt ${attempt + 1}/${maxRetries + 1}`
//             );

//             const response =
//                 await ai.models.generateContent({
//                     model: GEMINI_MODEL,
//                     contents,
//                     config
//                 });

//             return response;

//         } catch (error) {
//             lastError = error;

//             const errorCode =
//                 error?.status ||
//                 error?.code;

//             const errorMessage =
//                 error?.message || "";

//             const isTemporaryError =
//                 errorCode === "UNAVAILABLE" ||
//                 errorCode === 503 ||
//                 errorMessage.includes("503") ||
//                 errorMessage.includes("high demand") ||
//                 errorMessage.includes("UNAVAILABLE");

//             if (!isTemporaryError) {
//                 throw error;
//             }

//             if (attempt === maxRetries) {
//                 break;
//             }

//             // 2s → 4s → 8s
//             const delay =
//                 2000 * Math.pow(2, attempt);

//             console.log(
//                 `Gemini temporarily unavailable. Retrying in ${delay / 1000}s...`
//             );

//             await new Promise(
//                 resolve => setTimeout(resolve, delay)
//             );
//         }
//     }

//     throw new Error(
//         `Gemini service is currently unavailable after ${maxRetries + 1} attempts. Please try again later. Original error: ${lastError?.message || "Unknown error"}`
//     );
// }


// // --------------------------------------------------
// // Generate Interview Report
// // --------------------------------------------------

// /**
//  * @name generateInterviewReport
//  * @description Generates an interview preparation report using Gemini AI.
//  */
// /**
//  * @name generateInterviewReport
//  * @description Generates an interview preparation report using Gemini AI.
//  */
// async function generateInterviewReport({
//     resume,
//     selfDescription,
//     jobDescription
// }) {
//     const prompt = `
// You are an expert technical interviewer and career coach.

// Analyze the candidate's resume against the target job description.

// Candidate Resume:
// ${resume}

// Candidate Self Description:
// ${selfDescription}

// Target Job Description:
// ${jobDescription}

// Generate a complete interview preparation report.

// The response MUST contain exactly these fields:

// {
//     "matchScore": 0,
//     "technicalQuestions": [],
//     "behavioralQuestions": [],
//     "skillGaps": [],
//     "preparationPlan": [],
//     "title": ""
// }

// Rules:

// 1. matchScore
// - Must be a NUMBER between 0 and 100.
// - Example: 82
// - Do NOT return "82%" or "82".

// 2. technicalQuestions
// - Must be an ARRAY.
// - Each item must contain:
//   - question
//   - intention
//   - answer

// 3. behavioralQuestions
// - Must be an ARRAY.
// - Each item must contain:
//   - question
//   - intention
//   - answer

// 4. skillGaps
// - Must be an ARRAY.
// - Each item must contain:
//   - skill
//   - severity
// - severity MUST be exactly one of:
//   - "low"
//   - "medium"
//   - "high"

// 5. preparationPlan
// - Must be an ARRAY.
// - Each item must contain:
//   - day
//   - focus
//   - tasks
// - day must be a NUMBER.
// - tasks must be an ARRAY of strings.

// 6. title
// - Must be a STRING containing the target job title.

// Generate realistic technical and behavioral questions based on
// the candidate's actual resume and the target job description.

// Do not invent qualifications, experience, education, or projects.

// Return ONLY valid JSON matching the requested structure.
// `;

//     const response = await generateWithRetry({
//         contents: prompt,

//         config: {
//             responseMimeType: "application/json",

//             responseSchema: zodToJsonSchema(
//                 interviewReportSchema
//             )
//         }
//     });

//     console.log(
//         "Gemini raw response:",
//         response.text
//     );

//     if (!response.text) {
//         throw new Error(
//             "AI returned an empty interview report"
//         );
//     }

//     let parsedResponse;

//     try {
//         parsedResponse = JSON.parse(response.text);
//     } catch (error) {
//         console.error(
//             "Gemini returned invalid JSON:",
//             response.text
//         );

//         throw new Error(
//             "AI returned invalid JSON for interview report"
//         );
//     }

//     console.log(
//         "Parsed Gemini response:",
//         parsedResponse
//     );

//     return interviewReportSchema.parse(
//         parsedResponse
//     );
// }

// // --------------------------------------------------
// // Generate PDF From HTML
// // --------------------------------------------------

// /**
//  * @name generatePdfFromHtml
//  * @description Converts HTML content into a PDF using Puppeteer.
//  */
// async function generatePdfFromHtml(
//     htmlContent
// ) {

//     const browser =
//         await puppeteer.launch({
//             headless: true,

//             args: [
//                 "--no-sandbox",
//                 "--disable-setuid-sandbox"
//             ]
//         });


//     try {

//         const page =
//             await browser.newPage();


//         await page.setContent(
//             htmlContent,
//             {
//                 waitUntil:
//                     "networkidle0"
//             }
//         );


//         const pdfBuffer =
//             await page.pdf({
//                 format: "A4",

//                 printBackground: true,

//                 margin: {
//                     top: "20mm",
//                     bottom: "20mm",
//                     left: "15mm",
//                     right: "15mm"
//                 }
//             });


//         return pdfBuffer;

//     } finally {

//         await browser.close();

//     }
// }


// // --------------------------------------------------
// // Generate Resume PDF
// // --------------------------------------------------

// /**
//  * @name generateResumePdf
//  * @description Generates an ATS-friendly resume and converts it into PDF.
//  */
// async function generateResumePdf({
//     resume,
//     selfDescription,
//     jobDescription
// }) {

//     const resumePdfSchema =
//         z.object({
//             html: z.string()
//         });


//     const prompt = `
// Create a professional, ATS-friendly resume using the
// following information.

// Original Resume:
// ${resume}

// Self Description:
// ${selfDescription}

// Target Job Description:
// ${jobDescription}

// Requirements:

// - Tailor the resume to the target job.
// - Highlight relevant skills and experience.
// - Do not invent qualifications, jobs, education, or experience.
// - Keep the resume concise.
// - Target 1-2 pages.
// - Use simple professional HTML.
// - Make the HTML suitable for conversion to PDF.
// - Make it ATS friendly.
// - Use clear sections such as:
//   Summary,
//   Skills,
//   Education,
//   Experience,
//   Projects,
//   Certifications if applicable.
// - Do not mention that AI generated the resume.
// - Return only the HTML inside the "html" field.
// `;


//     const response =
//         await generateWithRetry({
//             contents: prompt,

//             config: {
//                 responseMimeType:
//                     "application/json",

//                 responseSchema:
//                     zodToJsonSchema(
//                         resumePdfSchema
//                     )
//             }
//         });


//     if (!response.text) {
//         throw new Error(
//             "AI returned an empty resume"
//         );
//     }


//     let jsonContent;

//     try {

//         jsonContent =
//             JSON.parse(response.text);

//     } catch (error) {

//         throw new Error(
//             "AI returned invalid JSON for resume"
//         );

//     }


//     const validatedContent =
//         resumePdfSchema.parse(
//             jsonContent
//         );


//     const pdfBuffer =
//         await generatePdfFromHtml(
//             validatedContent.html
//         );


//     return pdfBuffer;
// }


// // --------------------------------------------------
// // Exports
// // --------------------------------------------------

// module.exports = {
//     generateInterviewReport,
//     generateResumePdf
// };