const express = require("express"); //importing express
const app = express(); //making express object.
const port = process.env.PORT || 5000;
const server = require("http").createServer(app);
const UserTask = require("./models/user_task_model");

const io = require("socket.io")(server);

//socket io
io.of("/api/socket").on("connect", (socket) => {
  console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });
});

// getting-started.js
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://shady:12345@cluster0.vblar.mongodb.net/MyDatabase?retryWrites=true&w=majority",
  // "mongodb+srv://taskUser:iwillnottellu@cluster0.os32m.mongodb.net/MyDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Shady! Connection Error:"));

db.once("open", function () {
  console.log("Shady! Mongo DB Connected");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("Good Open Web Host");
});
app.get("/homepage", (req, res) => {
  res.send("Home Page");
});
app.use(express.json());
const userTaskRoute = require("./routes/user_task");
app.use("/userTask", userTaskRoute);
