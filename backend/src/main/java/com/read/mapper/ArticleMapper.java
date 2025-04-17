package com.read.mapper;

import com.read.dto.DtoArticle;
import com.read.dto.DtoArticleFamily;
import com.read.entities.ArticleEntities.Article;
import com.read.entities.ArticleEntities.ArticleFamily;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ArticleMapper {

    public ArticleFamily toEntity(DtoArticleFamily dto) {
        ArticleFamily family = new ArticleFamily();
        family.setTitle(dto.getTitle());
        family.setCategory(dto.getCategory());
        family.setImageLink(dto.getImageLink());

        List<Article> articles = dto.getArticles().stream().map(articleDTO -> {
            Article article = new Article();
            
            article.setContent(articleDTO.getContent());
            article.setDifficulty(articleDTO.getDifficulty());
            article.setFamily(family);
            return article;
        }).toList();

        family.setArticles(articles);
        return family;
    }

    public DtoArticleFamily toDTO(ArticleFamily family) {
        DtoArticleFamily dto = new DtoArticleFamily();
        dto.setTitle(family.getTitle());
        dto.setCategory(family.getCategory());
        dto.setImageLink(family.getImageLink());

        List<DtoArticle> articleDTOs = family.getArticles().stream().map(article -> {
            DtoArticle articleDTO = new DtoArticle();
            articleDTO.setArticleId(article.getId());
            articleDTO.setContent(article.getContent());
            articleDTO.setDifficulty(article.getDifficulty());
            return articleDTO;
        }).toList();

        dto.setArticles(articleDTOs);
        return dto;
    }

    
}