package com.read.mapper;

import com.read.dto.DtoTranslate;
import com.read.entities.TranslateEntities.Translate;

import org.springframework.stereotype.Component;


@Component
public class TranslateMapper {

    public DtoTranslate convertToDto(Translate translate) {
        DtoTranslate dto = new DtoTranslate();
        dto.setTranslateId(translate.getId());
        dto.setEnglish(translate.getEnglish().getWord());
        dto.setEnglishId(translate.getEnglish().getId());
        dto.setTurkish(translate.getTurkish().getWord());
        dto.setType(translate.getType().getName());
        dto.setCategory(translate.getCategory().getName());
        return dto;
    }
}
