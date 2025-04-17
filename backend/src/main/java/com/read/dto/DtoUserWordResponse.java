package com.read.dto;

import java.util.List;


import lombok.Data;

@Data
public class DtoUserWordResponse {
      private String userId;
      private Long articleId;
      private List<UserWordDetail> words;

      @Data
      public static class UserWordDetail {
          private String english;
          private List<String> translations; // id değil, direkt Türkçe anlamları
      }
}
