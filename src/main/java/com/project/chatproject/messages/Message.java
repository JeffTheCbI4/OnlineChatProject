package com.project.chatproject.messages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Message {
    private String username;
    private String text;
    private Type type;
    private String image;

    public enum Type {
        CHAT,
        CONNECT,
        DISCONNECT,
    }

    public Message(String username, Type type){
        this.username = username;
        this.type = type;
    }

    public Message(String username, String text, Type type){
        this.username = username;
        this.text = text;
        this.type = type;
    }
}
