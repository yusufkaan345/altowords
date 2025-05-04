package com.read.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DtoUserScoreAll {
    private String userName;
    private Integer totalScore;
}
