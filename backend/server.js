const express = require("express");
const config = require("dotenv/config");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const passport = require("passport");
const authRouter = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const userRouter = require("./routes/userRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.use("/auth", authRouter);
app.use(authMiddleware.authenticate("jwt", { session: false }));
app.use("/user", userRouter);
app.use("/conversation", conversationRouter);
app.all("*", (request, response) => {
  response.sendStatus(404);
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

global.onlineUsers = [];

io.on("connection", (socket) => {

  // store a user among online users when connected
  socket.on("add-user", (newUserId) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      onlineUsers.push({
        userId: newUserId,
        socket: socket.id
      })
      console.log("New user connected", onlineUsers);
    }

    io.emit("get-users", onlineUsers);
  });

  // send a message to a specifique user
  socket.on("send-msg", (data) => {

    const {receverId} = data;
    const user = onlineUsers.find(user => user.userId === receverId);
    console.log(user);
    console.log("Hello World!", receverId);
    console.log("Data", data);

    if (user) {
      io.to(user.socket).emit('receive-message', data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
