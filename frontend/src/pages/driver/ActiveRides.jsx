import { useState, useEffect } from "react";

function ActiveRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const driverId = user?._id || user?.id;
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(res => res.json())
      .then(data => {
        setRides(data.filter(r => r.driver === driverId || r.driver?._id === driverId));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        :root { --purple:#4a1a8a; --purple2:#6b2fb5; --purple3:#8b3fd4; --amber:#f5c842; --off:#f8f6ff; --muted:#7a7a9a; }
        body { font-family:'DM Sans',sans-serif; }
        .ar-page { min-height:100vh; background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%); padding:24px; }
        .ar-header { background:rgba(255,255,255,0.12); border-radius:20px; padding:20px 24px; color:white; margin-bottom:20px; display:flex; align-items:center; gap:12px; border:1px solid rgba(255,255,255,0.15); }
        .ar-icon { width:48px; height:48px; background:var(--amber); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; }
        .ar-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; }
        .ar-subtitle { font-size:12px; opacity:0.72; margin-top:2px; }
        .ar-card { background:white; border-radius:18px; padding:20px; margin-bottom:12px; box-shadow:0 8px 24px rgba(74,26,138,0.15); border:1.5px solid #ede8f8; }
        .ar-route { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .ar-city { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:var(--purple); }
        .ar-arrow { font-size:20px; color:var(--amber); font-weight:700; }
        .ar-info { display:flex; gap:8px; flex-wrap:wrap; }
        .ar-badge { background:var(--off); border:1.5px solid #ede8f8; border-radius:10px; padding:6px 14px; font-size:12px; color:var(--purple2); font-weight:600; }
        .ar-status { background:linear-gradient(135deg,var(--purple),var(--purple2)); border-radius:10px; padding:6px 14px; font-size:12px; color:white; font-weight:600; }
        .ar-empty { background:rgba(255,255,255,0.1); border-radius:20px; padding:48px; text-align:center; color:white; border:1px solid rgba(255,255,255,0.15); }
        .ar-empty-icon { font-size:52px; margin-bottom:14px; }
        .ar-empty-text { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:6px; }
        .ar-empty-sub { font-size:13px; opacity:0.7; }
        .ar-back { display:block; text-align:center; margin-top:24px; color:var(--amber); font-size:13px; font-weight:600; text-decoration:none; }
        .ar-loading { text-align:center; color:rgba(255,255,255,0.7); padding:48px; font-size:16px; }
      `}</style>
      <div className="ar-page">
        <div className="ar-header">
          <div className="ar-icon">🚗</div>
          <div>
            <div className="ar-title">My Active Rides</div>
            <div className="ar-subtitle">Local Ride — Driver Panel</div>
          </div>
        </div>
        {loading ? (
          <div className="ar-loading">Loading rides...</div>
        ) : rides.length === 0 ? (
          <div className="ar-empty">
            <div className="ar-empty-icon">🛣️</div>
            <div className="ar-empty-text">Koi active ride nahi</div>
            <div className="ar-empty-sub">Post Ride karke shuru karo!</div>
          </div>
        ) : (
          rides.map((ride, i) => (
            <div className="ar-card" key={i}>
              <div className="ar-route">
                <span className="ar-city">{ride.startCity}</span>
                <span className="ar-arrow">→</span>
                <span className="ar-city">{ride.endCity}</span>
              </div>
              <div className="ar-info">
                <span className="ar-badge">💰 Rs. {ride.fare}</span>
                <span className="ar-badge">💺 {ride.seats} Seats</span>
                <span className="ar-status">✅ {ride.status || "Active"}</span>
              </div>
            </div>
          ))
        )}
        <a href="/" className="ar-back">← Wapas Jao</a>
      </div>
    </>
  );
}
export default ActiveRides;