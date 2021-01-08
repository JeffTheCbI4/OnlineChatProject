package com.project.chatproject.controller;

import com.project.chatproject.messages.Message;
import com.project.chatproject.messages.MessageDetails;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class MessageController {

    @MessageMapping("/message-details")
    @SendTo("/topic/messages")
    public Message message(MessageDetails messageDetails) throws InterruptedException {
        Thread.sleep(1000);
        return new Message("[" + messageDetails.getDate() + "] " +
                HtmlUtils.htmlEscape(messageDetails.getUsername()) + ": " +
                messageDetails.getText());
    }
}
