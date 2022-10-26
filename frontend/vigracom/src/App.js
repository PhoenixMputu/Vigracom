import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Chat from './pages/Chat'

function App() {
  const [user, setUser] = useState()
  useEffect(() => {
    setUser(localStorage.getItem('user'))
  }, [user])

  // useEffect(() => {
  //   socket.current = io('http://localhost:8080', {
  //     transportOptions: ["websocket"],
  //   });
  // })

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            <Route path="/home" index element={<Chat />} />
            <Route path="/" element={<Auth />} />
          </>
        ) : (
          <>
            <Route path="/" index element={<Auth />} />
            <Route path="home" element={<Chat />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
