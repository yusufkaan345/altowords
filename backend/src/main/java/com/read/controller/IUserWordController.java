package com.read.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;

public interface IUserWordController {

    ResponseEntity<Void> saveUserWords(DtoUserWordRequest request);
    ResponseEntity<List<DtoUserWordResponse>> getUserWords(String userId);
    ResponseEntity<List<DtoUserWordResponse>> getUserWordsByUserAndArticle(String userId, Long articleId);
}
