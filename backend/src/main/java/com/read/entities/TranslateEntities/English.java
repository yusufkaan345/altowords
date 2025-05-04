package com.read.entities.TranslateEntities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;


@Entity
@Table(name = "english")
@Data
public class English {

    @Id
    private Long id;

    @Column(nullable = false)
    private String word;

    @OneToMany(mappedBy = "english", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
     private List<Translate> translates = new ArrayList<>();
}