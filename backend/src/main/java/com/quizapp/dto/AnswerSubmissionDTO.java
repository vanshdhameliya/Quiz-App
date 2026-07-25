package com.quizapp.dto;

import java.util.Map;

public class AnswerSubmissionDTO {

    /** Map of questionId -> selected option index. */
    private Map<Long, Integer> answers;

    public Map<Long, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }
}
