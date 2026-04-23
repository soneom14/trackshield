const express = require("express");
const mongoose = require("mongoose");
const app = express();

// PORT (important for Render)
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Schema
const locationSchema = new mongoose.Schema({
    deviceId: String,
    latitude: String,
    longitude: String,
    updatedAt: Date,
});

const Location = mongoose.model("Location", locationSchema);

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("TrackShield Backend Running with DB 🚀");
});

// ✅ UPDATE ROUTE (SEND DATA)
app.get("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.send("Missing lat or lon");
        }

        await Location.findOneAndUpdate(
            { deviceId: id },
            {
                deviceId: id,
                latitude: lat,
                longitude: lon,
                updatedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        res.send("Location updated successfully");
    } catch (err) {
        console.error(err);
        res.send("Error updating location");
    }
});

// ✅ TRACK ROUTE (GET DATA)
app.get("/track/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Location.findOne({ deviceId: id });

        if (!data) {
            return res.send("Location not available yet");
        }

        res.send(`
      <h2>Device ID: ${id}</h2>
      <p>Latitude: ${data.latitude}</p>
      <p>Longitude: ${data.longitude}</p>
      <p>Last Updated: ${data.updatedAt}</p>
    `);
    } catch (err) {
        console.error(err);
        res.send("Error fetching location");
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});