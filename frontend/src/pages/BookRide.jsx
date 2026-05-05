import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function BookRide() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://local-ride-production.up.railway.app/api/rides")
      .then(r => r.json())
      .then(data => setRide(data.find(r => r._id === id)));
  }, [id]);

  const handleBook = async () => {
    setLoading(true); setError("");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const passengerId = user?._id || user?.id;
    if (!passengerId) { setError("Pehle login karo!"); setLoading(false); return; }
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          rideId: id,
          passenger: passengerId,
          pickupStop: ride?.startCity || "Start",
          dropoffStop: ride?.endCity || "End",
          fare: (ride?.fare || 0) * seats,
          seatsBooked: seats,
          status: "confirmed"
        }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.message || "Booking failed!");
    } catch { setError("Server se connection nahi!"); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --purple: #4a1a8a; --purple2: #6b2fb5; --purple3: #8b3fd4;
          --amber: #f5c842; --amber2: #ffd84d;
          --off: #f8f6ff; --muted: #7a7a9a; --text: #1a1a2e;
        }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--purple) 0%, var(--purple2) 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; position: relative; overflow: hidden;
        }
        .page::before {
          content: ''; position: absolute;
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(245,200,66,0.06);
          top: -100px; right: -100px;
        }
        .page::after {
          content: ''; position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
          bottom: -80px; left: -80px;
        }

        .card {
          background: white; border-radius: 28px;
          width: 100%; max-width: 420px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(74,26,138,0.45);
          position: relative; z-index: 2;
          animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .header {
          background: linear-gradient(135deg, var(--purple2), var(--purple));
          padding: 24px; color: white;
          display: flex; align-items: center; gap: 14px;
        }
        .h-icon {
          width: 50px; height: 50px; background: var(--amber);
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; font-size: 24px;
          box-shadow: 0 6px 16px rgba(245,200,66,0.4);
        }
        .h-title { font-size: 20px; font-weight: 800; }
        .h-sub { font-size: 12px; opacity: 0.72; margin-top: 2px; }

        .body { padding: 26px; }

        .route-box {
          background: linear-gradient(135deg, var(--purple), var(--purple2));
          border-radius: 20px; padding: 22px; text-align: center;
          margin-bottom: 18px;
          box-shadow: 0 8px 24px rgba(74,26,138,0.25);
        }
        .route-cities {
          display: flex; align-items: center;
          justify-content: center; gap: 14px; margin-bottom: 12px;
        }
        .r-city { font-size: 22px; font-weight: 800; color: white; }
        .r-arrow { color: var(--amber); font-size: 26px; font-weight: 700; }
        .fare-big { font-size: 38px; font-weight: 800; color: var(--amber); line-height: 1; }
        .fare-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }

        .chips { display: flex; gap: 10px; margin-bottom: 22px; }
        .chip {
          flex: 1; background: var(--off); border: 1.5px solid #ede8f8;
          border-radius: 14px; padding: 12px 10px; text-align: center;
        }
        .chip-icon { font-size: 20px; margin-bottom: 4px; }
        .chip-val { font-size: 13px; font-weight: 700; color: var(--purple); }
        .chip-label { font-size: 11px; color: var(--muted); margin-top: 1px; }

        .seats-section { margin-bottom: 18px; }
        .seats-label {
          font-size: 11px; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;
        }
        .seats-control {
          display: flex; align-items: center; gap: 16px;
          background: var(--off); border: 1.5px solid #ede8f8;
          border-radius: 14px; padding: 12px 16px;
        }
        .s-btn {
          width: 40px; height: 40px; border-radius: 10px;
          border: 2px solid #ede8f8; background: white;
          font-size: 20px; font-weight: 700; color: var(--purple2);
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .s-btn:hover { background: var(--purple); color: white; border-color: var(--purple); }
        .s-num { font-size: 28px; font-weight: 800; color: var(--purple); flex: 1; text-align: center; }
        .s-text { font-size: 12px; color: var(--muted); }

        .total-row {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(245,200,66,0.1); border: 1.5px solid rgba(245,200,66,0.3);
          border-radius: 14px; padding: 14px 18px; margin-bottom: 20px;
        }
        .total-label { font-size: 13px; font-weight: 600; color: var(--purple); }
        .total-val { font-size: 24px; font-weight: 800; color: var(--purple2); }

        .error-box {
          background: #fff0f5; border: 1.5px solid #ffb3cc;
          border-radius: 12px; padding: 10px 14px;
          font-size: 13px; color: #cc2255;
          margin-bottom: 14px; text-align: center;
        }

        .btn-book {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, var(--purple2), var(--purple));
          color: white; border: none; border-radius: 14px;
          font-size: 16px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(74,26,138,0.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-book:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(74,26,138,0.45); }
        .btn-book:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .back { display: block; text-align: center; margin-top: 14px; color: var(--purple2); font-size: 13px; font-weight: 600; text-decoration: none; }
        .back:hover { text-decoration: underline; }

        /* SUCCESS */
        .success-wrap { padding: 10px 0; text-align: center; }
        .success-anim { font-size: 64px; margin-bottom: 16px; animation: bounce 0.6s ease; }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        .success-title { font-size: 24px; font-weight: 800; color: var(--purple); margin-bottom: 8px; }
        .success-sub { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; }

        .driver-notice {
          background: linear-gradient(135deg, var(--purple), var(--purple2));
          border-radius: 16px; padding: 18px; margin-bottom: 20px; text-align: left;
        }
        .dn-title { font-size: 13px; font-weight: 700; color: var(--amber); margin-bottom: 10px; }
        .dn-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; }
        .dn-item:last-child { margin-bottom: 0; }
        .dn-dot { width: 6px; height: 6px; background: var(--amber); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
        .dn-text { font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.5; }

        .btn-home {
          width: 100%; padding: 14px;
          background: var(--amber); color: var(--purple);
          border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(245,200,66,0.4);
        }
        .btn-home:hover { background: var(--amber2); transform: translateY(-2px); }

        .loading-wrap { text-align: center; padding: 40px 0; }
        .loading-car { font-size: 40px; animation: drive 1s linear infinite; }
        @keyframes drive { 0%,100%{transform:translateX(-4px)} 50%{transform:translateX(4px)} }
        .loading-text { font-size: 14px; color: var(--muted); margin-top: 12px; }
      `}</style>

      <div className="page">
        <div className="card">
          <div className="header">
            <div className="h-icon">🎫</div>
            <div>
              <div className="h-title">Book a Ride</div>
              <div className="h-sub">Local Ride — Passenger Booking</div>
            </div>
          </div>

          <div className="body">
            {!ride ? (
              <div className="loading-wrap">
                <div className="loading-car">🚗</div>
                <div className="loading-text">Ride load ho rahi hai...</div>
              </div>
            ) : success ? (
              <div className="success-wrap">
                <div className="success-anim">🎉</div>
                <div className="success-title">Booking Confirmed!</div>
                <div className="success-sub">
                  Aapki <strong>{ride.startCity} → {ride.endCity}</strong> ride book ho gayi!<br/>
                  <strong>{seats} seat(s)</strong> — Total: <strong>Rs. {(ride.fare || 0) * seats}</strong>
                </div>

                <div className="driver-notice">
                  <div className="dn-title">📢 Driver ko kaise pata chalega?</div>
                  <div className="dn-item">
                    <div className="dn-dot"/>
                    <div className="dn-text">Driver apna <strong>Active Rides</strong> page check karega — wahan aapki booking nazar aayegi</div>
                  </div>
                  <div className="dn-item">
                    <div className="dn-dot"/>
                    <div className="dn-text">Departure time par driver se <strong>phone number</strong> pe rabta karo</div>
                  </div>
                  <div className="dn-item">
                    <div className="dn-dot"/>
                    <div className="dn-text">Pickup point: <strong>{ride.startCity}</strong> — waqt par pahuncho</div>
                  </div>
                </div>

                <button className="btn-home" onClick={() => window.location.href="/"}>
                  🏠 Wapas Home Jao
                </button>
              </div>
            ) : (
              <>
                <div className="route-box">
                  <div className="route-cities">
                    <span className="r-city">{ride.startCity}</span>
                    <span className="r-arrow">→</span>
                    <span className="r-city">{ride.endCity}</span>
                  </div>
                  <div className="fare-big">Rs. {ride.fare}</div>
                  <div className="fare-label">per seat ka fare</div>
                </div>

                <div className="chips">
                  <div className="chip">
                    <div className="chip-icon">💺</div>
                    <div className="chip-val">{ride.seats || ride.availableSeats || "?"}</div>
                    <div className="chip-label">Available</div>
                  </div>
                  <div className="chip">
                    <div className="chip-icon">🕐</div>
                    <div className="chip-val">
                      {ride.departureTime
                        ? new Date(ride.departureTime).toLocaleTimeString("en-PK", {hour:"2-digit", minute:"2-digit"})
                        : "Flexible"}
                    </div>
                    <div className="chip-label">Departure</div>
                  </div>
                  <div className="chip">
                    <div className="chip-icon">✅</div>
                    <div className="chip-val">{ride.status || "Active"}</div>
                    <div className="chip-label">Status</div>
                  </div>
                </div>

                <div className="seats-section">
                  <div className="seats-label">Kitni Seats Chahiye?</div>
                  <div className="seats-control">
                    <button className="s-btn" onClick={() => setSeats(s => Math.max(1, s-1))}>−</button>
                    <div className="s-num">{seats}</div>
                    <button className="s-btn" onClick={() => setSeats(s => Math.min(4, s+1))}>+</button>
                    <div className="s-text">seats</div>
                  </div>
                </div>

                <div className="total-row">
                  <span className="total-label">💰 Total Amount</span>
                  <span className="total-val">Rs. {(ride.fare || 0) * seats}</span>
                </div>

                {error && <div className="error-box">⚠️ {error}</div>}

                <button className="btn-book" onClick={handleBook} disabled={loading}>
                  {loading ? <><div className="spinner"/> Booking...</> : "🎫 Confirm Booking"}
                </button>
                <a href="/" className="back">← Wapas Jao</a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}