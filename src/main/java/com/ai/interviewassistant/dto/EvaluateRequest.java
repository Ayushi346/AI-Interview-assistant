//package com.ai.interviewassistant.dto;
//
//public class EvaluateRequest {
//    private String question;
//    private String answer;
//
//    public EvaluateRequest() {}
//    public String getQuestion() { return question; }
//    public void setQuestion(String question) { this.question = question; }
//    public String getAnswer() { return answer; }
//    public void setAnswer(String answer) { this.answer = answer; }
//}

package com.ai.interviewassistant.dto;

public class EvaluateRequest {
    private String question;
    private String answer;

    public EvaluateRequest() {
    }

    public EvaluateRequest(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}