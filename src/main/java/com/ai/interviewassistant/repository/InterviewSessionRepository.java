//package com.ai.interviewassistant.repository;
//
//import com.ai.interviewassistant.model.InterviewSession;
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//public interface InterviewSessionRepository extends MongoRepository<InterviewSession, String> {}

package com.ai.interviewassistant.repository;

import com.ai.interviewassistant.model.InterviewSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewSessionRepository extends MongoRepository<InterviewSession, String> {
}