package com.ai.interviewassistant.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private final WebClient webClient;

    public OpenAIService() {

        System.out.println("GROQ_API_KEY = " + System.getenv("GROQ_API_KEY"));  // Debugging

        this.webClient = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader("Authorization", "Bearer " + System.getenv("GROQ_API_KEY"))
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String askQuestion(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "model", "llama3-8b-8192",                // correct model
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        JsonNode response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null || response.get("choices") == null) {
            return "Groq API returned no response. Probably API key missing.";
        }

        return response.get("choices")
                .get(0)
                .get("message")
                .get("content")
                .asText();
    }
}
