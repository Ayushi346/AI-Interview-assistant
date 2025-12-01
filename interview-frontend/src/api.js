// const BASE_URL = "http://localhost:8080/api";
//
// export async function startSession(payload) {
//     const res = await fetch(`${BASE_URL}/interview/start`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//     });
//     return res.json();
// }
//
// export async function getNextQuestion(sessionId) {
//     const res = await fetch(`${BASE_URL}/interview/next?sessionId=${sessionId}`);
//     return res.json();
// }
//
// export async function submitAnswer(data) {
//     const res = await fetch(`${BASE_URL}/interview/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     });
//     return res.json();
// }
//
// export async function getSummary(sessionId) {
//     const res = await fetch(`${BASE_URL}/interview/summary?sessionId=${sessionId}`);
//     return res.json();
// }

const BASE = "http://localhost:8080/api"; // change if backend is on different host

async function handleRes(res) {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw { status: res.status, body: err };
    }
    return res.json();
}

export async function startSession(payload) {
    const res = await fetch(`${BASE}/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getNextQuestion(sessionId) {
    const res = await fetch(`${BASE}/interview/next?sessionId=${sessionId}`);
    return handleRes(res);
}

export async function submitAnswer(data) {
    const res = await fetch(`${BASE}/interview/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleRes(res);
}

export async function startInterview(payload) {
    const res = await fetch("http://localhost:8080/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    return res.json();
}


export async function getSummary(sessionId) {
    const res = await fetch(`${BASE}/interview/summary?sessionId=${sessionId}`);
    return handleRes(res);
}

export async function getAllQuestions() {
    const res = await fetch(`${BASE}/interview/questions`);
    return handleRes(res);
}
