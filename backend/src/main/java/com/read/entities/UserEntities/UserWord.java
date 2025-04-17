package com.read.entities.UserEntities;

import java.util.ArrayList;
import java.util.List;

import com.read.entities.ArticleEntities.Article;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="user_word_list")
public class UserWord {
  
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kullanıcıyı temsil eder
    @Column(name = "user_id", nullable = false)
    private String userId;

    // Hangi makaleye ait kelimeleri işaretliyoruz
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    // UserWord - Translate (çevrilen kelimeler) ilişkisi
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_word_id") // UserWord ile Translate'leri bağla
    private List<TranslateUserWord> translateUserWords = new ArrayList<>();
  
}
