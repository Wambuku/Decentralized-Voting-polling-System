import React from 'react';
import CreatePoll from './components/CreatePoll';
import VotePoll from './components/VotePoll';
import PollResults from './components/PollResults';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Voting and Polling System</h1>
      </header>
      <main>
        <CreatePoll />
        <VotePoll />
        <PollResults />
      </main>
    </div>
  );
}

export default App;
