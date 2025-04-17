package com.read.dto;

import java.util.List;

import lombok.Data;

@Data
public class DtoUserWordRequest {
    private String userId;
    private Long articleId;
    private List<UserWordDetail> words;

    @Data
    public static class UserWordDetail {
        private String english;
        private List<Long> translateIds;
    }
}
