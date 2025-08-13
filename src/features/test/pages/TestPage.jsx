import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchQuestions, setAnswer, setCurrentQuestion, submitAnswers } from '../testSlice';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Button from '../../../shared/components/Button';

const TestPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    questions, 
    currentQuestionIndex, 
    answers,
    isLoading,
    error 
  } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleAnswer = (questionId, answerId) => {
    dispatch(setAnswer({ questionId, answer: answerId }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(setCurrentQuestion(currentQuestionIndex + 1));
    } else {
      dispatch(submitAnswers(answers)).then(() => {
        navigate('/test/result');
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestion(currentQuestionIndex - 1));
    }
  };

  if (isLoading) {
    return <Loading>테스트를 불러오는 중...</Loading>;
  }

  if (error) {
    return <Error>{error}</Error>;
  }

  if (!questions.length) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <Container>
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={questions.length} 
      />
      <QuestionCard
        question={currentQuestion}
        currentAnswer={currentAnswer}
        onAnswer={handleAnswer}
      />
      <ButtonContainer>
        <Button 
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          이전
        </Button>
        <Button
          onClick={handleNext}
          disabled={!currentAnswer}
        >
          {isLastQuestion ? '결과 보기' : '다음'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const Error = styled.div`
  color: var(--error-color);
  text-align: center;
  padding: 2rem;
`;

export default TestPage;
