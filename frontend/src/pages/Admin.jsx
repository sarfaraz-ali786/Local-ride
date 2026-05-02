import { useState, useEffect } from "react";

function Admin() {
  const [rides, setRides] = useState([]);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(res => res.json())
      .then(data => { setRides(data); setMsg(""); })
      .catch(() => setMsg("Error loading"));
  }, []);

  return (

cd "C:/Users/HP/Desktop/Local-Ride"
cat > frontend/src/pages/Admin.jsx << 'EOF'
import { useState, useEffect } from "react";

function Admin() {
  const [rides, setRides] = useState([]);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(res => res.json())
      .then(data => { setRides(data); setMsg(""); })
      .catch(() => setMsg("Error loading"));
  }, []);

  return (
    <div style={{padding:"20px", maxWidth:"800px", margin:"auto"}}>
      <h2>Admin Panel</h2>
      {msg && <p>{msg}</p>}
      <h3>All Rides ({rides.length})</h3>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr style={{background:"#1a237e", color:"white"}}>
            <th style={{padding:"10px"}}>From</th>
            <th style={{padding:"10px"}}>To</th>
            <th style={{padding:"10px"}}>Seats</th>
            <th style={{padding:"10px"}}>Fare</th>
            <th style={{padding:"10px"}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rides.map(ride => (
            <tr key={ride._id} style={{borderBottom:"1px solid #ccc"}}>
              <td style={{padding:"10px"}}>{ride.startCity}</td>
              <td style={{padding:"10px"}}>{ride.endCity}</td>
              <td style={{padding:"10px"}}>{ride.availableSeats}</td>
              <td style={{padding:"10px"}}>Rs.{ride.fare}</td>
              <td style={{padding:"10px"}}>{ride.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/><a href="/">Back to Home</a>
    </div>
  );
}

export default Admin;
