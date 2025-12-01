////package com.ai.interviewassistant.model;
////
////import org.springframework.data.annotation.Id;
////import org.springframework.data.mongodb.core.mapping.Document;
////
////import java.time.LocalDateTime;
////
////@Document(collection = "answers_history")
////public class CandidateAnswer {
////    @Id
////    private String id;
////    private String sessionId;
////    private String questionId;
////    private String questionText;
////    private String answerText;
////    private double score;        // numeric score (0-10)
////    private String feedback;     // short feedback text from Groq
////    private LocalDateTime answeredAt;
////
////    public CandidateAnswer() {}
////    // getters & setters ...
////}
//
//
//package com.ai.interviewassistant.model;
//
//import lombok.Data;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.time.LocalDateTime;
//
//@Data
//@Document("answers")
//public class CandidateAnswer {
//
//    @Id
//    private String id;
//    private String sessionId;
//    private String questionId;
//    private String questionText;
//    private String answerText;
//    private double score;
//    private String feedback;
//    private LocalDateTime answeredAt;
//}
package com.ai.interviewassistant.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Document(collection = "candidate_answers")
public class CandidateAnswer {

    @Id
    private String id;

    private String sessionId;
    private String questionId;
    private String answerText;
    private LocalDateTime submittedAt;
}