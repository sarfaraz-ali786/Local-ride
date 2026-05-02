import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/driver/post");
      } else {
        setMsg(data.message || "Login failed");
      }
    } catch (err) {
      setMsg("Network error!");
    }
  };

  return (
    <div style={{padding:"20px", maxWidth:"400px", margin:"auto", textAlign:"center"}}>
      <h2>Login</h2>
      {msg && <p style={{color:"red"}}>{msg}</p>}
      <input placeholder="Phone Number" onChange={e=>setPhone(e.target.value)} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:"10px",margin:"5px 0"}} /><br/>
      <button onClick={handleLogin} style={{width:"100%",padding:"10px",background:"#007bff",color:"white",border:"none"}}>Login</button>
      <br/><br/><a href="/register">Register karo</a>
    </div>
  );
}

export default Login;
