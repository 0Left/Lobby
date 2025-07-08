import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gameCategories from './gameCategories';

export default function HomePage({ playerName, onRequestUserInfo }) {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    time: '',
    gameType: gameCategories[0].id,
    description: '',
    playerLimit: 1
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('lobbyEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveEvents = (newEvents) => {
    localStorage.setItem('lobbyEvents', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const createEvent = (e) => {
    e.preventDefault();
    
    // Generate a unique host ID for this session
    const hostId = `host_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const event = {
      id: Date.now().toString(),
      ...newEvent,
      hostId: hostId,
      hostName: playerName,
      status: 'Waiting',
      players: [],
      createdAt: new Date().toISOString()
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);
    setNewEvent({ name: '', time: '', gameType: gameCategories[0].id, description: '', playerLimit: 1 });
    setShowCreateForm(false);
  };

  const joinEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (event.players.length >= event.playerLimit) {
      alert('Event is full!');
      return;
    }

    // Check if user has the correct name/id for this game
    const nameKey = `lobbyUserName_${event.gameType}`;
    const idKey = `lobbyUserId_${event.gameType}`;
    const gameName = localStorage.getItem(nameKey);
    const gameId = localStorage.getItem(idKey);

    if (!gameName || !gameId) {
      onRequestUserInfo(event.gameType);
      return;
    }

    // Check if already in event
    if (event.players.some(p => p.userId === gameId)) {
      alert('You are already in this event!');
      return;
    }

    const updatedEvents = events.map(e => 
      e.id === eventId 
        ? { ...e, players: [...e.players, { name: gameName, userId: gameId }] }
        : e
    );
    saveEvents(updatedEvents);
  };

  const deleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== eventId);
      saveEvents(updatedEvents);
    }
  };

  const getGameName = (gameId) => {
    const game = gameCategories.find(g => g.id === gameId);
    return game ? game.name : gameId;
  };

  return (
    <div>
      <h2>Welcome, {playerName}!</h2>
      
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create Event'}
      </button>

      {showCreateForm && (
        <form onSubmit={createEvent}>
          <h3>Create New Event</h3>
          <div>
            <label>Name:</label>
            <input 
              value={newEvent.name} 
              onChange={e => setNewEvent({...newEvent, name: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label>Time:</label>
            <input 
              type="datetime-local" 
              value={newEvent.time} 
              onChange={e => setNewEvent({...newEvent, time: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label>Game Type:</label>
            <select
              value={newEvent.gameType}
              onChange={e => setNewEvent({...newEvent, gameType: e.target.value})}
              required
            >
              {gameCategories.map(game => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Description:</label>
            <textarea 
              value={newEvent.description} 
              onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label>Player Limit:</label>
            <input 
              type="number" 
              min="1" 
              value={newEvent.playerLimit} 
              onChange={e => setNewEvent({...newEvent, playerLimit: parseInt(e.target.value)})} 
              required 
            />
          </div>
          <button type="submit">Create Event</button>
        </form>
      )}

      <h3>Available Events</h3>
      {events.length === 0 ? (
        <p>No events available. Create the first event!</p>
      ) : (
        events.map(event => (
          <div key={event.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{event.name}</h4>
            <p><strong>Host:</strong> {event.hostName}</p>
            <p><strong>Time:</strong> {new Date(event.time).toLocaleString()}</p>
            <p><strong>Game:</strong> {getGameName(event.gameType)}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Status:</strong> {event.status}</p>
            <p><strong>Players:</strong> {event.players.length}/{event.playerLimit}</p>
            <button onClick={() => joinEvent(event.id)} disabled={event.players.length >= event.playerLimit}>
              Join
            </button>
            <Link to={`/event/${event.id}`}>View Details</Link>
            {event.hostName === playerName && (
              <button onClick={() => deleteEvent(event.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                Delete Event
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
} 