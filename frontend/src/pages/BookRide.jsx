import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function BookRide() {
  const { id } = useParams();
  const [seats, setSeats] = useState(1);
  const [msg, setMsg] = useState("");
  const [ride, setRide] = useState(null);

  useEffect(() => {
    fetch(`https://local-ride-production.up.railway.app/api/rides`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(r => r._id === id);
        if(found) setRide(found);
      });
  }, [id]);

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if(!token) { setMsg("Pehle login karo!"); return; }
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch("https://local-ride-production.up.railway.app/api/bookings/book", {
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
        fare: ride?.fare || 0,
        seatsBooked: Number(seats)
      })
    });
    const data = await res.json();
    if(res.ok) { setMsg("Booking Successful! ✅"); }
    else { setMsg(data.message || "Error occurred"); }
  };

  return (
    <div style={{padding:"20px", maxWidth:"400px", margin:"auto", textAlign:"center"}}>
      <h2>Book Ride</h2>
      {ride && (
        <div style={{background:"#f5f5f5", padding:"15px", borderRadius:"8px", marginBottom:"15px"}}>
          <p><b>{ride.startCity} → {ride.endCity}</b></p>
          <p>Fare: Rs.{ride.fare} | Seats: {ride.availableSeats}</p>
        </div>
      )}
      {msg && <p style={{color: msg.includes("Successful") ? "green" : "red"}}>{msg}</p>}
      <input type="number" min="1" max="4" value={seats}
        onChange={e => setSeats(e.target.value)}
        style={{width:"100%", padding:"10px", margin:"5px 0"}} /><br/><br/>
      <button onClick={handleBook} style={{width:"100%", padding:"12px", background:"#1a237e", color:"white", border:"none", borderRadius:"4px"}}>Confirm Booking</button>
      <br/><br/><a href="/">Back to Home</a>
    </div>
  );
}

export default BookRide;
