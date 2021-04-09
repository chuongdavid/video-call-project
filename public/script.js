var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;


function createRoom(){    
    console.log("Creating Room")
    let room = document.getElementById("room-input").value;
    if(room == " " || room == "")   {
        alert("Please enter room number")
        return;
    }
    room_id = room;
    let peer = new Peer(room_id)
    peer.on('open', (id)=>{
        console.log("Peer Connected with ID: ", id)                
        getUserMedia({
            video: true, 
            audio: true}, (stream)=>{
            local_stream = stream;
            setLocalStream(local_stream)
        },(err)=>{
            console.log(err)
        })
        
    })
    peer.on('call',(call)=>{        
        call.answer(local_stream);
        call.on('stream',(stream)=>{
            setRemoteStream(stream)
        })
    })
}

function joinRoom(){
    console.log("Joining Room")
    let room = document.getElementById("room-input").value;
    if(room == " " || room == "")   {
        alert("Please enter room number")
        return;
    }
    room_id = room;
    
    let peer = new Peer()
    peer.on('open', (id)=>{
        console.log("Connected with Id: "+id)
        getUserMedia({video: true, audio: true}, (stream)=>{
            local_stream = stream;
            setLocalStream(local_stream)
            
            let call = peer.call(room_id, stream)
            call.on('stream', (stream)=>{
                setRemoteStream(stream);
            })
        }, (err)=>{
            console.log(err)
        })

    })
}


function setLocalStream(stream) {
    const localVideo = document.getElementById('local-video')
    localVideo.srcObject = stream
    localVideo.muted = true
    localVideo.addEventListener('loadedmetadata', () => {
        localVideo.play()
    })    
}

function setRemoteStream(stream) {
    const remoteVideo = document.getElementById('remote-video')
    remoteVideo.srcObject = stream    
    remoteVideo.addEventListener('loadedmetadata', () => {
        remoteVideo.play()
    })    
}

