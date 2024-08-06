// @ts-nocheck
const server = require("http").createServer();

const PORT = 3000;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => console.log(`On http://localhost:${PORT}`));

let readyPlayers = 0;

io.on("connection", (socket) => {
  console.log("New client connected =>", socket.id);

  socket.on("ready", () => {
    console.log("Player ready =>", socket.id);
    readyPlayers++;

    if (readyPlayers % 2 === 0) {
      io.emit("startGame", socket.id);
    }
  });

  socket.on("paddleMove", (data) => {
    socket.broadcast.emit("paddleMove", data);
  });

  socket.on("ballMove", (data) => {
    socket.broadcast.emit("ballMove", data);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} because ${reason}`);
  });
});
