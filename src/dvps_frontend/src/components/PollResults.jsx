import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId } from '../declarations/dvps';

const PollResults = () => {
  const [pollId, setPollId] = useState('');
  const [poll, setPoll] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const agent = new HttpAgent();
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
    try {
      const pollData = await actor.getPoll(pollId);
      setPoll(pollData);
    } catch (error) {
      setPoll(null);
    }
  };

  return (
    <div>
      <h2>Poll Results</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Poll ID:
          <input type="text" value={pollId} onChange={(e) => setPollId(e.target.value)} />
        </label>
        <button type="submit">Get Results</button>
      </form>
      {poll && (
        <div>
          <h3>{poll.question}</h3>
          <ul>
            {poll.options.map((option, index) => (
              <li key={index}>
                {option}: {poll.votes[index]} votes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PollResults;
