import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/user/${id}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!user) return <h2>Loading...</h2>;

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>User Profile</h1>
            <p><b>Band ID:</b> {user.bandId}</p>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>Address:</b> {user.address}</p>
            <p><b>Persons:</b> {user.persons}</p>
            <p><b>Management:</b> {user.managementNumber}</p>
        </div>
    );
}

export default Profile;