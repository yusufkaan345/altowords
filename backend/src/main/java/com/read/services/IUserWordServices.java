package com.read.services;

import java.util.List;

import com.read.dto.DtoUserArticle;
import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;


public interface IUserWordServices {
    void saveUserWords(DtoUserWordRequest request,String firebaseUid);
    List<DtoUserWordResponse> getUserWordsByUserId(String userId);
    List<DtoUserWordResponse> getUserWordsByUserIdAndArticleId(String userId, Long articleId);
    void deleteUserWord(String userId, Long articleId, Long englishId);
    List<DtoUserArticle> getArticlesByUserId(String userId);
}
