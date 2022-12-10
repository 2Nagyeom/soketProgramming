const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {
  const userId = socket.client.id;
  /** 사용자 연결시 서에 로그 표출  */
  console.log('a user connected : ' + userId);

  /** 사용자가 채팅방에 입장했을때 모든 사용자에게 입장을 알림 */
  socket.on('enter_messageRoom', (msg) => {
    console.log('enter the messageRoom : ' + userId);
    console.log(JSON.stringify({ type: 'sytemMSG', name: 'Alert', chat: `새로운 사용자(${userId})가 입장했어요!` }));
    io.emit({ type: 'sytemMSG', name: 'Alert', chat: `새로운 사용자(${userId})가 입장했어요!` });
  });

  /** 사용자의 채팅 감지 */
  socket.on('chat_message', (msg) => {
    console.log('chat the' + msg);
    io.emit({ type: 'userMSG', name: userId, chat: msg });
  });

  /** 사용자가 게시글 보는 페이지에 접근시 */
  socket.on('view_first_board', (msg) => {
    console.log('view first board' + msg);
    socket.emit({ title: '이건 첫 게시글이에요!', body: '친구들과 소통할 게시글을 남겨보세요!', picture: [{ index: 1, img: 'https://picok.co.kr/data/file/wing8657/m15526234805252/img_m15526234805252_800.jpg' }] });
  });

  /** 사용자가 게시글 남길때 모든 사용자에게 글 전송 */
  socket.on('write_the_board', (msg) => {
    console.log('write_the_board' + msg);
    io.emit({ title: '이건 첫 게시글이에요!', body: '친구들과 소통할 게시글을 남겨보세요!', picture: [{ index: 1, img: 'https://picok.co.kr/data/file/wing8657/m15526234805252/img_m15526234805252_800.jpg' }] });
  });
  /** 사용자 이탈 감지 */
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});