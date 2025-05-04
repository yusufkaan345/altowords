package com.read.entities.ArticleEntities;

import com.read.entities.TranslateEntities.DifficultyLevel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Articles")
public class Article {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty")
    private DifficultyLevel difficulty; // A1_A2, B1_B2, C1_C2 gibi

    @Column(name="content",columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private ArticleFamily family;
}
