package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MessageDto;
import org.example.backend.model.ChatRoom;
import org.example.backend.model.Message;
import org.example.backend.service.ChatRoomService;
import org.example.backend.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ChatRoomService chatRoomService;

    // Group chat
    @MessageMapping("/chat.sendMessage")
    public void sendPublicMessage(MessageDto message, Principal principal) {
        String sender = principal.getName();
        message.setSender(sender);
        message.setTimestamp(now());
        messageService.save(sender, null, message.getContent());

        messagingTemplate.convertAndSend("/topic/public", message);
    }

    // Private message
    @MessageMapping("/chat.private.{username}")
    public void sendPrivateMessage(@DestinationVariable String username,
                                   MessageDto message,
                                   Principal principal) {
        String sender = principal.getName();
        message.setSender(sender);
        message.setRecipient(username);
        message.setTimestamp(now());

        // Save to DB
        messageService.save(sender, username, message.getContent());

        messagingTemplate.convertAndSendToUser(
                username, "/queue/messages", message
        );
    }

    @MessageMapping("/chat.room.{roomName}")
    public void sendRoomMessage(@DestinationVariable String roomName,
                                Message message,
                                Principal principal) {
        String sender = principal.getName();
        message.setSender(sender);
        message.setTimestamp(LocalDateTime.now());

        ChatRoom room = chatRoomService.getRoom(roomName);

        // Save message with room
        messageService.saveToRoom(sender, message.getContent(), room);

        messagingTemplate.convertAndSend("/topic/room." + roomName, message);
    }

    private String now() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }
}
