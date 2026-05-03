import { useState } from "react";

const CITIES = [
  "Karachi","Hyderabad","Sukkur","Larkana","Nawabshah",
  "Mirpurkhas","Jacobabad","Shikarpur","Dadu","Thatta",
  "Matli","Badin","Tando Adam","Tando Allahyar","Kotri",
];

export default function PostRide() {
  const [form, setForm] = useState({
    startCity:"", endCity:"", seats:"", fare:"", departureTime:""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/rides/create", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
        body: JSON.stringify({
          startCity: form.startCity,
          endCity: form.endCity,
          seats: Number(form.seats),
          totalSeats: Number(form.seats),
          availableSeats: Number(form.seats),
          fare: Number(form.fare),
          departureTime: form.departureTime,
        }),
      });
      const data = await res.json();
      if (res.ok) { setSuccess(true); }
      else { setError(data.message || "Error posting ride"); }
    } catch { setError("Server se connection nahi!"); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--purple:#4a1a8a;--purple2:#6b2fb5;--purple3:#8b3fd4;--amber:#f5c842;--off:#f8f6ff;--muted:#7a7a9a;}
        body{font-family:'DM Sans',sans-serif;}
        .page{min-height:100vh;background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%);display:flex;align-items:center;justify-content:center;padding:24px;}
        .card{background:white;border-radius:24px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 30px 80px rgba(74,26,138,0.4);}
        .header{background:linear-gradient(135deg,var(--purple2),var(--purple));padding:24px;color:white;display:flex;align-items:center;gap:12px;}
        .h-icon{width:48px;height:48px;background:var(--amber);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;}
        .h-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;}
        .h-sub{font-size:12px;opacity:0.72;margin-top:2px;}
        .body{padding:28px;}
        .field{margin-bottom:18px;}
        .field label{display:block;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;}
        .field select,.field input{width:100%;padding:13px 16px;border:2px solid #ede8f8;border-radius:12px;font-size:15px;font-family:'DM Sans',sans-serif;color:#333;background:var(--off);outline:none;transition:all 0.2s;appearance:none;}
        .field select:focus,.field input:focus{border-color:var(--purple3);background:white;box-shadow:0 0 0 4px rgba(139,63,212,0.08);}
        .row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .error{background:#fff0f5;border:1.5px solid #ffb3cc;border-radius:10px;padding:10px 14px;font-size:13px;color:#cc2255;margin-bottom:16px;text-align:center;}
        .success{background:#f0fff4;border:1.5px solid #9ae6b4;border-radius:16px;padding:28px;text-align:center;}
        .success h3{font-family:'Syne',sans-serif;font-size:20px;color:var(--purple);margin-bottom:8px;}
        .success p{font-size:14px;color:var(--muted);margin-bottom:20px;}
        .btn{width:100%;padding:14px;background:linear-gradient(135deg,var(--purple2),var(--purple));color:white;border:none;border-radius:14px;font-family:'Syne',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 8px 24px rgba(74,26,138,0.35);}
        .btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(74,26,138,0.45);}
        .btn:disabled{opacity:0.7;cursor:not-allowed;transform:none;}
        .btn-amber{background:var(--amber);color:var(--purple);box-shadow:0 8px 24px rgba(245,200,66,0.4);}
        .btn-amber:hover{background:#ffd84d;}
        .back{display:block;text-align:center;margin-top:16px;color:var(--purple2);font-size:13px;font-weight:600;text-decoration:none;}
        .back:hover{text-decoration:underline;}
      `}</style>
      <div className="page">
        <div className="card">
          <div className="header">
            <div className="h-icon">🚗</div>
            <div>
              <div className="h-title">Post a Ride</div>
              <div className="h-sub">Local Ride — Driver Panel</div>
            </div>
          </div>
          <div className="body">
            {success ? (
              <div className="success">
                <div style={{fontSize:52,marginBottom:12}}>🎉</div>
                <h3>Ride Post Ho Gayi!</h3>
                <p>Aapki ride successfully post ho gayi. Passengers book kar sakte hain.</p>
                <button className="btn btn-amber" onClick={()=>setSuccess(false)}>+ Aur Post Karo</button>
                <a href="/" className="back">← Wapas Jao</a>
              </div>
            ) : (
              <form onSubmit={submit}>
                {error && <div className="error">⚠️ {error}</div>}
                <div className="field">
                  <label>From City</label>
                  <select name="startCity" value={form.startCity} onChange={handle} required>
                    <option value="">Sheher chunein</option>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>To City</label>
                  <select name="endCity" value={form.endCity} onChange={handle} required>
                    <option value="">Sheher chunein</option>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="row">
                  <div className="field">
                    <label>Seats</label>
                    <input type="number" name="seats" min="1" max="8" placeholder="4" value={form.seats} onChange={handle} required/>
                  </div>
                  <div className="field">
                    <label>Fare (Rs.)</label>
                    <input type="number" name="fare" min="1" placeholder="500" value={form.fare} onChange={handle} required/>
                  </div>
                </div>
                <div className="field">
                  <label>Departure Time</label>
                  <input type="datetime-local" name="departureTime" value={form.departureTime} onChange={handle} required/>
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Posting..." : "🚀 Post Ride"}
                </button>
                <a href="/" className="back">← Wapas Jao</a>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}