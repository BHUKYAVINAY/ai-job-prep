const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");


// ==================================================
// GROQ CONFIGURATION
// ==================================================

if (!process.env.GROQ_API_KEY) {
    throw new Error(
        "GROQ_API_KEY is not configured"
    );
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL =
    process.env.GROQ_MODEL ||
    "llama-3.3-70b-versatile";


// ==================================================
// INTERVIEW REPORT SCHEMA
// ==================================================

/**
 * @name interviewReportSchema
 * @description Zod schema for the AI-generated interview report.
 */
const interviewReportSchema = z.object({

    matchScore: z.number()
        .min(0)
        .max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum([
                "low",
                "medium",
                "high"
            ])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(
                z.string()
            )
        })
    ),

    title: z.string()
});


// ==================================================
// GROQ REQUEST
// ==================================================

/**
 * @name generateGroqResponse
 * @description Sends a prompt to Groq and returns the generated JSON string.
 */
async function generateGroqResponse({
    prompt,
    maxRetries = 3
}) {

    let lastError;

    for (
        let attempt = 1;
        attempt <= maxRetries;
        attempt++
    ) {

        try {

            console.log(
                `Groq request attempt ${attempt}/${maxRetries}`
            );


            const completion =
                await groq.chat.completions.create({

                    model: GROQ_MODEL,

                    messages: [

                        {
                            role: "system",

                            content: `
You are an expert technical interviewer,
career coach, and professional resume assistant.

You MUST follow the JSON structure requested
by the user.

Rules:

- Return ONLY valid JSON.
- Do not return Markdown.
- Do not use code fences.
- Do not add explanations outside JSON.
- Do not omit required fields.
- Follow the requested data types exactly.
`
                        },

                        {
                            role: "user",
                            content: prompt
                        }

                    ],

                    temperature: 0.1,

                    response_format: {
                        type: "json_object"
                    }
                });


            const content =
                completion
                    ?.choices?.[0]
                    ?.message?.content;


            if (!content) {

                throw new Error(
                    "Groq returned an empty response"
                );
            }


            console.log(
                "========== GROQ RAW RESPONSE =========="
            );

            console.log(content);

            console.log(
                "========================================"
            );


            return content;


        } catch (error) {

            lastError = error;


            console.error(
                `Groq attempt ${attempt} failed:`,
                error.message
            );


            const status =
                error?.status ||
                error?.statusCode;


            const retryable =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504;


            if (
                !retryable ||
                attempt === maxRetries
            ) {

                throw error;
            }


            const delay =
                2000 * Math.pow(
                    2,
                    attempt - 1
                );


            console.log(
                `Retrying Groq in ${delay / 1000} seconds...`
            );


            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        delay
                    )
            );
        }
    }


    throw lastError;
}


// ==================================================
// GENERATE INTERVIEW REPORT
// ==================================================

/**
 * @name generateInterviewReport
 * @description Generates an interview preparation report using Groq AI.
 */
async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Analyze the candidate and generate a complete
interview preparation report.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}


RETURN ONLY JSON.

The JSON MUST have exactly these fields:

{
    "matchScore": 85,
    "technicalQuestions": [],
    "behavioralQuestions": [],
    "skillGaps": [],
    "preparationPlan": [],
    "title": "Full Stack Developer"
}


FIELD REQUIREMENTS:


1. matchScore

- Must be a NUMBER.
- Must be between 0 and 100.
- Example: 85
- Do NOT return "85%".
- Do NOT return "85" as a string.


2. technicalQuestions

Must be an array.

Generate 5 technical questions.

Every object MUST contain:

{
    "question": "...",
    "intention": "...",
    "answer": "..."
}


3. behavioralQuestions

Must be an array.

Generate 5 behavioral questions.

Every object MUST contain:

{
    "question": "...",
    "intention": "...",
    "answer": "..."
}


4. skillGaps

Must be an array.

Every object MUST contain:

{
    "skill": "...",
    "severity": "medium"
}


5. severity

Must be exactly one of:

"low"
"medium"
"high"


6. preparationPlan

Must be an array.

Generate a 7-day preparation plan.

Every object MUST contain:

{
    "day": 1,
    "focus": "...",
    "tasks": [
        "...",
        "..."
    ]
}


7. day

Must be a NUMBER.


8. tasks

Must be an array of strings.


9. title

Must be a STRING.

Use the most appropriate job title
based on the target job description.


IMPORTANT:

- Do not invent qualifications.
- Do not invent education.
- Do not invent experience.
- Do not invent projects.
- Do not invent certifications.
- Base the analysis only on the provided information.
- All six fields are REQUIRED.
- Do not omit any field.
- Return ONLY JSON.
`;


    const content =
        await generateGroqResponse({
            prompt
        });


    let parsedResponse;


    try {

        parsedResponse =
            JSON.parse(content);

    } catch (error) {

        console.error(
            "Groq returned invalid JSON:"
        );

        console.error(content);

        throw new Error(
            "Groq returned invalid JSON for interview report"
        );
    }


    console.log(
        "Parsed Groq interview report:"
    );

    console.log(
        JSON.stringify(
            parsedResponse,
            null,
            2
        )
    );


    // Validate with Zod

    const validatedReport =
        interviewReportSchema.parse(
            parsedResponse
        );


    return validatedReport;
}


// ==================================================
// GENERATE PDF FROM HTML
// ==================================================

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


// ==================================================
// GENERATE RESUME PDF
// ==================================================

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

            html: z.string()

        });


    const prompt = `
Create a professional ATS-friendly resume.

ORIGINAL RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}


REQUIREMENTS:

- Tailor the resume to the target job.
- Highlight relevant skills and experience.
- Do not invent qualifications.
- Do not invent jobs.
- Do not invent education.
- Do not invent projects.
- Do not invent certifications.
- Keep the resume concise.
- Target 1-2 pages.
- Use simple professional HTML.
- Make the HTML suitable for PDF conversion.
- Make it ATS friendly.
- Use clear sections.
- Do not mention AI.
- Return ONLY JSON.


The JSON MUST have exactly this structure:

{
    "html": "<complete HTML resume>"
}


The "html" value must contain
the complete resume HTML.
`;


    const content =
        await generateGroqResponse({
            prompt
        });


    let jsonContent;


    try {

        jsonContent =
            JSON.parse(content);

    } catch (error) {

        console.error(
            "Groq returned invalid resume JSON:"
        );

        console.error(content);

        throw new Error(
            "Groq returned invalid JSON for resume"
        );
    }


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


// ==================================================
// EXPORTS
// ==================================================

module.exports = {

    generateInterviewReport,

    generateResumePdf
};