import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function RideResults() {
  const [params] = useSearchParams();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  useEffect(() => {
    fetch(`https://local-ride-production.up.railway.app/api/rides/search?from=${from}&to=${to}`)
      .then(r => r.json())
      .then(d => { setRides(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [from, to]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--purple:#4a1a8a;--purple2:#6b2fb5;--purple3:#8b3fd4;--amber:#f5c842;--off:#f8f6ff;--muted:#7a7a9a;}
        body{font-family:'DM Sans',sans-serif;}
        .page{min-height:100vh;background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%);padding:24px;}

        .topbar{display:flex;align-items:center;gap:14px;margin-bottom:24px;}
        .back-btn{width:40px;height:40px;background:rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;text-decoration:none;border:1px solid rgba(255,255,255,0.2);transition:background 0.2s;}
        .back-btn:hover{background:rgba(255,255,255,0.2);}
        .route-pill{background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:8px 20px;display:flex;align-items:center;gap:10px;}
        .route-city{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:white;}
        .route-arrow{color:var(--amber);font-size:16px;font-weight:700;}
        .count-badge{margin-left:auto;background:var(--amber);color:var(--purple);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;padding:6px 14px;border-radius:100px;}

        .section-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:white;margin-bottom:16px;}

        .ride-card{background:white;border-radius:20px;padding:22px;margin-bottom:14px;box-shadow:0 8px 30px rgba(74,26,138,0.2);border:1.5px solid #ede8f8;transition:all 0.3s;animation:slideUp 0.3s ease both;}
        .ride-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(74,26,138,0.25);}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
        .card-route{display:flex;align-items:center;gap:10px;}
        .card-city{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--purple);}
        .card-arrow{color:var(--amber);font-size:22px;font-weight:700;}
        .fare-tag{background:linear-gradient(135deg,var(--purple),var(--purple2));color:white;font-family:'Syne',sans-serif;font-size:18px;font-weight:800;padding:8px 18px;border-radius:12px;}

        .card-info{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;}
        .info-pill{background:var(--off);border:1.5px solid #ede8f8;border-radius:10px;padding:6px 14px;font-size:12px;font-weight:600;color:var(--purple2);}
        .info-pill.amber{background:rgba(245,200,66,0.12);border-color:rgba(245,200,66,0.3);color:#b8860b;}

        .book-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--purple2),var(--purple));color:white;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 6px 18px rgba(74,26,138,0.3);}
        .book-btn:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(74,26,138,0.4);}

        .empty{background:rgba(255,255,255,0.1);border-radius:24px;padding:56px 24px;text-align:center;border:1px solid rgba(255,255,255,0.15);}
        .empty-icon{font-size:56px;margin-bottom:14px;}
        .empty-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:white;margin-bottom:8px;}
        .empty-sub{font-size:14px;color:rgba(255,255,255,0.65);margin-bottom:24px;}
        .empty-btn{display:inline-block;background:var(--amber);color:var(--purple);padding:12px 28px;border-radius:12px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;text-decoration:none;}

        .loading{text-align:center;padding:60px 24px;}
        .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.2);border-top-color:var(--amber);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 16px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .loading p{color:rgba(255,255,255,0.7);font-size:15px;}
      `}</style>

      <div className="page">
        {/* TOP BAR */}
        <div className="topbar">
          <a href="/" className="back-btn">←</a>
          <div className="route-pill">
            <span className="route-city">{from || "?"}</span>
            <span className="route-arrow">→</span>
            <span className="route-city">{to || "?"}</span>
          </div>
          {!loading && <div className="count-badge">{rides.length} Rides</div>}
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"/>
            <p>Rides dhundh rahe hain...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Koi ride nahi mili!</div>
            <div className="empty-sub">{from} → {to} ke liye abhi koi ride available nahi hai.</div>
            <a href="/" className="empty-btn">← Wapas Jao</a>
          </div>
        ) : (
          <>
            <div className="section-title">Available Rides 🚗</div>
            {rides.map((ride, i) => (
              <div className="ride-card" key={ride._id || i} style={{animationDelay:`${i*0.08}s`}}>
                <div className="card-top">
                  <div className="card-route">
                    <span className="card-city">{ride.startCity}</span>
                    <span className="card-arrow">→</span>
                    <span className="card-city">{ride.endCity}</span>
                  </div>
                  <div className="fare-tag">Rs. {ride.fare}</div>
                </div>
                <div className="card-info">
                  <span className="info-pill">💺 {ride.seats || ride.availableSeats || "?"} Seats</span>
                  <span className="info-pill amber">🕐 {ride.departureTime ? new Date(ride.departureTime).toLocaleString("en-PK",{dateStyle:"medium",timeStyle:"short"}) : "Anytime"}</span>
                  <span className="info-pill">✅ {ride.status || "Available"}</span>
                </div>
                <button className="book-btn" onClick={()=>window.location.href=`/book/${ride._id}`}>
                  🎫 Book This Ride
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}