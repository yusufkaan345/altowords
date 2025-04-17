package com.read.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.read.entities.UserEntities.TranslateUserWord;

public interface TranslateUserWordRepository extends JpaRepository<TranslateUserWord, Long> {
    List<TranslateUserWord> findByUserWordId(Long userWordId);
}
