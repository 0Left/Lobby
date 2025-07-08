import { useState } from 'react';

export default function NamePrompt({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('lobbyPlayerName', name.trim());
      onSubmit(name.trim());
    }
  };

  return (
    <div className="name-prompt">
      <h2>Welcome to Lobby App</h2>
      <p>Please enter your name to get started:</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Name:</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter your name"
            required 
          />
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
} 