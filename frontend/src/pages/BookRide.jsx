import { useState } from "react";
import { useParams } from "react-router-dom";

function BookRide() {
  const { id } = useParams();
  const [seats, setSeats] = useState(1);
  const [msg, setMsg] = useState("");

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://local-ride-production.up.railway.app/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ rideId: id, seatsBooked: seats })
      }
    );
    const data = await res.json();
    if (res.ok) { setMsg("Booking Successful!"); }
    else { setMsg(data.message || "Error occurred"); }
  };

  return (
    <div style={{padding:"20px", maxWidth:"400px", margin:"auto"}}>
      <h2>Book Ride</h2>
      {msg && <p style={{color:"green"}}>{msg}</p>}
      <input type="number" min="1" max="4" value={seats}
        onChange={e => setSeats(e.target.value)} /><br/><br/>
      <button onClick={handleBook}>Confirm Booking</button>
      <br/><br/><a href="/">Back to Home</a>
    </div>
  );
}
export default BookRide;
