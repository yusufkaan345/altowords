package com.read.controller.impl;

import com.read.controller.ITranslateController;
import com.read.dto.DtoTranslate;
import com.read.services.ITranslateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/translate")
public class TranslateControllerImpl implements ITranslateController {
    @Autowired
    private final ITranslateService translateService;

    public TranslateControllerImpl(ITranslateService translateService) {
        this.translateService = translateService;
    }

    @Override
    @GetMapping("/{englishWord}")
    public ResponseEntity<List<DtoTranslate>> getTranslations(@PathVariable String englishWord) {
        List<DtoTranslate> translations = translateService.getTranslationsByEnglishWord(englishWord);
        if (translations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(translations);
    }
}
