import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        candidateName: '',
        topic: '',
        difficulty: 'Medium',
        count: 5
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.candidateName.trim()) {
            setError('Please enter your name')
            return
        }

        if (!formData.topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:8080/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const session = await response.json()
                navigate('/interview', { state: { session } })
            } else {
                setError('Failed to start interview. Please try again.')
            }
        } catch (err) {
            setError('Cannot connect to server: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const popularTopics = ['Java', 'Python', 'JavaScript', 'React', 'Spring Boot', 'DSA']

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-6">
            <div className="w-full max-w-xl">

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6 text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            AI Interview Assistant
                        </h1>
                        <p className="text-purple-100 text-sm">
                            Practice interviews with AI-powered feedback
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.candidateName}
                                    onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Topic Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-2">
                                    Interview Topic <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                    placeholder="e.g., Java, Python, React, DSA..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                                    required
                                />

                                {/* Popular Topics Pills */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs text-gray-500 font-medium self-center">Popular:</span>
                                    {popularTopics.map((topic) => (
                                        <button
                                            key={topic}
                                            type="button"
                                            onClick={() => setFormData({...formData, topic: topic})}
                                            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium rounded-full transition-all"
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty Level */}
                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-2">
                                    Difficulty Level
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { level: 'Easy', icon: '😊', color: 'green' },
                                        { level: 'Medium', icon: '🤔', color: 'yellow' },
                                        { level: 'Hard', icon: '💪', color: 'red' }
                                    ].map(({ level, icon, color }) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({...formData, difficulty: level})}
                                            className={`relative p-3 rounded-xl font-semibold text-sm transition-all ${
                                                formData.difficulty === level
                                                    ? `${
                                                        color === 'green' ? 'bg-green-500' :
                                                            color === 'yellow' ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                    } text-white shadow-lg`
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <div className="text-xl">{icon}</div>
                                            <div className="text-xs font-bold mt-1">{level}</div>
                                            {formData.difficulty === level && (
                                                <div className="absolute top-1 right-1">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Number of Questions */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 font-semibold text-sm">
                                        Number of Questions
                                    </label>
                                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold text-sm">
                                        {formData.count}
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="3"
                                    max="15"
                                    value={formData.count}
                                    onChange={(e) => setFormData({...formData, count: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>3</span>
                                    <span>15</span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Starting Interview...
                  </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                    Start Interview
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                    <p className="text-white text-xs">Powered by Groq AI • Good luck! 🚀</p>
                </div>
            </div>
        </div>
    )
}

export default Home