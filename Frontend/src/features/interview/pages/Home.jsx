import React, {
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router";

import "../style/home.scss";

import { useInterview } from "../hooks/useInterview";

const Home = () => {
    const navigate = useNavigate();

    const {
        loading,
        generateReport,
        reports,
    } = useInterview();

    const resumeInputRef = useRef(null);

    const [jobDescription, setJobDescription] =
        useState("");

    const [selfDescription, setSelfDescription] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");

            event.target.value = "";

            setSelectedFile(null);

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(
                "Resume file must be smaller than 5MB."
            );

            event.target.value = "";

            setSelectedFile(null);

            return;
        }

        setSelectedFile(file);
    };

    const handleGenerateReport = async () => {
        const resumeFile =
            resumeInputRef.current?.files?.[0];

        if (!jobDescription.trim()) {
            alert(
                "Please enter the job description."
            );

            return;
        }

        if (
            !resumeFile &&
            !selfDescription.trim()
        ) {
            alert(
                "Please upload a resume or enter your self-description."
            );

            return;
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile,
            });

            if (!data?._id) {
                throw new Error(
                    "Interview report was not generated."
                );
            }

            navigate(
                `/interview/${data._id}`
            );
        } catch (error) {
            console.error(
                "Generate interview report error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to generate interview report."
            );
        }
    };

    return (
        <main className="home-page">
            <section className="home-container">
                <header className="home-header">
                    <span className="home-header__label">
                        AI JOB PREP
                    </span>

                    <h1>
                        Prepare smarter.
                        <br />
                        <span>
                            Interview better.
                        </span>
                    </h1>

                    <p>
                        Upload your resume and job
                        description to generate a
                        personalized interview
                        preparation report.
                    </p>
                </header>

                <section className="interview-form">
                    <div className="form-column">
                        <div className="form-group">
                            <label htmlFor="jobDescription">
                                Job Description
                            </label>

                            <textarea
                                id="jobDescription"
                                name="jobDescription"
                                value={
                                    jobDescription
                                }
                                onChange={(event) =>
                                    setJobDescription(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Paste the job description here..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="selfDescription">
                                Self Description
                            </label>

                            <textarea
                                id="selfDescription"
                                name="selfDescription"
                                value={
                                    selfDescription
                                }
                                onChange={(event) =>
                                    setSelfDescription(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Tell us about yourself, your skills, experience and projects..."
                            />
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-group">
                            <label>
                                Upload Resume
                            </label>

                            <label
                                htmlFor="resume"
                                className="file-upload"
                            >
                                <span>
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Choose PDF"}
                                </span>

                                <small>
                                    {selectedFile
                                        ? `${(
                                              selectedFile.size /
                                              1024 /
                                              1024
                                          ).toFixed(
                                              2
                                          )} MB`
                                        : "PDF (Max 5MB)"}
                                </small>
                            </label>

                            <input
                                ref={
                                    resumeInputRef
                                }
                                hidden
                                type="file"
                                id="resume"
                                name="resume"
                                accept=".pdf"
                                onChange={
                                    handleFileChange
                                }
                            />
                        </div>

                        <button
                            type="button"
                            className="generate-btn"
                            onClick={
                                handleGenerateReport
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Interview Report"}
                        </button>
                    </div>
                </section>

                <section className="recent-reports">
                    <div className="section-header">
                        <div>
                            <span>
                                HISTORY
                            </span>

                            <h2>
                                Recent Reports
                            </h2>
                        </div>
                    </div>

                    {reports.length === 0 ? (
                        <div className="no-reports">
                            <p>
                                No interview reports
                                yet.
                            </p>
                        </div>
                    ) : (
                        <div className="reports-list">
                            {reports.map(
                                (report, index) => (
                                    <button
                                        type="button"
                                        className="report-card"
                                        key={
                                            report?._id ||
                                            index
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/interview/${report._id}`
                                            )
                                        }
                                    >
                                        <div>
                                            <h3>
                                                {report?.title ||
                                                    "Interview Report"}
                                            </h3>

                                            <p>
                                                Match Score:{" "}
                                                {Number(
                                                    report?.matchScore
                                                ) ||
                                                    0}
                                                %
                                            </p>
                                        </div>

                                        <span>
                                            →
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
};

export default Home;