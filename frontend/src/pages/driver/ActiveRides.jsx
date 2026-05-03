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
        const myRides = data.filter(r => r.driver === driverId || r.driver?._id === driverId);
        setRides(myRides);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ar-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a5c36 0%, #1a8a4a 50%, #0d7a3e 100%);
          font-family: 'Poppins', sans-serif;
          padding: 20px;
        }
        .ar-header {
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 20px 24px;
          color: white;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ar-icon {
          width: 46px; height: 46px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .ar-title { font-size: 20px; font-weight: 700; }
        .ar-subtitle { font-size: 12px; opacity: 0.75; }
        .ar-card {
          background: white;
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ar-route {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .ar-city {
          font-size: 16px;
          font-weight: 700;
          color: #0a5c36;
        }
        .ar-arrow { font-size: 18px; color: #888; }
        .ar-info {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ar-badge {
          background: #f0faf5;
          border: 1.5px solid #c8ecd9;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          color: #0a5c36;
          font-weight: 600;
        }
        .ar-status {
          background: #d4edda;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          color: #155724;
          font-weight: 600;
        }
        .ar-empty {
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          color: white;
        }
        .ar-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .ar-empty-text { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .ar-empty-sub { font-size: 13px; opacity: 0.75; }
        .ar-back {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          opacity: 0.85;
        }
        .ar-back:hover { opacity: 1; }
        .ar-loading {
          text-align: center;
          color: white;
          padding: 40px;
          font-size: 16px;
        }
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
                <span className="ar-status">✅ {ride.status || 'Active'}</span>
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