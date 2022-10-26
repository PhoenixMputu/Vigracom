import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import avatar from '../assets/avatar.jpg'
import message from '../assets/message.gif'
import ScrollToBottom from 'react-scroll-to-bottom'
import { MdSend } from 'react-icons/md'
import { AiOutlineCamera } from 'react-icons/ai'
import { SiIconify } from 'react-icons/si'
import { ToastContainer, toast } from 'react-toastify'
import { useStateValue } from '../utils/stateProvider'
// import { io } from 'socket.io-client'

const Conversation = ({ contact, item }) => {
  const [{ socket }] = useStateValue()
  const [allMessages, setAllMessages] = useState()
  const [text, setText] = useState('')
  // eslint-disable-next-line
  // const [onlineUsers, setOnlineUsers] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [submitMessage, setSubmitMessage] = useState(false)
  const [data, setData] = useState({
    send: '',
    received: '',
    message: ''
  })

  // const debug = null

  let _token = JSON.parse(localStorage.getItem('user'))
  const { token, pseudo } = _token

  // useEffect(() => {
  //   if (submitMessage !== null) {
  //     socket.current.emit('send-message', submitMessage)
  //   }
  // }, [submitMessage])

  // useEffect(() => {
  //   socket.current = io('ws://localhost:8080')
  //   socket.current.emit('add-user', _token.pseudo)
  //   socket.current.on('get-users', (users) => setOnlineUsers(users))
  //   socket.current.on('receive-message', (data) => setAllMessages(prevState => ([...prevState, data.message])))
  // }, [debug, token])

  // console.log(allMessages)

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      send: pseudo,
      received: item,
      message: text
    }))
  }, [text, pseudo, item])

  // useEffect(() => {
  //   // test.on("received_message", (data) => {
  //   // })
  // }, [test])

  useEffect(() => {
    const getMessages = axios({
      method: 'get',
      url: `http://localhost:8080/conversation/${item}/${pseudo}`,
      headers: {
        Authorization: token
      }
    })

    getMessages
      .then((response) => {
        setAllMessages(response.data.messages)
      })
      .catch((err) => console.log(err))
  }, [item, pseudo, token])

  const sendMessage = () => {
    if (!text) {
      return toast.error('Vous ne pouvez pas envoyer un message vide', {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    const createMessage = axios({
      method: 'post',
      url: 'http://localhost:8080/conversation',
      data: data,
      headers: {
        Authorization: token
      }
    })

    setText('')

    createMessage
      .then((response) => {
        console.log('Message envoyé', response.data.message)
        socket.emit('send-msg', { receverId: item, message: data })
        setSubmitMessage(!submitMessage)
      })
      .catch((error) => console.log(error))
  }

  // if (allMessages) {
  //   const receverId = allMessages.find((received) => received !== pseudo)
  //   setSubmitMessage({...data, receverId})
  // }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Container>
      <div className="header">
        <img src={contact.avatar ? contact.avatar : avatar} alt="avatar" />
        <div className="title">
          <h3>{contact ? contact.pseudo : 'Hello'}</h3>
        </div>
      </div>
      <ScrollToBottom className="scroll content" mode="top">
        {allMessages ? (
          allMessages.length !== 0 ? (
            allMessages.map((msg) =>
              msg.send === contact ? (
                <div className="message" id="other">
                  <span className="other">o</span>
                  <div className="item">
                    <div className="message-content">
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="message" id="you">
                  <span className="other">o</span>
                  <div className="item">
                    <div className="message-content">
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <img className="gif" src={message} alt="" />
          )
        ) : (
          <img className="gif" src={message} alt="" />
        )}
        <ToastContainer />
      </ScrollToBottom>
      <div className="inputMessage">
        <div>
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <SiIconify color="white" />
          <AiOutlineCamera />
        </div>
        <button onClick={sendMessage}>
          <MdSend color="white" size={24} />
        </button>
      </div>
    </Container>
  )
}

const Container = styled.div`
  background-color: #fff;
  grid-column-start: 7;
  grid-column-end: 13;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  border-radius: 10px;
  padding: 2rem;
  font-family: 'Oswald', sans-serif;
  box-shadow: rgba(0, 0, 0, 0.15) 2.5px 2.5px 3.2px;

  h1 {
    text-align: center;
  }

  .gif {
    width: 100% !important;
    height: 90% !important;
  }

  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #c5c5c5;
    padding-bottom: 0.5rem;

    img {
      width: 50px;
      height: 50px;
      border-radius: 100%;
    }

    .title {
      margin: auto !important;

      h3 {
        text-align: center;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .message {
      width: 100%;
      display: flex;
      align-items: end;
      margin-bottom: 20px;
      margin-top: 20px;

      .item {
        padding: 0.7rem;
      }
    }

    #other {
      justify-content: flex-start;
      flex-direction: row;
      color: black;

      span {
        background-color: #cfcfcf;
        color: #cfcfcf;
        border-top-left-radius: 200%;
      }

      .item {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 10px;
        background-color: #cfcfcf;
      }
    }

    #you {
      justify-content: flex-start;
      flex-direction: row-reverse;
      color: #fff;

      span {
        background-color: #1966ff;
        color: #1966ff;
        border-top-right-radius: 200%;
      }

      .item {
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #1966ff;
      }
    }
  }

  .scroll {
    max-height: 350px;
  }

  .inputMessage {
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: #c5c5c5;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 1rem;

    div {
      width: 85%;
      padding: 0.5rem;
      background-color: #cfcfcf;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 10px;

      input {
        border: none;
        background-color: transparent;
        width: 80%;

        &:focus {
          outline: none;
        }
      }
    }

    button {
      width: 10%;
      border-radius: 10px;
      border: none;
      background-color: #1966ff;
    }
  }
`

export default Conversation
