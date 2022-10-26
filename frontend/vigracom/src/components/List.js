import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import avatar from '../assets/avatar.jpg'
import ScrollToBottom from 'react-scroll-to-bottom'
import { useStateValue } from '../utils/stateProvider'

function List() {
  const [{ user }, dispatch] = useStateValue()
  const [allUsers, setAllUsers] = useState()
  const [currentUser, setCurrentUser] = useState({
    avatar: '',
    pseudo: ''
  })

  // eslint-disable-next-line no-underscore-dangle
  const _token = JSON.parse(localStorage.getItem('user'))
  const { pseudo, token } = _token

  useEffect(() => {
    const getUsers = axios({
      method: 'get',
      url: `http://localhost:8080/user/${pseudo}`,
      headers: {
        Authorization: token
      }
    })

    getUsers
      .then((response) => {
        setAllUsers(response.data.users)
      })
      .catch((err) => console.log(err))
  }, [pseudo, token])

  useEffect(() => {
    if (currentUser) {
      dispatch({
        type: 'SET_USER',
        user: currentUser
      })
    } else {
      dispatch({
        type: 'SET_USER',
        user: null
      })
    }
  }, [user, currentUser, dispatch])

  return (
    <Container>
      <div className="title">
        <h2>Liste de contacts</h2>
      </div>
      <ScrollToBottom className="scroll" mode="top">
        {allUsers
          ? // eslint-disable-next-line no-shadow
          allUsers.map((user) => (
            <div key={user.pseudo}
              className="user_item"
              onClick={() =>
                setCurrentUser({ pseudo: user.pseudo, avatar: user.avatar })
              }
            >
              <img src={user.avatar ? user.avatar : avatar} alt="avatar" />
              <div className="user_info">
                <h4>{user.pseudo}</h4>
              </div>
            </div>
          ))
          : null}
      </ScrollToBottom>
    </Container>
  )
}

const Container = styled.div`
  background-color: #fff;
  grid-column-start: 3;
  grid-column-end: 7;
  border-radius: 10px;
  padding: 2rem;
  font-family: 'Oswald', sans-serif;
  box-shadow: rgba(0, 0, 0, 0.15) 2.5px 2.5px 3.2px;

  h2 {
    margin-bottom: 0.5rem;
  }

  .scroll {
    height: 400px;

    .user_item {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom-width: 2px;
      border-bottom-style: solid;
      border-bottom-color: #c5c5c5;

      &:hover {
        transform: scaleY(1.1);
        cursor: pointer;
        opacity: 0.7;
      }
    }
  }

  img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    padding: 0.5rem;
  }
`

export default List
