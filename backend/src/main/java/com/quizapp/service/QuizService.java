package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.model.Question;
import com.quizapp.model.Quiz;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.repository.QuizRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    // ---------- Public helpers that keep lazy collections inside the transaction ----------

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPublicQuizSummaries() {
        return quizRepository.findAll().stream()
                .map(q -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", q.getId());
                    row.put("title", q.getTitle());
                    row.put("description", q.getDescription() == null ? "" : q.getDescription());
                    row.put("questionCount", q.getQuestions().size());
                    return row;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getAllQuizDtos() {
        return quizRepository.findAll().stream()
                .map(this::toAdminDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizDTO getQuizDto(Long id) {
        return toAdminDto(getQuizEntityById(id));
    }

    // ---------- Admin operations ----------

    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Quiz getQuizEntityById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with id " + id));
    }

    @Transactional
    public Quiz createQuiz(QuizDTO dto) {
        Quiz quiz = new Quiz(dto.getTitle(), dto.getDescription());
        if (dto.getQuestions() != null) {
            for (QuestionDTO qDto : dto.getQuestions()) {
                quiz.addQuestion(new Question(qDto.getQuestionText(), qDto.getOptions(), qDto.getCorrectOption()));
            }
        }
        return quizRepository.save(quiz);
    }

    @Transactional
    public QuizDTO createQuizDto(QuizDTO dto) {
        return toAdminDto(createQuiz(dto));
    }

    @Transactional
    public Quiz updateQuiz(Long id, QuizDTO dto) {
        Quiz quiz = getQuizEntityById(id);
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        return quizRepository.save(quiz);
    }

    @Transactional
    public QuizDTO updateQuizDto(Long id, QuizDTO dto) {
        return toAdminDto(updateQuiz(id, dto));
    }

    @Transactional
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    @Transactional
    public Question addQuestion(Long quizId, QuestionDTO dto) {
        Quiz quiz = getQuizEntityById(quizId);
        Question question = new Question(dto.getQuestionText(), dto.getOptions(), dto.getCorrectOption());
        quiz.addQuestion(question);
        quizRepository.save(quiz);
        return question;
    }

    @Transactional
    public QuestionDTO addQuestionDto(Long quizId, QuestionDTO dto) {
        Question question = addQuestion(quizId, dto);
        return new QuestionDTO(question.getId(), question.getQuestionText(), question.getOptions(), question.getCorrectOption());
    }

    @Transactional
    public Question updateQuestion(Long questionId, QuestionDTO dto) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id " + questionId));
        question.setQuestionText(dto.getQuestionText());
        question.setOptions(dto.getOptions());
        question.setCorrectOption(dto.getCorrectOption());
        return questionRepository.save(question);
    }

    @Transactional
    public QuestionDTO updateQuestionDto(Long questionId, QuestionDTO dto) {
        Question question = updateQuestion(questionId, dto);
        return new QuestionDTO(question.getId(), question.getQuestionText(), question.getOptions(), question.getCorrectOption());
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    /** Converts a Quiz entity into the admin DTO, which includes correct answers. */
    public QuizDTO toAdminDto(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        List<QuestionDTO> questionDtos = quiz.getQuestions().stream()
                .map(q -> new QuestionDTO(q.getId(), q.getQuestionText(), q.getOptions(), q.getCorrectOption()))
                .collect(Collectors.toList());
        dto.setQuestions(questionDtos);
        return dto;
    }

    // ---------- Public (player-facing) operations ----------

    @Transactional(readOnly = true)
    public QuizPublicDTO getQuizForPlay(Long id) {
        Quiz quiz = getQuizEntityById(id);
        List<QuestionPublicDTO> questionDtos = quiz.getQuestions().stream()
                .map(q -> new QuestionPublicDTO(q.getId(), q.getQuestionText(), q.getOptions()))
                .collect(Collectors.toList());
        return new QuizPublicDTO(quiz.getId(), quiz.getTitle(), quiz.getDescription(), questionDtos);
    }

    @Transactional(readOnly = true)
    public ResultDTO evaluate(Long quizId, AnswerSubmissionDTO submission) {
        Quiz quiz = getQuizEntityById(quizId);
        int score = 0;
        int total = quiz.getQuestions().size();

        for (Question question : quiz.getQuestions()) {
            Integer selected = submission.getAnswers() != null
                    ? submission.getAnswers().get(question.getId())
                    : null;
            if (selected != null && selected == question.getCorrectOption()) {
                score++;
            }
        }
        return new ResultDTO(score, total);
    }
}
