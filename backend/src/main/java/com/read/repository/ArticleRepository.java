package com.read.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.read.entities.ArticleEntities.Article;

public interface ArticleRepository  extends JpaRepository<Article, Long> {
   

}
