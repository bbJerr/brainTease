import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import './leaderboard.css';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const leaderboardQuery = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
      const querySnapshot = await getDocs(leaderboardQuery);
      const scoresList = querySnapshot.docs.map(doc => doc.data());
      setScores(scoresList);
    };

    fetchScores();
  }, []);

  const handleNavigateToTrivia = () => {
    window.location.assign("/trivia");
  };

  return (
    <div className="leaderboard-container">
        <FontAwesomeIcon 
            icon={faGamepad} 
            className="trivia-icon" 
            onClick={handleNavigateToTrivia} 
            title="Back to Trivia"
        />
      <h1>Leaderboard</h1>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            <span className="rank" data-rank={index + 1}></span>
            <span className="name">{score.name}</span>
            <span className="score">{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
