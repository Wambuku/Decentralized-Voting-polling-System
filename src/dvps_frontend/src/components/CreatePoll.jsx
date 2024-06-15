import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId } from '../declarations/dvps';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [message, setMessage] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = options.slice();
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const agent = new HttpAgent();
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
    try {
      const pollId = await actor.createPoll(question, options);
      setMessage(`Poll created with ID: ${pollId}`);
    } catch (error) {
      setMessage('Failed to create poll');
    }
  };

  return (
    <div>
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>
        <div>
          {options.map((option, index) => (
            <label key={index}>
              Option {index + 1}:
              <input type="text" value={option} onChange={(e) => handleOptionChange(index, e)} />
            </label>
          ))}
        </div>
        <button type="button" onClick={handleAddOption}>Add Option</button>
        <button type="submit">Create Poll</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreatePoll;
