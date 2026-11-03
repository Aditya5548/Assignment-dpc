
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT;
app.use(cors())
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);

app.get("/", (req ,res) => {
  res.sendFile("login.html", { root: "public" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
