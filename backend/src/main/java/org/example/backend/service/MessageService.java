package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MessageDto;
import org.example.backend.model.ChatRoom;
import org.example.backend.model.Message;
import org.example.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository repository;

    public void save(String sender, String recipient, String content) {
        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();
        repository.save(message);
    }

    public List<MessageDto> getPublicMessages() {
        return repository.findByRecipientIsNull().stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MessageDto> getPrivateMessages(String user1, String user2) {
        return repository.findBySenderOrRecipient(user1, user1).stream()
                .filter(m ->
                        (m.getSender().equals(user1) && m.getRecipient().equals(user2)) ||
                                (m.getSender().equals(user2) && m.getRecipient().equals(user1))
                )
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(this::toDTO)
                .toList();
    }

    private MessageDto toDTO(Message message) {
        MessageDto dto = new MessageDto();
        dto.setSender(message.getSender());
        dto.setRecipient(message.getRecipient());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp().toString());
        return dto;
    }
    public List<MessageDto> getMessagesForRoom(String roomName) {
        return repository.findAll().stream()
                .filter(m -> m.getRoom() != null && m.getRoom().getName().equals(roomName))
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(this::toDTO)
                .toList();
    }

    public void saveToRoom(String sender, String content, ChatRoom room) {
        Message message = Message.builder()
                .sender(sender)
                .recipient(null)
                .content(content)
                .timestamp(LocalDateTime.now())
                .room(room)
                .build();

        repository.save(message);
    }
}
