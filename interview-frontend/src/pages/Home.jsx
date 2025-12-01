// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { startSession } from "../api";
//
// export default function Home() {
//     const [name, setName] = useState("");
//     const [topic, setTopic] = useState("");
//     const [difficulty, setDifficulty] = useState("Medium");
//     const [count, setCount] = useState(5);
//     const [loading, setLoading] = useState(false);
//     const nav = useNavigate();
//
//     const start = async () => {
//         if (!name) return alert("Enter your name");
//         setLoading(true);
//         try {
//             const session = await startSession({
//                 candidateName: name,
//                 topic,
//                 difficulty,
//                 count
//             });
//             // store session id and redirect to interview page
//             localStorage.setItem("sessionId", session.id);
//             nav("/interview");
//         } catch (e) {
//             console.error(e);
//             alert("Failed to start session: " + (e?.body?.message || e?.status || e));
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="bg-white p-6 rounded shadow">
//             <h2 className="text-2xl font-semibold mb-4">Start Interview</h2>
//
//             <label className="block mb-2 text-sm">Your name</label>
//             <input value={name} onChange={e=>setName(e.target.value)} className="w-full mb-4 p-2 border rounded" />
//
//             <label className="block mb-2 text-sm">Topic (optional)</label>
//             <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full mb-4 p-2 border rounded" placeholder="e.g. Java, DSA, Graphs" />
//
//             <label className="block mb-2 text-sm">Difficulty</label>
//             <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full mb-4 p-2 border rounded">
//                 <option>Easy</option>
//                 <option>Medium</option>
//                 <option>Hard</option>
//             </select>
//
//             <label className="block mb-2 text-sm">Number of questions</label>
//             <input type="number" value={count} min="1" max="30" onChange={e=>setCount(Number(e.target.value))} className="w-full mb-4 p-2 border rounded" />
//
//             <button onClick={start} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
//                 {loading ? "Starting..." : "Start Interview"}
//             </button>
//         </div>
//     );
// }

import React, { useState } from "react";
import { startInterview } from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [count, setCount] = useState(5);

    async function handleStart() {
        if (!name || !topic || !count) {
            alert("All fields required");
            return;
        }

        try {
            const res = await startInterview({
                candidateName: name,
                topic: topic,
                difficulty: difficulty,
                count: 5

            });

            // save session
            localStorage.setItem("sessionId", res.id);

            nav("/interview");
        } catch (e) {
            console.error(e);
            alert("Could not start interview.");
        }
    }

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Start Interview</h2>

            <input value={name} onChange={e => setName(e.target.value)}
                   className="w-full p-2 border rounded mb-3" placeholder="Your Name"/>

            <input value={topic} onChange={e => setTopic(e.target.value)}
                   className="w-full p-2 border rounded mb-3" placeholder="Topic (Java, Spring, DSA)"/>

            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                    className="w-full p-2 border rounded mb-3">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <input type="number" value={count} min="1" max="20"
                   onChange={e => setCount(Number(e.target.value))}

                   className="w-full p-2 border rounded mb-3" placeholder="Number of questions"/>

            <button
                onClick={handleStart}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Start Interview
            </button>
        </div>
    );
}
