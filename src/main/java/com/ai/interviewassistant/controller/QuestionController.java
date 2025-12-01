//package com.ai.interviewassistant.controller;
//
//import com.ai.interviewassistant.model.Question;
//import com.ai.interviewassistant.repository.QuestionRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Random;
//
//@RestController
//@RequestMapping("/api/questions")
//public class QuestionController {
//
//    @Autowired
//    private QuestionRepository questionRepository;
//
//    @PostMapping
//    public Question createQuestion(@RequestBody Question question) {
//        return questionRepository.save(question);
//    }
//
//    @GetMapping
//    public List<Question> getAllQuestions() {
//        return questionRepository.findAll();
//    }
//
//    @GetMapping("/{id}")
//    public Question getQuestionById(@PathVariable String id) {
//        return questionRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
//    }
//
//    @PostMapping("/register")
//    public String register(@RequestBody UserRequest request) {
//        System.out.println("Received: " + request);
//        return "OK";
//    }
//
//
//
//    @GetMapping("/random")
//    public Question getRandomQuestion() {
//        List<Question> questions = questionRepository.findAll();
//        if (questions.isEmpty()) {
//            throw new RuntimeException("No questions found in database");
//        }
//        return questions.get(new Random().nextInt(questions.size()));
//    }
//
//    @PutMapping("/{id}")
//    public Question updateQuestion(@PathVariable String id, @RequestBody Question updatedQuestion) {
//        return questionRepository.findById(id).map(question -> {
//            question.setTitle(updatedQuestion.getTitle());
//            question.setDescription(updatedQuestion.getDescription());
//            question.setDifficulty(updatedQuestion.getDifficulty());
//            question.setTopic(updatedQuestion.getTopic());
//            return questionRepository.save(question);
//        }).orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
//    }
//
//    @DeleteMapping("/{id}")
//    public String deleteQuestion(@PathVariable String id) {
//        if (!questionRepository.existsById(id)) {
//            throw new RuntimeException("Question not found with id: " + id);
//        }
//        questionRepository.deleteById(id);
//        return "Question deleted successfully";
//    }
//
//
//}

//
//package com.ai.interviewassistant.controller;
//
//import com.ai.interviewassistant.model.Question;
//import com.ai.interviewassistant.service.QuestionService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/questions")
//public class QuestionController {
//
//    private final QuestionService questionService;
//    public QuestionController(QuestionService questionService) { this.questionService = questionService; }
//
//    @PostMapping
//    public Question create(@RequestBody Question q) { return questionService.save(q); }
//
//    @GetMapping
//    public List<Question> all() { return questionService.findAll(); }
//
//    @GetMapping("/{id}")
//    public Question byId(@PathVariable String id) { return questionService.getById(id); }
//}

package com.ai.interviewassistant.controller;

import com.ai.interviewassistant.model.Question;
import com.ai.interviewassistant.service.QuestionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService service;

    public QuestionController(QuestionService service) {
        this.service = service;
    }

    @GetMapping("/random")
    public Question getRandom() {
        return service.getRandomQuestion();
    }

    @GetMapping("/ask")
    public Question ask(@RequestParam String q) {
        return service.askAIAndSave(q);
    }

    @PostMapping
    public Question create(@RequestBody Question q) {
        return service.save(q);
    }



}
