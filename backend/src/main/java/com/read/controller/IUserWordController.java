package com.read.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.read.dto.DtoUserArticle;
import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;

import jakarta.servlet.http.HttpServletRequest;

public interface IUserWordController {
    ResponseEntity<Void> saveUserWords( HttpServletRequest httpRequest,DtoUserWordRequest request);
    ResponseEntity<List<DtoUserWordResponse>> getUserWordsByUserId( HttpServletRequest request);
    ResponseEntity<List<DtoUserWordResponse>> getUserWordsByUserIdAndArticleId(HttpServletRequest request,Long articleId); 
    ResponseEntity<Void> deleteUserWord(HttpServletRequest request, Long articleId, Long englishId);
    ResponseEntity<List<DtoUserArticle>> getUserArticles( HttpServletRequest request);
}
