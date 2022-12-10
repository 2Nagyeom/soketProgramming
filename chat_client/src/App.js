import React, { useEffect, useState } from 'react';
import styles from './App.css';
import { Navbar, Nav, Container, NavDropdown, Form, Button, FormControl } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { disconnectSocket, initSocketConnection, sendSocketMessage, socket } from './socket';


function App() {

  useEffect(() => {
    initSocketConnection()
    return () => {
      disconnectSocket()
    }
  }, [])

  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/Main" element={<Main />}></Route>
          <Route path="/Chat" element={<Chat />}></Route>
        </Routes>
      </BrowserRouter>
    </div>


  );
}

export default App;

const Main = () => {
  return (
    null
  )
}

const Chat = () => {
  const [inputText, setInputText] = useState('')
  useEffect(() => {
    sendSocketMessage()

    return () => {
    }
  }, [])

  return (
    <>
      <ul id="messages">

      </ul>
      <form id="form" onSubmit={(e) => {
        e.preventDefault();
        sendSocketMessage('chat_message', inputText);
      }}>
        <input id="input" autocomplete="off" value={inputText} onChange={(e) => {
          setInputText(e.target.value)
        }} /><button>Send</button>
      </form>
    </>
  )
}


const Header = () => {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="Main">게시판</Nav.Link>
          <Nav.Link href="chat">채팅방</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}