import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function InterviewSession() {
    const location = useLocation()
    const navigate = useNavigate()

    // Get session data from navigation state
    const sessionData = location.state?.session

    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Load first question on mount
    useEffect(() => {
        if (!sessionData) {
            navigate('/')
            return
        }
        loadNextQuestion()
    }, [])

    const loadNextQuestion = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(
                `http://localhost:8080/api/interview/next?sessionId=${sessionData.id}`
            )
            const data = await response.json()

            if (data.finished) {
                // All questions completed, go to summary
                navigate('/summary', {
                    state: { sessionId: sessionData.id }
                })
            } else if (data.error) {
                setError(data.error)
            } else {
                setCurrentQuestion(data)
                setAnswer('') // Clear answer for new question
            }
        } catch (err) {
            setError('Failed to load question: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!answer.trim()) {
            setError('Please provide an answer')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:8080/api/interview/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionData.id,
                    questionId: currentQuestion.questionId,
                    answerText: answer
                })
            })

            if (response.ok) {
                // Answer submitted successfully, load next question
                loadNextQuestion()
            } else {
                setError('Failed to submit answer')
            }
        } catch (err) {
            setError('Error submitting answer: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit()
        }
    }

    if (!sessionData) {
        return <div className="text-center p-8">No session data found</div>
    }

    if (loading && !currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="bg-white rounded-lg p-8 shadow-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading question...</p>
                </div>
            </div>
        )
    }

    if (error && !currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="bg-white rounded-lg p-8 shadow-2xl">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="bg-white/90 backdrop-blur rounded-t-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {sessionData.candidateName}'s Interview
                            </h2>
                            <p className="text-gray-600">
                                {sessionData.topic} • {sessionData.difficulty}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-purple-600">
                                {currentQuestion?.questionNumber || 0}/{currentQuestion?.totalQuestions || 0}
                            </div>
                            <div className="text-sm text-gray-600">Questions</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                            style={{
                                width: `${(currentQuestion?.questionNumber / currentQuestion?.totalQuestions) * 100}%`
                            }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-b-2xl shadow-2xl p-8">

                    {/* Question */}
                    <div className="mb-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                                Q
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                                {currentQuestion?.questionText}
                            </h3>
                        </div>
                    </div>

                    {/* Answer Input */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Your Answer
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your answer here... (Ctrl+Enter to submit)"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none transition-colors"
                            rows="8"
                            disabled={loading}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            💡 Tip: Press Ctrl + Enter to submit
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !answer.trim()}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit & Next Question
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to end the interview?')) {
                                    navigate('/summary', { state: { sessionId: sessionData.id } })
                                }
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                            End Interview
                        </button>
                    </div>
                </div>

                {/* Footer Hint */}
                <div className="text-center mt-6 text-white/80 text-sm">
                    <p>Answer honestly and thoroughly. Good luck! 🚀</p>
                </div>
            </div>
        </div>
    )
}

export default InterviewSession