package com.ai.interviewassistant.dto;

import lombok.Getter;

import java.util.List;

public class ChatResponse {
    private List<Choice> choices;

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    @Getter
    public static class Choice {
        private Message message;

        public void setMessage(Message message) {
            this.message = message;
        }
    }
}
