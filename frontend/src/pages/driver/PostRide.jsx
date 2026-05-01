import { useState } from "react";

function PostRide() {
  const [form, setForm] = useState({
    startCity: "",
    endCity: "",
    departureTime: "",
    totalSeats: "",
    fare: "",
    stops: ""
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://local-ride-production.up.railway.app/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          totalSeats: Number(form.totalSeats),
          fare: Number(form.fare),
          stops: form.stops.split(",")
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Ride Posted Successfully!");
      } else {
        setMessage(data.message || "Error posting ride");
      }
    } catch (err) {
      setMessage("Network error!");
    }
  };

  return (
    <div style={{padding:"20px", maxWidth:"500px", margin:"auto"}}>
      <h2>Post a Ride</h2>
      {message && <p style={{color:"green"}}>{message}</p>}
      <input placeholder="Start City" onChange={e=>setForm({...form,startCity:e.target.value})} /><br/><br/>
      <input placeholder="End City" onChange={e=>setForm({...form,endCity:e.target.value})} /><br/><br/>
      <input type="datetime-local" onChange={e=>setForm({...form,departureTime:e.target.value})} /><br/><br/>
      <input placeholder="Total Seats" onChange={e=>setForm({...form,totalSeats:e.target.value})} /><br/><br/>
      <input placeholder="Fare (PKR)" onChange={e=>setForm({...form,fare:e.target.value})} /><br/><br/>
      <input placeholder="Stops (comma separated)" onChange={e=>setForm({...form,stops:e.target.value})} /><br/><br/>
      <button onClick={handleSubmit}>Post Ride</button>
    </div>
  );
}

export default PostRide;
