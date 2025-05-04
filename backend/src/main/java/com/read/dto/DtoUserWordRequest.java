package com.read.dto;

import java.util.List;

import com.read.entities.TranslateEntities.DifficultyLevel;

import lombok.Data;

@Data
public class DtoUserWordRequest {
    
    private Long articleId;
    private String articleTitle; 
    private DifficultyLevel difficulty; 
    private List<WordDto> words;

    @Data
    public static class WordDto {
        private Long englishId;
        private String word;
        private List<Long> translateIds;
    }


}

