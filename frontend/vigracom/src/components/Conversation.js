import React, { useState, useEffect, useRef } from 'react'
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
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Picker from 'emoji-picker-react'

const Conversation = ({ contact, item }) => {
  const [{ socket, msg }] = useStateValue()

  const [allMessages, setAllMessages] = useState()
  const [selectedImage, setSelectedImage] = useState()
  const [previewLink, setPreviewLink] = useState(null)
  const [submitMessage, setSubmitMessage] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [data, setData] = useState({
    send: '',
    received: '',
    message: '',
    imageUrl: ''
  })

  const messageRef = useRef()
  const imageRef = useRef()

  useEffect(() => {
    if (!msg) return
    if (!allMessages) return
    setAllMessages([...allMessages, {...msg}])
    toast.info(`Nouveau message de ${msg.send}`, {
      position: toast.POSITION.TOP_RIGHT
    })
  }, [msg])

  console.log(allMessages)

  let _token = JSON.parse(localStorage.getItem('user'))
  const { token, pseudo } = _token

  const handleChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      send: pseudo,
      received: item,
      message: e.target.value
    }))
  }

  const cancelImage = () => {
    imageRef.current.value = ''
    setSelectedImage(null)
  }

  console.log(process.env.REACT_APP_URL_API)

  useEffect(() => {
    const getMessages = axios({
      method: 'get',
      //REACT_APP_URL_API = http://localhost:8080
      url: `${process.env.REACT_APP_URL_API}/conversation/${item}/${pseudo}`,
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

  const onEmojiClick = (event) => {
    messageRef.current.value = messageRef.current.value.concat(event.emoji)
    messageRef.current.focus()
  }

  const sendMessage = async () => {
    if (!messageRef.current.value && !imageRef.current.value) {
      return toast.error('Vous ne pouvez pas envoyer un message vide', {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    if (previewLink) {
      const formData = new FormData()
      formData.append('file', previewLink)
      formData.append('upload_preset', 'vigracom')
      const response = await axios({
        method: 'post',
        url: process.env.REACT_APP_URL_CLOUDINARY,
        data: formData
      })
      // eslint-disable-next-line dot-notation
      const imageUrl = response.data['secure_url']

      const createMessage = axios({
        method: 'post',
        url: `${process.env.REACT_APP_URL_API}/conversation`,
        data: {...data, imageUrl},
        headers: {
          Authorization: token
        }
      })

      createMessage
        .then((response) => {
          console.log(response.data.message)
          socket.emit('send-msg', { receverId: item, message: response.data.message })
          setAllMessages([...allMessages, {...response.data.message}])
          setSubmitMessage(!submitMessage)
        })
        .catch((error) => console.log(error))

      imageRef.current.value = ''
      messageRef.current.value = ''
      setPreviewLink(null)
    } else {
      const createMessage = axios({
        method: 'post',
        url: `${process.env.REACT_APP_URL_API}/conversation`,
        data: data,
        headers: {
          Authorization: token
        }
      })

      createMessage
        .then((response) => {
          console.log('Message envoyé')
          socket.emit('send-msg', { receverId: item, message: response.data.message })
          setAllMessages([...allMessages, {...response.data.message}])
          setSubmitMessage(!submitMessage)
        })
        .catch((error) => console.log(error))
      imageRef.current.value = ''
      messageRef.current.value = ''
      setShowEmoji(false)
    }

    imageRef.current.value = ''
    messageRef.current.value = ''
    setPreviewLink(null)
  }

  useEffect(() => {
    if (!selectedImage) return setPreviewLink(null)
    const reader = new FileReader()
    reader.readAsDataURL(selectedImage)
    reader.onloadend = () => {
      setPreviewLink(reader.result)
    }
  }, [selectedImage])

  return (
    <Container>
      <div className="header">
        <img src={contact.avatar ? contact.avatar : avatar} alt="avatar" />
        <div className="title">
          <h3>{contact ? contact.pseudo : 'Hello'}</h3>
        </div>
      </div>
      <ScrollToBottom className="scroll content" mode="bottom">
        {allMessages ? (
          allMessages.length !== 0 ? (
            allMessages.map((msg) =>
              msg.send === pseudo ? (
                <div className="message" id="you">
                  <span className="other">o</span>
                  <div className="item">
                    <div className="message-content">
                      <p>{msg.message}</p>
                      {msg.imageUrl && <img src={msg.imageUrl}/>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="message" id="other">
                  <span className="other">o</span>
                  <div className="item">
                    <div className="message-content">
                      <p>{msg.message}</p>
                      {msg.imageUrl && <img src={msg.imageUrl}/>}
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
        {showEmoji ? <div style={{ height: '200px', width: '100px' }}><Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick}/></div> : null}
      </ScrollToBottom>
      <div className="inputMessage">
        {previewLink && 
          <div className='preview'>
            <div>
              <AiOutlineCloseCircle onClick={cancelImage}/>
            </div>
            <img src={previewLink} alt="preview Image" />
          </div>
        }
        <div className='group'>
          <input type="text" onChange={handleChange} ref={messageRef} />
          <SiIconify color="white" onClick={() => setShowEmoji(!showEmoji)} />
          <input
            ref={imageRef}
            type="file"
            accept="image/png, image/jpeg"
            name="image"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            className="image-input"
          />
          <AiOutlineCamera onClick={() => imageRef.current.click()} />
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

        .message-content {
          text-align: left;

          img {
            background-image: #fff;
            width: 70%;
            height: auto;
          }
        }
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

        .message-content {
          text-align: right;

          img {
            background-image: #fff;
            width: 70%;
            height: auto;
          }
        }
      }
    }
  }

  .scroll {
    max-height: 270px;
  }

  .inputMessage {
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: #c5c5c5;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 1rem;

    .image-input {
      display: none;
    }

    .preview {
      position: relative;
      width: 100%;

      div {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99;
        transform: translate(-100%, -100%);
      }

      img {
        width: 100%;
        height: 100px;
      }
    }

    .group {
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
