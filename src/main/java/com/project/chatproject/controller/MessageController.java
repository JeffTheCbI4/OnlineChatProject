package com.project.chatproject.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.chatproject.messages.Message;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.HashSet;
import java.util.Set;

@Getter
@Controller
public class MessageController {

    private Set<String> userList = new HashSet<>();
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/message-details")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message, SimpMessageHeaderAccessor headerAccessor,
                               @Header("simpSessionId") String sessionId) throws JsonProcessingException {
        message.setUsername(HtmlUtils.htmlEscape(message.getUsername()));
        if (message.getType().equals(Message.Type.CONNECT)){
            headerAccessor.getSessionAttributes().put("username", message.getUsername());
            ObjectMapper objectMapper = new ObjectMapper();
            String userListJSON = objectMapper.writeValueAsString(userList);
            messagingTemplate.convertAndSend("/user/queue/specific-user" + "-user" + sessionId, userListJSON);
            userList.add(message.getUsername());
            return message;
        }
        return message;
    }
}
