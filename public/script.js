var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;

const socket = io()


function joinRoom(){  
    $('#join-room').css("display","none");
    console.log("Joining Room")
    let room = document.getElementById("room-input").value;
    if(room == " " || room == "")   {
        alert("Please enter room number")
        return;
    }
    room_id = room;
    socket.emit("roomId", room_id);
    
    socket.on('has_room', checkRoom => {        
        if(checkRoom){
            socket.emit('join_room', room_id,(check_enough) =>{
                if(check_enough){                    
                    $('#alert-enough').css("display","block");     
                    $('#alert-enough').fadeOut(3000) 
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                    console.log("Joining Room loop")       
                }
                else{
                    let peer = new Peer({ key: 'oz9b3ni30qtcsor', debug: 3, config: {'iceServers': [
                        { url: 'stun:stun.l.google.com:19302' },
                        { url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'web...@live.com' },
                        { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username:'web...@live.com' },
                        { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
                        { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
                    ]}})            
                    console.log('peer join', peer);
                    peer.on('open', (id)=>{                
                        console.log("Connected with Id: "+id)                
                        getUserMedia({video: true, audio: true}, (stream)=>{
                            local_stream = stream;
                            setLocalStream(local_stream)   
                            let call = peer.call(room_id, stream)
                            console.log("Call", call)
                            call.on('stream', (stream)=>{
                                setRemoteStream(stream);
                            })
                        }, (err)=>{
                            console.log(err)
                        })        
                    })
                }                
            })            
            
        }
        else{
            let peer = new Peer(room_id,{ key: 'oz9b3ni30qtcsor', debug: 3, config: {'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
                { url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'web...@live.com' },
                { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username:'web...@live.com' },
                { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
                { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
            ]}})
            socket.emit('create_room', room_id)
            console.log('peer create', peer);
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
    });   
    
    
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


