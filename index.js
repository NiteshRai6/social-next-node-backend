const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public/uploads')));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.listen(4000, () => {
    console.log('Connected')
});