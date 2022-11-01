import React, {useState} from 'react'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import List from '../components/List'
import Conversation from '../components/Conversation'
import { useStateValue } from '../utils/stateProvider'
import { ThreeCircles } from 'react-loader-spinner'

const Chat = () => {
  const [{ user }] = useStateValue()
  const [loader, setLoader] = useState(true)

  setTimeout(() => { setLoader(false) }, 10000)
  return (
    <Container>
      {loader ? <div className="center">
        <ThreeCircles
          height="100"
          width="100"
          color="#1966ff"
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
        />
      </div>
        :
        <div className="container">
          <Sidebar />
          <List />
          {user && user.avatar ? (
            <Conversation contact={user} item={user.pseudo} />
          ) : null}
        </div>
      }
    </Container>
  )
}

const Container = styled.main`
  background-color: #eaeaea;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;

  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #eaeaea;
    width: 90%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-column-gap: 1rem;
  }
`

export default Chat
