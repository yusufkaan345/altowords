package com.read.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.read.dto.DtoUserScore;
import com.read.dto.DtoUserScoreAll;

import jakarta.servlet.http.HttpServletRequest;

public interface IUserScoreController {
 ResponseEntity<Void> addScore( HttpServletRequest httpRequest,int score, String userName);
 ResponseEntity<DtoUserScore> getUserScoreDto(HttpServletRequest httpRequest);
 ResponseEntity<List<DtoUserScoreAll>> getUserScoreDtoAll();
}
