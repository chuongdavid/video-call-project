const express = require("express");
const uuid = require("short-uuid");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8888;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {  
  res.render("index");
});

let roomExist = []

io.on('connection', socket => {
    console.log(" New Connection")
    socket.on('create_room', room_id => {
      roomExist.push({_id:room_id,users:[socket.id]});
      console.log(roomExist)
    })
    socket.on('roomId', room_id => {
      const room = roomExist.find((item) => item._id === room_id)
      if(room) {
        socket.emit('has_room', true);
      }
      else{
        socket.emit('has_room', false);
      }
    })
    socket.on('join_room', (room_id,callback) => {
      const room = roomExist.find((item) => item._id === room_id)
      console.log("length",room.users.length )                 
      if(room.users.length < 2){
        room.users.push(socket.id)
        callback(false)        
      }
      else{         
        callback(true)
      }   
      console.log('check',roomExist)        
    })

    socket.on("disconnect", () =>{
      
      console.log('disconnect',socket.id)
      console.log('check before dis',roomExist)      
      
        const room = roomExist.find((item) => item.users.includes(socket.id))
        if(room){
          console.log('check disconect',room)
          room.users = room.users.filter(user => user !== socket.id)
          console.log('room user',room.users)            
          console.log('check after dis',roomExist) 
          if(room.users.length == 0){
            roomExist=roomExist.filter(item => item._id !== room._id)
          }
          console.log('check Room Exist', roomExist)
        }
        else{
          console.log('Không tìm thấy phòng')
        }
        

      
    })    
})


server.listen(port);
