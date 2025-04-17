package com.read.entities.ArticleEntities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class ArticleFamily {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "family_id")
    private Long id;

    @Column(name = "title")
    private String title; // örnek: "Perseverance on Mars"

    @Column(name = "image_link",columnDefinition = "TEXT")
    private String imageLink;

    @Column(name = "category",length = 500)
    private String category;


    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL)
    private List<Article> articles = new ArrayList<>();
}
