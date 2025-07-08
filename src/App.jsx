import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NamePrompt from './NamePrompt'
import UserInfoPrompt from './UserInfoPrompt'
import HomePage from './HomePage'
import EventPage from './EventPage'
import gameCategories from './gameCategories'

function App() {
  const [playerName, setPlayerName] = useState(null)
  const [pendingGame, setPendingGame] = useState(null)

  useEffect(() => {
    const savedName = localStorage.getItem('lobbyPlayerName')
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handleNameSubmit = (name) => {
    setPlayerName(name)
  }

  const handleUserSubmit = (userInfo) => {
    setPendingGame(null)
  }

  const requestUserInfo = (gameId) => {
    setPendingGame(gameId)
  }

  if (!playerName) {
    return <NamePrompt onSubmit={handleNameSubmit} />
  }

  if (pendingGame) {
    return <UserInfoPrompt onSubmit={handleUserSubmit} initialGameId={pendingGame} />
  }

  return (
    <div>
      <h1>Lobby App</h1>
      <Routes>
        <Route path="/" element={<HomePage playerName={playerName} onRequestUserInfo={requestUserInfo} />} />
        <Route path="/event/:id" element={<EventPage playerName={playerName} onRequestUserInfo={requestUserInfo} />} />
      </Routes>
    </div>
  )
}

export default App
