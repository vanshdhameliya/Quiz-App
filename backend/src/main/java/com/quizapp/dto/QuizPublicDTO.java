package com.quizapp.dto;

import java.util.List;

public class QuizPublicDTO {
    private Long id;
    private String title;
    private String description;
    private List<QuestionPublicDTO> questions;

    public QuizPublicDTO() {
    }

    public QuizPublicDTO(Long id, String title, String description, List<QuestionPublicDTO> questions) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.questions = questions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<QuestionPublicDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionPublicDTO> questions) {
        this.questions = questions;
    }
}
