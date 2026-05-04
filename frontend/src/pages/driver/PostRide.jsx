import { useState, useEffect } from "react";

const CITIES = [
  "Karachi","Hyderabad","Sukkur","Larkana","Nawabshah",
  "Mirpurkhas","Jacobabad","Shikarpur","Dadu","Thatta",
  "Matli","Badin","Tando Adam","Tando Allahyar","Kotri",
];

// Approximate distances in km between cities (one-way)
const DISTANCES = {
  // Karachi
  "Karachi-Hyderabad": 165, "Karachi-Sukkur": 480, "Karachi-Larkana": 520,
  "Karachi-Nawabshah": 300, "Karachi-Mirpurkhas": 280, "Karachi-Jacobabad": 560,
  "Karachi-Shikarpur": 500, "Karachi-Dadu": 330, "Karachi-Thatta": 98,
  "Karachi-Matli": 220, "Karachi-Badin": 200, "Karachi-Tando Adam": 270,
  "Karachi-Tando Allahyar": 250, "Karachi-Kotri": 155,

  // Hyderabad
  "Hyderabad-Sukkur": 320, "Hyderabad-Larkana": 360, "Hyderabad-Nawabshah": 140,
  "Hyderabad-Mirpurkhas": 115, "Hyderabad-Jacobabad": 400, "Hyderabad-Shikarpur": 340,
  "Hyderabad-Dadu": 170, "Hyderabad-Thatta": 75, "Hyderabad-Matli": 80,
  "Hyderabad-Badin": 100, "Hyderabad-Tando Adam": 105, "Hyderabad-Tando Allahyar": 90,
  "Hyderabad-Kotri": 12,

  // Sukkur
  "Sukkur-Larkana": 80, "Sukkur-Nawabshah": 190, "Sukkur-Mirpurkhas": 290,
  "Sukkur-Jacobabad": 90, "Sukkur-Shikarpur": 45, "Sukkur-Dadu": 200,
  "Sukkur-Thatta": 390, "Sukkur-Matli": 350, "Sukkur-Badin": 370,
  "Sukkur-Tando Adam": 280, "Sukkur-Tando Allahyar": 300, "Sukkur-Kotri": 310,

  // Larkana
  "Larkana-Nawabshah": 230, "Larkana-Mirpurkhas": 330, "Larkana-Jacobabad": 120,
  "Larkana-Shikarpur": 60, "Larkana-Dadu": 130, "Larkana-Thatta": 430,
  "Larkana-Matli": 390, "Larkana-Badin": 410, "Larkana-Tando Adam": 320,
  "Larkana-Tando Allahyar": 340, "Larkana-Kotri": 350,

  // Nawabshah
  "Nawabshah-Mirpurkhas": 90, "Nawabshah-Jacobabad": 280, "Nawabshah-Shikarpur": 220,
  "Nawabshah-Dadu": 160, "Nawabshah-Thatta": 220, "Nawabshah-Matli": 180,
  "Nawabshah-Badin": 200, "Nawabshah-Tando Adam": 80, "Nawabshah-Tando Allahyar": 100,
  "Nawabshah-Kotri": 130,

  // Mirpurkhas
  "Mirpurkhas-Jacobabad": 370, "Mirpurkhas-Shikarpur": 310, "Mirpurkhas-Dadu": 260,
  "Mirpurkhas-Thatta": 190, "Mirpurkhas-Matli": 110, "Mirpurkhas-Badin": 130,
  "Mirpurkhas-Tando Adam": 60, "Mirpurkhas-Tando Allahyar": 45, "Mirpurkhas-Kotri": 120,

  // Jacobabad
  "Jacobabad-Shikarpur": 50, "Jacobabad-Dadu": 230, "Jacobabad-Thatta": 470,
  "Jacobabad-Matli": 430, "Jacobabad-Badin": 450, "Jacobabad-Tando Adam": 360,
  "Jacobabad-Tando Allahyar": 380, "Jacobabad-Kotri": 390,

  // Shikarpur
  "Shikarpur-Dadu": 210, "Shikarpur-Thatta": 450, "Shikarpur-Matli": 410,
  "Shikarpur-Badin": 430, "Shikarpur-Tando Adam": 340, "Shikarpur-Tando Allahyar": 360,
  "Shikarpur-Kotri": 370,

  // Dadu
  "Dadu-Thatta": 240, "Dadu-Matli": 260, "Dadu-Badin": 280,
  "Dadu-Tando Adam": 200, "Dadu-Tando Allahyar": 210, "Dadu-Kotri": 180,

  // Thatta
  "Thatta-Matli": 130, "Thatta-Badin": 110, "Thatta-Tando Adam": 180,
  "Thatta-Tando Allahyar": 170, "Thatta-Kotri": 70,

  // Matli
  "Matli-Badin": 42, "Matli-Tando Adam": 60, "Matli-Tando Allahyar": 55,
  "Matli-Kotri": 145,

  // Badin
  "Badin-Tando Adam": 80, "Badin-Tando Allahyar": 90, "Badin-Kotri": 155,
  "Badin-Thatta": 110,

  // Tando Adam
  "Tando Adam-Tando Allahyar": 35, "Tando Adam-Kotri": 110,

  // Tando Allahyar
  "Tando Allahyar-Kotri": 85,

  // Kotri
  "Kotri-Hyderabad": 12,
};

function getDistance(from, to) {
  const key1 = `${from}-${to}`;
  const key2 = `${to}-${from}`;
  return DISTANCES[key1] || DISTANCES[key2] || null;
}

export default function PostRide() {
  const [form, setForm] = useState({
    startCity: "", endCity: "", seats: "", departureTime: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pricePerKm, setPricePerKm] = useState(null);
  const [calculatedFare, setCalculatedFare] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("adminPricePerKm");
    if (saved) setPricePerKm(Number(saved));
  }, []);

  useEffect(() => {
    if (form.startCity && form.endCity && form.startCity !== form.endCity) {
      const dist = getDistance(form.startCity, form.endCity);
      setDistance(dist);
      if (dist && pricePerKm) {
        setCalculatedFare(Math.round(dist * pricePerKm));
      } else {
        setCalculatedFare(null);
      }
    } else {
      setDistance(null);
      setCalculatedFare(null);
    }
  }, [form.startCity, form.endCity, pricePerKm]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!calculatedFare) {
      setError("Fare calculate nahi hua — Admin ne price set nahi ki ya cities match nahi hoti.");
      return;
    }
    setLoading(true); setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          startCity: form.startCity,
          endCity: form.endCity,
          seats: Number(form.seats),
          totalSeats: Number(form.seats),
          availableSeats: Number(form.seats),
          fare: calculatedFare,
          departureTime: form.departureTime,
        }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.message || "Error posting ride");
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
          --off: #f8f6ff; --muted: #7a7a9a;
        }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        .topbar {
          background: linear-gradient(135deg, var(--purple), var(--purple2));
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .topbar-title { color: white; font-size: 16px; font-weight: 700; }
        .btn-logout {
          background: rgba(255,255,255,0.15); color: white;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 10px; padding: 7px 16px;
          font-size: 13px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-logout:hover { background: rgba(255,255,255,0.25); }

        .page {
          min-height: calc(100vh - 52px);
          background: linear-gradient(135deg, var(--purple) 0%, var(--purple2) 100%);
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .card {
          background: white; border-radius: 24px;
          width: 100%; max-width: 460px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(74,26,138,0.4);
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .header {
          background: linear-gradient(135deg, var(--purple2), var(--purple));
          padding: 24px; color: white; display: flex; align-items: center; gap: 12px;
        }
        .h-icon {
          width: 48px; height: 48px; background: var(--amber);
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; font-size: 22px;
        }
        .h-title { font-size: 20px; font-weight: 800; }
        .h-sub { font-size: 12px; opacity: 0.72; margin-top: 2px; }

        .body { padding: 28px; }

        .warn-box {
          background: #fff8e1; border: 1.5px solid #ffe082;
          border-radius: 14px; padding: 14px 18px;
          font-size: 13px; color: #b8860b;
          margin-bottom: 20px; text-align: center; font-weight: 600;
        }

        .field { margin-bottom: 18px; }
        .field label {
          display: block; font-size: 11px; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.8px; margin-bottom: 6px;
        }
        .field select, .field input {
          width: 100%; padding: 13px 16px;
          border: 2px solid #ede8f8; border-radius: 12px;
          font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #333; background: var(--off); outline: none; transition: all 0.2s;
          appearance: none;
        }
        .field select:focus, .field input:focus {
          border-color: var(--purple3); background: white;
          box-shadow: 0 0 0 4px rgba(139,63,212,0.08);
        }

        .fare-box {
          background: linear-gradient(135deg, var(--purple), var(--purple2));
          border-radius: 18px; padding: 20px; margin-bottom: 20px; text-align: center;
        }
        .fare-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .fare-amount { font-size: 42px; font-weight: 800; color: var(--amber); line-height: 1; }
        .fare-detail { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 6px; }
        .fare-pending {
          font-size: 15px; color: rgba(255,255,255,0.5);
          font-weight: 600; padding: 8px 0;
        }

        .error {
          background: #fff0f5; border: 1.5px solid #ffb3cc;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #cc2255;
          margin-bottom: 16px; text-align: center;
        }
        .success {
          background: #f0fff4; border: 1.5px solid #9ae6b4;
          border-radius: 16px; padding: 28px; text-align: center;
        }
        .success h3 { font-size: 20px; font-weight: 800; color: var(--purple); margin-bottom: 8px; }
        .success p { font-size: 14px; color: var(--muted); margin-bottom: 20px; }

        .btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, var(--purple2), var(--purple));
          color: white; border: none; border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(74,26,138,0.35);
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(74,26,138,0.45); }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .btn-amber { background: var(--amber); color: var(--purple); box-shadow: 0 8px 24px rgba(245,200,66,0.4); }
        .btn-amber:hover { background: var(--amber2); }
        .back {
          display: block; text-align: center; margin-top: 16px;
          color: var(--purple2); font-size: 13px; font-weight: 600; text-decoration: none;
        }
        .back:hover { text-decoration: underline; }
      `}</style>

      <div className="topbar">
        <div className="topbar-title">🚗 Driver Panel</div>
        <button className="btn-logout" onClick={logout}>🚪 Logout</button>
      </div>

      <div className="page">
        <div className="card">
          <div className="header">
            <div className="h-icon">🚗</div>
            <div>
              <div className="h-title">Post a Ride</div>
              <div className="h-sub">Local Ride — Driver Panel</div>
            </div>
          </div>
          <div className="body">
            {success ? (
              <div className="success">
                <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
                <h3>Ride Post Ho Gayi!</h3>
                <p>
                  <strong>{form.startCity} → {form.endCity}</strong><br />
                  Fare: <strong>Rs. {calculatedFare}</strong> (Admin rate se)
                </p>
                <button className="btn btn-amber" onClick={() => { setSuccess(false); setForm({ startCity: "", endCity: "", seats: "", departureTime: "" }); }}>
                  + Aur Post Karo
                </button>
                <a href="/" className="back">← Wapas Jao</a>
              </div>
            ) : (
              <>
                {!pricePerKm && (
                  <div className="warn-box">
                    ⚠️ Admin ne abhi price per km set nahi ki — Pehle Admin panel mein set karo
                  </div>
                )}

                {error && <div className="error">⚠️ {error}</div>}

                <div className="field">
                  <label>From City</label>
                  <select name="startCity" value={form.startCity} onChange={handle} required>
                    <option value="">Sheher chunein</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>To City</label>
                  <select name="endCity" value={form.endCity} onChange={handle} required>
                    <option value="">Sheher chunein</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="fare-box">
                  <div className="fare-label">Auto-Calculated Fare (Admin Rate)</div>
                  {calculatedFare ? (
                    <>
                      <div className="fare-amount">Rs. {calculatedFare}</div>
                      <div className="fare-detail">
                        {distance} km × Rs. {pricePerKm}/km
                      </div>
                    </>
                  ) : (
                    <div className="fare-pending">
                      {form.startCity && form.endCity
                        ? "⚠️ Is route ki distance available nahi"
                        : "Cities chunein — fare auto show hoga"}
                    </div>
                  )}
                </div>

                <div className="field">
                  <label>Seats</label>
                  <input
                    type="number" name="seats" min="1" max="8"
                    placeholder="4" value={form.seats} onChange={handle} required
                  />
                </div>

                <div className="field">
                  <label>Departure Time</label>
                  <input
                    type="datetime-local" name="departureTime"
                    value={form.departureTime} onChange={handle} required
                  />
                </div>

                <button
                  className="btn"
                  onClick={submit}
                  disabled={loading || !calculatedFare}
                >
                  {loading ? "Posting..." : "🚀 Post Ride"}
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