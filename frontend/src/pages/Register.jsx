import { useState } from "react";
function Register() {
  const [form, setForm] = useState({name:"",phone:"",cnic:"",password:"",role:"passenger",agreedToTerms:false});
  const [msg, setMsg] = useState("");
  const handle = e => setForm({...form, [e.target.name]: e.target.type==="checkbox" ? e.target.checked : e.target.value});
  const handleRegister = async () => {
    if(!form.agreedToTerms){setMsg("Terms accept karo!"); return;}
    const res = await fetch("https://local-ride-production.up.railway.app/api/auth/register",{
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)
    });
    const data = await res.json();
    if(res.ok){setMsg("Register Successful! Ab login karo."); window.location.href="/login";}
    else setMsg(data.message||"Error");
  };
  return (
    <div style={{padding:"20px",maxWidth:"400px",margin:"auto"}}>
      <h2>Register</h2>
      {msg && <p style={{color:"red"}}>{msg}</p>}
      <input name="name" placeholder="Name" onChange={handle} style={{width:"100%",padding:"10px",margin:"8px 0"}} />
      <input name="phone" placeholder="Phone" onChange={handle} style={{width:"100%",padding:"10px",margin:"8px 0"}} />
      <input name="cnic" placeholder="CNIC" onChange={handle} style={{width:"100%",padding:"10px",margin:"8px 0"}} />
      <input name="password" type="password" placeholder="Password" onChange={handle} style={{width:"100%",padding:"10px",margin:"8px 0"}} />
      <select name="role" onChange={handle} style={{width:"100%",padding:"10px",margin:"8px 0"}}>
        <option value="passenger">Passenger</option>
        <option value="driver">Driver</option>
      </select>
      <label><input name="agreedToTerms" type="checkbox" onChange={handle} /> Terms & Conditions accept karta hoon</label>
      <button onClick={handleRegister} style={{width:"100%",padding:"12px",background:"#1a237e",color:"white",border:"none",marginTop:"10px"}}>Register</button>
      <p>Already registered? <a href="/login">Login karo</a></p>
    </div>
  );
}
export default Register;
