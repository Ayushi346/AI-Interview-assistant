import React, { useEffect, useState } from "react";
import { getNextQuestion, submitAnswer } from "../api";
import { useNavigate } from "react-router-dom";

export default function Interview() {
    const nav = useNavigate();
    const [sessionId] = useState(localStorage.getItem("sessionId"));
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ index: 0, total: 0 });

    useEffect(() => {
        if (!sessionId) {
            nav("/");
            return;
        }
        loadNext();
        // eslint-disable-next-line
    }, []);

    async function loadNext() {
        setLoading(true);
        try {
            const res = await getNextQuestion(sessionId);

            if (res.finished === true) {
                nav(`/summary?sessionId=${sessionId}`);
                return;
            }

            setQuestion(res);
            setAnswer("");

            setMeta({
                questionIndex: res.questionIndex,
                totalQuestions: res.totalQuestions
            });

        } catch (e) {
            console.error(e);
            alert("Could not load question.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit() {
        if (!answer.trim()) {
            return alert("Write your answer before submitting.");
        }
        setLoading(true);
        try {
            await submitAnswer({
                sessionId,
                questionId: question.questionId,
                answerText: answer,
            });

            await loadNext();


        } catch (e) {
            console.error(e);
            alert("Submit failed.");
        } finally {
            setLoading(false);
        }
    }

    if (!question) return <div className="text-center p-6">Loading question...</div>;

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-4">
                <div>
                    <div className="text-sm text-gray-500">
                        Question {meta.questionIndex} / {meta.totalQuestions}
                    </div>
                    <h3 className="text-xl font-semibold mt-1">{question.questionText}</h3>
                </div>
            </div>

            <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                rows="8"
                className="w-full p-3 border rounded mb-4"
                placeholder="Type your answer here..."
            />

            <div className="flex gap-3">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Submit Answer
                </button>

                <button
                    onClick={() => nav(`/summary?sessionId=${sessionId}`)}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    Finish & Summary
                </button>
            </div>
        </div>
    );
}
