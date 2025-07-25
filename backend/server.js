const docenv=require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const http = require("http");
const { Server } = require("socket.io");

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");
const editorRoutes = require("./routes/editorRoomRoutes");
const codingRoomRoutes = require("./routes/codingRoomRoutes");

const app = express();
const server = http.createServer(app); // 👈 Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Adjust in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const PORT = process.env.PORT || 5000;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/announcements", announcementRoutes);
app.use("/lostfound", lostFoundRoutes);
app.use("/editor", editorRoutes);
app.use("/coding-room", codingRoomRoutes);

// WebSocket Events
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📥 ${socket.id} joined room ${roomId}`);
  });

  socket.on("codeUpdate", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", { code }); // Consistent name
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });

  socket.on("connect_error", (err) => {
    console.error("⚠️ WebSocket error:", err.message);
  });
});

// Cloudinary signature route
app.get("/api/signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "sece_admin_uploads";

  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  res.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

// Root
app.get("/", (req, res) => {
  res.send("Firebase + Express Auth Server");
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
