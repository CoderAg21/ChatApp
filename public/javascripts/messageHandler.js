// messageHandler.js
module.exports = (io, socket) => {
    
//User connection and alert when it disconnect from server
    clientName = socket.handshake.auth.name
    socket.broadcast.emit("newConnection",clientName) //Broadcasting to everyone except the user
    //  listen event when some message is produce
    socket.on('chat message', (msg,clientName) => {
      console.log('message ' + msg)
      // socket.broadcast.emit("userId",socket.handshake.auth.userId) //Broadcasting to everyone except the user
      // socket.broadcast.emit("userId",socket.handshake.auth.name) //Broadcasting to everyone except the user
      console.log(clientName)
      //broadcast the message to everyOne
      socket.broadcast.emit('chat message', msg,clientName);
    });
  
    //broadcast the message to everyone except the user
    // socket.broadcast.emit('hi');
  
    //Disconnected
    socket.on('disconnect', () => {
      socket.broadcast.emit("disconnected",socket.handshake.auth.name)
    });
  }