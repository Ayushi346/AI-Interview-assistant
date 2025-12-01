package com.ai.interviewassistant.dto;

import org.apache.logging.log4j.message.Message;

import java.util.List;

public class chatRequest {
    private String model;
    private List<Message> messages;

    public chatRequest(String model, List<Message> messages) {
        this.model = model;
        this.messages = messages;
    }

    // getters + setters
}
