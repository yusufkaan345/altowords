package com.read.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.read.controller.IUserScoreController;
import com.read.dto.DtoUserScore;
import com.read.dto.DtoUserScoreAll;
import com.read.services.IUserScoreServices;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
public class UserScoreControllerImpl implements IUserScoreController{
    @Autowired
    private  IUserScoreServices userScoreService;

    @PostMapping("/add")
    @Override
    public ResponseEntity<Void> addScore( HttpServletRequest httpRequest,@RequestParam int score , @RequestParam String username) {

        String userId = (String) httpRequest.getAttribute("firebaseUid");
        userScoreService.addScore(userId, score, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-score")
    public ResponseEntity<DtoUserScore> getUserScoreDto(HttpServletRequest httpRequest) {
        String userId = (String) httpRequest.getAttribute("firebaseUid");

        DtoUserScore dto = userScoreService.getUserScoreDto(userId);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @GetMapping("/all-scores")
    public ResponseEntity<List<DtoUserScoreAll>> getUserScoreDtoAll() {
        return ResponseEntity.ok(userScoreService.getAllUserScoresWithUserNames());
    }
}
