package com.read.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.read.dto.DtoUserScoreAll;
import com.read.entities.UserEntities.UserScore;

public interface UserScoreRepository extends JpaRepository<UserScore, Long> {
    Optional<UserScore> findByUserId(String UserId);
     @Query("SELECT new com.read.dto.DtoUserScoreAll(us.userName, us.totalScore) FROM UserScore us")
    List<DtoUserScoreAll> findAllUserScoresWithUserNames();
}

