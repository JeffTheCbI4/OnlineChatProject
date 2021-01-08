package com.project.chatproject.messages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDetails {
    private String username;
    private String text;
    private String date;
    //private Image image;
}
