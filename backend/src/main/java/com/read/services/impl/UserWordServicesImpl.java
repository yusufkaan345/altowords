package com.read.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.read.dto.DtoUserWordRequest;
import com.read.dto.DtoUserWordResponse;
import com.read.entities.ArticleEntities.Article;
import com.read.entities.TranslateEntities.English;
import com.read.entities.TranslateEntities.Translate;
import com.read.entities.UserEntities.TranslateUserWord;
import com.read.entities.UserEntities.UserWord;
import com.read.repository.TranslateRepository;
import com.read.repository.UserWordRepository;
import com.read.services.IUserWordServices;

@Service
public class UserWordServicesImpl implements IUserWordServices {

    @Autowired
    private UserWordRepository userWordRepository;
    @Autowired
    private TranslateRepository translateRepository;

    @Override
    public void saveUserWords(DtoUserWordRequest request) {

        UserWord userWord = new UserWord();
        userWord.setUserId(request.getUserId());

        Article article = new Article();
        article.setId(request.getArticleId());
        userWord.setArticle(article);

        List<TranslateUserWord> translateUserWords = new ArrayList<>();
        if (request.getWords() == null || request.getWords().isEmpty()) {
            throw new IllegalArgumentException("Word list cannot be null or empty");
        }
        for (DtoUserWordRequest.UserWordDetail wordDetail : request.getWords()) {

            for (Long translateId : wordDetail.getTranslateIds()) {
                Translate translate = translateRepository.findById(translateId)
                        .orElseThrow(() -> new RuntimeException("Translate not found: " + translateId));

                TranslateUserWord translateUserWord = new TranslateUserWord();
                translateUserWord.setTranslate(translate);
                translateUserWord.setUserWord(userWord);
                translateUserWords.add(translateUserWord);
            }
        }

        userWord.setTranslateUserWords(translateUserWords);

        // 3. Kaydet
        userWordRepository.save(userWord);
    }

    @Override
    public List<DtoUserWordResponse> getUserWordsByUser(String userId) {
        List<UserWord> userWords = userWordRepository.findByUserId(userId);

        if (userWords.isEmpty()) {
            return Collections.emptyList();
        }

        List<DtoUserWordResponse> responses = new ArrayList<>();

        for (UserWord userWord : userWords) {
            DtoUserWordResponse dto = new DtoUserWordResponse();
            dto.setUserId(userWord.getUserId());
            dto.setArticleId(userWord.getArticle().getId());

            Map<String, List<String>> grouped = userWord.getTranslateUserWords().stream()
                    .collect(Collectors.groupingBy(
                            tuw -> {
                                English english = tuw.getTranslate().getEnglish();
                                return english != null ? english.getWord() : "UNKNOWN";
                            },
                            Collectors.mapping(tuw -> {
                                String turkish = tuw.getTranslate().getTurkish().toString();
                                return turkish != null ? turkish : "UNKNOWN";
                            }, Collectors.toList())));

            List<DtoUserWordResponse.UserWordDetail> details = grouped.entrySet().stream().map(entry -> {
                DtoUserWordResponse.UserWordDetail detail = new DtoUserWordResponse.UserWordDetail();
                detail.setEnglish(entry.getKey());
                detail.setTranslations(entry.getValue());
                return detail;
            }).collect(Collectors.toList());

            dto.setWords(details);
            responses.add(dto);
        }

        return responses;
    }

    @Override
    public List<DtoUserWordResponse> getUserWordsByUserAndArticle(String userId, Long articleId) {
        Optional<UserWord> userWordOpt = userWordRepository.findByUserIdAndArticleId(userId, articleId);

        if (userWordOpt.isEmpty()) {
            return Collections.emptyList();
        }

        UserWord userWord = userWordOpt.get();

        DtoUserWordResponse dto = new DtoUserWordResponse();
        dto.setUserId(userId);
        dto.setArticleId(articleId);

        Map<String, List<String>> grouped = userWord.getTranslateUserWords().stream()
                .collect(Collectors.groupingBy(
                        tuw -> {
                            English english = tuw.getTranslate().getEnglish();
                            return english != null ? english.getWord() : "UNKNOWN";
                        },
                        Collectors.mapping(tuw -> {
                            String turkish = tuw.getTranslate().getTurkish().toString();
                            return turkish != null ? turkish : "UNKNOWN";
                        }, Collectors.toList())));

        List<DtoUserWordResponse.UserWordDetail> details = grouped.entrySet().stream().map(entry -> {
            DtoUserWordResponse.UserWordDetail detail = new DtoUserWordResponse.UserWordDetail();
            detail.setEnglish(entry.getKey());
            detail.setTranslations(entry.getValue());
            return detail;
        }).collect(Collectors.toList());

        dto.setWords(details);

        return List.of(dto);
    }

}
