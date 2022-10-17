import {useState} from "react";
import styled from "styled-components";
import brand from "../assets/brand.svg";
import Login from "../components/Login";
import Register from "../components/Register";

const Auth = () => {
  const [login, setLogin] = useState(true);
  return (
    <Container>
      <div className="container">
        <div className="brand">
          <h1>VIGRACOM</h1>
          <p>Vivez la communication en grand</p>
          <img src={brand} alt="Illustraction-brand" />
          <button onClick={() => setLogin(!login)}> {login ? 'Créez un compte ?' : 'Avez-vous un compte ?'}</button>
        </div>
        <div className="form-section">
          {login ? <Login/> : <Register/>}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: #EAEAEA;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    width: 60%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-beetween;
    align-items: center;
    margin: auto;
    border-radius: 10px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 255, .2);
  }

  .brand {
    width: 50%;
    background-color: #1966FF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    p {
      color: #fff;
    }

    h1 {
      margin: auto;
      text-align: center;
      font-family: 'Orbitron', sans-serif;
      color: #fff;
      margin-bottom: .5rem;
    }

    img {
      margin-top: .5rem;
      width: 90%;
      margin-bottom: .5rem;
    }

    button {
      border: none;
      padding: 7px 15px;
      color: #fff;
      font-weight: 600;
      border-radius: 5px;
      background-color: #1966FF;
      margin-top: .5rem;

      &:hover {
        cursor: pointer;
        opacity: .7;
        transform: scale(1.05);
      }
    }
  }

  .form-section {
    width: 50%;
  }
`;

export default Auth;
