import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Summary() {
    const location = useLocation()
    const navigate = useNavigate()
    const sessionId = location.state?.sessionId

    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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
            }
        } catch (err) {
            setError('Failed to load summary: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading summary...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
                <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Interview Completed!
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Great job, {summary?.candidateName}!
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600">{summary?.totalQuestions}</div>
                            <div className="text-sm text-gray-600 mt-1">Total Questions</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">{summary?.answeredQuestions}</div>
                            <div className="text-sm text-gray-600 mt-1">Answered</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600">{summary?.topic}</div>
                            <div className="text-sm text-gray-600 mt-1">Topic</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-orange-600">{summary?.difficulty}</div>
                            <div className="text-sm text-gray-600 mt-1">Difficulty</div>
                        </div>
                    </div>
                </div>

                {/* Answers Review */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Answers</h2>

                    {summary?.answers && summary.answers.length > 0 ? (
                        <div className="space-y-6">
                            {summary.answers.map((item, index) => (
                                <div key={item.id} className="border-l-4 border-purple-500 bg-gray-50 rounded-r-lg p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 mb-2">
                                                Question ID: {item.questionId}
                                            </p>
                                            <p className="text-gray-700 bg-white rounded p-3 whitespace-pre-wrap">
                                                {item.answerText}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Submitted: {new Date(item.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">No answers recorded</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                            Start New Interview
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                            Print Summary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary