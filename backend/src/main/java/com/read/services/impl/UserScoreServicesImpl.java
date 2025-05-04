package com.read.services.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.read.dto.DtoUserScore;
import com.read.dto.DtoUserScoreAll;
import com.read.entities.UserEntities.DailyScore;
import com.read.entities.UserEntities.UserScore;
import com.read.mapper.ScoreMapper;
import com.read.repository.DailyScoreRepository;
import com.read.repository.UserScoreRepository;
import com.read.services.IUserScoreServices;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class UserScoreServicesImpl implements IUserScoreServices {
     
    @Autowired
    private  UserScoreRepository userScoreRepository;
    @Autowired
    private  DailyScoreRepository dailyScoreRepository;
    @Override
    public void addScore(String userId, int addedScore, String userName) {
         UserScore userScore = userScoreRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserScore newUserScore = new UserScore();
                    newUserScore.setUserId(userId);
                    return userScoreRepository.save(newUserScore);
                });

        LocalDate today = LocalDate.now();

        DailyScore dailyScore = dailyScoreRepository.findByUserScoreAndDate(userScore, today)
                .orElseGet(() -> {
                    DailyScore ds = new DailyScore();
                    ds.setUserScore(userScore);
                    ds.setDate(today);
                    return dailyScoreRepository.save(ds);
                });

        dailyScore.setScore(dailyScore.getScore() + addedScore);
        userScore.setTotalScore(userScore.getTotalScore() + addedScore);
        userScore.setUserName(userName);
        userScoreRepository.save(userScore);
        dailyScoreRepository.save(dailyScore);
    }


   
    @Override
    public DtoUserScore getUserScoreDto(String userId) {
        return userScoreRepository.findByUserId(userId)
                .map(ScoreMapper::toUserScoreDto)
                .orElse(null);
    }


    @Override
    public List<DtoUserScoreAll> getAllUserScoresWithUserNames() {
        return userScoreRepository.findAllUserScoresWithUserNames();
    }

}
