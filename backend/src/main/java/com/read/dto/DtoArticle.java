package com.read.dto;

import com.read.entities.TranslateEntities.DifficultyLevel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DtoArticle {
        private Long articleId; 
        private DifficultyLevel difficulty;
        private String content;
}