package org.example.backend.controller;

import org.example.backend.dto.ChatMessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class ChatController {
    @MessageMapping("/chat.sendMessage") // from client to server
    @SendTo("/topic/public") // from server to all subscribers
    public ChatMessageDto sendMessage(ChatMessageDto message, Principal principal) {
        message.setSender(principal.getName());
        message.setTimestamp(LocalDateTime.now().toString());
        return message;
    }
}
