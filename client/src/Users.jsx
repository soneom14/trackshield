import React, { useEffect, useState } from "react";
import BASE_URL from "./api";

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Users</h2>

            {users.map((u, i) => (
                <div key={i} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                    <p><b>Band ID:</b> {u.bandId}</p>
                    <p><b>Parent:</b> {u.parentName}</p>
                    <p><b>Child:</b> {u.childName}</p>
                    <p><b>Phone:</b> {u.phone}</p>
                    <p><b>Address:</b> {u.address}</p>
                </div>
            ))}
        </div>
    );
};

export default Users;