import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiFillMessage } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useStateValue } from '../utils/stateProvider'
import { IoLogOut } from 'react-icons/io5'
import avatar from '../assets/avatar.jpg'
import 'react-toastify/dist/ReactToastify.css'

function Sidebar() {
  const [{ socket, msg }, dispatch ] = useStateValue()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [newMessgage, setNewMessgae] = useState()
  const navigate = useNavigate()
  const _token = JSON.parse(localStorage.getItem('user'))
  const { pseudo, token } = _token

  useEffect(() => {
    socket.emit('add-user', pseudo)
    socket.on('get-users', (users) => setOnlineUsers(users))
    socket.on('receive-message', (data) => setNewMessgae(data.message))
  }, [token])

  useEffect(() => {
    dispatch({
      type: 'SET_MSG',
      msg: newMessgage
    })
  }, [newMessgage, msg])

  console.log(onlineUsers)

  const logOut = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <>
      <Container>
        <div className="sidebar-top">
          <img className="user-avatar" src={_token.avatar || avatar} alt="avatar" />
          <div className="switches">
            <button type="button" className="switch messages-switch">
              <AiFillMessage color="#fff" size={30} />
            </button>
          </div>
        </div>
        <div className="sidebar-bottom">
          <button type="button" className="logout-btn" onClick={logOut}>
            <IoLogOut color="#fff" size={40} />
          </button>
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  background-color: #1966ff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  grid-column-start: 1;
  grid-column-end: 3;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-radius: 10px;

  .sidebar-top {
    margin-bottom: 2rem;
    img {
      width: 70px;
      height: 70px;
      border-radius: 100%;
      margin-right: 50px;

      &:hover {
        transform: scaleY(1.1);
        cursor: pointer;
      }
    }

    .switches {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 1.5rem;
    }

    button {
      padding: 1rem 2rem;
      background-color: #004be1;
      border: none;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-right-width: 5px;
      border-right-style: solid;
      border-right-color: #ffe921;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .sidebar-bottom {
    disply: flex;
    flex-direction: row;
    align-itme: center !important;
    justify-content: center !important;
    text-align: center !important;
    width: 100%;

    button {
      margin: auto;
      background-color: transparent;
      border: none;

      &:hover {
        cursor: pointer;
        transform: scale(1.3);
      }
    }
  }
`

export default Sidebar
