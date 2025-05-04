package com.read.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DtoArticleFamily {
    
    private String title;
    private String imageLink;
    private String category;
    private List<DtoArticle> articles;

}
