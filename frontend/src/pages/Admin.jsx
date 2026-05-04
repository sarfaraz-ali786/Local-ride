import { useState, useEffect } from "react";

const API = "https://local-ride-production.up.railway.app";

function Admin() {
  const [rides, setRides] = useState([]);
  const [msg, setMsg] = useState("Loading...");
  const [pricePerKm, setPricePerKm] = useState("");
  const [savedPrice, setSavedPrice] = useState(null);
  const [priceMsg, setPriceMsg] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    // Load rides
    fetch(`${API}/api/rides`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRides(data);
          setMsg(data.length === 0 ? "Koi ride nahi hai" : "");
        } else setMsg("Data error");
      })
      .catch(() => setMsg("Network error!"));

    // Load saved price per km
    const saved = localStorage.getItem("adminPricePerKm");
    if (saved) { setSavedPrice(Number(saved)); setPricePerKm(saved); }
  }, []);

  const savePrice = () => {
    const val = Number(pricePerKm);
    if (!val || val <= 0) { setPriceMsg("❌ Valid price daalo!"); return; }
    setSavingPrice(true);
    // Save to localStorage (backend mein save karna ho to API call karo)
    localStorage.setItem("adminPricePerKm", val);
    setSavedPrice(val);
    setTimeout(() => {
      setSavingPrice(false);
      setPriceMsg("✅ Price per km save ho gaya!");
      setTimeout(() => setPriceMsg(""), 3000);
    }, 600);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0ecff; }

        .topbar {
          background: linear-gradient(135deg, var(--purple), var(--purple2));
          padding: 16px 28px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 4px 20px rgba(74,26,138,0.3);
        }
        .topbar-title { color: white; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .btn-logout {
          background: rgba(255,255,255,0.15); color: white;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 10px; padding: 8px 18px;
          font-size: 14px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-logout:hover { background: rgba(255,255,255,0.25); }

        .container { max-width: 860px; margin: 32px auto; padding: 0 20px; }

        /* Price Card */
        .price-card {
          background: white; border-radius: 24px;
          padding: 28px; margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(74,26,138,0.12);
          border: 2px solid #ede8f8;
        }
        .card-title {
          font-size: 16px; font-weight: 800; color: var(--purple);
          margin-bottom: 6px; display: flex; align-items: center; gap: 8px;
        }
        .card-sub { font-size: 13px; color: var(--muted); margin-bottom: 22px; }

        .price-row { display: flex; gap: 14px; align-items: flex-end; }
        .price-input-wrap { flex: 1; }
        .price-input-wrap label {
          display: block; font-size: 11px; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.8px; margin-bottom: 8px;
        }
        .price-input {
          width: 100%; padding: 14px 18px;
          border: 2px solid #ede8f8; border-radius: 14px;
          font-size: 20px; font-weight: 800; color: var(--purple);
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--off); outline: none; transition: all 0.2s;
        }
        .price-input:focus { border-color: var(--purple3); background: white; box-shadow: 0 0 0 4px rgba(139,63,212,0.08); }
        .btn-save {
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--purple2), var(--purple));
          color: white; border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(74,26,138,0.3);
          white-space: nowrap;
        }
        .btn-save:hover { transform: translateY(-2px); }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .price-preview {
          margin-top: 16px;
          background: linear-gradient(135deg, var(--purple), var(--purple2));
          border-radius: 14px; padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pp-label { font-size: 13px; color: rgba(255,255,255,0.7); }
        .pp-val { font-size: 22px; font-weight: 800; color: var(--amber); }
        .pp-example { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 2px; }

        .price-msg {
          margin-top: 12px; font-size: 13px; font-weight: 600;
          color: var(--purple2); text-align: center;
        }

        /* Rides section */
        .section-title {
          font-size: 16px; font-weight: 800; color: var(--purple);
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }
        .ride-card {
          background: white; border-radius: 18px;
          padding: 20px; margin-bottom: 14px;
          box-shadow: 0 4px 16px rgba(74,26,138,0.08);
          border: 1.5px solid #ede8f8;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .ride-route { font-size: 17px; font-weight: 800; color: var(--purple); }
        .ride-meta { font-size: 13px; color: var(--muted); margin-top: 4px; }
        .ride-fare {
          font-size: 22px; font-weight: 800; color: var(--purple2);
          background: var(--off); border-radius: 12px; padding: 8px 16px;
          white-space: nowrap;
        }
        .status-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 700;
          background: rgba(74,26,138,0.1); color: var(--purple2);
          margin-top: 6px;
        }
        .empty { text-align: center; padding: 40px; color: var(--muted); font-size: 15px; }
        .back { display: inline-block; margin-top: 24px; color: var(--purple2); font-size: 13px; font-weight: 600; text-decoration: none; }
        .back:hover { text-decoration: underline; }
      `}</style>

      <div className="topbar">
        <div className="topbar-title">🛡️ Admin Panel</div>
        <button className="btn-logout" onClick={logout}>🚪 Logout</button>
      </div>

      <div className="container">

        {/* Price Per Km Card */}
        <div className="price-card">
          <div className="card-title">💰 Price Per KM Set Karo</div>
          <div className="card-sub">
            Yeh price driver ke PostRide form mein automatically use hogi — driver khud fare nahi dalega.
          </div>

          <div className="price-row">
            <div className="price-input-wrap">
              <label>Rs. per KM</label>
              <input
                className="price-input"
                type="number"
                min="1"
                placeholder="20"
                value={pricePerKm}
                onChange={e => setPricePerKm(e.target.value)}
              />
            </div>
            <button className="btn-save" onClick={savePrice} disabled={savingPrice}>
              {savingPrice ? "Saving..." : "💾 Save Karo"}
            </button>
          </div>

          {savedPrice && (
            <div className="price-preview">
              <div>
                <div className="pp-label">Current Rate</div>
                <div className="pp-val">Rs. {savedPrice} / km</div>
                <div className="pp-example">Example: 50km → Rs. {savedPrice * 50}</div>
              </div>
              <div style={{fontSize: 36}}>📍</div>
            </div>
          )}

          {priceMsg && <div className="price-msg">{priceMsg}</div>}
        </div>

        {/* Rides List */}
        <div className="section-title">🚗 Sab Rides ({rides.length})</div>
        {msg && <div className="empty">{msg}</div>}
        {rides.map(ride => (
          <div key={ride._id} className="ride-card">
            <div>
              <div className="ride-route">{ride.startCity} → {ride.endCity}</div>
              <div className="ride-meta">
                💺 {ride.availableSeats} seats &nbsp;|&nbsp;
                👤 {ride.driver?.name || "Unknown"}
              </div>
              <span className="status-badge">{ride.status || "active"}</span>
            </div>
            <div className="ride-fare">Rs. {ride.fare}</div>
          </div>
        ))}

        <a href="/" className="back">← Wapas Home Jao</a>
      </div>
    </>
  );
}

export default Admin;