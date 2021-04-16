const express = require("express"); //importing express
const app = express(); //making express object.
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 5000;

// App use
app.use(express.json());
app.use(express.urlencoded());

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
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Shady! Connection Error:"));

db.once("open", function () {
  console.log("Shady! Success Mongo DB Connected");
});

app.get("/", (req, res) => {
  res.send("<h1>Wellcome Good Open Web Host Server</h1>");
});

// User Route
const userRoute = require("./routes/user");
app.use("/user", userRoute);

// PayPal Route
const payRoute = require("./routes/payPal");
app.use("/payPal", payRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});