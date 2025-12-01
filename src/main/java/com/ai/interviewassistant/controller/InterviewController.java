package com.ai.interviewassistant.controller;

import com.ai.interviewassistant.dto.StartSessionRequest;
import com.ai.interviewassistant.dto.SubmitAnswerRequest;
import com.ai.interviewassistant.dto.NextQuestionResponse;
import com.ai.interviewassistant.model.CandidateAnswer;
import com.ai.interviewassistant.model.InterviewSession;
import com.ai.interviewassistant.service.InterviewService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    // Start session
    @PostMapping("/start")
    public InterviewSession start(@RequestBody StartSessionRequest req) {
        return interviewService.startSession(req.getCandidateName(), req.getTopic(), req.getDifficulty(), req.getCount());
    }

    // Get next question
    @GetMapping("/next")
    public Map<String,Object> next(@RequestParam String sessionId) {
        return interviewService.getNextQuestion(sessionId);
    }

    // Submit answer
    @PostMapping("/submit")
    public CandidateAnswer submit(@RequestBody SubmitAnswerRequest req) {
        return interviewService.submitAnswer(req.getSessionId(), req.getQuestionId(), req.getAnswerText());
    }

    // Get summary
    @GetMapping("/summary")
    public Map<String,Object> summary(@RequestParam String sessionId) {
        return interviewService.getSessionSummary(sessionId);
    }

    // Optional: end session early
    @PostMapping("/end")
    public InterviewSession end(@RequestParam String sessionId) {
        InterviewSession s = interviewService.finishSession(sessionId);
        return s;
    }


}
