package com.ai.interviewassistant.service;

import com.ai.interviewassistant.model.Answer;
import com.ai.interviewassistant.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public Answer save(String question, String answer, String topic) {
        Answer a = new Answer();
        a.setQuestion(question);
        a.setAnswer(answer);
        a.setTopic(topic);
        a.setTimestamp(LocalDateTime.now());
        return answerRepository.save(a);
    }

    public List<Answer> findAll() {
        return answerRepository.findAll();
    }
}