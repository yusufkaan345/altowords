package com.read.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.read.entities.UserEntities.UserWord;

public interface UserWordRepository extends JpaRepository<UserWord,Long>{
    List<UserWord> findByUserId(String userId);

    Optional<UserWord> findByUserIdAndArticleId(String userId, Long articleId);
}
