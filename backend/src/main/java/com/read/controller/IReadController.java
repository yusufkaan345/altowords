package com.read.controller;

import com.read.dto.DtoArticleFamily;
import org.springframework.http.ResponseEntity;


import java.util.List;

public interface IReadController {
    public ResponseEntity<DtoArticleFamily> save( DtoArticleFamily dto);
    public ResponseEntity<DtoArticleFamily> getOne( Long id);
    public ResponseEntity<List<DtoArticleFamily>> getAll();
}
