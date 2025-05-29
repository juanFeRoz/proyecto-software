package org.example.backend.service;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Set;

@Component
public class WebSocketEventListener {
    private final WebSocketUserRegistry userRegistry;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(WebSocketUserRegistry userRegistry, SimpMessagingTemplate messagingTemplate) {
        this.userRegistry = userRegistry;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if (user != null) {
            userRegistry.addUser(user.getName());
            sendOnlineUsers();
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if (user != null) {
            userRegistry.removeUser(user.getName());
            sendOnlineUsers();
        }
    }

    private void sendOnlineUsers() {
        Set<String> onlineUsers = userRegistry.getOnlineUsers();
        messagingTemplate.convertAndSend("/topic/onlineUsers", onlineUsers);
    }
}
