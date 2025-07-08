import { useState, useEffect } from 'react';
import gameCategories from './gameCategories';

export default function UserInfoPrompt({ onSubmit, initialGameId }) {
  const [selectedGame, setSelectedGame] = useState(initialGameId || gameCategories[0].id);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Load name/id for selected game from localStorage
    const nameKey = `lobbyUserName_${selectedGame}`;
    const idKey = `lobbyUserId_${selectedGame}`;
    setName(localStorage.getItem(nameKey) || '');
    setUserId(localStorage.getItem(idKey) || '');
  }, [selectedGame]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && userId) {
      const nameKey = `lobbyUserName_${selectedGame}`;
      const idKey = `lobbyUserId_${selectedGame}`;
      localStorage.setItem(nameKey, name);
      localStorage.setItem(idKey, userId);
      onSubmit({ name, userId, game: selectedGame });
    }
  };
  

  const game = gameCategories.find(g => g.id === selectedGame);

  return (
    <div className="user-info-prompt">
      <h2>Enter your info</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Game:</label>
          <select value={selectedGame} onChange={e => setSelectedGame(e.target.value)}>
            {gameCategories.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>{game?.playerNameLabel || 'Name'}:</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>{game?.playerIdLabel || 'ID'}:</label>
          <input value={userId} onChange={e => setUserId(e.target.value)} required />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
} 