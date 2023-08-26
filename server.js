import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dbConnect } from "./middlewares";
import dotenv from "dotenv";
import { authController, userController } from "./controllers";
dotenv.config();

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(bodyParser.json());

//Default Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.use("/api", authController);
app.use("/api/user", userController);


// API is listening at PORT
app.listen(PORT, () => {
    console.log("EM Rating & Review " + PORT);
});

//db Connection
dbConnect();