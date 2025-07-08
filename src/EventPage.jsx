import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gameCategories from './gameCategories';

export default function EventPage({ playerName, onRequestUserInfo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('lobbyEvents');
    if (savedEvents) {
      const allEvents = JSON.parse(savedEvents);
      setEvents(allEvents);
      const foundEvent = allEvents.find(e => e.id === id);
      setEvent(foundEvent);
    }
  }, [id]);

  const saveEvents = (newEvents) => {
    localStorage.setItem('lobbyEvents', JSON.stringify(newEvents));
    setEvents(newEvents);
    setEvent(newEvents.find(e => e.id === id));
  };

  const joinEvent = () => {
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
      e.id === id 
        ? { ...e, players: [...e.players, { name: gameName, userId: gameId }] }
        : e
    );
    saveEvents(updatedEvents);
  };

  const leaveEvent = () => {
    if (!event) return;
    
    // Find the player's game-specific ID for this event
    const nameKey = `lobbyUserName_${event.gameType}`;
    const idKey = `lobbyUserId_${event.gameType}`;
    const gameId = localStorage.getItem(idKey);

    if (!gameId) return;

    const updatedEvents = events.map(e => 
      e.id === id 
        ? { ...e, players: e.players.filter(p => p.userId !== gameId) }
        : e
    );
    saveEvents(updatedEvents);
  };

  const updateStatus = (newStatus) => {
    const updatedEvents = events.map(e => 
      e.id === id ? { ...e, status: newStatus } : e
    );
    saveEvents(updatedEvents);
  };

  const deleteEvent = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== id);
      localStorage.setItem('lobbyEvents', JSON.stringify(updatedEvents));
      navigate('/');
    }
  };

  if (!event) {
    return <div>Event not found</div>;
  }

  const isHost = event.hostName === playerName;
  const game = gameCategories.find(g => g.id === event.gameType);
  
  // Check if player is in this event
  const nameKey = `lobbyUserName_${event.gameType}`;
  const idKey = `lobbyUserId_${event.gameType}`;
  const gameId = localStorage.getItem(idKey);
  const isPlayer = gameId ? event.players.some(p => p.userId === gameId) : false;
  const isFull = event.players.length >= event.playerLimit;

  return (
    <div>
      <Link to="/">← Back to Home</Link>
      
      <h2>{event.name}</h2>
      <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
        <p><strong>Host:</strong> {event.hostName}</p>
        <p><strong>Time:</strong> {new Date(event.time).toLocaleString()}</p>
        <p><strong>Game Type:</strong> {game ? game.name : event.gameType}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Players:</strong> {event.players.length}/{event.playerLimit}</p>
        
        {isHost && (
          <div>
            <h4>Host Controls</h4>
            <select value={event.status} onChange={(e) => updateStatus(e.target.value)}>
              <option value="Waiting">Waiting</option>
              <option value="In Progress">In Progress</option>
              <option value="Full">Full</option>
              <option value="Ended">Ended</option>
            </select>
            <button onClick={deleteEvent} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
              Delete Event
            </button>
          </div>
        )}

        <h4>Players</h4>
        <ul>
          {event.players.map(player => (
            <li key={player.userId}>
              {player.name} {player.name === event.hostName ? '(Host)' : ''}
            </li>
          ))}
        </ul>

        {!isPlayer && !isFull && (
          <button onClick={joinEvent}>Join Event</button>
        )}
        {isPlayer && (
          <button onClick={leaveEvent}>Leave Event</button>
        )}
        {isFull && !isPlayer && (
          <p>Event is full!</p>
        )}
      </div>
    </div>
  );
} 