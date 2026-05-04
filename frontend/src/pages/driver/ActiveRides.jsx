import { useState, useEffect } from "react";

function ActiveRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const driverId = user?._id || user?.id || "";

    fetch("https://local-ride-production.up.railway.app/api/rides", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) { setError("Data nahi aaya"); setLoading(false); return; }

        // Driver ID matching — har case handle karo
        const myRides = data.filter(r => {
          const d = r.driver;
          if (!d) return false;
          if (typeof d === "string") return d === driverId;
          if (typeof d === "object") return (d._id === driverId) || (d.id === driverId);
          return false;
        });

        setRides(myRides);
        setLoading(false);
      })
      .catch(() => { setError("Server se connect nahi ho saka"); setLoading(false); });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        :root { --purple:#4a1a8a; --purple2:#6b2fb5; --amber:#f5c842; --off:#f8f6ff; }
        body { font-family:'Plus Jakarta Sans',sans-serif; }
        .ar-page { min-height:100vh; background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%); padding:24px; }

        .ar-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .ar-back { width:40px; height:40px; background:rgba(255,255,255,0.12); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:18px; text-decoration:none; border:1px solid rgba(255,255,255,0.2); }
        .ar-logout { background:rgba(255,80,80,0.2); border:1px solid rgba(255,80,80,0.4); color:white; padding:8px 16px; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; }

        .ar-header { background:rgba(255,255,255,0.12); border-radius:20px; padding:20px 24px; color:white; margin-bottom:20px; display:flex; align-items:center; gap:12px; border:1px solid rgba(255,255,255,0.15); }
        .ar-icon { width:48px; height:48px; background:var(--amber); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .ar-title { font-size:20px; font-weight:800; }
        .ar-subtitle { font-size:12px; opacity:0.72; margin-top:2px; }

        .nav-pills { display:flex; gap:10px; margin-bottom:22px; }
        .nav-pill { flex:1; padding:11px; text-align:center; border-radius:12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; text-decoration:none; border:1.5px solid rgba(255,255,255,0.25); color:white; background:rgba(255,255,255,0.1); }
        .nav-pill.active { background:var(--amber); color:var(--purple); border-color:var(--amber); }

        .count-bar { background:rgba(255,255,255,0.12); border-radius:14px; padding:14px 18px; color:white; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; border:1px solid rgba(255,255,255,0.15); }
        .count-num { font-size:28px; font-weight:800; color:var(--amber); }
        .count-label { font-size:13px; opacity:0.75; margin-top:2px; }

        .ar-card { background:white; border-radius:18px; padding:20px; margin-bottom:12px; box-shadow:0 8px 24px rgba(74,26,138,0.15); border:1.5px solid #ede8f8; animation:slideUp 0.3s ease both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .ar-route { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .ar-city { font-size:19px; font-weight:800; color:var(--purple); }
        .ar-arrow { font-size:20px; color:var(--amber); font-weight:700; }
        .ar-info { display:flex; gap:8px; flex-wrap:wrap; }
        .ar-badge { background:var(--off); border:1.5px solid #ede8f8; border-radius:10px; padding:6px 14px; font-size:12px; color:var(--purple2); font-weight:600; }
        .ar-status { background:linear-gradient(135deg,var(--purple),var(--purple2)); border-radius:10px; padding:6px 14px; font-size:12px; color:white; font-weight:600; }

        .ar-empty { background:rgba(255,255,255,0.1); border-radius:20px; padding:48px 24px; text-align:center; color:white; border:1px solid rgba(255,255,255,0.15); }
        .ar-empty-icon { font-size:52px; margin-bottom:14px; }
        .ar-empty-text { font-size:18px; font-weight:800; margin-bottom:6px; }
        .ar-empty-sub { font-size:13px; opacity:0.7; margin-bottom:20px; }
        .post-btn { display:inline-block; background:var(--amber); color:var(--purple); padding:12px 28px; border-radius:12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800; text-decoration:none; }

        .error-box { background:rgba(255,80,80,0.15); border:1px solid rgba(255,80,80,0.3); border-radius:14px; padding:16px 20px; color:white; font-size:14px; margin-bottom:16px; }
        .ar-loading { text-align:center; color:rgba(255,255,255,0.7); padding:48px; font-size:16px; }
        .spinner { width:36px; height:36px; border:3px solid rgba(255,255,255,0.2); border-top-color:var(--amber); border-radius:50%; animation:spin 0.7s linear infinite; margin:0 auto 14px; }
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>

      <div className="ar-page">
        {/* TOP BAR */}
        <div className="ar-topbar">
          <a href="/" className="ar-back">←</a>
          <button className="ar-logout" onClick={logout}>Logout 🚪</button>
        </div>

        {/* HEADER */}
        <div className="ar-header">
          <div className="ar-icon">🚗</div>
          <div>
            <div className="ar-title">My Active Rides</div>
            <div className="ar-subtitle">LocalRide — Driver Panel</div>
          </div>
        </div>

        {/* NAV */}
        <div className="nav-pills">
          <a href="/driver/post" className="nav-pill">➕ Post Ride</a>
          <a href="/driver/active" className="nav-pill active">📋 Active Rides</a>
          <a href="/driver/wallet" className="nav-pill">💰 Wallet</a>
        </div>

        {/* ERROR */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* COUNT */}
        {!loading && !error && (
          <div className="count-bar">
            <div>
              <div className="count-num">{rides.length}</div>
              <div className="count-label">Total Active Rides</div>
            </div>
            <div style={{fontSize:32}}>🛣️</div>
          </div>
        )}

        {/* RIDES */}
        {loading ? (
          <div className="ar-loading">
            <div className="spinner"/>
            Rides load ho rahi hain...
          </div>
        ) : rides.length === 0 && !error ? (
          <div className="ar-empty">
            <div className="ar-empty-icon">🛣️</div>
            <div className="ar-empty-text">Koi active ride nahi</div>
            <div className="ar-empty-sub">Abhi pehli ride post karo!</div>
            <a href="/driver/post" className="post-btn">➕ Ride Post Karo</a>
          </div>
        ) : (
          rides.map((ride, i) => (
            <div className="ar-card" key={ride._id || i} style={{animationDelay:`${i*0.08}s`}}>
              <div className="ar-route">
                <span className="ar-city">{ride.startCity}</span>
                <span className="ar-arrow">→</span>
                <span className="ar-city">{ride.endCity}</span>
              </div>
              <div className="ar-info">
                <span className="ar-badge">💰 Rs. {ride.fare}</span>
                <span className="ar-badge">💺 {ride.seats || ride.availableSeats} Seats</span>
                <span className="ar-badge">
                  👥 {ride.bookings?.length || 0} Booked
                </span>
                <span className="ar-status">✅ {ride.status || "Active"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ActiveRides;