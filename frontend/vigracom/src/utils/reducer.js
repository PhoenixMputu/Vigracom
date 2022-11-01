import { io } from 'socket.io-client'

export const initialState = {
  user: null,
  socket: io('http://localhost:8080'),
  msg: null
}

const reducer = (state, action) => {
  switch (action.type) {
  case 'SET_USER':
    return {
      ...state,
      user: action.user
    }
  case 'SET_MSG':
    return {
      ...state,
      msg: action.msg
    }
  default:
    return state
  }
}

export default reducer
