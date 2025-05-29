package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.service.WebSocketUserRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final WebSocketUserRegistry userRegistry;

    @GetMapping("/online")
    public Set<String> getOnlineUsers() {
        return userRegistry.getOnlineUsers();
    }
}
