package com.read.entities.TranslateEntities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "translate")
public class Translate {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "english_id", nullable = false)
    private English english;

    @ManyToOne
    @JoinColumn(name = "turkish_id", nullable = false)
    private Turkish turkish;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private Type type;

    
}