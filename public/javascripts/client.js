let deviceId = localStorage.getItem("deviceId")
let userName = prompt("Enter your name")
if (!deviceId) {
    deviceId = `${crypto.randomUUID()}`
    localStorage.setItem('deviceId', deviceId)
}
let counter = 0
const socket = io({
    auth: {
        userId: deviceId,
        name: userName   //sending to the server
    },
});
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');


const createMessageElement = (userName,inputVal,dir)=>{
    const item = document.createElement('li');
        item.setAttribute('class', `${dir}`)
        item.innerHTML = `
        <h5 class="user">${userName}</h5>
        <p class="msg">${inputVal}</p>
  `
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        clientOffset = `${socket.id}-${counter++}`
        socket.emit('chat message', input.value,userName, clientOffset)
        createMessageElement("You",input.value,'right')

        input.value = ''
    }
});

socket.on('chat message', (msg, clientName) => {
    createMessageElement(clientName,msg,'left')
});

socket.on('newConnection', (msg, clientName) => {
    // alert(`${clientName} joined the group`)
    const item = document.createElement('li');
    item.setAttribute('class', "new")
    item.innerHTML = `
        <h5 class="user">${clientName} has joined the</h5>
  `
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})

socket.on("disconnected",(userName)=>{

    const item = document.createElement('li');
    item.setAttribute('class', "new")
    item.style.background = '#ff6969'
    item.innerHTML =`
        <h5 class="user">${userName} leaved the chat</h5>
  `
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    
})
