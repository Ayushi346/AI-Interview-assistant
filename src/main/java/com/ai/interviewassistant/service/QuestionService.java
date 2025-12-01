
package com.ai.interviewassistant.service;

import com.ai.interviewassistant.model.Question;
import com.ai.interviewassistant.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class QuestionService {

    private final QuestionRepository repo;
    private final GroqService groqService;
    private final Random random = new Random();

    public QuestionService(QuestionRepository repo, GroqService groqService) {
        this.repo = repo;
        this.groqService = groqService;
    }

    public Question getRandomQuestion() {
        List<Question> all = repo.findAll();
        if (all.isEmpty()) return null;
        return all.get(random.nextInt(all.size()));
    }

    public Question getRandomByTopic(String topic) {
        List<Question> list = repo.findByTopicIgnoreCase(topic);
        if (list.isEmpty()) return null;
        return list.get(random.nextInt(list.size()));
    }

    public Question getRandomByDifficulty(String difficulty) {
        List<Question> list = repo.findByDifficultyIgnoreCase(difficulty);
        if (list.isEmpty()) return null;
        return list.get(random.nextInt(list.size()));
    }

    public Question getById(String id) {
        return repo.findById(id).orElse(null);
    }

    public List<Question> findAll() {
        return repo.findAll();
    }

    public Question save(Question q) {
        return repo.save(q);
    }

    // Ask AI → Save to DB
    public Question askAIAndSave(String questionText) {

        // check if exists
        Question existing = (Question) repo.findByTopicIgnoreCase(questionText);
        if (existing != null) return existing;

        String aiAnswer = groqService.askQuestion(questionText);

        Question q = new Question();
        q.setTitle(questionText);
        q.setDescription(aiAnswer);
        q.setTopic("General");
        q.setDifficulty("Easy");

        return repo.save(q);
    }
}
