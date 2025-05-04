package com.read.entities.UserEntities;

import java.time.LocalDateTime;

import com.read.entities.ArticleEntities.Article;
import com.read.entities.TranslateEntities.English;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_word",
       uniqueConstraints = @UniqueConstraint(
         name = "uc_user_english_article",
         columnNames = {"user_id", "english_id", "article_id"}
       ))
public class UserWord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false, length=100)
    private String userId;

    @ManyToOne(optional=false)
    @JoinColumn(name="english_id")
    private English english;

    @ManyToOne(optional=false)
    @JoinColumn(name="article_id")
    private Article article;

    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt = LocalDateTime.now();

   

}
