package com.read.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoUserScore {
    private String userId; // Firebase Auth ile eşleşecek kullanıcı ID
    private String userName;
    private Integer totalScore;
    private List<DtoDailyScore> dailyScores;
}
