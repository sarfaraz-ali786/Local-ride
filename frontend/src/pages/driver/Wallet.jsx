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
        const sum = data.reduce((acc, b) => acc + (b.fare || 0), 0);
        setTotal(sum);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .w-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a5c36 0%, #1a8a4a 50%, #0d7a3e 100%);
          font-family: 'Poppins', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .w-card {
          background: white; border-radius: 20px;
          width: 100%; max-width: 420px;
          overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .w-header {
          background: linear-gradient(135deg, #1a8a4a, #0a5c36);
          padding: 28px 24px; color: white;
          display: flex; align-items: center; gap: 12px;
        }
        .w-icon {
          width: 46px; height: 46px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .w-title { font-size: 20px; font-weight: 700; }
        .w-subtitle { font-size: 12px; opacity: 0.75; }
        .w-body { padding: 24px; }
        .w-total {
          background: #f0faf5; border-radius: 12px;
          padding: 20px; text-align: center;
          margin-bottom: 20px; border: 1.5px solid #c8ecd9;
        }
        .w-total-label { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .w-total-amount { color: #0a5c36; font-size: 36px; font-weight: 700; }
        .w-section-title { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 10px; }
        .w-item {
          background: #f8f8f8; border-radius: 10px;
          padding: 12px 16px; margin-bottom: 8px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .w-item-left { font-size: 13px; color: #555; }
        .w-item-right { font-size: 14px; font-weight: 700; color: #1a8a4a; }
        .w-empty { text-align: center; color: #888; padding: 20px; font-size: 13px; }
        .w-back {
          display: block; text-align: center; margin-top: 16px;
          color: #1a8a4a; font-size: 13px; font-weight: 600; text-decoration: none;
        }
        .w-back:hover { text-decoration: underline; }
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

            {loading && <div className="w-empty">Loading...</div>}
            {!loading && bookings.length === 0 && (
              <div className="w-empty">Koi booking nahi abhitak</div>
            )}
            {bookings.map((b, i) => (
              <div className="w-item" key={i}>
                <div className="w-item-left">
                  Booking #{i + 1}<br />
                  <span style={{fontSize:'11px', color:'#aaa'}}>{b.pickupStop} → {b.dropoffStop}</span>
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