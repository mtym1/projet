import React from 'react';
import { useQuery } from '@apollo/client';
//import { useLazyQuery } from '@apollo/client';

import { useParams } from 'react-router-dom';
import { GET_QUIZ_ITEMS_BY_QUESTION_ID, GET_AVERAGE_TIME, GET_USER_BY_ID  } from '../graphql'
import { Query } from '@apollo/react-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useInterval } from 'react-use';




function QuizStats() {
  const { id: questionId } = useParams();

  //uselazyquery
 const { data: quizItemsData,  refetch: refetchQuizItems } = useQuery(GET_QUIZ_ITEMS_BY_QUESTION_ID, {
  variables: { questionId },

});

  const { data: averageData, refetch: refetchAverageData  } = useQuery(GET_AVERAGE_TIME, {
  variables: { questionId },

  });

  useInterval(() => {
    refetchQuizItems();
    refetchAverageData();
  }, 10000);
// refresh every 10 seconds
// kol 10 secs t3awd t3ytl usequery

  if (!quizItemsData || !averageData) {
    return <p>Loading...</p>;
    
  }

  const quizItems = quizItemsData.getQuizPropaByQuestionId.quizItems;
  const totalCount = quizItemsData.getQuizPropaByQuestionId.totalCount;

  console.log(quizItems[0].question);

  const result = quizItems.reduce(
    (accumulator, item) => {
      if (item.correctAnswer === item.selectedAnswer) {
        accumulator.correctAnswers += 1;
      } else {
        accumulator.incorrectAnswers += 1;
      }
      return accumulator;
    },
    { correctAnswers: 0, incorrectAnswers: 0 }
  );

  const correctPercentage = ((result.correctAnswers / totalCount) * 100).toFixed(2);
  const incorrectPercentage = ((result.incorrectAnswers / totalCount) * 100).toFixed(2);
  const averageTime = averageData.getAverageTime.toFixed(2);






  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <p>Question : {quizItems[0].question}</p>
        <p>Total Answers: {totalCount}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '10%' }}>
          <CircularProgressbar
            value={Number(correctPercentage)}
            text={`${correctPercentage}%`}
            styles={buildStyles({
              pathColor: '#28a745',
              textColor: '#28a745',
            })}
          />
          <p>Correct Answers</p>
        </div>
        <div style={{ width: '10%' }}>
          <CircularProgressbar
            value={Number(incorrectPercentage)}
            text={`${incorrectPercentage}%`}
            styles={buildStyles({
              pathColor: '#dc3545',
              textColor: '#dc3545',
            })}
          />
          <p>Incorrect Answers</p>
        </div>
      </div>
      <p  style={{ marginTop: '2rem' }}>
    Average Time: {averageTime} minutes
  </p>
  <h3 style={{ marginTop: '2rem' }}>Answers Breakdown:</h3>
  <div style={{ marginTop: '1rem' }}>
  {quizItems.map((item) => (
  <div key={item.id}>
    <Query query={GET_USER_BY_ID} variables={{ getUserByIdId: item.userid }}>
      {({ loading, error, data }) => {
        if (loading) 
        {
           return  <p>Loading...</p>; }
        if (error) return <p>Error :(</p>;
        return (
          <>
            <p>User: {data.getUserByID.displayName}</p>
            <p>Email: {data.getUserByID.email}</p>
            <p>
              Selected Answer: {item.selectedAnswer}
              {item.correctAnswer === item.selectedAnswer && (
                <span style={{ color: 'green' }}> (Correct)</span>
              )}
              {item.correctAnswer !== item.selectedAnswer && (
                <span style={{ color: 'red' }}> (Incorrect)</span>
              )}
            </p>
            <hr />
          </>
        );
      }}
    </Query>
  </div>
))}
  </div>
</div>
);
}

export default QuizStats;
