package com.read.dto;

import java.util.List;

import com.read.entities.TranslateEntities.DifficultyLevel;

import lombok.Data;


@Data
public class DtoUserWordResponse {
    private Long articleId;
    private String articleTitle;
    private DifficultyLevel difficulty;
    private List<WordDto> words;

    @Data
    public static class WordDto {
        private Long englishId;
        private String word;
        private List<TranslationDto> translates;
    }

    @Data
    public static class TranslationDto {
        private String turkish;
        private String category;
        private String type;
    }
}
