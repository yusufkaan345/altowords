package com.read.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.read.dto.DtoUserArticle;
import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;
import com.read.entities.ArticleEntities.Article;
import com.read.entities.TranslateEntities.English;
import com.read.entities.UserEntities.UserWord;
import com.read.repository.ArticleRepository;
import com.read.repository.EnglishRepository;
import com.read.repository.UserWordRepsitory;
import com.read.services.IUserWordServices;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserWordServicesImpl implements IUserWordServices {
    private final UserWordRepsitory userWordRepository;
    private final ArticleRepository articleRepository;
    private final EnglishRepository englishRepository;

    @Override
    public void saveUserWords(DtoUserWordRequest request,String firebaseUid) {
        Article article = articleRepository.findById(request.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article not found"));

        for (DtoUserWordRequest.WordDto wordDto : request.getWords()) {
            boolean exists = userWordRepository.existsByUserIdAndEnglishIdAndArticleId(
                    firebaseUid, wordDto.getEnglishId(), request.getArticleId());

            if (!exists) {
                English english = englishRepository.findById(wordDto.getEnglishId())
                        .orElseThrow(() -> new RuntimeException("English word not found"));

                UserWord userWord = new UserWord();
                userWord.setUserId(firebaseUid);
                userWord.setEnglish(english);
                userWord.setArticle(article);
                userWord.setCreatedAt(LocalDateTime.now());

                userWordRepository.save(userWord);
            }
        }
    }

    @Override
    public List<DtoUserWordResponse> getUserWordsByUserId(String userId) {
        List<UserWord> userWords = userWordRepository.findAllByUserId(userId);
        return mapToResponseDtosGroupedByArticle(userWords);
    }

    @Override
    public List<DtoUserWordResponse> getUserWordsByUserIdAndArticleId(String userId, Long articleId) {
        List<UserWord> userWords = userWordRepository.findAllByUserIdAndArticleId(userId, articleId);
        return mapToResponseDtosGroupedByArticle(userWords);
    }

   @Override
    public void deleteUserWord(String userId,Long articleId, Long englishId) {
        UserWord userWord = userWordRepository.findByUserIdAndArticleIdAndEnglishId(userId,articleId,englishId)
                .orElseThrow(() -> new RuntimeException("User word not found"));

        userWordRepository.delete(userWord);
    }


    @Override
    public List<DtoUserArticle> getArticlesByUserId(String userId) {
        return userWordRepository.findArticlesByUserId(userId);
    }

    
    private List<DtoUserWordResponse> mapToResponseDtosGroupedByArticle(List<UserWord> userWords) {
        Map<Article, List<UserWord>> grouped = userWords.stream()
                .collect(Collectors.groupingBy(UserWord::getArticle));

        List<DtoUserWordResponse> response = new ArrayList<>();

        for (Map.Entry<Article, List<UserWord>> entry : grouped.entrySet()) {
            Article article = entry.getKey();
            List<UserWord> words = entry.getValue();

            DtoUserWordResponse dto = new DtoUserWordResponse();
            dto.setArticleId(article.getId());
            dto.setArticleTitle(article.getFamily().getTitle());
            dto.setDifficulty(article.getDifficulty());
            List<DtoUserWordResponse.WordDto> wordDtos = new ArrayList<>();
            for (UserWord uw : words) {
                English english = uw.getEnglish();

                DtoUserWordResponse.WordDto wordDto = new DtoUserWordResponse.WordDto();
                wordDto.setEnglishId(english.getId());
                wordDto.setWord(english.getWord());

                List<DtoUserWordResponse.TranslationDto> translations = english.getTranslates().stream().map(t -> {
                    DtoUserWordResponse.TranslationDto td = new DtoUserWordResponse.TranslationDto();
                    td.setTurkish(t.getTurkish().getWord());
                    td.setCategory(t.getCategory().getName());
                    td.setType(t.getType().getName());
                    return td;
                }).collect(Collectors.toList());

                wordDto.setTranslates(translations);
                wordDtos.add(wordDto);
            }

            dto.setWords(wordDtos);
            response.add(dto);
        }

        return response;
    }
   

   


}
