package com.read.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.read.dto.DtoDailyScore;
import com.read.dto.DtoUserScore;
import com.read.entities.UserEntities.DailyScore;
import com.read.entities.UserEntities.UserScore;

@Component
public class ScoreMapper {
    
    public static DtoUserScore toUserScoreDto(UserScore userScore) {
        DtoUserScore dto = new DtoUserScore();
        dto.setUserId(userScore.getUserId());
        dto.setUserName(userScore.getUserName());
        dto.setTotalScore(userScore.getTotalScore());

        List<DtoDailyScore> dailyDtos = userScore.getDailyScores().stream()
            .map(ScoreMapper::toDailyScoreDto)
            .collect(Collectors.toList());
        dto.setDailyScores(dailyDtos);

        return dto;
    }

    public static DtoDailyScore toDailyScoreDto(DailyScore dailyScore) {
        DtoDailyScore dto = new DtoDailyScore();
        dto.setDate(dailyScore.getDate());
        dto.setScore(dailyScore.getScore());
        return dto;
    }
}

