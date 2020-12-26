package ru.sbrf.chatproject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Setter @Getter private String from;
    @Setter @Getter private String to;
    @Setter @Getter private String content;


}
