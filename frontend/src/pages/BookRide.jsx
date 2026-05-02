import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function BookRide() {
  const { id } = useParams();
  const [seats, setSeats] = useState(1);
  const [msg, setMsg] = useState("");
  const [ride, setRide] = useState(null);

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(res => res.json())
      .then(data => {
        const found = data.find(r => r._id === id);
        if(found) setRide(found);
      });
  }, [id]);

  const handleBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if(!token || !userStr) { setMsg("Pehle login karo!"); return; }
      const user = JSON.parse(userStr);
      const res = await fetch(
        "https://local-ride-production.up.railway.app/api/bookings/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            passenger: user.id,
            ride: id,
            pickupStop: ride?.startCity || "Start",
            dropoffStop: ride?.endCity || "End",
            fare: Number(ride?.fare) || 0,
            seatsBooked: Number(seats)
          })
        }
      );
      const data = await res.json();
      if(res.ok) { setMsg("Booking Successful!"); }
      else { setMsg("Error: " + (data.message || "Unknown")); }
    } catch(err) {
      setMsg("Network error: " + err.message);
    }
  };

  return (
    <div style={{padding:"20px", maxWidth:"400px", margin:"auto", textAlign:"center"}}>
      <h2>Book Ride</h2>
      {ride && (
        <div style={{background:"#f0f0f0", padding:"15px", borderRadius:"8px", marginBottom:"15px"}}>
          <b>{ride.startCity} to {ride.endCity}</b>
          <p>Fare: Rs.{ride.fare} | Seats: {ride.availableSeats}</p>
        </div>
      )}
      {msg && <p style={{color: msg.includes("Successful") ? "green" : "red", fontWeight:"bold"}}>{msg}</p>}
      <input type="number" min="1" max="4" value={seats}
        onChange={e => setSeats(e.target.value)}
        style={{width:"100%", padding:"10px", margin:"10px 0"}} />
      <button onClick={handleBook}
        style={{width:"100%", padding:"12px", background:"#1a237e", color:"white", border:"none", borderRadius:"4px", fontSize:"16px"}}>
        Confirm Booking
      </button>
      <br/><br/><a href="/">Back to Home</a>
    </div>
  );
}

export default BookRide;
