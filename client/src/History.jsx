import { useEffect, useState } from "react";
import axios from "axios";

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/history")
            .then(res => setHistory(res.data));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Scan History</h1>

            {history.map((item, i) => (
                <div key={i} style={{ background: "#1e293b", color: "white", margin: "10px", padding: "10px" }}>
                    <p>🎫 {item.bandId}</p>
                    <p>👶 {item.childName}</p>
                    <p>👨 {item.parentName}</p>
                    <p>📲 {item.scannedBy}</p>
                </div>
            ))}
        </div>
    );
}

export default History;