import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import './leaderboard.css';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const currentUser = auth.currentUser;

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
        <div className="leaderboard-header">
        <FontAwesomeIcon 
          icon={faGamepad} 
          className="trivia-icon" 
          onClick={handleNavigateToTrivia} 
          title="Back to Trivia"
        />
        <h1 className="title">Leaderboard</h1>
      </div>
      <ul>
        {scores.map((score, index) => (
          <li key={index} className={score.name === currentUser?.displayName ? "highlight" : ""}>
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
