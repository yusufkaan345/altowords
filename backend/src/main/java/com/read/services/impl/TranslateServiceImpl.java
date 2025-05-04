package com.read.services.impl;

import com.read.dto.DtoTranslate;
import com.read.entities.TranslateEntities.Translate;
import com.read.mapper.TranslateMapper;
import com.read.repository.TranslateRepository;
import com.read.services.ITranslateService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TranslateServiceImpl implements ITranslateService {
    private  TranslateRepository translateRepository;
    private  TranslateMapper mapper;

    public TranslateServiceImpl(TranslateRepository translateRepository, TranslateMapper mapper) {
        this.translateRepository = translateRepository;
        this.mapper = mapper;
    }
    
  
    @Override
    public List<DtoTranslate> getTranslationsByEnglishWord(String word) {
        List<Translate> translations = translateRepository.findByEnglishWord(word);
        return translations.stream()
                .map(mapper::convertToDto)
                .collect(Collectors.toList());
    }
}
