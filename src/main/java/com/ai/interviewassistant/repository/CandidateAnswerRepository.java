//package com.ai.interviewassistant.repository;
//
//import com.ai.interviewassistant.model.CandidateAnswer;
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//import java.util.List;
//
//public interface CandidateAnswerRepository extends MongoRepository<CandidateAnswer, String> {
//    List<CandidateAnswer> findBySessionIdOrderByAnsweredAtAsc(String sessionId);
//}

package com.ai.interviewassistant.repository;

import com.ai.interviewassistant.model.CandidateAnswer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateAnswerRepository extends MongoRepository<CandidateAnswer, String> {
    List<CandidateAnswer> findBySessionId(String sessionId);
}