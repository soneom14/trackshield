const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ======================
// ⚙️ MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());


// ======================
// 🔗 MONGODB CONNECTION
// ======================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ Mongo Error:", err));


// ======================
// 📦 SCHEMAS
// ======================

// 📍 Location Schema
const locationSchema = new mongoose.Schema({
    deviceId: String,
    latitude: String,
    longitude: String,
    updatedAt: Date,
});

const Location = mongoose.model("Location", locationSchema);


// 👤 User Schema
const userSchema = new mongoose.Schema({
    parentName: String,
    childName: String,
    phone: String,
    address: String,
    bandId: String,
});

const User = mongoose.model("User", userSchema);


// ======================
// 🏠 HOME ROUTE
// ======================
app.get("/", (req, res) => {
    res.send("🚀 TrackShield Backend Running");
});


// ======================
// 📡 UPDATE LOCATION (ESP / GPS)
// ======================
app.get("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.send("❌ Missing lat or lon");
        }

        await Location.findOneAndUpdate(
            { deviceId: id },
            {
                deviceId: id,
                latitude: lat,
                longitude: lon,
                updatedAt: new Date(),
            },
            { upsert: true }
        );

        res.send("✅ Location Updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Error updating location");
    }
});


// ======================
// 📍 TRACK LOCATION (VIEW)
// ======================
app.get("/track/:id", async (req, res) => {
    try {
        const data = await Location.findOne({ deviceId: req.params.id });

        if (!data) {
            return res.send("📍 Location not available yet");
        }

        res.send(`
      <h2>Device ID: ${data.deviceId}</h2>
      <p><b>Latitude:</b> ${data.latitude}</p>
      <p><b>Longitude:</b> ${data.longitude}</p>
      <p><b>Last Updated:</b> ${data.updatedAt}</p>
    `);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Error fetching location");
    }
});


// ======================
// 👥 USERS ROUTES
// ======================

// GET all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Error fetching users" });
    }
});

// REGISTER user
app.post("/register", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ message: "✅ User Registered" });
    } catch (err) {
        res.status(500).json({ error: "Error saving user" });
    }
});


// ======================
// 🚀 SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});