import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import InterviewSession from './components/InterviewSession'
import Summary from './components/Summary'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/interview" element={<InterviewSession />} />
            <Route path="/summary" element={<Summary />} />
        </Routes>
    )
}

export default App