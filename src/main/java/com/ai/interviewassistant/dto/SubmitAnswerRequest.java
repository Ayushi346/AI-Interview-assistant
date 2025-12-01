package com.ai.interviewassistant.dto;

import lombok.Data;

@Data
public class SubmitAnswerRequest {
    private String sessionId;
    private String questionId;
    private String answerText;
}
