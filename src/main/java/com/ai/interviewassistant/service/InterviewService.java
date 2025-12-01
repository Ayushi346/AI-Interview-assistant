//package com.ai.interviewassistant.service;
//
//import com.ai.interviewassistant.model.CandidateAnswer;
//import com.ai.interviewassistant.model.InterviewSession;
//import com.ai.interviewassistant.model.Question;
//import com.ai.interviewassistant.repository.CandidateAnswerRepository;
//import com.ai.interviewassistant.repository.InterviewSessionRepository;
//import com.ai.interviewassistant.repository.QuestionRepository;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class InterviewService {
//
//    private final QuestionRepository questionRepository;
//    private final InterviewSessionRepository sessionRepository;
//    private final CandidateAnswerRepository answerRepository;
//    private final GroqService groqService;
//
//    public InterviewService(
//            QuestionRepository questionRepository,
//            InterviewSessionRepository sessionRepository,
//            CandidateAnswerRepository answerRepository,
//            GroqService groqService) {
//        this.questionRepository = questionRepository;
//        this.sessionRepository = sessionRepository;
//        this.answerRepository = answerRepository;
//        this.groqService = groqService;
//    }
//
//    // Start session: select questions (by topic/difficulty if provided)
//    public InterviewSession startSession(String candidateName, String topic, String difficulty, int count) {
//
//        List<Question> pool;
//
//        if (topic != null && !topic.isBlank() &&
//                difficulty != null && !difficulty.isBlank()) {
//
//            pool = questionRepository.findByTopicIgnoreCaseAndDifficultyIgnoreCase(topic, difficulty);
//
//        } else if (topic != null && !topic.isBlank()) {
//
//            pool = questionRepository.findByTopicIgnoreCase(topic);
//
//        } else if (difficulty != null && !difficulty.isBlank()) {
//
//            pool = questionRepository.findByDifficultyIgnoreCase(difficulty);
//
//        } else {
//            pool = questionRepository.findAll();
//        }
//
//// Prevent empty session
//        if (pool.isEmpty()) {
//            throw new RuntimeException("No questions found for chosen topic/difficulty");
//        }
//
//
//        Collections.shuffle(pool, new Random());
//        List<String> ids = pool.stream()
//                .limit(count)
//                .map(Question::getId)
//                .collect(Collectors.toList());
//
//        InterviewSession s = new InterviewSession();
//        s.setCandidateName(candidateName);
//        s.setTopic(topic);
//        s.setDifficulty(difficulty);
//        s.setTotalQuestions(ids.size());
//        s.setQuestionIds(ids);
//        s.setCurrentIndex(0);
//        s.setFinished(false);
//        s.setStartedAt(LocalDateTime.now());
//        return sessionRepository.save(s);
//
//    }
//
//    // Get next question DTO
//    public Map<String,Object> getNextQuestion(String sessionId) {
//        InterviewSession s = sessionRepository.findById(sessionId)
//                .orElseThrow(() -> new RuntimeException("Session not found"));
//
//        if (s.getCurrentIndex() >= s.getQuestionIds().size()) {
//            s.setFinished(true);
//            s.setFinishedAt(LocalDateTime.now());
//            sessionRepository.save(s);
//            return Map.of("finished", true);
//        }
//
//        String qid = s.getQuestionIds().get(s.getCurrentIndex());
//        Question q = questionRepository.findById(qid)
//                .orElseThrow(() -> new RuntimeException("Question not found"));
//
//        return Map.of(
//                "finished", false,
//                "sessionId", s.getId(),
//                "questionId", q.getId(),
//                "questionText", q.getDescription(),
//                "questionIndex", s.getCurrentIndex() + 1,
//                "totalQuestions", s.getTotalQuestions()
//        );
//    }
//
//    // Submit answer: call Groq to evaluate, store CandidateAnswer, increment index
//    public CandidateAnswer submitAnswer(String sessionId, String questionId, String answerText) {
//        InterviewSession s = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
//        Question q = questionRepository.findById(questionId).orElseThrow(() -> new RuntimeException("Question not found"));
//
//        // Build evaluation prompt for Groq — structured and strict
//        String evalPrompt = buildEvaluationPrompt(q.getDescription(), answerText);
//
//        String evalResponse = groqService.askQuestion(evalPrompt); // e.g. returns score + feedback
//
//        // We need to parse score & feedback from Groq output. We'll use a simple pattern: expect "SCORE: X\nFEEDBACK: ..."
//        double score = 0.0;
//        String feedback = evalResponse;
//        try {
//            // attempt parse: look for "SCORE:" prefix
//            String upper = evalResponse.toUpperCase();
//            if (upper.contains("SCORE:")) {
//                int pos = upper.indexOf("SCORE:");
//                String after = evalResponse.substring(pos + 6).trim();
//                String[] parts = after.split("\\n", 2);
//                String scoreText = parts[0].trim();
//                score = Double.parseDouble(scoreText.split("[^0-9\\.]")[0]);
//                feedback = parts.length > 1 ? parts[1].trim() : "";
//            } else {
//                // fallback: ask Groq again to produce JSON (if needed) — keep simple for now
//            }
//        } catch (Exception ex) {
//            // parsing failed — keep score 0 and store full evalResponse as feedback
//            feedback = evalResponse;
//        }
//
//        CandidateAnswer ca = new CandidateAnswer();
//        ca.setSessionId(sessionId);
//        ca.setQuestionId(questionId);
//        ca.setQuestionText(q.getDescription());
//        ca.setAnswerText(answerText);
//        ca.setScore(score);
//        ca.setFeedback(feedback);
//        ca.setAnsweredAt(LocalDateTime.now());
//        CandidateAnswer saved = answerRepository.save(ca);
//
//        // advance session index and save
////        int current = s.getCurrentIndex();
////        s.setCurrentIndex(current + 1);
////        if (s.getCurrentIndex() >= s.getQuestionIds().size()) {
////            s.setFinished(true);
////            s.setFinishedAt(LocalDateTime.now());
////        }
//        s.setCurrentIndex(s.getCurrentIndex() + 1);
//
//        if (s.getCurrentIndex() < s.getQuestionIds().size()) {
//            s.setFinished(false);
//        } else {
//            s.setFinished(true);
//            s.setFinishedAt(LocalDateTime.now());
//        }
//
//        sessionRepository.save(s);
//
//        return saved;
//    }
//
//    // Build evaluation prompt — be explicit
//    private String buildEvaluationPrompt(String questionText, String candidateAnswer) {
//        return "You are a strict senior interviewer. Evaluate the candidate's answer and return the result in the following format exactly:\n\n" +
//                "SCORE: <number between 0 and 10>\n" +
//                "FEEDBACK: <one-sentence feedback explaining the score>\n\n" +
//                "Question: " + questionText + "\n\n" +
//                "Candidate Answer: " + candidateAnswer + "\n\n" +
//                "Be brief and factual.";
//    }
//
//    // get session summary
//    public Map<String,Object> getSessionSummary(String sessionId) {
//        InterviewSession s = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
//        List<CandidateAnswer> answers = answerRepository.findBySessionIdOrderByAnsweredAtAsc(sessionId);
//
//        double avg = answers.stream().mapToDouble(CandidateAnswer::getScore).average().orElse(0.0);
//
////        List<Map<String,Object>> items = answers.stream().map(a -> Map.of(
////                "questionText", a.getQuestionText(),
////                "answerText", a.getAnswerText(),
////                "score", a.getScore(),
////                "feedback", a.getFeedback()
////        )).collect(Collectors.toList());
//        List<Map<String, Object>> items = answers.stream().map(a -> {
//            Map<String, Object> m = new HashMap<>();
//            m.put("questionText", a.getQuestionText());
//            m.put("answerText", a.getAnswerText());
//            m.put("score", a.getScore());
//            m.put("feedback", a.getFeedback());
//            return m;
//        }).toList();
//
//
//        // Optionally ask Groq for an overall summary/feedback for session
//        String overallPrompt = "Summarize candidate performance. Provide 2-sentence overall feedback and recommend next learning steps. " +
//                "Include numeric average score: " + avg;
//        String overallFeedback = groqService.askQuestion(overallPrompt);
//
//        return Map.of(
//                "finished", false,
//                "sessionId", s.getId(),
//                "candidateName", s.getCandidateName(),
//                "topic", s.getTopic(),
//                "totalQuestions", s.getTotalQuestions(),
//                "answered", answers.size(),
//                "averageScore", avg,
//                "answers", items,
//                "overallFeedback", overallFeedback
//        );
//    }
//
//    public InterviewSession finishSession(String sessionId) {
//        InterviewSession session = sessionRepository.findById(sessionId)
//                .orElseThrow(() -> new RuntimeException("Session not found"));
//
//        if (!session.isFinished()) {
//            session.setFinished(true);
//            session.setFinishedAt(LocalDateTime.now());
//            sessionRepository.save(session);
//        }
//
//        return session;
//    }
//
//}

package com.ai.interviewassistant.service;

import com.ai.interviewassistant.model.CandidateAnswer;
import com.ai.interviewassistant.model.InterviewSession;
import com.ai.interviewassistant.model.Question;
import com.ai.interviewassistant.repository.CandidateAnswerRepository;
import com.ai.interviewassistant.repository.InterviewSessionRepository;
import com.ai.interviewassistant.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final CandidateAnswerRepository answerRepository;
    private final GroqService groqService;

    public InterviewService(InterviewSessionRepository sessionRepository,
                            QuestionRepository questionRepository,
                            CandidateAnswerRepository answerRepository,
                            GroqService groqService) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.groqService = groqService;
    }

    public InterviewSession startSession(String candidateName, String topic, String difficulty, int count) {

        // 1. Fetch or generate questions
        List<Question> availableQuestions = questionRepository.findByTopicIgnoreCase(topic);
        List<String> questionIds = new ArrayList<>();

        // If we have enough questions in DB
        if (availableQuestions != null && availableQuestions.size() >= count) {
            // Use existing questions
            for (int i = 0; i < count; i++) {
                questionIds.add(availableQuestions.get(i).getId());
            }
        } else {
            // Generate new questions
            int existing = (availableQuestions != null) ? availableQuestions.size() : 0;

            // Add existing questions first
            if (availableQuestions != null) {
                for (Question q : availableQuestions) {
                    questionIds.add(q.getId());
                }
            }

            // Generate remaining questions
            int toGenerate = count - existing;
            for (int i = 0; i < toGenerate; i++) {
                String prompt = "Generate a single " + difficulty + " level interview question about " + topic +
                        ". Return ONLY the question text, no numbering, no explanations.";

                String generatedQuestion = groqService.askQuestion(prompt).trim();

                // Save to database
                Question newQuestion = new Question();
                newQuestion.setTitle(generatedQuestion);
                newQuestion.setDescription(generatedQuestion);
                newQuestion.setTopic(topic);
                newQuestion.setDifficulty(difficulty);

                Question saved = questionRepository.save(newQuestion);
                questionIds.add(saved.getId());
            }
        }

        // 2. Create session
        InterviewSession session = new InterviewSession();
        session.setCandidateName(candidateName);
        session.setTopic(topic);
        session.setDifficulty(difficulty);
        session.setTotalQuestions(questionIds.size()); // ✅ This should be 'count'
        session.setQuestionIds(questionIds);
        session.setCurrentQuestionIndex(0);
        session.setStartedAt(LocalDateTime.now());
        session.setStatus("IN_PROGRESS");

        return sessionRepository.save(session);
    }

    public Map<String, Object> getNextQuestion(String sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
        if (session == null) {
            return Map.of("error", "Session not found");
        }

        int currentIndex = session.getCurrentQuestionIndex();
        List<String> questionIds = session.getQuestionIds();

        // Check if finished
        if (currentIndex >= questionIds.size()) {
            return Map.of("finished", true, "message", "All questions completed");
        }

        // Get current question
        String questionId = questionIds.get(currentIndex);
        Question question = questionRepository.findById(questionId).orElse(null);

        if (question == null) {
            return Map.of("error", "Question not found");
        }

        return Map.of(
                "sessionId", sessionId,
                "questionId", question.getId(),
                "questionText", question.getDescription(),
                "questionNumber", currentIndex + 1,
                "totalQuestions", questionIds.size(),
                "finished", false
        );
    }

    public CandidateAnswer submitAnswer(String sessionId, String questionId, String answerText) {
        InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
        if (session == null) {
            throw new RuntimeException("Session not found");
        }

        // Save answer
        CandidateAnswer answer = new CandidateAnswer();
        answer.setSessionId(sessionId);
        answer.setQuestionId(questionId);
        answer.setAnswerText(answerText);
        answer.setSubmittedAt(LocalDateTime.now());

        CandidateAnswer saved = answerRepository.save(answer);

        // Move to next question
        session.setCurrentQuestionIndex(session.getCurrentQuestionIndex() + 1);
        sessionRepository.save(session);

        return saved;
    }

    public Map<String, Object> getSessionSummary(String sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
        if (session == null) {
            return Map.of("error", "Session not found");
        }

        List<CandidateAnswer> answers = answerRepository.findBySessionId(sessionId);

        return Map.of(
                "sessionId", sessionId,
                "candidateName", session.getCandidateName(),
                "topic", session.getTopic(),
                "difficulty", session.getDifficulty(),
                "totalQuestions", session.getTotalQuestions(),
                "answeredQuestions", answers.size(),
                "answers", answers
        );
    }

    public InterviewSession finishSession(String sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
        if (session != null) {
            session.setStatus("COMPLETED");
            session.setCompletedAt(LocalDateTime.now());
            return sessionRepository.save(session);
        }
        return null;
    }
}
