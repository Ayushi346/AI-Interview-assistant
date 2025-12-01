package com.ai.interviewassistant.dto;

import java.util.List;
import java.util.Map;

public class SessionSummaryResponse {
    private String sessionId;
    private String candidateName;
    private String topic;
    private int totalQuestions;
    private int answered;
    private double averageScore;
    private List<Map<String,Object>> answers; // list of { questionText, answerText, score, feedback }
    private String overallFeedback; // short summary from Groq (optional)

    public SessionSummaryResponse() {}
    // getters/setters
}
