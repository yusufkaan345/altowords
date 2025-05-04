package com.read.controller.impl;

import com.read.controller.IReadController;
import com.read.dto.DtoArticleFamily;

import com.read.services.IReadServices;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ReadControllerImpl implements IReadController {

    @Autowired
    private  IReadServices articleService;


    @PostMapping(path = "/save")
    @Override
    public ResponseEntity<DtoArticleFamily> save(@RequestBody DtoArticleFamily dto) {
        return ResponseEntity.ok(articleService.saveFamily(dto));
    }

    @GetMapping("/{id}")
    @Override
    public ResponseEntity<DtoArticleFamily> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getFamily(id));
    }

    @GetMapping(path = "/all")
    @Override
    public ResponseEntity<List<DtoArticleFamily>> getAll() {
        return ResponseEntity.ok(articleService.getAllFamilies());
    }
}
