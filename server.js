// Line 1 — express library import karo
const express  = require("express");

// Line 2 — mongoose import karo
const mongoose = require("mongoose");

// Line 3 — cors import karo
const cors     = require("cors");

// Line 4 — path import karo (index.html serve karne ke liye)
const path     = require("path");

// Line 6 — express app banao
const app = express();

// Line 8 — middlewares lagao
app.use(cors());
app.use(express.json());

// Line 11 — Atlas connection string
const MONGO_URI = "mongodb+srv://anuragk06469_db_user:JSXAnM9VhY6eh9OI@cluster0.ybuzu0m.mongodb.net/mongodbstudent";

// Line 13 — Atlas se connect karo
mongoose.connect(MONGO_URI)
  .then(() => console.log("Atlas connected!"))
  .catch((err) => console.log("Error:", err.message));

// Line 17 — Student Schema
const Student = mongoose.model("Student", {
  name:   String,
  age:    Number,
  course: String
});

// ─────────────────────────────────────────────
// Line 23 — ROOT route — index.html serve karo
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ─────────────────────────────────────────────
// Line 28 — CREATE — naya student
// ─────────────────────────────────────────────
app.post("/studentdata", async (req, res) => {
  try {
    const { name, age, course } = req.body;

    // Validation
    if (!name || !course) {
      return res.status(400).json({ message: "Name and cource are required" });
    }

    const s = new Student({ name, age, course });
    await s.save();
    res.json({ message: name + " Added!" });

  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ─────────────────────────────────────────────
// Line 44 — READ
// ─────────────────────────────────────────────
app.get("/studentdata", async (req, res) => {
  try {
    const all = await Student.find();
    res.json(all);

  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ─────────────────────────────────────────────
// Line 53 — UPDATE — student ki info
// ─────────────────────────────────────────────
app.put("/studentdata/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.course) updates.course = req.body.course;
    if (req.body.age)    updates.age    = req.body.age;

    await Student.findByIdAndUpdate(req.params.id, updates);
    res.json({ message: "Updated successfully!" });

  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ─────────────────────────────────────────────
// Line 65 — DELETE — student hatao
// ─────────────────────────────────────────────
app.delete("/studentdata/:id", async (req, res) => {
  try {
    const d = await Student.findByIdAndDelete(req.params.id);

    if (!d) {
      return res.status(404).json({ message: "Student not found!" });
    }

    res.json({ message: d.name + " deleted!" });

  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ─────────────────────────────────────────────
// Line 78 — Server start karo
// ─────────────────────────────────────────────
app.listen(5000, () => console.log("Server: http://localhost:5000"));