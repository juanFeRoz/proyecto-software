package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.ChatRoom;
import org.example.backend.repository.ChatRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository roomRepo;

    public List<ChatRoom> getAllRooms() {
        return roomRepo.findAll();
    }

    public ChatRoom createRoom(String name, String description) {
        if (roomRepo.existsByName(name)) {
            throw new IllegalArgumentException("Room already exists");
        }
        ChatRoom room = ChatRoom.builder().name(name).description(description).build();
        return roomRepo.save(room);
    }

    public ChatRoom getRoom(String name) {
        return roomRepo.findByName(name).orElseThrow();
    }
}
