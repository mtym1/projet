import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery,useMutation } from '@apollo/client';
import { useInterval, useLockBodyScroll } from 'react-use';
import { GET_QUIZ_QUESTIONS,DELETE_QUIZ, DELETE_Quiz_propa } from '../graphql';

import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

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

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(((</p>;

  // return (
  //   <div>
  //     <h1>List of Quiz Questions</h1>
  //     {quizQuestions.map((quizQuestion) => (
  //       <div key={quizQuestion.id}>
  //         <h3>{quizQuestion.question}</h3>
  //         <p>Module: {quizQuestion.moduleName}</p>
  //         <Link to={`/quiz/${quizQuestion.id}/details`}>View Details</Link>
  //         <Link to={`/quiz/${quizQuestion.id}/stats`}>View Stats</Link>
  //         <button onClick={() => handleDeleteQuiz(quizQuestion.id)}>Delete Quiz</button>
  //       </div>
  //     ))}
  //   </div>
  // );

  

  return(
    <div class="home-page">
      {/* left */}
      <div>
        <div class='learnify-text'><span>Learnify</span></div>
        <div>
          <div class="profile-detail">
            <img src='/boutef.jpg'></img>
            <div class="username">Aniket Dange</div>
            <div class="email">AniketDange@gmail.com</div>
          </div>
          <ul class="navigation-buttons">
            <li><img src='/icons/house.svg'></img> <a href='/home'>Dashboard</a></li>
            <li><img src='/icons/time.svg'></img> <a href='/createQuestion'>Question</a></li>
            <li><img src='/icons/settings.svg'></img> <a href='/settings'>Settings</a></li>
            <li><img src='/icons/logout.svg'></img> <a href='/logout'>Logout</a></li>
          </ul>
        </div>
      </div>

      {/* right */}
      <div class="right">
        <div class="hello-text">
            <div>Hello, Aniket</div>
            <div>Today is Monday, 01 jan 2023</div>
        </div>
        <div class="three-buttons">
          <div>Add a new question <i>+</i></div>
          <div>Check live answer <i>+</i></div>
          <div>Add meeting <i>+</i></div>
        </div>
        <div class="performance">
          <div>Performance</div>
          <div>Graphique</div>
        </div>
        <div class="title">Title</div>
        <div class="results-info">
          <div><div><span></span> total</div><div>total: 80</div></div>
          <div><div><span></span>answer</div><div>answer: 60</div></div>
          <div><div><span></span>correct</div><div>correct: 45</div></div>
          <div><div><span></span>wrong</div><div>wrong: 20</div></div>
        </div>
        <div class="circles">
        <div>80%</div>
          <div>65%</div>
          <div>35%</div>
        </div>
      </div>
    </div>
  );


}
export default QuizQuestionsList;
