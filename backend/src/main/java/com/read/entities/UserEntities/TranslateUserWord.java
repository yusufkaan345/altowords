package com.read.entities.UserEntities;

import com.read.entities.TranslateEntities.Translate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "translate_user_word")
public class TranslateUserWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Çeviri ID'si
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "translate_id", nullable = false)
    private Translate translate;

    // UserWord ID'ye bağlı olarak hangi kelimenin işaretlendiğini tutuyoruz
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_word_id", nullable = false)
    private UserWord userWord;
}
