package com.read.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.read.entities.TranslateEntities.English;

public interface EnglishRepository extends JpaRepository<English, Long> {
   

}
