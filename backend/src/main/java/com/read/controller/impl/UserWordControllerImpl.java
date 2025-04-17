package com.read.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.read.controller.IUserWordController;
import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;
import com.read.services.IUserWordServices;

@RestController
@RequestMapping("/api/user-word")
public class UserWordControllerImpl implements IUserWordController{

    @Autowired
    private IUserWordServices userWordServices;

    @Override
    @PostMapping("/save")
    public ResponseEntity<Void> saveUserWords(@RequestBody DtoUserWordRequest request) {
        userWordServices.saveUserWords(request);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping("/getall")
    public ResponseEntity<List<DtoUserWordResponse>> getUserWords(@RequestParam String userId) {
        List<DtoUserWordResponse> response = userWordServices.getUserWordsByUser(userId);
        if (response.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/get")
    public ResponseEntity<List<DtoUserWordResponse>> getUserWordsByUserAndArticle(@RequestParam String userId,
                                                                                   @RequestParam Long articleId) {
        List<DtoUserWordResponse> response = userWordServices.getUserWordsByUserAndArticle(userId, articleId);
        if (response.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }
}
