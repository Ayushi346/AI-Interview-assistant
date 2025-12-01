import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function Summary() {
    const [data, setData] = useState(null);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    useEffect(() => {
        if (!sessionId) return;

        axios.get(`http://localhost:8080/api/interview/summary?sessionId=${sessionId}`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, [sessionId]);

    if (!data) return <p>Loading summary...</p>;

    return (
        <div>
            <h2>Session Summary</h2>
            <p><b>Candidate:</b> {data.candidateName}</p>
            <p><b>Topic:</b> {data.topic}</p>
            <p><b>Answered:</b> {data.answered} / {data.totalQuestions}</p>
            <p><b>Average Score:</b> {data.averageScore.toFixed(2)}</p>

            <h3>Questions & Answers</h3>
            {data.answers.map((a, i) => (
                <div key={i}>
                    <p><b>Q{i+1}:</b> {a.questionText}</p>
                    <p><b>Your Answer:</b> {a.answerText}</p>
                    <p><b>Score:</b> {a.score}</p>
                    <p><b>Feedback:</b> {a.feedback}</p>
                </div>
            ))}

            <h3>Overall Feedback</h3>
            <p>{data.overallFeedback}</p>
        </div>
    );
}
