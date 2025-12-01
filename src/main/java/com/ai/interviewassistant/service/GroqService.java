package com.ai.interviewassistant.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {
    private final WebClient webClient;

    public GroqService() {
        String key = System.getenv("GROQ_API_KEY");
        System.out.println("GROQ_API_KEY loaded: " + (key != null ? "YES" : "NO"));
        this.webClient = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String askQuestion(String prompt) {
        String apiKey = System.getenv("GROQ_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("GROQ_API_KEY not set in environment");
        }

//        Map<String, Object> request = Map.of(
//                "model", "llama3-8b-8192",
//                "messages", List.of(Map.of("role", "user", "content", prompt)),
//                "max_tokens", 300
//        );

        Map<String, Object> request = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "max_tokens", 500
        );


        JsonNode resp = webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (resp == null || resp.get("choices") == null || !resp.get("choices").isArray()) {
            throw new RuntimeException("Invalid response from Groq");
        }

        return resp.get("choices").get(0).get("message").get("content").asText();
    }
}
