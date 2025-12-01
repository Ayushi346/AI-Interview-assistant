//////package com.ai.interviewassistant.model;
//////
//////import lombok.Data;
//////import org.springframework.data.annotation.Id;
//////import org.springframework.data.mongodb.core.mapping.Document;
//////
//////@Data
//////@Document(collection = "questions")
//////public class Question {
//////
//////    @Id
//////    private String id;
//////
//////    private String title;
//////    private String description;
//////    private String difficulty;
//////    private String topic;
//////
//////}
////
////package com.ai.interviewassistant.model;
////
////import org.springframework.data.annotation.Id;
////import org.springframework.data.mongodb.core.mapping.Document;
////
////@Document(collection = "questions")
////public class Question {
////
////    @Id
////    private String id;
////
////    private String question;
////    private String answer;
////
////    public Question() {}
////
////    public Question(String question, String answer) {
////        this.question = question;
////        this.answer = answer;
////    }
////
////    // GETTERS + SETTERS
////
////    public String getId() { return id; }
////
////    public void setId(String id) { this.id = id; }
////
////    public String getQuestion() { return question; }
////
////    public void setQuestion(String question) { this.question = question; }
////
////    public String getAnswer() { return answer; }
////
////    public void setAnswer(String answer) { this.answer = answer; }
////}
//
//package com.ai.interviewassistant.model;
//
//import lombok.Data;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//@Data
//@Document("questions")
//public class Question {
//    @Id
//    private String id;
//    private String title;
//    private String description;
//    private String topic;
//    private String difficulty;
//}

package com.ai.interviewassistant.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("questions")
public class Question {

    @Id
    private String id;

    private String title;
    private String description;
    private String topic;
    private String difficulty;

    public Question() {}

    // ADD THIS constructor
    public Question(String title, String description) {
        this.title = title;
        this.description = description;
    }
}
