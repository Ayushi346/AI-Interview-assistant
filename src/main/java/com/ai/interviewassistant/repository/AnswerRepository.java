//package com.ai.interviewassistant.repository;
//
//import com.ai.interviewassistant.model.Answer;
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//public interface AnswerRepository extends MongoRepository<Answer, String> {}

package com.ai.interviewassistant.repository;

import com.ai.interviewassistant.model.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends MongoRepository<Answer, String> {
}