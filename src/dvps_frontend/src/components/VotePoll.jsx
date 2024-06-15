import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId } from '../declarations/dvps';

const VotePoll = () => {
  const [pollId, setPollId] = useState('');
  const [optionIndex, setOptionIndex] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const agent = new HttpAgent();
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
    try {
      const success = await actor.vote(pollId, parseInt(optionIndex, 10));
      setMessage(success ? 'Vote cast successfully' : 'Failed to cast vote');
    } catch (error) {
      setMessage('Failed to cast vote');
    }
  };

  return (
    <div>
      <h2>Vote in a Poll</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Poll ID:
          <input type="text" value={pollId} onChange={(e) => setPollId(e.target.value)} />
        </label>
        <label>
          Option Index:
          <input type="number" value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} />
        </label>
        <button type="submit">Vote</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default VotePoll;
