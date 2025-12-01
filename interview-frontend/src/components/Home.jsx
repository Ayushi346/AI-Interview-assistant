import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        candidateName: '',
        topic: 'Java',
        difficulty: 'Medium',
        count: 5
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
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
                setError('Failed to start interview')
            }
        } catch (err) {
            setError('Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    🎯 Start Interview
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.candidateName}
                            onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                            required
                            className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Topic</label>
                        <select
                            value={formData.topic}
                            onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                        >
                            <option>Java</option>
                            <option>Python</option>
                            <option>JavaScript</option>
                            <option>DSA</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Difficulty</label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                            className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Number of Questions</label>
                        <input
                            type="number"
                            value={formData.count}
                            onChange={(e) => setFormData({...formData, count: parseInt(e.target.value)})}
                            min="1"
                            max="20"
                            className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Starting...' : 'Start Interview'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Home