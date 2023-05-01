import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_QUIZ_QUESTIONS, CREATE_QUIZ } from '../graphql';
import QRCode from 'qrcode.react';

function AddQuizQuestionForm() {
  const [moduleName, setModuleName] = useState('');
  const [question, setQuestion] = useState('');
  const [propositions, setPropositions] = useState({
    p1: 'Default Propo 1',
    p2: 'Default Propo 2',
  });
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [time, setTime]= useState(0);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [errorMessage, setErrorr] = useState('');

  const [createQuiz, { loading, error }] = useMutation(CREATE_QUIZ, {
    refetchQueries: [{ query: GET_QUIZ_QUESTIONS }],
  });

  const handlePropositionChange = (key, value) => {
    setPropositions({ ...propositions, [key]: value });
  };

  const handleAddProposition = (event) => {
    event.preventDefault();
    const newKey = `p${Object.keys(propositions).length + 1}`;
    setPropositions({ ...propositions, [newKey]: '' });
  };

  const handleRemoveProposition = (key) => {
    const { [key]: value, ...newPropositions } = propositions;
    setPropositions(newPropositions);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('hello');
    console.log(Object.values(moduleName).includes(''));
    
    
    if ((moduleName==='')||(question==='')) {
      const errorMessage = 'Please fill out all fields.';
    
      setErrorr(errorMessage);
      return;
    }
    if ((correctAnswer==='')) {
      const errorMessage = 'Please fill out all fields.';
    
      setErrorr(errorMessage);
      return;
    }
    const quizInput = { moduleName, question,propositions, correctAnswer, selectedAnswer,time: parseInt(time) };
    console.log(quizInput);
    createQuiz({ variables: { quizinput: quizInput } }).then((response) => {
      const qrCodeData = {
        id: response.data.createQuiz.id,
        moduleName, question, propositions, correctAnswer, selectedAnswer,time
      };
      setQRCodeData(qrCodeData);
      console.log(qrCodeData);
    });
    
    setModuleName('');
    setQuestion('');
    setPropositions({
      p1: 'Default Propo 1',
      p2: 'Default Propo 2',
    });
    setCorrectAnswer('');
    setSelectedAnswer('');
    setTime(0);
    setErrorr('');
  };

  const handleDownloadQRCode = () => {
    const qrCodeDataURL = document.getElementById('qr-code').toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = qrCodeDataURL;
    downloadLink.download = 'qr-code.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  

  return (
  <form onSubmit={handleSubmit} className="create">
  <label className="create label">
    Module Name:
  <input type="text" value={moduleName} onChange={(event) => setModuleName(event.target.value)} required/>
  </label>
  <br />
  <label className="create label">
    Question:
  <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} />
  </label>
  <br />
 <div>
  {Object.keys(propositions).map((key, index) => (
    <div key={index}>
      <label className="create label">
        Proposition {index + 1}:
        <br />
        <input type="text" value={propositions[key]} onChange={(event) => handlePropositionChange(key, event.target.value)} />
      </label>
      <br />
      <button onClick={() => handleRemoveProposition(key)}>Remove</button>
    </div>
  ))}
  <button onClick={handleAddProposition}>Add Proposition</button>
  <br />
  
  <label className="create label">
    Correct Proposition:
    <select value={correctAnswer} onChange={(event) => setCorrectAnswer(event.target.value)}>
      <option value="">Select a proposition</option>
      {Object.keys(propositions).map((key, index) => (
        <option key={index} value={propositions[key]}>
          {propositions[key]}
        </option>
      ))}
    </select>
  </label>
</div>
{errorMessage && <p>{errorMessage}</p>}
  <br />
  
  <button onClick={handleSubmit}>Submit</button>
  
  <br />
      {qrCodeData && (
        <div className="qr-code">
        <QRCode id="qr-code" value={JSON.stringify(qrCodeData)} size={250}  fontWeight={300} />
        <br />
        <button onClick={handleDownloadQRCode}>Download QR Code</button>
      </div>
      )}
      <br />
      {loading && <p>Loading.... </p>}
      {error && <p className="create error">Error creating quiz</p>}
      </form>
);
}

export default AddQuizQuestionForm;