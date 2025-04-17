package com.read.services;

import com.read.dto.DtoArticleFamily;

import java.util.List;

public interface IReadServices {

    public DtoArticleFamily saveFamily(DtoArticleFamily dto);
    public DtoArticleFamily getFamily(Long id);
    public List<DtoArticleFamily> getAllFamilies();
}
