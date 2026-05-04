import { useState, useEffect, useRef, useCallback } from "react";

// ─── useDriverNotifications Hook ───────────────────────────────────────────────
function useDriverNotifications(rides) {
  const [notifications, setNotifications] = useState([]);
  const prevBookingCounts = useRef({});

  const addNotification = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (!rides || rides.length === 0) return;

    rides.forEach(ride => {
      const rideId = ride._id;
      const currentCount = ride.bookings?.length || 0;
      const prevCount = prevBookingCounts.current[rideId];

      if (prevCount !== undefined && currentCount > prevCount) {
        const diff = currentCount - prevCount;
        addNotification(
          `🎉 ${ride.startCity} → ${ride.endCity} ride mein ${diff} naya booking aaya!`
        );
      }
      prevBookingCounts.current[rideId] = currentCount;
    });
  }, [rides, addNotification]);

  return { notifications, dismissNotification };
}
// ───────────────────────────────────────────────────────────────────────────────

function ActiveRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auto-refresh every 30 seconds to detect new bookings
  const fetchRides = useCallback(() => {
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
        if (!Array.isArray(data)) {
          setError("Data nahi aaya");
          setLoading(false);
          return;
        }

        const myRides = data.filter(r => {
          const d = r.driver;
          if (!d) return false;
          if (typeof d === "string") return d === driverId;
          if (typeof d === "object") return (d._id === driverId) || (d.id === driverId);
          return false;
        });

        setRides(myRides);
        setLoading(false);
        setError("");
      })
      .catch(() => {
        setError("Server se connect nahi ho saka");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRides();
    // Poll every 30 seconds for new bookings
    const interval = setInterval(fetchRides, 30000);
    return () => clearInterval(interval);
  }, [fetchRides]);

  const { notifications, dismissNotification } = useDriverNotifications(rides);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const totalBookings = rides.reduce((sum, r) => sum + (r.bookings?.length || 0), 0);
  const totalEarnings = rides.reduce((sum, r) => sum + ((r.bookings?.length || 0) * (r.fare || 0)), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        :root { --purple:#4a1a8a; --purple2:#6b2fb5; --amber:#f5c842; --off:#f8f6ff; }
        body { font-family:'Plus Jakarta Sans',sans-serif; }
        .ar-page { min-height:100vh; background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%); padding:24px; }

        /* ─── Notification Toast ─── */
        .notif-stack { position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; max-width:320px; }
        .notif-toast { background:white; border-left:4px solid var(--amber); border-radius:14px; padding:14px 16px; box-shadow:0 8px 32px rgba(74,26,138,0.25); display:flex; align-items:flex-start; gap:10px; animation:toastIn 0.35s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes toastIn { from{opacity:0;transform:translateX(60px);} to{opacity:1;transform:translateX(0);} }
        .notif-msg { font-size:13px; font-weight:700; color:var(--purple); flex:1; line-height:1.4; }
        .notif-close { background:none; border:none; cursor:pointer; font-size:16px; color:#aaa; flex-shrink:0; padding:0; line-height:1; }

        /* ─── Top Bar ─── */
        .ar-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .ar-back { width:40px; height:40px; background:rgba(255,255,255,0.12); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:18px; text-decoration:none; border:1px solid rgba(255,255,255,0.2); }
        .ar-logout { background:rgba(255,80,80,0.2); border:1px solid rgba(255,80,80,0.4); color:white; padding:8px 16px; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; }

        /* ─── Header ─── */
        .ar-header { background:rgba(255,255,255,0.12); border-radius:20px; padding:20px 24px; color:white; margin-bottom:20px; display:flex; align-items:center; gap:12px; border:1px solid rgba(255,255,255,0.15); }
        .ar-icon { width:48px; height:48px; background:var(--amber); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .ar-title { font-size:20px; font-weight:800; }
        .ar-subtitle { font-size:12px; opacity:0.72; margin-top:2px; }

        /* ─── Nav ─── */
        .nav-pills { display:flex; gap:10px; margin-bottom:22px; }
        .nav-pill { flex:1; padding:11px; text-align:center; border-radius:12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; text-decoration:none; border:1.5px solid rgba(255,255,255,0.25); color:white; background:rgba(255,255,255,0.1); }
        .nav-pill.active { background:var(--amber); color:var(--purple); border-color:var(--amber); }

        /* ─── Stats Row ─── */
        .stats-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:18px; }
        .stat-card { background:rgba(255,255,255,0.12); border-radius:14px; padding:14px 12px; color:white; text-align:center; border:1px solid rgba(255,255,255,0.15); }
        .stat-num { font-size:22px; font-weight:800; color:var(--amber); }
        .stat-label { font-size:10px; opacity:0.72; margin-top:3px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }

        /* ─── Refresh Bar ─── */
        .refresh-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
        .refresh-hint { font-size:11px; color:rgba(255,255,255,0.55); }
        .refresh-btn { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); color:white; padding:6px 14px; border-radius:8px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; cursor:pointer; }

        /* ─── Ride Cards ─── */
        .ar-card { background:white; border-radius:18px; padding:20px; margin-bottom:12px; box-shadow:0 8px 24px rgba(74,26,138,0.15); border:1.5px solid #ede8f8; animation:slideUp 0.3s ease both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .ar-route { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .ar-city { font-size:19px; font-weight:800; color:var(--purple); }
        .ar-arrow { font-size:20px; color:var(--amber); font-weight:700; }
        .ar-info { display:flex; gap:8px; flex-wrap:wrap; }
        .ar-badge { background:var(--off); border:1.5px solid #ede8f8; border-radius:10px; padding:6px 14px; font-size:12px; color:var(--purple2); font-weight:600; }
        .ar-status { background:linear-gradient(135deg,var(--purple),var(--purple2)); border-radius:10px; padding:6px 14px; font-size:12px; color:white; font-weight:600; }
        .booking-fill { margin-top:12px; }
        .fill-label { display:flex; justify-content:space-between; font-size:11px; color:#888; font-weight:600; margin-bottom:5px; }
        .fill-track { background:#ede8f8; border-radius:99px; height:6px; overflow:hidden; }
        .fill-bar { height:100%; background:linear-gradient(90deg,var(--purple),var(--purple2)); border-radius:99px; transition:width 0.5s ease; }

        /* ─── Empty State ─── */
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

      {/* ─── Notification Toasts ─── */}
      <div className="notif-stack">
        {notifications.map(n => (
          <div className="notif-toast" key={n.id}>
            <span className="notif-msg">{n.msg}</span>
            <button className="notif-close" onClick={() => dismissNotification(n.id)}>✕</button>
          </div>
        ))}
      </div>

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

        {/* STATS */}
        {!loading && !error && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{rides.length}</div>
              <div className="stat-label">Rides</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{totalBookings}</div>
              <div className="stat-label">Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">₨{totalEarnings}</div>
              <div className="stat-label">Earnings</div>
            </div>
          </div>
        )}

        {/* REFRESH */}
        {!loading && (
          <div className="refresh-bar">
            <span className="refresh-hint">🔄 Har 30 sec mein auto refresh</span>
            <button className="refresh-btn" onClick={fetchRides}>Refresh ↻</button>
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
          rides.map((ride, i) => {
            const booked = ride.bookings?.length || 0;
            const total = ride.seats || ride.availableSeats || 1;
            const fillPct = Math.min(100, Math.round((booked / total) * 100));
            return (
              <div className="ar-card" key={ride._id || i} style={{animationDelay:`${i*0.08}s`}}>
                <div className="ar-route">
                  <span className="ar-city">{ride.startCity}</span>
                  <span className="ar-arrow">→</span>
                  <span className="ar-city">{ride.endCity}</span>
                </div>
                <div className="ar-info">
                  <span className="ar-badge">💰 Rs. {ride.fare}</span>
                  <span className="ar-badge">💺 {total} Seats</span>
                  <span className="ar-badge">👥 {booked} Booked</span>
                  <span className="ar-status">✅ {ride.status || "Active"}</span>
                </div>
                {/* Seat fill progress bar */}
                <div className="booking-fill">
                  <div className="fill-label">
                    <span>Seat Occupancy</span>
                    <span>{fillPct}%</span>
                  </div>
                  <div className="fill-track">
                    <div className="fill-bar" style={{width:`${fillPct}%`}} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default ActiveRides;