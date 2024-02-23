import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import PropertyRouter from "./routers/property.router";

const app = express();
app.use(cors());
app.use(express.json()); // To read Body Data
app.use(express.static(__dirname)); // to file read statically
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("This is Home page");
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

mongoose
  .connect("mongodb://127.0.0.1:27017/myMERN")
  .then(() => {
    console.log("DataBase Connected !!");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Server is Running on port http://localhost:" + PORT);
});

app.use("/properties", PropertyRouter);
