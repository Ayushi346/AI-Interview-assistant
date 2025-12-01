import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Summary() {
    const location = useLocation()
    const navigate = useNavigate()
    const sessionId = location.state?.sessionId

    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [evaluations, setEvaluations] = useState([])
    const [evaluating, setEvaluating] = useState(false)

    useEffect(() => {
        if (!sessionId) {
            navigate('/')
            return
        }
        loadSummary()
    }, [sessionId])

    const loadSummary = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/interview/summary?sessionId=${sessionId}`
            )
            const data = await response.json()

            if (data.error) {
                setError(data.error)
            } else {
                setSummary(data)
                // Auto-evaluate answers
                evaluateAnswers(data.answers)
            }
        } catch (err) {
            setError('Failed to load summary: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const evaluateAnswers = async (answers) => {
        if (!answers || answers.length === 0) return

        setEvaluating(true)
        const results = []

        for (const answer of answers) {
            try {
                const response = await fetch('http://localhost:8080/api/openai/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question: answer.questionId, // You might want to fetch the actual question text
                        answer: answer.answerText
                    })
                })

                const feedback = await response.text()
                results.push({ answerId: answer.id, feedback })
            } catch (err) {
                results.push({ answerId: answer.id, feedback: 'Unable to evaluate this answer' })
            }
        }

        setEvaluations(results)
        setEvaluating(false)
    }

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600 bg-green-50'
        if (score >= 6) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    const calculateAverageScore = () => {
        const scores = evaluations.map(e => {
            const match = e.feedback.match(/(\d+)\/10/)
            return match ? parseInt(match[1]) : 0
        })
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length
        return avg.toFixed(1)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your results...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
                    <div className="text-6xl mb-4 text-center">❌</div>
                    <p className="text-red-600 text-center mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Celebration Header */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    <div className="text-center mb-6">
                        <div className="text-8xl mb-4 animate-bounce">🎉</div>
                        <h1 className="text-5xl font-bold text-gray-800 mb-3">
                            Interview Completed!
                        </h1>
                        <p className="text-xl text-gray-600">
                            Great job, {summary?.candidateName}! Here's your performance summary.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold text-blue-600">{summary?.totalQuestions}</div>
                            <div className="text-sm text-gray-600 mt-2">Total Questions</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold text-green-600">{summary?.answeredQuestions}</div>
                            <div className="text-sm text-gray-600 mt-2">Answered</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold text-purple-600">{summary?.topic}</div>
                            <div className="text-sm text-gray-600 mt-2">Topic</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold text-orange-600">{summary?.difficulty}</div>
                            <div className="text-sm text-gray-600 mt-2">Level</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold text-pink-600">
                                {evaluations.length > 0 ? calculateAverageScore() : '-'}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">Avg Score</div>
                        </div>
                    </div>
                </div>

                {/* AI Evaluation Status */}
                {evaluating && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
                            <div>
                                <p className="font-semibold text-gray-800">AI is evaluating your answers...</p>
                                <p className="text-sm text-gray-600">This may take a few moments</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Results */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span className="text-4xl">📝</span>
                        Detailed Feedback
                    </h2>

                    {summary?.answers && summary.answers.length > 0 ? (
                        <div className="space-y-6">
                            {summary.answers.map((answer, index) => {
                                const evaluation = evaluations.find(e => e.answerId === answer.id)

                                return (
                                    <div key={answer.id} className="border-l-4 border-purple-500 bg-gradient-to-r from-gray-50 to-white rounded-r-2xl p-6 shadow-md hover:shadow-lg transition-shadow">

                                        {/* Question Number & ID */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Question {index + 1}</p>
                                                    <p className="text-sm text-gray-500">ID: {answer.questionId}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(answer.submittedAt).toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Your Answer */}
                                        <div className="mb-4">
                                            <p className="font-semibold text-gray-700 mb-2">Your Answer:</p>
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                    {answer.answerText}
                                                </p>
                                            </div>
                                        </div>

                                        {/* AI Feedback */}
                                        {evaluation ? (
                                            <div className="mt-4">
                                                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    <span className="text-xl">🤖</span>
                                                    AI Feedback:
                                                </p>
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                        {evaluation.feedback}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : evaluating ? (
                                            <div className="mt-4 flex items-center gap-2 text-gray-500">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                                                <span className="text-sm">Evaluating...</span>
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-12 text-lg">
                            No answers were recorded for this session.
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Start New Interview
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300"
                        >
                            Print Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary