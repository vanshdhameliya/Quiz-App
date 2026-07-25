package com.quizapp.controller;

import com.quizapp.dto.QuestionDTO;
import com.quizapp.dto.QuizDTO;
import com.quizapp.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints for managing quizzes and their questions.
 * Mirrors the "Manage Quizzes" admin page in the React frontend.
 */
@RestController
@RequestMapping("/api/admin/quizzes")
public class AdminController {

    private final QuizService quizService;

    public AdminController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<QuizDTO> getAllQuizzes() {
        return quizService.getAllQuizDtos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizDto(id));
    }

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody QuizDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.createQuizDto(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long id, @RequestBody QuizDTO dto) {
        return ResponseEntity.ok(quizService.updateQuizDto(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{quizId}/questions")
    public ResponseEntity<QuestionDTO> addQuestion(@PathVariable Long quizId, @RequestBody QuestionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.addQuestionDto(quizId, dto));
    }

    @PutMapping("/questions/{questionId}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long questionId, @RequestBody QuestionDTO dto) {
        return ResponseEntity.ok(quizService.updateQuestionDto(questionId, dto));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
}
