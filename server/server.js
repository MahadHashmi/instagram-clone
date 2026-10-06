const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============ ENSURE FOLDERS EXIST ============
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");
if (!fs.existsSync("./data")) fs.mkdirSync("./data");

const POSTS_FILE = path.join(__dirname, "data", "posts.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");

// ============ LOAD FROM DISK ============
function loadJSON(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let posts = loadJSON(POSTS_FILE, []);
let users = loadJSON(USERS_FILE, [
  { id: 1, username: "you", fullname: "Your Name", bio: "Welcome 👋", avatar: "👤" },
  { id: 2, username: "alex", fullname: "Alex Kumar", bio: "Photographer 📷", avatar: "🧑" },
  { id: 3, username: "sara", fullname: "Sara Khan", bio: "Traveler 🌍", avatar: "👩" },
  { id: 4, username: "john", fullname: "John Doe", bio: "Foodie 🍕", avatar: "🧔" },
]);

// If users file doesn't exist yet, create it now
if (!fs.existsSync(USERS_FILE)) saveJSON(USERS_FILE, users);

// ============ FILE UPLOAD ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_")),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp|mp4|mov|webm/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (ok.test(ext)) cb(null, true);
    else cb(new Error("Only images and videos allowed"));
  },
});

// ============ POSTS ROUTES ============

app.get("/posts", (req, res) => res.json(posts));

app.get("/posts/user/:username", (req, res) => {
  res.json(posts.filter((p) => p.username === req.params.username));
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

app.post("/upload", upload.single("media"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const ext = path.extname(req.file.filename).toLowerCase();
  const isVideo = [".mp4", ".mov", ".webm"].includes(ext);

  const newPost = {
    id: Date.now(),
    username: req.body.username || "you",
    caption: req.body.caption || "",
    mediaUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    mediaType: isVideo ? "video" : "image",
    likes: 0,
    views: 0,
    comments: [],
    saved: false,
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  saveJSON(POSTS_FILE, posts);   // ← SAVE TO DISK
  res.json(newPost);
});

app.post("/like/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  post.likes += 1;
  saveJSON(POSTS_FILE, posts);
  res.json(post);
});

app.post("/save/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  post.saved = !post.saved;
  saveJSON(POSTS_FILE, posts);
  res.json(post);
});

app.post("/view/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    post.views += 1;
    saveJSON(POSTS_FILE, posts);
  }
  res.json(post);
});

app.post("/comment/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  post.comments.push({ user: "you", text: req.body.text, at: Date.now() });
  saveJSON(POSTS_FILE, posts);
  res.json(post);
});

app.delete("/posts/:id", (req, res) => {
  const idx = posts.findIndex((p) => p.id == req.params.id);
  if (idx > -1) {
    const file = posts[idx].mediaUrl.split("/uploads/")[1];
    const filePath = path.join(__dirname, "uploads", file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    posts.splice(idx, 1);
    saveJSON(POSTS_FILE, posts);
  }
  res.json({ ok: true });
});

// ============ USERS ROUTES ============

app.get("/users", (req, res) => res.json(users));

app.get("/users/:username", (req, res) => {
  const u = users.find((x) => x.username === req.params.username);
  if (!u) return res.status(404).json({ error: "User not found" });
  res.json(u);
});

// Create new profile
app.post("/users", (req, res) => {
  const { username, fullname, bio } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: "Username already taken" });
  }

  const newUser = {
    id: Date.now(),
    username: username.trim(),
    fullname: fullname || username,
    bio: bio || "",
    avatar: "👤",
  };
  users.push(newUser);
  saveJSON(USERS_FILE, users);
  res.json(newUser);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});