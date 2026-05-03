import { useState } from "react";

function PostRide() {
  const [form, setForm] = useState({
    startCity: "", endCity: "", seats: 1, fare: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const cities = ["Karachi","Hyderabad","Jamshoro","Kotri","Sukkur",
    "Larkana","Nawabshah","Mirpurkhas","Thatta","Badin"];

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setMsg("Pehle login karo!"); return; }
    const user = JSON.parse(localStorage.getItem("user"));
    setLoading(true);
    try {
      const res = await fetch(
        "https://local-ride-production.up.railway.app/api/rides/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            driver: user?._id || user?.id,
            startCity: form.startCity,
            endCity: form.endCity,
            seats: Number(form.seats),
            fare: Number(form.fare)
          })
        }
      );
      const data = await res.json();
      if (res.ok) setMsg("Ride Posted! ✅");
      else setMsg("Error: " + (data.message || "Kuch ghalat hua"));
    } catch {
      setMsg("Network error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pr-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a5c36 0%, #1a8a4a 50%, #0d7a3e 100%);
          font-family: 'Poppins', sans-serif;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .pr-card {
          background: white; border-radius: 20px; width: 100%; max-width: 420px;
          overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pr-header {
          background: linear-gradient(135deg, #1a8a4a, #0a5c36);
          padding: 28px 24px; color: white;
          display: flex; align-items: center; gap: 12px;
        }
        .pr-icon {
          width: 46px; height: 46px; background: rgba(255,255,255,0.2);
          border-radius: 12px; display: flex; align-items: center;
          justify-content: center; font-size: 22px;
        }
        .pr-title { font-size: 20px; font-weight: 700; }
        .pr-subtitle { font-size: 12px; opacity: 0.75; }
        .pr-body { padding: 24px; }
        .pr-label { font-size: 12px; font-weight: 600; color: #555; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .pr-select, .pr-input {
          width: 100%; padding: 12px 14px; border: 1.5px solid #ddd;
          border-radius: 10px; font-size: 14px; font-family: 'Poppins', sans-serif;
          margin-bottom: 16px; outline: none; transition: border 0.2s;
          appearance: none; background: white;
        }
        .pr-select:focus, .pr-input:focus { border-color: #1a8a4a; }
        .pr-row { display: flex; gap: 12px; }
        .pr-row > div { flex: 1; }
        .pr-msg {
          text-align: center; padding: 10px; border-radius: 10px;
          font-size: 13px; font-weight: 500; margin-bottom: 14px;
        }
        .pr-msg.success { background: #d4edda; color: #155724; }
        .pr-msg.error { background: #f8d7da; color: #721c24; }
        .pr-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #1a8a4a, #0a5c36);
          color: white; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 4px 15px rgba(26,138,74,0.4);
          transition: transform 0.15s;
        }
        .pr-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .pr-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .pr-back { display: block; text-align: center; margin-top: 14px; color: #1a8a4a; font-size: 13px; font-weight: 600; text-decoration: none; }
      `}</style>
      <div className="pr-page">
        <div className="pr-card">
          <div className="pr-header">
            <div className="pr-icon">🚗</div>
            <div>
              <div className="pr-title">Post a Ride</div>
              <div className="pr-subtitle">Local Ride — Driver Panel</div>
            </div>
          </div>
          <div className="pr-body">
            <div className="pr-label">From City</div>
            <select className="pr-select" value={form.startCity}
              onChange={e => setForm({...form, startCity: e.target.value})}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="pr-label">To City</div>
            <select className="pr-select" value={form.endCity}
              onChange={e => setForm({...form, endCity: e.target.value})}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="pr-row">
              <div>
                <div className="pr-label">Seats</div>
                <input className="pr-input" type="number" min="1" max="8"
                  value={form.seats}
                  onChange={e => setForm({...form, seats: e.target.value})}
                  placeholder="Seats" />
              </div>
              <div>
                <div className="pr-label">Fare (Rs.)</div>
                <input className="pr-input" type="number"
                  value={form.fare}
                  onChange={e => setForm({...form, fare: e.target.value})}
                  placeholder="Amount" />
              </div>
            </div>

            {msg && (
              <div className={`pr-msg ${msg.includes("✅") ? "success" : "error"}`}>
                {msg}
              </div>
            )}

            <button className="pr-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "🚀 Post Ride"}
            </button>
            <a href="/" className="pr-back">← Wapas Jao</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostRide;