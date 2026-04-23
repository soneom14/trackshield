const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔥 CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 🔥 USER SCHEMA
const userSchema = new mongoose.Schema({
    bandId: String,
    parentName: String,
    childName: String,
    phone: String,
    address: String,
    location: {
        lat: Number,
        lng: Number
    }
});

const User = mongoose.model("User", userSchema);

// HOME
app.get("/", (req, res) => {
    res.send("TrackShield Backend Running with DB 🚀");
});

// 🔥 REGISTER USER
app.post("/register", async (req, res) => {
    try {
        const { parentName, childName, phone, address } = req.body;

        if (!parentName || !childName || !phone || !address) {
            return res.status(400).json({ message: "All fields required" });
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Phone must be 10 digits" });
        }

        const bandId = "TS-" + Math.floor(1000 + Math.random() * 9000);

        const newUser = new User({
            bandId,
            parentName,
            childName,
            phone,
            address
        });

        await newUser.save();

        res.json({
            message: "User saved in DB",
            user: newUser
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔥 GET USERS (FROM DB)
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// 🔥 UPDATE LOCATION (Arduino)
app.post("/location", async (req, res) => {
    const { bandId, lat, lng } = req.body;

    try {
        const user = await User.findOne({ bandId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.location = { lat, lng };
        await user.save();

        res.json({ message: "Location updated" });

    } catch {
        res.status(500).json({ message: "Error updating location" });
    }
});

// 🔥 LIVE TRACK PAGE
app.get("/track/:bandId", async (req, res) => {
    const { bandId } = req.params;

    try {
        const user = await User.findOne({ bandId });

        if (!user || !user.location) {
            return res.send("<h2>Location not available yet</h2>");
        }

        res.send(`
      <h2>TrackShield Live Location</h2>
      <p><b>Band ID:</b> ${bandId}</p>
      <p><b>Lat:</b> ${user.location.lat}</p>
      <p><b>Lng:</b> ${user.location.lng}</p>
      <a href="https://www.google.com/maps?q=${user.location.lat},${user.location.lng}" target="_blank">
        Open in Google Maps
      </a>
    `);

    } catch {
        res.send("<h2>Error fetching location</h2>");
    }
});

// START SERVER (NETWORK ACCESS ENABLED)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});