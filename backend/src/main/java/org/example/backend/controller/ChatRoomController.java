package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.ChatRoom;
import org.example.backend.service.ChatRoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    @GetMapping
    public List<ChatRoom> listRooms() {
        return chatRoomService.getAllRooms();
    }

    @PostMapping
    public ChatRoom createRoom(@RequestBody ChatRoom room) {
        return chatRoomService.createRoom(room.getName(), room.getDescription());
    }
}
