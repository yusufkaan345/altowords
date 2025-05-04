package com.read.services;

import com.read.dto.DtoTranslate;

import java.util.List;

public interface ITranslateService {
    List<DtoTranslate> getTranslationsByEnglishWord(String word);
}
