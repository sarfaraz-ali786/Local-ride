import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RideResults() {
  const [rides, setRides] = useState([]);
  const [msg, setMsg] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");
    fetch(`https://local-ride-production.up.railway.app/api/rides/search?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) setMsg("Koi ride nahi mili!");
        else setMsg("");
        setRides(data);
      })
      .catch(() => setMsg("Error loading rides"));
  }, []);

  return (
    <div style={{padding:"20px", maxWidth:"600px", margin:"auto"}}>
      <h2>Available Rides</h2>
      {msg && <p>{msg}</p>}
      {rides.map(ride => (
        <div key={ride._id} style={{border:"1px solid #ccc", padding:"15px", marginBottom:"10px", borderRadius:"8px"}}>
          <h3>{ride.startCity} → {ride.endCity}</h3>
          <p>Seats: {ride.availableSeats} | Fare: Rs.{ride.fare}</p>
          <p>Driver: {ride.driver?.name}</p>
          <button onClick={() => navigate(`/book/${ride._id}`)} style={{padding:"8px 15px", background:"#007bff", color:"white", border:"none", borderRadius:"4px"}}>Book Ride</button>
        </div>
      ))}
      <br/>
      <a href="/">Back</a>
    </div>
  );
}

export default RideResults;
