const express=require('express');
const app=express();
const http=require('http').createServer(app);
const io=require('socket.io')(http,{cors:{origin:'*'}});
const { UniqueString, UniqueNumber, UniqueStringId,UniqueNumberId,UniqueOTP,UniqueCharOTP,HEXColor,uuid } = require('unique-string-generator');

let users={};
let chatrooms={};

io.on("connection", (socket) => {
    socket.on('new-connect',(test)=>{
        let chatroom=UniqueString();
        socket.emit('need-chatroom',chatroom);
    });
    socket.on('new-user-joined',user=>{
        socket.join(user[1]);
        users[socket.id]=user[0];
        chatrooms[socket.id]=user[1];
        socket.to(user[1]).emit('new-user',user[0]);
    });
    socket.on('send-message',data=>{
        socket.to(data[1]).emit('recieve-message',[data[0],data[2]]);
    });
    socket.on('disconnect',()=>{
        socket.to(chatrooms[socket.id]).emit('user-left',users[socket.id]);
    })
});

http.listen(8000,()=>{
    console.log("Server started successfully")
});
