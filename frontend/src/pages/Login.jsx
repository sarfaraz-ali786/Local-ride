import { useState } from "react";
function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const handleLogin = async () => {
    const res = await fetch("https://local-ride-production.up.railway.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if(res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } else { setMsg(data.message || "Error"); }
  };
  return (
    <div style={{padding:"20px",maxWidth:"400px",margin:"auto"}}>
      <h2>Login</h2>
      {msg && <p style={{color:"red"}}>{msg}</p>}
      <input placeholder="Phone" onChange={e=>setPhone(e.target.value)} style={{width:"100%",padding:"10px",margin:"8px 0"}} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:"10px",margin:"8px 0"}} />
      <button onClick={handleLogin} style={{width:"100%",padding:"12px",background:"#1a237e",color:"white",border:"none"}}>Login</button>
    </div>
  );
}
export default Login;
