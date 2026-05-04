import { useState } from "react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        setError(data.message || "Login failed!");
      }
    } catch {
      setError("Server se connection nahi ho raha!");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --purple:#4a1a8a; --purple2:#6b2fb5; --purple3:#8b3fd4;
          --amber:#f5c842; --amber2:#ffd84d;
          --gray:#3a3a4a; --off:#f8f6ff; --muted:#7a7a9a;
        }

        body { font-family:'Plus Jakarta Sans',sans-serif; overflow:hidden; }

        .scene {
          position:fixed; inset:0;
          background:linear-gradient(180deg, #1a0a3a 0%, #2d1060 40%, #1a0a3a 100%);
          overflow:hidden;
        }
        .stars {
          position:absolute; inset:0;
          background-image:
            radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 10%, rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 25%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 8%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 85% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 95% 35%, rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 55%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 45%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 70% 50%, rgba(255,255,255,0.6) 0%, transparent 100%);
        }
        .city {
          position:absolute; bottom:38%; left:0; right:0;
          display:flex; align-items:flex-end; gap:3px;
          padding:0 20px; opacity:0.25;
        }
        .building { background:linear-gradient(180deg,#6b2fb5,#4a1a8a); border-radius:3px 3px 0 0; flex-shrink:0; }
        .road { position:absolute; bottom:0; left:0; right:0; height:38%; background:linear-gradient(180deg, #2a2a3a 0%, #1a1a28 100%); }
        .road-line {
          position:absolute; top:45%; left:0; right:0; height:4px;
          background:repeating-linear-gradient(90deg, var(--amber) 0px, var(--amber) 40px, transparent 40px, transparent 80px);
          animation: roadMove 0.6s linear infinite;
        }
        .road-edge-top { position:absolute; top:0; left:0; right:0; height:4px; background:var(--amber); opacity:0.4; }
        @keyframes roadMove { from { background-position: 0 0; } to { background-position: -80px 0; } }
        .trees { position:absolute; bottom:38%; left:0; right:0; display:flex; gap:60px; padding:0 30px; animation: treesMove 3s linear infinite; }
        @keyframes treesMove { from { transform:translateX(0); } to { transform:translateX(-120px); } }
        .tree { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
        .tree-top { width:18px; height:28px; background:#2d6a4f; border-radius:50% 50% 30% 30%; }
        .tree-trunk { width:5px; height:12px; background:#8B5E3C; }
        .car-wrap { position:absolute; bottom:calc(38% + 2px); left:12%; animation: carBounce 0.4s ease-in-out infinite alternate; }
        @keyframes carBounce { from { transform:translateY(0px); } to { transform:translateY(-3px); } }
        .car-svg { width:140px; height:auto; filter:drop-shadow(0 8px 20px rgba(74,26,138,0.6)); }
        .headlight-beam { position:absolute; right:-80px; top:18px; width:90px; height:28px; background:linear-gradient(90deg, rgba(245,200,66,0.6), transparent); border-radius:0 50% 50% 0; filter:blur(4px); }
        .speed-lines { position:absolute; bottom:calc(38% + 20px); left:0; right:50%; display:flex; flex-direction:column; gap:8px; padding-left:20px; overflow:hidden; }
        .speed-line { height:2px; border-radius:2px; background:linear-gradient(90deg, transparent, rgba(245,200,66,0.5), transparent); animation: speedLine 0.8s linear infinite; }
        .speed-line:nth-child(1) { width:120px; animation-delay:0s; }
        .speed-line:nth-child(2) { width:80px; animation-delay:0.2s; }
        .speed-line:nth-child(3) { width:100px; animation-delay:0.4s; }
        @keyframes speedLine { from { transform:translateX(200px); opacity:0; } to { transform:translateX(-200px); opacity:1; } }

        .card-wrap { position:fixed; inset:0; display:flex; align-items:center; justify-content:flex-end; padding:24px 5% 24px 0; pointer-events:none; }
        .card { background:rgba(255,255,255,0.95); backdrop-filter:blur(20px); border-radius:28px; padding:36px 32px; width:100%; max-width:380px; box-shadow:0 30px 80px rgba(74,26,138,0.45); pointer-events:all; border:1.5px solid rgba(139,63,212,0.15); animation: slideIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes slideIn { from { opacity:0; transform:translateX(60px) scale(0.95); } to { opacity:1; transform:translateX(0) scale(1); } }

        .card-logo { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
        .card-logo-icon { width:44px; height:44px; background:var(--amber); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 6px 16px rgba(245,200,66,0.4); }
        .card-logo-text { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; font-weight:800; color:var(--purple); }
        .card-logo-text span { color:var(--purple3); }

        .card-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:26px; font-weight:800; color:var(--purple); margin-bottom:4px; }
        .card-sub { font-size:13px; color:var(--muted); margin-bottom:28px; }

        .field { margin-bottom:16px; }
        .field label { display:block; font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
        .field input { width:100%; padding:13px 16px; border:2px solid #ede8f8; border-radius:12px; font-size:15px; font-family:'Plus Jakarta Sans',sans-serif; color:var(--gray); background:var(--off); outline:none; transition:all 0.2s; }
        .field input:focus { border-color:var(--purple3); background:white; box-shadow:0 0 0 4px rgba(139,63,212,0.08); }

        .error-box { background:#fff0f5; border:1.5px solid #ffb3cc; border-radius:10px; padding:10px 14px; font-size:13px; color:#cc2255; margin-bottom:14px; text-align:center; }

        .btn-login { width:100%; padding:14px; background:linear-gradient(135deg,var(--purple2),var(--purple)); color:white; border:none; border-radius:14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.2s; margin-top:4px; box-shadow:0 8px 24px rgba(74,26,138,0.35); display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-login:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(74,26,138,0.45); }
        .btn-login:disabled { opacity:0.7; cursor:not-allowed; transform:none; }

        .spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        .divider { text-align:center; color:var(--muted); font-size:12px; margin:18px 0; position:relative; }
        .divider::before, .divider::after { content:''; position:absolute; top:50%; width:38%; height:1px; background:#ede8f8; }
        .divider::before { left:0; } .divider::after { right:0; }

        .btn-register { width:100%; padding:13px; background:transparent; color:var(--purple2); border:2px solid var(--purple3); border-radius:14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; text-decoration:none; display:block; text-align:center; }
        .btn-register:hover { background:var(--off); }

        @media (max-width:640px) {
          .card-wrap { justify-content:center; padding:20px; align-items:flex-end; padding-bottom:32px; }
          .card { max-width:100%; border-radius:24px 24px 20px 20px; }
          .car-wrap { left:5%; }
        }
      `}</style>

      <div className="scene">
        <div className="stars" />
        <div className="city">
          {[55,80,45,95,60,40,110,50,75,35,90,65,48,85,42,70,100,38].map((h,i)=>(
            <div key={i} className="building" style={{height:h,width:i%3===0?28:i%2===0?20:16}} />
          ))}
        </div>
        <div className="road">
          <div className="road-edge-top" />
          <div className="road-line" />
        </div>
        <div className="trees">
          {[...Array(12)].map((_,i)=>(
            <div key={i} className="tree" style={{marginTop: i%2===0?0:8}}>
              <div className="tree-top" style={{height:i%3===0?34:24}} />
              <div className="tree-trunk" />
            </div>
          ))}
        </div>
        <div className="speed-lines">
          <div className="speed-line" /><div className="speed-line" /><div className="speed-line" />
        </div>
        <div className="car-wrap">
          <div className="headlight-beam" />
          <svg className="car-svg" viewBox="0 0 200 90" fill="none">
            <rect x="10" y="45" width="175" height="32" rx="8" fill="#6b2fb5"/>
            <path d="M55 45 C60 20, 75 15, 90 14 L140 14 C155 14, 165 20, 170 45Z" fill="#8b3fd4"/>
            <path d="M95 18 C100 16, 130 16, 138 18 L165 42 L95 42Z" fill="rgba(245,200,66,0.25)" stroke="rgba(245,200,66,0.4)" strokeWidth="1"/>
            <path d="M62 18 C70 16, 88 16, 93 18 L93 42 L60 42Z" fill="rgba(245,200,66,0.2)" stroke="rgba(245,200,66,0.3)" strokeWidth="1"/>
            <rect x="172" y="50" width="12" height="8" rx="3" fill="#f5c842"/>
            <rect x="10" y="52" width="8" height="6" rx="2" fill="#ff4466"/>
            <circle cx="50" cy="77" r="13" fill="#1a1a28" stroke="#3a3a4a" strokeWidth="2"/>
            <circle cx="50" cy="77" r="7" fill="#3a3a4a"/>
            <circle cx="50" cy="77" r="3" fill="#f5c842"/>
            <circle cx="148" cy="77" r="13" fill="#1a1a28" stroke="#3a3a4a" strokeWidth="2"/>
            <circle cx="148" cy="77" r="7" fill="#3a3a4a"/>
            <circle cx="148" cy="77" r="3" fill="#f5c842"/>
            <line x1="110" y1="46" x2="110" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <rect x="90" y="58" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
            <rect x="118" y="58" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
          </svg>
        </div>
      </div>

      <div className="card-wrap">
        <div className="card">
          <div className="card-logo">
            <div className="card-logo-icon">🚗</div>
            <div className="card-logo-text">Local<span>Ride</span></div>
          </div>
          <div className="card-title">Wapas Aagaye! 👋</div>
          <div className="card-sub">Apne account mein login karo aur safar shuru karo</div>
          {error && <div className="error-box">⚠️ {error}</div>}
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Phone Number</label>
              <input type="tel" placeholder="03XXXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)} required/>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <><div className="spinner"/>Logging in...</> : "🚀 Login Karo"}
            </button>
          </form>
          <div className="divider">ya</div>
          <a href="/register" className="btn-register">Naya Account Banao →</a>
        </div>
      </div>
    </>
  );
}