package com.read.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.read.entities.UserEntities.DailyScore;
import com.read.entities.UserEntities.UserScore;

public interface DailyScoreRepository extends JpaRepository<DailyScore, Long> {
    Optional<DailyScore> findByUserScoreAndDate(UserScore userScore, LocalDate date);
    List<DailyScore> findAllByUserScore(UserScore userScore);
}