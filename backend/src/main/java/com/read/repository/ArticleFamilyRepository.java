package com.read.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.read.entities.ArticleEntities.ArticleFamily;


public interface ArticleFamilyRepository extends JpaRepository<ArticleFamily,Long> {
}

