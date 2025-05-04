package com.read.controller.impl;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.read.controller.IUserWordController;
import com.read.dto.DtoUserArticle;
import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;
import com.read.services.IUserWordServices;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/user-word")
@RequiredArgsConstructor
public class UserWordControllerImpl implements IUserWordController{

    @Autowired
    private  IUserWordServices userWordService;

    @PostMapping("/save")
    public ResponseEntity<Void> saveUserWords(HttpServletRequest httpRequest,@RequestBody DtoUserWordRequest request) {
        String userId = (String) httpRequest.getAttribute("firebaseUid");
        userWordService.saveUserWords(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/delete/{articleId}/{englishId}")
    public ResponseEntity<Void> deleteUserWord(HttpServletRequest request,@PathVariable Long articleId, @PathVariable Long englishId) {
        String userId = (String) request.getAttribute("firebaseUid");
        userWordService.deleteUserWord(userId, articleId, englishId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

     // ✅ GET: Belirli bir kullanıcıya ait tüm kelimeleri getir
    @GetMapping("words")
    public ResponseEntity<List<DtoUserWordResponse>> getUserWordsByUserId(HttpServletRequest request) {
        String userId = (String) request.getAttribute("firebaseUid"); // FirebaseTokenFilter'dan geliyor
        List<DtoUserWordResponse> words = userWordService.getUserWordsByUserId(userId);
        return ResponseEntity.ok(words);
    }

     // ✅ GET: Belirli bir kullanıcı + makaleye ait kelimeleri getir
     @GetMapping("/article/{articleId}")
     public ResponseEntity<List<DtoUserWordResponse>> getUserWordsByUserIdAndArticleId(
              HttpServletRequest request,
             @PathVariable Long articleId) {
         
         String userId = (String) request.getAttribute("firebaseUid");        
         List<DtoUserWordResponse> words = userWordService.getUserWordsByUserIdAndArticleId(userId, articleId);
         return ResponseEntity.ok(words); 
     }

    // ✅ GET: Belirli bir kullanıcıya ait makaleleriN idsini getir
     @GetMapping("/articles")
    public ResponseEntity<List<DtoUserArticle>> getUserArticles(HttpServletRequest request) {
        String userId = (String) request.getAttribute("firebaseUid");
        List<DtoUserArticle> articles = userWordService.getArticlesByUserId(userId);
        return ResponseEntity.ok(articles);
    }

}
