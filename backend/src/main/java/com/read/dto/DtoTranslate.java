package com.read.dto;

import lombok.Data;

@Data
public class DtoTranslate {
    private Long translateId;  
    private String english;
    private String turkish;
    private String type;
    private String category;

}