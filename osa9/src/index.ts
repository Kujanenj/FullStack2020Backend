import express from "express";
import diagnoseRouter from "./routes/diagnoses";
const app = express();
//const cors = require("cors");

app.use(express.json());
//app.use(cors);
const PORT = 3001;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use("/api/diagnoses", diagnoseRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
