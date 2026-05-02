import { useState, useEffect } from "react";

function Admin() {
  const [rides, setRides] = useState([]);
  const [msg, setMsg] = useState("Loading rides...");

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(res => res.json())
      .then(data => {
        console.log("Rides:", data);
        if(Array.isArray(data)) {
          setRides(data);
          setMsg(data.length === 0 ? "Koi ride nahi hai" : "");
        } else {
          setMsg("Data error");
        }
      })
      .catch(err => {
        console.log("Error:", err);
        setMsg("Network error!");
      });
  }, []);

  return (
    <div style={{padding:"20px", maxWidth:"800px", margin:"auto"}}>
      <h2 style={{color:"#1a237e"}}>🛡️ Admin Panel</h2>
      {msg && <p style={{color:"red"}}>{msg}</p>}
      <h3>Total Rides: {rides.length}</h3>
      {rides.map(ride => (
        <div key={ride._id} style={{border:"1px solid #ccc", padding:"15px", marginBottom:"10px", borderRadius:"8px", background:"#f5f5f5"}}>
          <b>{ride.startCity} → {ride.endCity}</b>
          <p>Seats: {ride.availableSeats} | Fare: Rs.{ride.fare} | Status: {ride.status}</p>
          <p>Driver: {ride.driver?.name || "Unknown"}</p>
        </div>
      ))}
      <br/><a href="/">Back to Home</a>
    </div>
  );
}

export default Admin;
