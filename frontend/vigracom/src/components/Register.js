import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

function Register() {
  const navigate = useNavigate()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState()
  const [error, setError] = useState({
    pseudo: '',
    password: ''
  })
  const [form, setForm] = useState({
    pseudo: '',
    password: '',
    avatar: ''
  })

  const handleImageChange = (imageSelected) => {
    if (imageSelected) {
      setImage(imageSelected[0])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.pseudo.length < 4) {
      setError((prevState) => ({
        ...prevState,
        pseudo: 'Le pseudo doit avoir au moins 4 caractères !'
      }))
    }

    if (form.pseudo.length > 4) {
      setError((prevState) => ({
        ...prevState,
        pseudo: ''
      }))
    }

    if (form.password.length > 4) {
      setError((prevState) => ({
        ...prevState,
        password: ''
      }))
    }

    if (form.password.length < 4) {
      setError((prevState) => ({
        ...prevState,
        password: 'Le mot de passe doit avoir au moins 4 caractères !'
      }))
    }

    if (form.password !== confirmPassword) {
      setError((prevState) => ({
        ...prevState,
        password: 'Les mots de passe ne sont pas identique !'
      }))
    }

    if (form.password === confirmPassword) {
      setError((prevState) => ({
        ...prevState,
        password: ''
      }))
    }

    if (error.pseudo) {
      toast.error(error.pseudo, {
        position: toast.POSITION.TOP_LEFT
      })
    }

    if (error.password) {
      toast.error(error.password, {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'vigracom')

    const response = await axios({
      method: 'post',
      url: 'https://api.cloudinary.com/v1_1/dywvbuuqw/upload',
      data: formData
    })
    // eslint-disable-next-line dot-notation
    const avatar = response.data['secure_url']

    const register = axios({
      method: 'post',
      url: 'http://localhost:8080/auth/register',
      data: { ...form, avatar }
    })

    register
      // eslint-disable-next-line no-shadow, consistent-return
      .then((response) => {
        if (response.data.type === 'Erreur') {
          return toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          })
        }

        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/home')
      })
      // eslint-disable-next-line no-shadow
      .catch((error) => console.log(error))
  }
  return (
    <>
      <Container onSubmit={handleSubmit}>
        <h2>INSCRIPTION</h2>
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
        <label htmlFor="avatar">Avatar</label>
        <input
          type="file"
          accept="image/png, jpg, jpeg"
          id="avatar"
          name="avatar"
          onChange={(e) => handleImageChange(e.target.files)}
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          placeholder="********"
          name="password"
          id="password"
          required
          onChange={handleChange}
          value={form.password}
        />
        <label htmlFor="Confirmpassword">Confirmation du mot de passe</label>
        <input
          type="password"
          placeholder="********"
          name="Confirmpassword"
          id="Confirmpassword"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <input className="btn" type="submit" value="S'inscrire" />
      </Container>
      <ToastContainer />
    </>
  )
}

const Container = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
  gap: 0.2rem;
  color: #1966ff;
  font-family: 'Oswald', sans-serif;

  h2 {
    font-family: 'Oswald', sans-serif;
    color: #1966ff;
    text-align: center;
    text-transform: uppercase;
  }

  input {
    padding: 0.2rem;
  }

  .btn {
    margin-top: 0.5rem;
    background-color: #1966ff;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
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

export default Register
