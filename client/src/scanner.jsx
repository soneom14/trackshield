import React, { useState } from "react";
import BASE_URL from "./api";

const Scanner = () => {
    const [id, setId] = useState("");

    const handleScan = () => {
        window.location.href = `${BASE_URL}/track/${id}`;
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Scanner</h2>

            <input
                placeholder="Enter Band ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />

            <button onClick={handleScan}>Track</button>
        </div>
    );
};

export default Scanner;