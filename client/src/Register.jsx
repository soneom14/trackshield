import React, { useState } from "react";
import BASE_URL from "./api";

const Register = () => {
    const [form, setForm] = useState({
        parentName: "",
        childName: "",
        phone: "",
        address: "",
        bandId: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        alert("User Registered ✅");
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>TrackShield Registration</h1>

            <input name="parentName" placeholder="Parent Name" onChange={handleChange} /><br />
            <input name="childName" placeholder="Child Name" onChange={handleChange} /><br />
            <input name="phone" placeholder="Phone" onChange={handleChange} /><br />
            <input name="address" placeholder="Address" onChange={handleChange} /><br />
            <input name="bandId" placeholder="Band ID" onChange={handleChange} /><br />

            <button onClick={handleSubmit}>Register</button>
        </div>
    );
};

export default Register;