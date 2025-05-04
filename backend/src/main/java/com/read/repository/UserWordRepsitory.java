package com.read.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.read.dto.DtoUserArticle;
import com.read.entities.UserEntities.UserWord;


public interface UserWordRepsitory extends JpaRepository<UserWord, Long> {
    Optional<UserWord> findByUserIdAndArticleIdAndEnglishId(String userId, Long articleId, Long englishId);

    List<UserWord> findAllByUserIdAndArticleId(String userId, Long articleId);

    List<UserWord> findAllByUserId(String userId);

    boolean existsByUserIdAndEnglishIdAndArticleId(String userId, Long englishId, Long articleId);

    @Query("SELECT DISTINCT new com.read.dto.DtoUserArticle(a.id) " +
       "FROM UserWord uw " +
       "JOIN uw.article a " +
       "WHERE uw.userId = :userId")
    List<DtoUserArticle> findArticlesByUserId(String userId);
}
