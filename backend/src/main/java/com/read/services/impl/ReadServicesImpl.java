package com.read.services.impl;

import com.read.dto.DtoArticleFamily;
import com.read.entities.ArticleEntities.ArticleFamily;
import com.read.mapper.ArticleMapper;
import com.read.repository.ArticleFamilyRepository;
import com.read.services.IReadServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadServicesImpl implements IReadServices {
    @Autowired
    private  ArticleFamilyRepository articleFamilyRepository;

    @Autowired
    private  ArticleMapper articleMapper;

    @Override
    public DtoArticleFamily saveFamily(DtoArticleFamily dto) {
        ArticleFamily family = articleMapper.toEntity(dto);
        ArticleFamily saved = articleFamilyRepository.save(family);
        return articleMapper.toDTO(saved);
    }

    @Override
    public DtoArticleFamily getFamily(Long id) {
        ArticleFamily family = articleFamilyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Family not found"));
        return articleMapper.toDTO(family);
    }

    @Override
    public List<DtoArticleFamily> getAllFamilies() {
        return articleFamilyRepository.findAll()
                .stream()
                .map(articleMapper::toDTO)
                .toList();
    }
}
