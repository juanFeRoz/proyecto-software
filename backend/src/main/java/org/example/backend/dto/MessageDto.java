package org.example.backend.dto;

import lombok.Data;

@Data
public class MessageDto {
    private String sender;
    private String recipient;
    private String content;
    private String timestamp;
}
