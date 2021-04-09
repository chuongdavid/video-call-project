const express = require("express");
const uuid = require("short-uuid");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8888;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  // roomId = uuid.generate()

  // res.redirect(`/${roomId}`)
  res.render("index");
});

// app.get('/room', (req, res) => {
//     res.render('index')
// })

// io.on('connection', socket => {
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId);
//         socket.broadcast.to(roomId).emit('user-connected', userId)

//         socket.on('disconnect', () => {
//             socket.broadcast.to(roomId).emit('user-disconnected', userId)
//         })
//     })
// })

server.listen(port);
