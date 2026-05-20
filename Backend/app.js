const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const roadmapRoutes = require('./routes/roadmap');
app.use('/api', roadmapRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/skillmismatchreact")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});