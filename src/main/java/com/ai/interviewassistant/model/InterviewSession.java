////package com.ai.interviewassistant.model;
////
////import org.springframework.data.annotation.Id;
////import org.springframework.data.mongodb.core.mapping.Document;
////
////import java.time.LocalDateTime;
////import java.util.List;
////
////@Document(collection = "sessions")
////public class InterviewSession {
////    @Id
////    private String id;
////    private String candidateName;
////    private String topic;
////    private String difficulty;
////    private int totalQuestions;
////    private List<String> questionIds;      // ordered list of question ids to ask
////    private int currentIndex;              // index of next question
////    private boolean finished;
////    private LocalDateTime startedAt;
////    private LocalDateTime finishedAt;
////
////    public InterviewSession() {}
////
////    // getters & setters (omitted for brevity — generate in IDE)
////    // ...
////}
//
//package com.ai.interviewassistant.model;
//
//import lombok.Data;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Data
//@Document("sessions")
//public class InterviewSession {
//    @Id
//    private String id;
//    private String candidateName;
//    private String topic;
//    private String difficulty;
//    private int totalQuestions;
//    private List<String> questionIds;
//    private int currentIndex;
//    private boolean finished;
//    private LocalDateTime startedAt;
//    private LocalDateTime finishedAt;
//}
package com.ai.interviewassistant.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "interview_sessions")
public class InterviewSession {

    @Id
    private String id;

    private String candidateName;
    private String topic;
    private String difficulty;
    private int totalQuestions;
    private List<String> questionIds;
    private int currentQuestionIndex;
    private String status; // IN_PROGRESS, COMPLETED
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}