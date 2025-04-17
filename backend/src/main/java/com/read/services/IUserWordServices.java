package com.read.services;

import java.util.List;

import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;

public interface IUserWordServices {
     void saveUserWords(DtoUserWordRequest request);
     public List<DtoUserWordResponse> getUserWordsByUser(String userId);
     public List<DtoUserWordResponse> getUserWordsByUserAndArticle(String userId, Long articleId);
}
