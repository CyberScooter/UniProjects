
const app        = require("./app")
const {chatSystem} = require("./routes/chat")
var server     = require("http").createServer(app)
var io         = require("socket.io")(server, {cors: {origin: "*"}})

chatSystem(io)



server.listen(process.env.PORT, () => {
  console.log(`Ecofine app listening to port ${process.env.PORT}`);
});
