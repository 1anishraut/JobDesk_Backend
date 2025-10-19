const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./Database/dbConnection.js");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://shimmering-douhua-884b59.netlify.app",
    ],
    credentials: true, 
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Routes
const authRouter = require("./Routes/userAuth.js");
const taskRouter = require("./Routes/taskRoutes.js")
app.use("/", authRouter);
app.use("/", taskRouter);




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
