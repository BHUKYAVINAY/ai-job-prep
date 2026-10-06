import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

import "../style/interview.scss";

import { useInterview } from "../hooks/useInterview";

const NAV_ITEMS = [
    {
        id: "technical",
        label: "Technical Questions",
    },
    {
        id: "behavioral",
        label: "Behavioral Questions",
    },
    {
        id: "roadmap",
        label: "Preparation Roadmap",
    },
];

const QuestionCard = ({
    question,
    index,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <article className="q-card">
            <button
                type="button"
                className={`q-card__header ${
                    open ? "is-open" : ""
                }`}
                onClick={() => setOpen(!open)}
            >
                <span className="q-card__index">
                    {String(index + 1).padStart(2, "0")}
                </span>

                <span className="q-card__question">
                    {question?.question ||
                        "Question not available"}
                </span>

                <span className="q-card__chevron">
                    {open ? "−" : "+"}
                </span>
            </button>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <h4>Intention</h4>

                        <p>
                            {question?.intention ||
                                "No intention available."}
                        </p>
                    </div>

                    <div className="q-card__section">
                        <h4>Answer</h4>

                        <p>
                            {question?.answer ||
                                "No answer available."}
                        </p>
                    </div>
                </div>
            )}
        </article>
    );
};

const RoadMapDay = ({
    day,
    index,
}) => {
    return (
        <article className="roadmap-day">
            <div className="roadmap-day__index">
                {String(index + 1).padStart(2, "0")}
            </div>

            <div className="roadmap-day__content">
                <div className="roadmap-day__header">
                    <div>
                        <span className="roadmap-day__badge">
                            Day {day?.day || index + 1}
                        </span>

                        <h3>
                            {day?.focus ||
                                "Preparation"}
                        </h3>
                    </div>
                </div>

                <ul className="roadmap-day__tasks">
                    {Array.isArray(day?.tasks) &&
                    day.tasks.length > 0 ? (
                        day.tasks.map(
                            (task, taskIndex) => (
                                <li key={taskIndex}>
                                    <span className="roadmap-day__bullet">
                                        ✓
                                    </span>

                                    <span>
                                        {task}
                                    </span>
                                </li>
                            )
                        )
                    ) : (
                        <li>
                            <span>
                                No tasks available.
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </article>
    );
};

const Interview = () => {
    const [activeNav, setActiveNav] =
        useState("technical");

    const {
        report,
        loading,
        getResumePdf,
    } = useInterview();

    const { interviewId } = useParams();

    const navigate = useNavigate();

    if (loading) {
        return (
            <main className="interview-page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>

                    <h2>
                        Loading interview report...
                    </h2>

                    <p>
                        Please wait while we prepare
                        your report.
                    </p>
                </div>
            </main>
        );
    }

    if (!report) {
        return (
            <main className="interview-page">
                <div className="empty-state">
                    <h2>
                        Interview report not found
                    </h2>

                    <p>
                        We could not find the requested
                        interview report.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </button>
                </div>
            </main>
        );
    }

    const technicalQuestions =
        Array.isArray(report.technicalQuestions)
            ? report.technicalQuestions
            : [];

    const behavioralQuestions =
        Array.isArray(report.behavioralQuestions)
            ? report.behavioralQuestions
            : [];

    const preparationPlan =
        Array.isArray(report.preparationPlan)
            ? report.preparationPlan
            : [];

    const skillGaps =
        Array.isArray(report.skillGaps)
            ? report.skillGaps
            : [];

    const matchScore =
        Number(report.matchScore) || 0;

    const handleDownloadResume = async () => {
        try {
            await getResumePdf(interviewId);
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to download resume."
            );
        }
    };

    const renderContent = () => {
        if (activeNav === "technical") {
            return (
                <section className="content-section">
                    <div className="content-header">
                        <div>
                            <span className="content-header__label">
                                TECHNICAL
                            </span>

                            <h1>
                                Technical Interview
                                Questions
                            </h1>

                            <p>
                                Questions generated
                                based on your resume
                                and job description.
                            </p>
                        </div>

                        <span className="content-header__count">
                            {technicalQuestions.length}
                        </span>
                    </div>

                    <div className="q-list">
                        {technicalQuestions.length >
                        0 ? (
                            technicalQuestions.map(
                                (
                                    question,
                                    index
                                ) => (
                                    <QuestionCard
                                        key={
                                            question?._id ||
                                            index
                                        }
                                        question={
                                            question
                                        }
                                        index={
                                            index
                                        }
                                    />
                                )
                            )
                        ) : (
                            <div className="empty-section">
                                No technical questions
                                available.
                            </div>
                        )}
                    </div>
                </section>
            );
        }

        if (activeNav === "behavioral") {
            return (
                <section className="content-section">
                    <div className="content-header">
                        <div>
                            <span className="content-header__label">
                                BEHAVIORAL
                            </span>

                            <h1>
                                Behavioral Interview
                                Questions
                            </h1>

                            <p>
                                Prepare answers for
                                common behavioral
                                interview situations.
                            </p>
                        </div>

                        <span className="content-header__count">
                            {behavioralQuestions.length}
                        </span>
                    </div>

                    <div className="q-list">
                        {behavioralQuestions.length >
                        0 ? (
                            behavioralQuestions.map(
                                (
                                    question,
                                    index
                                ) => (
                                    <QuestionCard
                                        key={
                                            question?._id ||
                                            index
                                        }
                                        question={
                                            question
                                        }
                                        index={
                                            index
                                        }
                                    />
                                )
                            )
                        ) : (
                            <div className="empty-section">
                                No behavioral questions
                                available.
                            </div>
                        )}
                    </div>
                </section>
            );
        }

        return (
            <section className="content-section">
                <div className="content-header">
                    <div>
                        <span className="content-header__label">
                            ROADMAP
                        </span>

                        <h1>
                            Preparation Roadmap
                        </h1>

                        <p>
                            Follow this plan to
                            prepare for your target
                            role.
                        </p>
                    </div>

                    <span className="content-header__count">
                        {preparationPlan.length}
                    </span>
                </div>

                <div className="roadmap-list">
                    {preparationPlan.length > 0 ? (
                        preparationPlan.map(
                            (day, index) => (
                                <RoadMapDay
                                    key={
                                        day?._id ||
                                        day?.day ||
                                        index
                                    }
                                    day={day}
                                    index={index}
                                />
                            )
                        )
                    ) : (
                        <div className="empty-section">
                            No preparation roadmap
                            available.
                        </div>
                    )}
                </div>
            </section>
        );
    };

    return (
        <main className="interview-page">
            <div className="interview-layout">
                <aside className="interview-nav">
                    <div className="interview-nav__brand">
                        <span>
                            AI JOB PREP
                        </span>
                    </div>

                    <nav>
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={
                                    activeNav ===
                                    item.id
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveNav(
                                        item.id
                                    )
                                }
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <button
                        type="button"
                        className="back-home-btn"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← Back to Home
                    </button>
                </aside>

                <div className="interview-divider"></div>

                <section className="interview-content">
                    {renderContent()}
                </section>

                <aside className="interview-sidebar">
                    <div className="sidebar-card match-score">
                        <div className="sidebar-card__header">
                            <span>
                                JOB MATCH
                            </span>
                        </div>

                        <div className="match-score__ring">
                            <div>
                                <strong>
                                    {matchScore}%
                                </strong>

                                <span>
                                    Match
                                </span>
                            </div>
                        </div>

                        <p>
                            {matchScore >= 80
                                ? "Strong match for this role"
                                : matchScore >=
                                  60
                                ? "Good match for this role"
                                : "Needs improvement for this role"}
                        </p>
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card__header">
                            <span>
                                SKILL GAPS
                            </span>
                        </div>

                        <div className="skill-gaps">
                            {skillGaps.length > 0 ? (
                                skillGaps.map(
                                    (
                                        gap,
                                        index
                                    ) => (
                                        <div
                                            className="skill-tag"
                                            key={
                                                gap?._id ||
                                                index
                                            }
                                        >
                                            <span>
                                                {gap?.skill ||
                                                    "Unknown skill"}
                                            </span>

                                            <span
                                                className={`skill-tag__badge skill-tag__badge--${
                                                    gap?.severity ||
                                                    "low"
                                                }`}
                                            >
                                                {gap?.severity ||
                                                    "low"}
                                            </span>
                                        </div>
                                    )
                                )
                            ) : (
                                <p>
                                    No skill gaps
                                    found.
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="download-btn"
                        onClick={
                            handleDownloadResume
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Generating..."
                            : "Download Resume PDF"}
                    </button>
                </aside>
            </div>
        </main>
    );
};

export default Interview;