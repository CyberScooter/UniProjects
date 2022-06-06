// CLIENT SIDE CODE


// .on means that its receiving or waiting for data to be sent, in this case its receiving from server.js
// .emit means that its sending data, in this case its sending to the server.js

const form = document.getElementById('chat')
const messages = document.querySelector('#form')

const socket = io();

// if client receives a 'message' from the server
// THIS LISTENS TO THE SERVER SIGNALS SENT
socket.on('message', message => {
    // if the same user opens a duplicate tab, then using the ip address detection by the server, it sets the form to invisible
    // also if the user manages to manipulate the form using javascript it wont work as the server completely denies, duplicate ip requests
    if(message == 'Chat session already active'){
        form.style.visibility = "hidden"
    }else {
        // update it onto the html page

        // uses local client server time for timestamps in each message
        var current = new Date();
        updateDOM(`[${(current.getHours()<10?'0':'') + current.getHours()}:${(current.getMinutes()<10?'0':'') + current.getMinutes()}] ` + message)
        // make it so clients automatically scroll down to latest message
        messages.scrollTop = messages.scrollHeight;
    }
})

// seperated alerts from user messages, this below reads for alerts like connected, disconnected, ! commands
socket.on('alert', alert => {
    // update it onto the html page
    updateDOM(alert)
    // make it so clients automatically scroll down to latest message
    messages.scrollTop = messages.scrollHeight;

})

function escapeHtml(html){
    var text = document.createTextNode(html);
    var p = document.createElement('p');
    p.appendChild(text);
    return p.innerHTML;
  }
// if form submit is pressed when connecting to the chat OR when typing a message
// THIS IS FOR SENDING SIGNALS TO THE SERVER
form.addEventListener('submit', (e) => {
    // prevent it from making a http request, this is so that the socketio can handle it instead of http.get() or http.post() requests
    e.preventDefault()

    // captures the message text from the message input in the form
    const message = e.target.elements.message.value

    // if the username is typed in the form, this if statement is for connecting to the chat
    if(document.getElementById("username") != null){
        // capture the username from the username input
        const username = e.target.elements.username.value
    
        // if username is not empty and message is not empty
        if(username != '' && message != ''){
            // send a 'add-username' signal to the server, GO INTO server.js AND CHECK HOW IT PROCESSES IT
            // the first argument in socket.emit is the type of signal send to server 'add-username'
            // the second argument is the username
            // the third argument is the response from the server once it has dealt with the signal
            socket.emit('add-username',escapeHtml(username), resp => {
                if(resp.status == "ok"){
                    // send a 'active-users' signal to the server, GO INTO server.js AND CHECK HOW IT PROCESSES IT
                    // this allows a message to be sent from the server to display the number of active users in the chatroom to be displayed specifically to the user that joined
                    socket.emit('active-users')
                    // this handles the message by sending it to the server, and the server sends the message to everyone including the one who sent it
                    socket.emit('chat-message', escapeHtml(message))
                    // removes the username input as its not longer needed because the user has joined the chatroom
                    document.getElementById("username").remove()
                    document.getElementById("send").innerText = "Chat"
                }
            })

        }
        // as the site is never refreshed because of line 26 this means that the inputs have to be emptied after
        e.target.elements.message.value = ""
        e.target.elements.username.value = ""


        // this if statement below handles the messaging once the user is connected to the chatroom
    }else if(document.getElementById("username") == null && message != ''){

        // this command is for checking the number of active users
        if(message == "!activeusers"){
            // sends the signal to the server which sends back to client who SPECIFICALLY requested
            socket.emit('!activeusers')
            // empties the message input
            e.target.elements.message.value = ""
        }else if(message == "!emotes"){
            socket.emit('emotes')
            e.target.elements.message.value = ""

        }else {
            // else just send the message to everyone
            socket.emit('chat-message', escapeHtml(message))
            // empty the message input
            e.target.elements.message.value = ""
        }

    }
})

function updateDOM(message) {
    const p = document.createElement('p')
    p.innerHTML = `<span>${message}</span>`

    document.querySelector('.messages').appendChild(p)
}