import React from 'react';
import Trivia from './components/Trivia/Trivia';
import Background from './components/Background/Background';
import './App.css';

function App() {
  return (
    <div className="App">
      <Background />
      <Trivia />
    </div>
  );
}

export default App;