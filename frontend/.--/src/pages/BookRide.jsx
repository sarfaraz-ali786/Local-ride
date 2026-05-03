import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function BookRide() {
  const { id } = useParams();
  const [seats, setSeats] = useState(1);
  const [msg, setMsg] = useState("");
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(res => res.json())
      .then(data => {
        const found = data.find(r => r._id === id);
        if (found) setRide(found);
      });
  }, [id]);

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setMsg("Pehle login karo!"); return; }

    const userRaw = localStorage.getItem("user");
    let user;
    try {
      user = JSON.parse(userRaw);
    } catch {
      setMsg("Session error. Dobara login karo.");
      return;
    }

    const passengerId = user?._id || user?.id;
    if (!passengerId) {
      setMsg("User ID nahi mili. Dobara login karo.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(
        "https://local-ride-production.up.railway.app/api/bookings/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            passenger: passengerId,
            ride: id,
            pickupStop: ride?.startCity || "Start",
            dropoffStop: ride?.endCity || "End",
            fare: Number(ride?.fare) * Number(seats) || 0,
            seatsBooked: Number(seats)
          })
        }
      );
      const data = await res.json();
      if (res.ok) {
        setBooked(true);
        setMsg("Booking Confirmed!");
      } else {
        setMsg("Error: " + (data.message || "Kuch ghalat hua"));
      }
    } catch (err) {
      setMsg("Network error. Internet check karo.");
    } finally {
      setLoading(false);
    }
  };

  const totalFare = Number(ride?.fare || 0) * Number(seats);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .br-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a5c36 0%, #1a8a4a 50%, #0d7a3e 100%);
          font-family: 'Poppins', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; position: relative; overflow: hidden;
        }
        .br-page::before {
          content: ''; position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: rgba(255,255,255,0.04); top: -150px; right: -150px;
        }
        .br-page::after {
          content: ''; position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(255,255,255,0.04); bottom: -100px; left: -80px;
        }
        .br-card {
          background: white; border-radius: 20px;
          width: 100%; max-width: 420px; overflow: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.3);
          position: relative; z-index: 1;
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .br-header {
          background: linear-gradient(135deg, #1a8a4a, #0a5c36);
          padding: 28px 24px 22px; color: white;
        }
        .br-header-top {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .br-icon {
          width: 42px; height: 42px; background: rgba(255,255,255,0.2);
          border-radius: 12px; display: flex; align-items: center;
          justify-content: center; font-size: 20px;
        }
        .br-title { font-size: 20px; font-weight: 700; letter-spacing: 0.3px; }
        .br-subtitle { font-size: 12px; opacity: 0.75; }
        .br-route {
          background: rgba(255,255,255,0.15); border-radius: 12px;
          padding: 14px 16px; display: flex; align-items: center; gap: 12px;
        }
        .br-city { text-align: center; flex: 1; }
        .br-city-name { font-size: 16px; font-weight: 700; }
        .br-city-label { font-size: 10px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
        .br-arrow { font-size: 20px; opacity: 0.8; }
        .br-body { padding: 24px; }
        .br-info-row { display: flex; gap: 12px; margin-bottom: 20px; }
        .br-info-box {
          flex: 1; background: #f0faf5; border: 1.5px solid #c8ecd9;
          border-radius: 12px; padding: 12px; text-align: center;
        }
        .br-info-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .br-info-value { font-size: 16px; font-weight: 700; color: #0a5c36; }
        .br-section-label { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 10px; }
        .br-seats {
          display: flex; align-items: center; gap: 16px;
          background: #f8f8f8; border-radius: 12px;
          padding: 12px 16px; margin-bottom: 20px;
        }
        .br-seat-btn {
          width: 36px; height: 36px; border-radius: 10px; border: none;
          background: #1a8a4a; color: white; font-size: 20px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; line-height: 1;
        }
        .br-seat-btn:hover { background: #0a5c36; }
        .br-seat-btn:disabled { background: #ccc; cursor: not-allowed; }
        .br-seat-count { font-size: 24px; font-weight: 700; color: #1a8a4a; flex: 1; text-align: center; }
        .br-seat-text { font-size: 12px; color: #888; }
        .br-summary {
          background: #f0faf5; border-radius: 12px;
          padding: 14px 16px; margin-bottom: 20px; border: 1.5px solid #c8ecd9;
        }
        .br-summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #555; margin-bottom: 6px; }
        .br-summary-total {
          display: flex; justify-content: space-between;
          font-size: 16px; font-weight: 700; color: #0a5c36;
          border-top: 1.5px dashed #c8ecd9; padding-top: 10px; margin-top: 6px;
        }
        .br-msg {
          text-align: center; padding: 10px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500; margin-bottom: 14px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .br-msg.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .br-msg.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .br-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #1a8a4a, #0a5c36);
          color: white; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          letter-spacing: 0.5px; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 15px rgba(26,138,74,0.4);
          font-family: 'Poppins', sans-serif;
        }
        .br-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,138,74,0.5); }
        .br-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .br-back { display: block; text-align: center; margin-top: 14px; color: #1a8a4a; font-size: 13px; font-weight: 600; text-decoration: none; }
        .br-back:hover { text-decoration: underline; }
        .br-success-screen { text-align: center; padding: 40px 24px; }
        .br-success-icon { font-size: 64px; margin-bottom: 16px; animation: bounceIn 0.5s ease; }
        @keyframes bounceIn {
          0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); }
        }
        .br-success-title { font-size: 22px; font-weight: 700; color: #0a5c36; margin-bottom: 8px; }
        .br-success-sub { font-size: 14px; color: #666; margin-bottom: 24px; }
        .br-loading {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.5); border-top-color: white;
          border-radius: 50%; animation: spin 0.6s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="br-page">
        <div className="br-card">
          {booked ? (
            <div className="br-success-screen">
              <div className="br-success-icon">✅</div>
              <div className="br-success-title">Booking Confirmed!</div>
              <div className="br-success-sub">
                {ride?.startCity} → {ride?.endCity}<br />
                {seats} seat(s) | Rs. {totalFare}
              </div>
              <a href="/" className="br-btn" style={{display:'block', textDecoration:'none', padding:'15px'}}>
                🏠 Home Par Jao
              </a>
            </div>
          ) : (
            <>
              <div className="br-header">
                <div className="br-header-top">
                  <div className="br-icon">🚗</div>
                  <div>
                    <div className="br-title">Book Ride</div>
                    <div className="br-subtitle">Local Ride — Carpooling App</div>
                  </div>
                </div>
                {ride && (
                  <div className="br-route">
                    <div className="br-city">
                      <div className="br-city-name">{ride.startCity}</div>
                      <div className="br-city-label">From</div>
                    </div>
                    <div className="br-arrow">→</div>
                    <div className="br-city">
                      <div className="br-city-name">{ride.endCity}</div>
                      <div className="br-city-label">To</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="br-body">
                {ride && (
                  <div className="br-info-row">
                    <div className="br-info-box">
                      <div className="br-info-label">Fare/Seat</div>
                      <div className="br-info-value">Rs. {ride.fare}</div>
                    </div>
                    <div className="br-info-box">
                      <div className="br-info-label">Available</div>
                      <div className="br-info-value">{ride.seats} Seats</div>
                    </div>
                    <div className="br-info-box">
                      <div className="br-info-label">Status</div>
                      <div className="br-info-value" style={{fontSize:'12px', color:'#1a8a4a'}}>
                        {ride.status || 'Active'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="br-section-label">Select Seats</div>
                <div className="br-seats">
                  <button className="br-seat-btn"
                    onClick={() => setSeats(s => Math.max(1, s - 1))}
                    disabled={seats <= 1}>−</button>
                  <div>
                    <div className="br-seat-count">{seats}</div>
                    <div className="br-seat-text" style={{textAlign:'center'}}>seat(s)</div>
                  </div>
                  <button className="br-seat-btn"
                    onClick={() => setSeats(s => Math.min(4, s + 1))}
                    disabled={seats >= 4}>+</button>
                </div>

                {ride && (
                  <div className="br-summary">
                    <div className="br-summary-row">
                      <span>Fare per seat</span><span>Rs. {ride.fare}</span>
                    </div>
                    <div className="br-summary-row">
                      <span>Seats</span><span>× {seats}</span>
                    </div>
                    <div className="br-summary-total">
                      <span>Total</span><span>Rs. {totalFare}</span>
                    </div>
                  </div>
                )}

                {msg && (
                  <div className={`br-msg ${msg.includes("Confirmed") ? "success" : "error"}`}>
                    {msg}
                  </div>
                )}

                <button className="br-btn" onClick={handleBook} disabled={loading || !ride}>
                  {loading ? <><span className="br-loading"></span>Booking ho rahi hai...</> : "✓ Confirm Booking"}
                </button>

                <a href="/" className="br-back">← Wapas Jao</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BookRide;