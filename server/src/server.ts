import express from "express";
import cors from "cors";
import dataRoute from "./routes/dataRoutes";

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.use("/api", dataRoute);

app.get("/", (req, res) => {
  res.send("API is running");
});