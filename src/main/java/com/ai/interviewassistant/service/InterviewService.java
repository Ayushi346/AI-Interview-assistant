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
