import { useState, useEffect } from "react";

function Wallet() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/bookings")
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setTotal(data.reduce((acc, b) => acc + (b.fare || 0), 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        :root { --purple:#4a1a8a; --purple2:#6b2fb5; --amber:#f5c842; --amber2:#ffd84d; --gray:#3a3a4a; --off:#f8f6ff; --muted:#7a7a9a; }
        body { font-family:'DM Sans',sans-serif; }
        .w-page { min-height:100vh; background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%); display:flex; align-items:center; justify-content:center; padding:20px; }
        .w-card { background:white; border-radius:24px; width:100%; max-width:420px; overflow:hidden; box-shadow:0 30px 80px rgba(74,26,138,0.4); }
        .w-header { background:linear-gradient(135deg,var(--purple2),var(--purple)); padding:28px 24px; color:white; display:flex; align-items:center; gap:12px; }
        .w-icon { width:48px; height:48px; background:var(--amber); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; }
        .w-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; }
        .w-subtitle { font-size:12px; opacity:0.72; margin-top:2px; }
        .w-body { padding:24px; }
        .w-total { background:linear-gradient(135deg,var(--purple),var(--purple2)); border-radius:16px; padding:24px; text-align:center; margin-bottom:20px; }
        .w-total-label { color:rgba(255,255,255,0.7); font-size:11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
        .w-total-amount { color:var(--amber); font-family:'Syne',sans-serif; font-size:40px; font-weight:800; }
        .w-section-title { font-size:13px; font-weight:600; color:var(--gray); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.8px; }
        .w-item { background:var(--off); border-radius:12px; padding:14px 16px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; border:1.5px solid #ede8f8; }
        .w-item-left { font-size:13px; color:#333; font-weight:500; }
        .w-item-sub { font-size:11px; color:var(--muted); margin-top:2px; }
        .w-item-right { font-size:15px; font-weight:800; color:var(--purple2); font-family:'Syne',sans-serif; }
        .w-empty { text-align:center; color:var(--muted); padding:24px; font-size:13px; }
        .w-back { display:block; text-align:center; margin-top:16px; color:var(--purple2); font-size:13px; font-weight:600; text-decoration:none; }
        .w-back:hover { text-decoration:underline; }
        .w-loading { text-align:center; padding:20px; color:var(--muted); }
      `}</style>
      <div className="w-page">
        <div className="w-card">
          <div className="w-header">
            <div className="w-icon">💰</div>
            <div>
              <div className="w-title">My Wallet</div>
              <div className="w-subtitle">Driver Earnings — Local Ride</div>
            </div>
          </div>
          <div className="w-body">
            <div className="w-total">
              <div className="w-total-label">Total Earnings</div>
              <div className="w-total-amount">Rs. {total}</div>
            </div>
            <div className="w-section-title">Recent Bookings</div>
            {loading && <div className="w-loading">Loading...</div>}
            {!loading && bookings.length === 0 && <div className="w-empty">Koi booking nahi abhi tak</div>}
            {bookings.map((b, i) => (
              <div className="w-item" key={i}>
                <div>
                  <div className="w-item-left">Booking #{i + 1}</div>
                  <div className="w-item-sub">{b.pickupStop} → {b.dropoffStop}</div>
                </div>
                <div className="w-item-right">Rs. {b.fare}</div>
              </div>
            ))}
            <a href="/" className="w-back">← Wapas Jao</a>
          </div>
        </div>
      </div>
    </>
  );
}
export default Wallet;