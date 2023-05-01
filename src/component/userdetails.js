import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const GET_QUIZ_BYID_QUESTION = gql`
  query Quiz($quizId: ID!) {
    quiz(id: $quizId) {
      correctAnswer
      id
      moduleName
      propositions
      question
      selectedAnswer
      time
    }
  }
`;

function QuizQuestionDetails() {
  const { id: quizId } = useParams();
const { loading, error, data } = useQuery(GET_QUIZ_BYID_QUESTION, {
  variables: { quizId },
});
  if (loading) return <p>Loading...</p>;
  if (error) return <h1>{error.message}</h1>;

  const quizQuestion = data.quiz;

  return (
    <div>

  <h1>{quizQuestion.question}</h1>
  <p>Module: {quizQuestion.moduleName}</p>
  <h2>Propositions:</h2>
  <ul>
    {Object.values(quizQuestion.propositions).map((proposition, index) => (
      <li key={index}>
        <p>Proposition {index + 1}: {proposition}</p>
      </li>
    ))}
  </ul>
  <p>Correct Proposition: {quizQuestion.correctAnswer}</p>
</div>
  );
}

export default QuizQuestionDetails;