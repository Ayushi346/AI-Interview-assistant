package com.ai.interviewassistant.dto;

import lombok.Data;

@Data
public class StartSessionRequest {
    private String candidateName;
    private String topic;
    private String difficulty;
    private int count = 5 ;
}
