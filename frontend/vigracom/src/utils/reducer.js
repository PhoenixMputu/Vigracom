import { io } from 'socket.io-client'

export const initialState = {
  user: null,
  socket: io('ws://localhost:8080')
}

const reducer = (state, action) => {
  switch (action.type) {
  case 'SET_USER':
    return {
      ...state,
      user: action.user
    }
  default:
    return state
  }
}

export default reducer
