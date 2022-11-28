const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  /** 사용자의 채팅 감지 */
  socket.on('chat message', (msg) => {
    console.log('chat the' + msg);
    io.emit('chat message', msg);
  });
  /** 사용자 이탈 감지 */
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});