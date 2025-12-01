//////package com.ai.interviewassistant.repository;
//////
//////import com.ai.interviewassistant.model.Question;
//////import org.springframework.data.mongodb.repository.MongoRepository;
//////
//////public interface QuestionRepository extends MongoRepository<Question, String> {
//////
//////}
////
//////package com.ai.interviewassistant.repository;
//////
//////import com.ai.interviewassistant.model.Question;
//////import org.springframework.data.mongodb.repository.MongoRepository;
//////
//////public interface QuestionRepository extends MongoRepository<Question, String> {
//////    Question findByQuestion(String question);
//////}
////
////package com.ai.interviewassistant.repository;
////
////import com.ai.interviewassistant.model.Question;
////import org.springframework.data.mongodb.repository.MongoRepository;
////import org.springframework.stereotype.Repository;
////
////import java.util.List;
////
////@Repository
////public interface QuestionRepository extends MongoRepository<Question, String> {
////    List<Question> findByTopic(String topic);
////}
//
//package com.ai.interviewassistant.repository;
//
//import org.springframework.data.mongodb.repository.MongoRepository;
//import com.ai.interviewassistant.model.Question;
//import java.util.List;
//
//public interface QuestionRepository extends MongoRepository<Question, String> {
//    List<Question> findByTopicIgnoreCase(String topic);
//}
//
//package com.ai.interviewassistant.repository;
//
//import com.ai.interviewassistant.model.Question;
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//import java.util.List;
//
//public interface QuestionRepository extends MongoRepository<Question, String> {
//
//    Question findByTitleIgnoreCase(String title);
//
//    List<Question> findByTopicIgnoreCase(String topic);
//
//    List<Question> findByTopic(String topic);
//
//    // Only keep valid fields (you DO NOT have a field named 'question')
//    // So remove findByQuestion
//}

package com.ai.interviewassistant.repository;

import com.ai.interviewassistant.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

//@Repository
//public interface QuestionRepository extends MongoRepository<Question, String> {
//
//    Question findByTitleIgnoreCase(String title);
//
//    List<Question> findByTopicIgnoreCase(String topic);
//
//    List<Question> findByDifficultyIgnoreCase(String difficulty);
//}

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {

    List<Question> findByTopicIgnoreCase(String topic);

    List<Question> findByDifficultyIgnoreCase(String difficulty);

    List<Question> findByTopicIgnoreCaseAndDifficultyIgnoreCase(String topic, String difficulty);
}
