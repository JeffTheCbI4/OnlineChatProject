package com.project.chatproject.listener;

import com.project.chatproject.messages.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class ChatEventListener {
    private static final Logger logger = LoggerFactory.getLogger(ChatEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void ConnectListener (SessionConnectedEvent event) {
        logger.info("Получено новое подключение");
    }

    @EventListener
    public void DisconnectListener (SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        logger.info("Пользователь отключился: " + username);
        Message disconnectMessage = new Message("Пользователь " + username + " покинул чат");
        messagingTemplate.convertAndSend("/topic/messages", disconnectMessage);
    }
}
