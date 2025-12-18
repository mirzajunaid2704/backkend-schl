const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATA FILE SETUP =================
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "enquiries.json");

// Create data folder if not exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create enquiries.json if not exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

// Load existing enquiries
let enquiries = [];
try {
  const data = fs.readFileSync(dataFile, "utf8");
  enquiries = JSON.parse(data);
} catch (err) {
  console.error("Error reading enquiries.json:", err);
}

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
  res.send("Suvidya School Backend is running ✅");
});

// Submit enquiry
app.post("/api/enquiry", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  const newEntry = {
    name,
    email,
    phone,
    message,
    date: new Date()
  };

  enquiries.push(newEntry);
  fs.writeFileSync(dataFile, JSON.stringify(enquiries, null, 2));

  res.json({ message: "Enquiry saved successfully" });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
