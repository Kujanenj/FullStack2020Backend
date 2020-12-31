import express from "express";
const app = express();
var cors = require('cors')
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", cors(), (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});