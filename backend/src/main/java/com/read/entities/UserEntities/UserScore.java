package com.read.entities.UserEntities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; // Firebase Auth ile eşleşecek kullanıcı ID
    private String userName; 
    private Integer totalScore = 0;

    @OneToMany(mappedBy = "userScore", cascade = CascadeType.ALL)
    private List<DailyScore> dailyScores = new ArrayList<>();
}
