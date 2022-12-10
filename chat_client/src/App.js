import React, { useEffect, useState } from 'react';
import styles from './App.css';
import { Navbar, Nav, Container, NavDropdown, Form, Button, FormControl } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { disconnectSocket, initSocketConnection, sendSocketMessage, socket, socketInfoReceived } from './socket';


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
  const [boardArr, setBoardArr] = useState([])
  useEffect(() => {
    socket.on('view_first_board', (msg) => {
      console.log(msg, '??');
      setBoardArr(prev => [...prev, msg])
    })
    return () => {
      sendSocketMessage('view_first_board')
      socket.off('view_first_board')
    }
  }, [])

  return (
    <div>
      {boardArr.map((value, index) => {
        return (
          <div key={index}>
            {value.name}/
            {value.title}/
            {value.body}
            <img style={{ width: 300, height: 300 }} src={value.picture[0].img} />
          </div>
        )
      })}
    </div>
  )
}

const Chat = () => {
  const [inputText, setInputText] = useState('')
  const [myNickNameText, setMyNickNameText] = useState('')
  const [isEnter, setIsEnter] = useState(false)
  const [chatArr, setChatArr] = useState([])

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      console.log(msg, '??');
      setChatArr(prev => [...prev, msg])
    })
    // socketInfoReceived('chat_message')

    return () => {
      socket.off('chat_message');
    }
  }, [])

  return (
    <div>
      <ul id="messages">
        {chatArr.map((value, index) => {
          const isMyChat = (value.chat.name === myNickNameText)
          if (value.type === "sytemMSG" && isMyChat) {
            return null
          } else if (value.type === "sytemMSG") {
            return <li>{value.chat.body}</li>
          }
          return (<li>{isMyChat ? '나의 채팅' : value.chat.name + '의 채팅'} : {value.chat.body}</li>)
        })}
      </ul>
      {!isEnter ?
        <div>
          <form id="form2" onSubmit={(e) => {
            e.preventDefault();
            setChatArr([{ type: 'sytemMSG', chat: { name: 'Alert', body: `채팅방에 입장하였습니다.` } }]);
            sendSocketMessage('enter_messageRoom', myNickNameText);
            setIsEnter(true)
          }}>
            <input id="input" autocomplete="off" style={{ border: '1px', }} value={myNickNameText} onChange={(e) => {
              setMyNickNameText(e.target.value)
            }} /><button>닉네임 지정 및 입장</button>
          </form>
        </div>
        :
        null}
      <form id="form" onSubmit={(e) => {
        e.preventDefault();
        sendSocketMessage('chat_message', { name: myNickNameText, body: inputText });
        setInputText('')
      }}>
        <input id="input" autocomplete="off" value={inputText} onChange={(e) => {
          setInputText(e.target.value)
        }} /><button>전송</button>
      </form>
    </div>
  )
}


const Header = () => {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="Main">소켓프로그래밍</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="Main">게시판</Nav.Link>
          <Nav.Link href="chat">채팅방</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}