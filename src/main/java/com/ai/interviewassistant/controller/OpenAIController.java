//package com.ai.interviewassistant.controller;
//
//import com.ai.interviewassistant.service.GroqService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/openai")
//public class OpenAIController {
//
//    @Autowired
//    private GroqService groqService;
//
//    @GetMapping("/ask")
//    public String ask(@RequestParam String q) {
//        return groqService.askQuestion(q);
//    }
//}

package com.ai.interviewassistant.controller;

import com.ai.interviewassistant.dto.EvaluateRequest;
import com.ai.interviewassistant.dto.GenerateRequest;
import com.ai.interviewassistant.model.Question;
import com.ai.interviewassistant.service.AnswerService;
import com.ai.interviewassistant.service.GroqService;
import com.ai.interviewassistant.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/openai")
public class OpenAIController {

    private final QuestionService questionService;
    private final GroqService groqService;
    private final AnswerService answerService;

    public OpenAIController(QuestionService questionService, GroqService groqService, AnswerService answerService) {
        this.questionService = questionService;
        this.groqService = groqService;
        this.answerService = answerService;
    }

    // 1) Random question + AI answer
    @GetMapping("/random")
    public Map<String,String> randomQnA() {
        Question q = questionService.getRandomQuestion();
        if (q == null) return Map.of("error","No questions found");
        String ai = groqService.askQuestion(q.getDescription());
        return Map.of("question", q.getDescription(), "answer", ai);
    }

    // 2) By topic
    @GetMapping("/topic")
    public Map<String,String> topicQnA(@RequestParam String name) {
        Question q = questionService.getRandomByTopic(name);
        if (q == null) return Map.of("error","No questions for topic: " + name);
        String ai = groqService.askQuestion(q.getDescription());
        return Map.of("topic", q.getTopic(), "question", q.getDescription(), "answer", ai);
    }

    // 3) Generate new question via AI and save (auto-generate)
    @PostMapping("/generate")
    public Question generateAndSave(@RequestBody GenerateRequest req) {
        String prompt = "Generate a single interview question (title + one-line description) for topic: " + req.getTopic()
                + (req.getDifficulty() != null ? " difficulty: " + req.getDifficulty() : "");
        String generated = groqService.askQuestion(prompt);
        // store as both title & description for simplicity
        Question q = new Question();
        q.setTitle(generated);
        q.setDescription(generated);
        q.setTopic(req.getTopic());
        q.setDifficulty(req.getDifficulty() == null ? "Medium" : req.getDifficulty());
        return questionService.save(q);
    }

    // 4) Evaluate candidate answer
    @PostMapping("/evaluate")
    public String evaluate(@RequestBody EvaluateRequest req) {
        String prompt = "You are an interviewer. Evaluate the candidate answer strictly and give a score (0-10) with short feedback.\n"
                + "Question: " + req.getQuestion() + "\nCandidate Answer: " + req.getAnswer();
        return groqService.askQuestion(prompt);
    }

    // 5) Save AI answer to history and return
    @GetMapping("/answer-by-id")
    public Map<String,String> answerById(@RequestParam String id) {
        Question q = questionService.getById(id);
        if (q == null) return Map.of("error","Question not found: " + id);
        String ai = groqService.askQuestion(q.getDescription());
        answerService.save(q.getDescription(), ai, q.getTopic());
        return Map.of("question", q.getDescription(), "answer", ai);
    }

    // 6) History
    @GetMapping("/history")
    public List<?> history() { return answerService.findAll(); }

    // 7) Mock interview: multiple questions
    @GetMapping("/mock")
    public List<Map<String,String>> mock(@RequestParam String topic, @RequestParam(defaultValue = "5") int count) {
        // pick 'count' questions by topic (or random fallback)
        List<Question> pool = questionService.findAll();
        // simple: pick random count from pool (improvement: pick by topic)
        java.util.List<Map<String,String>> out = new java.util.ArrayList<>();
        for (int i=0;i<Math.min(count, pool.size()); i++) {
            Question q = pool.get(i);
            String ai = groqService.askQuestion(q.getDescription());
            out.add(Map.of("question", q.getDescription(), "answer", ai));
        }
        return out;
    }
}
