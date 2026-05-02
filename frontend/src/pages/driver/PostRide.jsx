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
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          ...form,
          totalSeats: Number(form.totalSeats),
          fare: Number(form.fare),
          stops: form.stops ? form.stops.split(",") : []
        })
      });
      const data = await res.json();
      if (res.ok) { setMessage("Ride Posted Successfully!"); }
      else { setMessage(data.message || "Error posting ride"); }
    } catch (err) {
      setMessage("Network error!");
    }
  };

  return (
    <div style={{padding:"20px", maxWidth:"500px", margin:"auto", textAlign:"center"}}>
      <h2>Ride Post Karo</h2>
      {message && <p style={{color:"green"}}>{message}</p>}
      <input placeholder="Start City" onChange={e=>setForm({...form,startCity:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input placeholder="End City" onChange={e=>setForm({...form,endCity:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input type="date" onChange={e=>setForm({...form,departureTime:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input placeholder="Total Seats" onChange={e=>setForm({...form,totalSeats:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input placeholder="Fare (PKR)" onChange={e=>setForm({...form,fare:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input placeholder="Stops (comma separated)" onChange={e=>setForm({...form,stops:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <button onClick={handleSubmit} style={{width:"100%",padding:"12px",background:"#1a237e",color:"white",border:"none",marginTop:"10px",fontSize:"16px"}}>Ride Post Karo</button>
      <br/><br/><a href="/">Wapas Jao</a>
    </div>
  );
}

export default PostRide;
