// Node server which will handle socket.io connection
const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  // If someone joins the chat, let others know!
  socket.on("new-user-joined", (name) => {
    if (name != null || name != undefined) {
      console.log("new user", name);
      users[socket.id] = name;
      socket.broadcast.emit("user-joined", name);
    }
  });

  // If someone sends message, broadcast it to the people!
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // If someone leaves the chat, let others know!
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
