package com.read.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.read.entities.TranslateEntities.Translate;

import java.util.List;

public interface TranslateRepository extends JpaRepository<Translate, Long> {

    @Query("SELECT t FROM Translate t WHERE LOWER(t.english.word) = LOWER(:englishWord)")
    List<Translate> findByEnglishWord(@Param("englishWord") String englishWord);

  
}