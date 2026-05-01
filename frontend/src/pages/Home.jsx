import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const navigate = useNavigate();

  const search = () => {
    navigate(`/rides?from=${from}&to=${to}`);
  };

  return (
    <div style={{padding:"20px", maxWidth:"500px", margin:"auto", textAlign:"center"}}>
      <h1>🚗 Local Ride</h1>
      <h3>Ride Dhundo</h3>
      <input placeholder="Kahan Se (e.g. Hyderabad)" value={from} onChange={e=>setFrom(e.target.value)} style={{width:"100%", padding:"10px", margin:"5px 0"}} /><br/>
      <input placeholder="Kahan Tak (e.g. Karachi)" value={to} onChange={e=>setTo(e.target.value)} style={{width:"100%", padding:"10px", margin:"5px 0"}} /><br/>
      <button onClick={search} style={{width:"100%", padding:"10px", background:"#007bff", color:"white", border:"none", marginTop:"10px"}}>🔍 Search Rides</button>
      <br/><br/>
      <a href="/login">Login</a> | <a href="/register">Register</a> | <a href="/driver/post">Post Ride</a>
    </div>
  );
}

export default Home;
