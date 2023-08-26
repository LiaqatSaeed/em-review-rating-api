import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(bodyParser.json());

//Default Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});


// API is listening at PORT
app.listen(PORT, () => {
  console.log("EM Rating & Review " + PORT);
});
