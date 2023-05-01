import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery,useMutation } from '@apollo/client';
import { useInterval, useLockBodyScroll } from 'react-use';
import { GET_QUIZ_QUESTIONS,DELETE_QUIZ, DELETE_Quiz_propa } from '../graphql';

function QuizQuestionsList() {
  const { loading, error, data,refetch } = useQuery(GET_QUIZ_QUESTIONS);
  useInterval(() => {
    refetch();
  }, 100);
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    if (data && data.quizs) {
      setQuizQuestions(data.quizs);
    }
  }, [data]);
  const [deleteQuiz] = useMutation(DELETE_QUIZ);
  const [deleteQuizpropa] = useMutation(DELETE_Quiz_propa);
  const handleDeleteQuiz = (quizId) => {
    deleteQuizpropa({
      variables: {
        questionid: quizId
      }
    }).then((result) => {
      console.log(result.data.deleteQuizpropa.message);
      // update the list of quiz questions after deleting a quiz
    }).catch((error) => {
      console.log(error);
    });
    deleteQuiz({
      variables: {
        quizId: quizId
      }
    }).then((result) => {
      console.log(result.data.deleteQuiz.message);
      // update the list of quiz questions after deleting a quiz
    }).catch((error) => {
      console.log(error);
    });
  }


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(((</p>;

  return (
    <div>
      <h1>List of Quiz Questions</h1>
      {quizQuestions.map((quizQuestion) => (
        <div key={quizQuestion.id}>
          <h3>{quizQuestion.question}</h3>
          <p>Module: {quizQuestion.moduleName}</p>
          <Link to={`/quiz/${quizQuestion.id}/details`}>View Details</Link>
          <Link to={`/quiz/${quizQuestion.id}/stats`}>View Stats</Link>
          <button onClick={() => handleDeleteQuiz(quizQuestion.id)}>Delete Quiz</button>
        </div>
      ))}
    </div>
  );
}
export default QuizQuestionsList;
