package com.read.controller;

import com.read.dto.DtoTranslate;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ITranslateController {
    ResponseEntity<List<DtoTranslate>> getTranslations(String englishWord);
}