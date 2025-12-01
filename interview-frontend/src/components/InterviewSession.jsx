import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function InterviewSession() {
    const location = useLocation()
    const navigate = useNavigate()
    const session = location.state?.session

    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!session) {
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
                `http://localhost:8080/api/interview/next?sessionId=${session.id}`
            )
            const data = await response.json()

            if (data.finished) {
                // Interview complete, go to summary
                navigate('/summary', { state: { sessionId: session.id } })
            } else if (data.error) {
                setError(data.error)
            } else {
                setCurrentQuestion(data)
                setAnswer('')
            }
        } catch (err) {
            setError('Failed to load question: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!answer.trim()) {
            setError('Please provide an answer before submitting')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Submit answer
            const submitResponse = await fetch('http://localhost:8080/api/interview/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: session.id,
                    questionId: currentQuestion.questionId,
                    answerText: answer
                })
            })

            if (submitResponse.ok) {
                // Load next question
                await loadNextQuestion()
            } else {
                setError('Failed to submit answer')
            }
        } catch (err) {
            setError('Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!session) {
        return null
    }

    if (loading && !currentQuestion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading question...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Progress Header */}
                <div className="bg-white/95 backdrop-blur rounded-t-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {session.candidateName}'s Interview
                            </h2>
                            <p className="text-gray-600">
                                {session.topic} • {session.difficulty}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-purple-600">
                                {currentQuestion?.questionNumber || 0}/{currentQuestion?.totalQuestions || 0}
                            </div>
                            <div className="text-sm text-gray-600">Progress</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                            style={{
                                width: `${((currentQuestion?.questionNumber || 0) / (currentQuestion?.totalQuestions || 1)) * 100}%`
                            }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-b-2xl shadow-2xl p-8">

                    {/* Question */}
                    <div className="mb-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                                Q{currentQuestion?.questionNumber}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                                    {currentQuestion?.questionText}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Answer Input */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-3 text-lg">
                            Your Answer
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your detailed answer here... Be thorough and explain your reasoning."
                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none transition-all text-lg"
                            rows="10"
                            disabled={loading}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">
                                💡 Tip: Write clear and detailed answers
                            </p>
                            <p className="text-sm text-gray-500">
                                {answer.length} characters
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-700 font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !answer.trim()}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Answer
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to end the interview early?')) {
                                    navigate('/summary', { state: { sessionId: session.id } })
                                }
                            }}
                            disabled={loading}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                        >
                            End Interview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewSession