//npm i ejs express mongoose socket.io ->Installed in this folder

//Requiring the modules
let PORT = 3000
let clientName;
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');

const { Server } = require('socket.io');
const path = require('path')
// const messageHandler = require('./public/javascripts/messageHandler')


//One worker per cpu core
const { availableParallelism } = require('node:os');
const cluster = require('node:cluster');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');

//creating the server
const app = express();
const server = createServer(app);
// const io = new Server(server);
const io = new Server(server, {
  connectionStateRecovery: {}
  // ackTimeout: 10000,
  // retries: 3

});
// io.adapter(createAdapter()); // Attach cluster adapter (runs only in workers)

// console.log(createServer())



// if (cluster.isPrimary) {
//   const numCPUs = availableParallelism();
//   // create one worker per available core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork({
//       PORT: 3000 + i
//     });
//   }
// }
  




//Make the form-data reaadable
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Making ejs to be executable
app.set('view engine','ejs')


//Making home route
app.get('/', (req, res) => {
  res.render("index")
})
io.on('connection',(socket)=>{
  console.log(200)
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
    console.log(404)
     socket.broadcast.emit("disconnected",socket.handshake.auth.name)
   })
 })


// each worker will listen on a distinct port
// const port = process.env.PORT;

server.listen(3000, () => {
  console.log(`server running at http://localhost:${3000}`);
});
