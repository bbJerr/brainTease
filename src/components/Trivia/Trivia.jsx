import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        setIsSubmitted(false); // Reset submission state
      })
      .catch(error => console.error('Error fetching trivia question:', error));
  };

  useEffect(() => {
    fetchQuestion(); // Fetch a question when the component mounts
  }, []);

  const handleSelect = answer => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setUserAnswer(selectedAnswer);
    setFeedback(selectedAnswer === correctAnswer ? 'Correct!' : 'Sorry, that\'s wrong.');
    setIsSubmitted(true); // Mark as submitted
  };

  const shuffle = array => array.sort(() => Math.random() - 0.5);

  return (
    <div className="trivia-container">
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
                disabled={!!userAnswer} // Disable if the user has already submitted an answer
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
            disabled={!selectedAnswer} // Disable if no answer is selected
          >
            Submit
          </button>
          <button
            className="skip-question"
            onClick={fetchQuestion}
            disabled={!!userAnswer} // Disable if the user has already submitted an answer
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
