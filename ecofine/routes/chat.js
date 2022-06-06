// this generates random colours hexcode for names
function generateRandomColor() {
  var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

const chatSystem = (io) => {

  // stores the users name mapped to the id they used to connect to the socket
  var users = {}

  // stores the id of the user with the colour name in chat
  var color = {}

  // session for users
  var usersessions = {}


  // sets a connection from duplex interaction between server to client and client to server
  io.on('connection', socket => {
    // heroku generates a new ip everytime the SAME user opens the page so the x-fordwards-for gets the real ip which will always be the same
    // OR use socket.request.connection.remoteaddress if in development
    var clientIp = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

    if (typeof (usersessions[clientIp]) == 'undefined') {
      // .on means that server is receiving data from client
      // .emit means that server is sending data to client(s)

      // to the client that requested:
      // socket.emit()

      // to all the clients except from the one that requested:
      // socket.broadcast.emit()

      //to all the clients even the one that requested :
      // io.emit()

      // when code is emitted here from the server it is received by line 14 in public/js/main.js file

      // if client sends a 'disconnect' signal


      socket.on('disconnect', () => {

        // if the user left the chat page and didnt type in their username then dont run code inside
        if (typeof (users[socket.id]) != 'undefined') {
          // removes entries of the user in users and color as they are no longer in the chats
          let username = users[socket.id]
          delete users[socket.id]
          delete color[socket.id]
          delete usersessions[clientIp]

          // sends message back TO ALL clients in 'message' signal saying that the user has left the chat using the objects 'users' and 'colors' created above
          io.emit('alert', `
          <div class="row">
            <div class="col-12 text-center">
              <small><strong style"color:${color[socket.id]};">${username} has left the chat.</strong><br><strong>${Object.keys(users).length} users currently active</strong></small>
            </div>
          </div>
        `)
        }
      })

      // if client sends a 'add-username' signal
      socket.on('add-username', (name, callback) => {
        // checking for duplicate name
        var names = Object.values(usersessions).filter(item => item == name)


        if (names.length == 0) {
          // use the socket id of the user as unique value to store the name in users object
          users[socket.id] = name
          // use the socket od of the user as unique value to store the random colour in the color object
          color[socket.id] = generateRandomColor();

          usersessions[clientIp] = name

          if(typeof(callback) == "function" && callback){
            callback({
              status: "ok"
            })
          }


        } else {
          if(typeof(callback) == "function" && callback){
            callback({
              status: "error"
            })
          }
        }
      })

      // if client sends a '!activeusers' signal
      socket.on('!activeusers', () => {
        // send message to the SPECIFIC CLIENT that send the message
        socket.emit('alert', `
        <div class="row">
          <div class="col-12 text-center">
            <small>${Object.keys(users).length} active users currently.</small>
          </div>
        </div>
        `)
      })

      // if client sends a 'chat-message' signal
      socket.on('chat-message', message => {
        // get current date
        if (message.length <= 300) {
          // send message with formatted date and username to ALL CLIENTS, including the one that requested
          io.emit('message', `<strong style="color:${color[socket.id]};">${users[socket.id]}</strong>:     ${message}
          `)
        }
      })

      // if client sends a 'active-users' signal
      socket.on('active-users', () => {
        // sends message to the SPECIFIC CLIENT only that they have been connected to chat
        socket.emit('alert', `
        <div class="row">
          <div class="col-12 text-center">
            <small>You have now been connected to the chat,<br><strong>${Object.keys(users).length} users currently active.</strong></small>
          </div>
        </div>
      `)

        // sends another message to everyone except from the client that has joined the chat
        socket.broadcast.emit('alert', `
        <div class="row">
          <div class="col-12 text-center">
            <small>${users[socket.id]} has joined the chat. <strong>${Object.keys(users).length} users currently active.</strong></small>
          </div>
        </div>
      `)
      })

    } else {
      socket.emit('alert', `
      <div class="row">
        <div class="col-12 text-center">
          <small><strong>Chat session already active.</strong></small>
        </div>
      </div>
        `)
    }
  });

}

exports.chatSystem = chatSystem;