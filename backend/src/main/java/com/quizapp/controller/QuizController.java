package com.quizapp.controller;

import com.quizapp.dto.AnswerSubmissionDTO;
import com.quizapp.dto.QuizPublicDTO;
import com.quizapp.dto.ResultDTO;
import com.quizapp.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public-facing endpoints used by quiz takers. Correct answers are never
 * exposed here — only {@link AdminController} returns them.
 */
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    /** Lightweight list for the "browse quizzes" page: no questions/answers included. */
    @GetMapping
    public List<Map<String, Object>> getAllQuizzes() {
        return quizService.getPublicQuizSummaries();
    }

    /** Returns quiz questions and options only — correct answers are stripped out. */
    @GetMapping("/{id}/play")
    public QuizPublicDTO getQuizForPlay(@PathVariable Long id) {
        return quizService.getQuizForPlay(id);
    }

    /** Grades the submitted answers server-side and returns the score. */
    @PostMapping("/{id}/submit")
    public ResultDTO submitAnswers(@PathVariable Long id, @RequestBody AnswerSubmissionDTO submission) {
        return quizService.evaluate(id, submission);
    }
}
