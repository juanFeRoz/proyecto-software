package org.example.backend.repository;

import org.example.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientIsNull(); // Group messages
    List<Message> findBySenderOrRecipient(String sender, String recipient); // Private history
}
