//package com.ai.interviewassistant.dto;
//
//public class StartSessionRequest {
//    private String candidateName;
//    private String topic;
//    private String difficulty; // optional
//    private int count = 5;     // default
//
//    public StartSessionRequest() {}
//    // getters/setters
//}

package com.ai.interviewassistant.dto;

import lombok.Data;

@Data
public class StartSessionRequest {
    private String candidateName;
    private String topic;
    private String difficulty;
    private int count = 5 ;
}
