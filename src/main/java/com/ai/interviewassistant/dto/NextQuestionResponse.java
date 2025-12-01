package com.ai.interviewassistant.dto;

public class NextQuestionResponse {
    private String sessionId;
    private String questionId;
    private String questionText;
    private int questionIndex;   // 1-based position
    private int totalQuestions;

    public NextQuestionResponse() {}
    // getters/setters
}
