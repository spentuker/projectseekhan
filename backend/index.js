import express from "express";
import cors from "cors";
import { prompt } from "./models/prompt.models.js";
import connectDB from "./database.js";

const app = express();
const PORT = 6969;
app.use(express.json());
app.use(cors());
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/submit`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed:${error}`);
  });
app.get("/", (req, res) => {
  res.send("bought 5 tickets");
});
app.post("/submit", async (req, res) => {
  console.log("Received data:", req.body);
  const newPrompt = new prompt({ promptInput: req.body.user_prompt });
  await newPrompt.save();
  res.json({ message: "Data received successfully" });
});
