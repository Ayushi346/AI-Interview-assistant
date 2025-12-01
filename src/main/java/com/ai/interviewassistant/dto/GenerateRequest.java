package com.ai.interviewassistant.dto;

public class GenerateRequest {
    private String topic;
    private String difficulty;

    public GenerateRequest() {
    }

    public GenerateRequest(String topic, String difficulty) {
        this.topic = topic;
        this.difficulty = difficulty;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}