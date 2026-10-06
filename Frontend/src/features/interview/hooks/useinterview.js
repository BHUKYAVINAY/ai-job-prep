import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
} from "../services/interview.api";

import {
    useCallback,
    useContext,
    useEffect,
} from "react";

import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
    } = context;

    const { interviewId } = useParams();

    const generateReport = useCallback(
        async ({
            jobDescription,
            selfDescription,
            resumeFile,
        }) => {
            setLoading(true);

            try {
                const response =
                    await generateInterviewReport({
                        jobDescription,
                        selfDescription,
                        resumeFile,
                    });

                const interviewReport =
                    response?.interviewReport;

                setReport(interviewReport || null);

                return interviewReport;
            } catch (error) {
                console.error(
                    "Generate report error:",
                    error
                );

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setReport]
    );

    const getReportById = useCallback(
        async (id) => {
            if (!id) {
                return null;
            }

            setLoading(true);

            try {
                const response =
                    await getInterviewReportById(id);

                const interviewReport =
                    response?.interviewReport;

                setReport(interviewReport || null);

                return interviewReport;
            } catch (error) {
                console.error(
                    "Get report error:",
                    error
                );

                setReport(null);

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setReport]
    );

    const getReports = useCallback(async () => {
        setLoading(true);

        try {
            const response =
                await getAllInterviewReports();

            const interviewReports =
                response?.interviewReports || [];

            setReports(interviewReports);

            return interviewReports;
        } catch (error) {
            console.error(
                "Get reports error:",
                error
            );

            setReports([]);

            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setReports]);

    const getResumePdf = useCallback(
        async (interviewReportId) => {
            if (!interviewReportId) {
                return;
            }

            setLoading(true);

            try {
                const pdfData =
                    await generateResumePdf({
                        interviewReportId,
                    });

                const blob = new Blob(
                    [pdfData],
                    {
                        type: "application/pdf",
                    }
                );

                const url =
                    window.URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    `resume_${interviewReportId}.pdf`;

                document.body.appendChild(link);

                link.click();

                link.remove();

                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error(
                    "Resume PDF error:",
                    error
                );

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [setLoading]
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                if (interviewId) {
                    await getReportById(interviewId);
                } else {
                    await getReports();
                }
            } catch (error) {
                console.error(
                    "Interview data loading error:",
                    error
                );
            }
        };

        loadData();
    }, [interviewId, getReportById, getReports]);

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
    };
};