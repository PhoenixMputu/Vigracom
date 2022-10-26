import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import axios from 'axios'

const Login = () => {
  let navigate = useNavigate()
  const [error, setError] = useState({
    pseudo: '',
    password: ''
  })
  const [form, setForm] = useState({
    pseudo: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.pseudo.length < 4) {
      setError((prevState) => ({
        ...prevState,
        pseudo: 'Le pseudo doit avoir au moins 4 caractères !'
      }))
    }

    if (form.pseudo.length > 4) {
      setError((prevState) => ({ ...prevState, pseudo: '' }))
    }

    if (error.pseudo) {
      toast.error(error.pseudo, {
        position: toast.POSITION.TOP_LEFT
      })
    }

    if (form.password.length < 4) {
      setError((prevState) => ({
        ...prevState,
        password: 'Le mot de passe doit avoir au moins 4 caractères !'
      }))
    }
    if (form.password.length > 4) {
      setError((prevState) => ({ ...prevState, password: '' }))
    }

    if (error.password) {
      toast.error(error.password, {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    const register = axios({
      method: 'post',
      url: 'http://localhost:8080/auth/login',
      data: form
    })

    register
      .then((response) => {
        if (response.data.type === 'Erreur') {
          return toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          })
        }

        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/home')
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      <Container onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <label htmlFor="pseudo">Pseudo</label>
        <input
          type="text"
          placeholder="Pseudo"
          name="pseudo"
          id="pseudo"
          value={form.pseudo}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="********"
          name="password"
          id="password"
          required
          onChange={handleChange}
          value={form.password}
        />
        <input className="btn" type="submit" value="Se connecter" />
      </Container>
      <ToastContainer />
    </>
  )
}

const Container = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
  gap: 0.5rem;
  color: #1966ff;
  font-family: 'Oswald', sans-serif;

  h2 {
    font-family: 'Oswald', sans-serif;
    color: #1966ff;
    text-align: center;
    text-transform: uppercase;
  }

  input {
    padding: 0.5rem;
  }

  .btn {
    margin-top: 0.5rem;
    background-color: #1966ff;
    border: none;
    border-radius: 5px;
    padding: 0.7rem;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 255, 0.2);

    &:hover {
      cursor: pointer;
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
`

export default Login
