import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name:"", phone:"", cnic:"", password:"", role:"passenger", agreedToTerms:false });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.agreedToTerms) { setMsg("Terms agree karo!"); return; }
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) { setMsg("Register ho gaya!"); navigate("/login"); }
      else { setMsg(data.message || "Error"); }
    } catch (err) { setMsg("Network error!"); }
  };

  return (
    <div style={{padding:"20px", maxWidth:"400px", margin:"auto", textAlign:"center"}}>
      <h2>Register</h2>
      {msg && <p style={{color:"red"}}>{msg}</p>}
      <input placeholder="Full Name" onChange={e=>setForm({...form,name:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input placeholder="Phone Number" onChange={e=>setForm({...form,phone:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input placeholder="CNIC Number" onChange={e=>setForm({...form,cnic:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <select onChange={e=>setForm({...form,role:e.target.value})} style={{width:"100%",padding:"10px",margin:"5px 0"}}>
        <option value="passenger">Passenger</option>
        <option value="driver">Driver</option>
      </select><br/>
      <label><input type="checkbox" onChange={e=>setForm({...form,agreedToTerms:e.target.checked})} /> Terms & Conditions se agree karta hoon</label><br/><br/>
      <button onClick={handleRegister} style={{width:"100%",padding:"10px",background:"#28a745",color:"white",border:"none"}}>Register</button>
      <br/><br/><a href="/login">Login karo</a>
    </div>
  );
}

export default Register;
