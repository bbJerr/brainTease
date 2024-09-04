import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './trivia.css';

const Trivia = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchQuestion = () => {
    axios
      .get('https://opentdb.com/api.php?amount=1&type=multiple')
      .then(response => {
        const data = response.data.results[0];
        setQuestion(decodeHTML(data.question));
        setCorrectAnswer(decodeHTML(data.correct_answer));
        setAnswers(shuffle(data.incorrect_answers.map(decodeHTML).concat(decodeHTML(data.correct_answer))));
        setSelectedAnswer(null);
        setUserAnswer(null);
        setFeedback('');
        setIsSubmitted(false);
      })
      .catch(error => console.error('Error fetching trivia question:', error));
  };

  useEffect(() => {
    fetchQuestion(); 
  }, []);

  const handleSelect = answer => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setUserAnswer(selectedAnswer);
    setFeedback(selectedAnswer === correctAnswer ? 'Correct!' : 'Sorry, that\'s wrong.');
    setIsSubmitted(true); 
  };

  const handleLogout = () => {
    signOut(auth)
      .catch(error => console.error('Error signing out:', error));
  };

  const shuffle = array => array.sort(() => Math.random() - 0.5);

  return (
    <div className="trivia-container">
      <FontAwesomeIcon 
        icon={faSignOutAlt} 
        className="logout-icon" 
        onClick={handleLogout} 
        title="Logout"
      />
      <img src="/brain-tease-logo.png" alt="brain tease logo" />
      <div className="question">{question}</div>
      <div className="answers">
        {answers.map((answer, index) => (
            <button
                key={index}
                className={`answer 
                ${selectedAnswer === answer ? 'selected' : ''}
                ${isSubmitted && answer === correctAnswer ? 'correct' : ''}
                ${isSubmitted && selectedAnswer === answer && selectedAnswer !== correctAnswer ? 'incorrect' : ''}
                `}
                onClick={() => handleSelect(answer)}
                disabled={!!userAnswer}
            >
                {answer}
            </button>
        ))}
      </div>
      {!isSubmitted ? (
        <>
          <button
            className="submit-answer"
            onClick={handleSubmit}
            disabled={!selectedAnswer} 
          >
            Submit
          </button>
          <button
            className="skip-question"
            onClick={fetchQuestion}
            disabled={!!userAnswer}
          >
            Skip Question
          </button>
        </>
      ) : (
        <>
          <div className="feedback">{feedback}</div>
          <button className="next-question" onClick={fetchQuestion}>
            Next Question
          </button>
        </>
      )}
    </div>
  );
};

function decodeHTML(html) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = html;
  return textArea.value;
}

export default Trivia;
