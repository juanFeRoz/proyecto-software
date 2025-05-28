package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MessageDto;
import org.example.backend.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/public")
    public List<MessageDto> getPublicMessages() {
        return messageService.getPublicMessages();
    }

    @GetMapping("/private/{username}")
    public List<MessageDto> getPrivateMessages(@PathVariable String username,
                                               Principal principal) {
        return messageService.getPrivateMessages(principal.getName(), username);
    }
}
