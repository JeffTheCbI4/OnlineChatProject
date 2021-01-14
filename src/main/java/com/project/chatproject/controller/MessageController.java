package com.project.chatproject.controller;

import com.project.chatproject.messages.Message;
import com.project.chatproject.messages.MessageDetails;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class MessageController {

    @MessageMapping("/message-details")
    @SendTo("/topic/messages")
    public Message sendMessage(MessageDetails messageDetails) {
        return new Message(HtmlUtils.htmlEscape(messageDetails.getUsername()) + ": " +
                messageDetails.getText());
    }

    @MessageMapping("/users/connect")
    @SendTo("/topic/messages")
    public Message userConnect(MessageDetails messageDetails, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", messageDetails.getUsername());
        return new Message("Пользователь " + HtmlUtils.htmlEscape(messageDetails.getUsername())
                + " присоединился к чату!");
    }
}
