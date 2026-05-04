import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const CITIES = [
  "Karachi","Hyderabad","Sukkur","Larkana","Nawabshah","Mirpurkhas","Jacobabad",
  "Shikarpur","Khairpur","Dadu","Badin","Thatta","Matli","Kotri","Jamshoro",
  "Tando Adam","Tando Allahyar","Sanghar","Naushahro Feroze","Kamber","Shahdadkot",
  "Qambar","Ghotki","Kandhkot","Kashmore","Umarkot","Naukot","Mithi","Islamkot",
  "Diplo","Chachro","Tharparkar","Sehwan","Moro","Hala","Mehrabpur","Daharki",
  "Pano Aqil","Salehpat","Shahdad Kot","Johi","Mehar","Warah","Sann","Bubak"
];

export default function RideResults() {
  const [params, setParams] = useSearchParams();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");

  const fetchRides = (f, t) => {
    setLoading(true);
    const url = (f && t)
      ? `https://local-ride-production.up.railway.app/api/rides/search?from=${f}&to=${t}`
      : `https://local-ride-production.up.railway.app/api/rides`;
    fetch(url)
      .then(r => r.json())
      .then(d => { setRides(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRides(from, to); }, []);

  const handleSearch = () => {
    setParams({ from, to });
    fetchRides(from, to);
  };

  const handleReset = () => {
    setFrom(""); setTo("");
    setParams({});
    fetchRides("", "");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--purple:#4a1a8a;--purple2:#6b2fb5;--purple3:#8b3fd4;--amber:#f5c842;--off:#f8f6ff;}
        body{font-family:'Plus Jakarta Sans',sans-serif;}
        .page{min-height:100vh;background:linear-gradient(135deg,var(--purple) 0%,var(--purple2) 100%);padding:24px;}

        .topbar{display:flex;align-items:center;gap:14px;margin-bottom:20px;}
        .back-btn{width:40px;height:40px;background:rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;text-decoration:none;border:1px solid rgba(255,255,255,0.2);}
        .page-title{font-size:22px;font-weight:800;color:white;}

        .search-box{background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:20px;margin-bottom:22px;}
        .search-label{font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;}
        .search-select{width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.15);color:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;margin-bottom:12px;appearance:none;outline:none;}
        .search-select option{background:#4a1a8a;color:white;}
        .search-select::placeholder{color:rgba(255,255,255,0.5);}
        .btn-row{display:flex;gap:10px;margin-top:4px;}
        .search-btn{flex:1;padding:13px;background:var(--amber);color:var(--purple);border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:800;cursor:pointer;}
        .reset-btn{padding:13px 18px;background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;}

        .count-badge{background:var(--amber);color:var(--purple);font-size:13px;font-weight:800;padding:6px 14px;border-radius:100px;display:inline-block;margin-bottom:14px;}
        .section-title{font-size:20px;font-weight:800;color:white;margin-bottom:14px;}

        .ride-card{background:white;border-radius:20px;padding:20px;margin-bottom:14px;box-shadow:0 8px 30px rgba(74,26,138,0.2);border:1.5px solid #ede8f8;animation:slideUp 0.3s ease both;}
        .ride-card:hover{transform:translateY(-3px);}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
        .card-route{display:flex;align-items:center;gap:8px;}
        .card-city{font-size:18px;font-weight:800;color:var(--purple);}
        .card-arrow{color:var(--amber);font-size:20px;font-weight:700;}
        .fare-tag{background:linear-gradient(135deg,var(--purple),var(--purple2));color:white;font-size:17px;font-weight:800;padding:7px 16px;border-radius:12px;}
        .card-info{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
        .info-pill{background:#f8f6ff;border:1.5px solid #ede8f8;border-radius:10px;padding:5px 12px;font-size:12px;font-weight:600;color:var(--purple2);}
        .info-pill.amber{background:rgba(245,200,66,0.12);border-color:rgba(245,200,66,0.3);color:#b8860b;}
        .book-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--purple2),var(--purple));color:white;border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(74,26,138,0.3);}
        .book-btn:hover{transform:translateY(-2px);}

        .empty{background:rgba(255,255,255,0.1);border-radius:24px;padding:48px 24px;text-align:center;border:1px solid rgba(255,255,255,0.15);}
        .empty-icon{font-size:52px;margin-bottom:12px;}
        .empty-title{font-size:20px;font-weight:800;color:white;margin-bottom:8px;}
        .empty-sub{font-size:14px;color:rgba(255,255,255,0.65);margin-bottom:22px;}

        .loading{text-align:center;padding:60px 24px;}
        .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.2);border-top-color:var(--amber);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 16px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .loading p{color:rgba(255,255,255,0.7);font-size:15px;}
      `}</style>

      <div className="page">
        {/* TOP BAR */}
        <div className="topbar">
          <a href="/" className="back-btn">←</a>
          <div className="page-title">🚗 Rides Dhundho</div>
        </div>

        {/* SEARCH FORM */}
        <div className="search-box">
          <div className="search-label">Kahan Se?</div>
          <select className="search-select" value={from} onChange={e => setFrom(e.target.value)}>
            <option value="">-- Shehar Chunein --</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="search-label">Kahan Tak?</div>
          <select className="search-select" value={to} onChange={e => setTo(e.target.value)}>
            <option value="">-- Shehar Chunein --</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="btn-row">
            <button className="search-btn" onClick={handleSearch}>🔍 Search Karo</button>
            <button className="reset-btn" onClick={handleReset}>Sab Rides</button>
          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <div className="loading">
            <div className="spinner"/>
            <p>Rides dhundh rahe hain...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Koi ride nahi mili!</div>
            <div className="empty-sub">
              {from && to ? `${from} → ${to} ke liye abhi koi ride nahi hai.` : "Abhi koi ride available nahi hai."}
            </div>
            <button className="reset-btn" onClick={handleReset} style={{marginTop:4}}>Sab Rides Dekho</button>
          </div>
        ) : (
          <>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <div className="section-title">Available Rides</div>
              <div className="count-badge">{rides.length} Rides</div>
            </div>
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
                  <span className="info-pill amber">
                    🕐 {ride.departureTime
                      ? new Date(ride.departureTime).toLocaleString("en-PK",{dateStyle:"medium",timeStyle:"short"})
                      : "Anytime"}
                  </span>
                  <span className="info-pill">✅ {ride.status || "Available"}</span>
                </div>
                <button className="book-btn" onClick={() => window.location.href=`/book/${ride._id}`}>
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