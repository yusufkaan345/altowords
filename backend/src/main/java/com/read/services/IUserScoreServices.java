package com.read.services;

import java.util.List;

import com.read.dto.DtoUserScore;
import com.read.dto.DtoUserScoreAll;

public interface IUserScoreServices {
    void addScore(String userId, int addedScore,String userName);
    DtoUserScore getUserScoreDto(String userId);
    List<DtoUserScoreAll> getAllUserScoresWithUserNames();
}
