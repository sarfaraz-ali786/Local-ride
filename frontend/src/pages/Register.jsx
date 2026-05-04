import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name:"", phone:"", cnic:"", password:"", role:"passenger", terms:false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(prev => ({...prev, [e.target.name]: val}));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.terms) { setError("Terms accept karo!"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("https://local-ride-production.up.railway.app/api/auth/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name: form.name, phone: form.phone,
cnic: form.cnic, password: form.password, 
role: form.role, terms: form.terms
        }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.message || "Registration failed!");
    } catch { setError("Server se connection nahi!"); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --purple:#4a1a8a; --purple2:#6b2fb5; --purple3:#8b3fd4;
          --amber:#f5c842; --amber2:#ffd84d;
          --off:#f8f6ff; --muted:#7a7a9a; --text:#1a1a2e;
        }
        body { font-family:'Plus Jakarta Sans',sans-serif; overflow-x:hidden; }
        .scene {
          position:fixed; inset:0;
          background:linear-gradient(180deg,#1a0a3a 0%,#2d1060 40%,#1a0a3a 100%);
          overflow:hidden;
        }
        .stars {
          position:absolute; inset:0;
          background-image:
            radial-gradient(1px 1px at 10% 15%,rgba(255,255,255,0.8) 0%,transparent 100%),
            radial-gradient(1px 1px at 25% 35%,rgba(255,255,255,0.6) 0%,transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 10%,rgba(255,255,255,0.9) 0%,transparent 100%),
            radial-gradient(1px 1px at 60% 25%,rgba(255,255,255,0.7) 0%,transparent 100%),
            radial-gradient(1px 1px at 80% 12%,rgba(255,255,255,0.8) 0%,transparent 100%),
            radial-gradient(1px 1px at 90% 30%,rgba(255,255,255,0.6) 0%,transparent 100%),
            radial-gradient(1px 1px at 55% 45%,rgba(255,255,255,0.7) 0%,transparent 100%);
        }
        .city {
          position:absolute; bottom:38%; left:0; right:0;
          display:flex; align-items:flex-end; gap:3px;
          padding:0 20px; opacity:0.2;
        }
        .building { background:linear-gradient(180deg,#6b2fb5,#4a1a8a); border-radius:3px 3px 0 0; flex-shrink:0; }
        .road { position:absolute; bottom:0; left:0; right:0; height:38%; background:linear-gradient(180deg,#2a2a3a 0%,#1a1a28 100%); }
        .road-line {
          position:absolute; top:45%; left:0; right:0; height:4px;
          background:repeating-linear-gradient(90deg,var(--amber) 0px,var(--amber) 40px,transparent 40px,transparent 80px);
          animation:roadMove 0.6s linear infinite;
        }
        .road-edge { position:absolute; top:0; left:0; right:0; height:4px; background:var(--amber); opacity:0.3; }
        @keyframes roadMove { from{background-position:0 0} to{background-position:-80px 0} }
        .trees { position:absolute; bottom:38%; left:0; right:0; display:flex; gap:60px; padding:0 30px; animation:treesMove 3s linear infinite; }
        @keyframes treesMove { from{transform:translateX(0)} to{transform:translateX(-120px)} }
        .tree { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
        .tree-top { width:18px; height:28px; background:#2d6a4f; border-radius:50% 50% 30% 30%; }
        .tree-trunk { width:5px; height:12px; background:#8B5E3C; }
        .car-wrap { position:absolute; bottom:calc(38% + 2px); left:8%; animation:carBounce 0.4s ease-in-out infinite alternate; }
        @keyframes carBounce { from{transform:translateY(0)} to{transform:translateY(-3px)} }
        .car-svg { width:130px; height:auto; filter:drop-shadow(0 8px 20px rgba(74,26,138,0.6)); }
        .headlight-beam { position:absolute; right:-75px; top:18px; width:85px; height:26px; background:linear-gradient(90deg,rgba(245,200,66,0.55),transparent); border-radius:0 50% 50% 0; filter:blur(4px); }
        .speed-lines { position:absolute; bottom:calc(38% + 18px); left:0; right:55%; display:flex; flex-direction:column; gap:8px; padding-left:16px; overflow:hidden; }
        .speed-line { height:2px; border-radius:2px; background:linear-gradient(90deg,transparent,rgba(245,200,66,0.45),transparent); animation:speedLine 0.8s linear infinite; }
        .speed-line:nth-child(1){width:110px;animation-delay:0s}
        .speed-line:nth-child(2){width:75px;animation-delay:0.25s}
        .speed-line:nth-child(3){width:95px;animation-delay:0.5s}
        @keyframes speedLine { from{transform:translateX(180px);opacity:0} to{transform:translateX(-180px);opacity:1} }
        .card-wrap { position:fixed; inset:0; display:flex; align-items:center; justify-content:flex-end; padding:20px 5% 20px 0; pointer-events:none; overflow-y:auto; }
        .card { background:rgba(255,255,255,0.96); backdrop-filter:blur(20px); border-radius:28px; padding:32px 28px; width:100%; max-width:370px; box-shadow:0 30px 80px rgba(74,26,138,0.45); pointer-events:all; border:1.5px solid rgba(139,63,212,0.15); animation:slideIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes slideIn { from{opacity:0;transform:translateX(60px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        .logo { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .logo-icon { width:42px; height:42px; background:var(--amber); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 6px 16px rgba(245,200,66,0.4); }
        .logo-text { font-size:20px; font-weight:800; color:var(--purple); }
        .logo-text span { color:var(--purple3); }
        .card-title { font-size:24px; font-weight:800; color:var(--purple); margin-bottom:4px; }
        .card-sub { font-size:13px; color:var(--muted); margin-bottom:22px; }
        .field { margin-bottom:14px; }
        .field label { display:block; font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:5px; }
        .field input { width:100%; padding:12px 14px; border:2px solid #ede8f8; border-radius:12px; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif; color:var(--text); background:var(--off); outline:none; transition:all 0.2s; }
        .field input:focus { border-color:var(--purple3); background:white; box-shadow:0 0 0 4px rgba(139,63,212,0.08); }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .role-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
        .role-btn { padding:10px; border-radius:12px; border:2px solid #ede8f8; background:var(--off); font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:var(--muted); cursor:pointer; transition:all 0.2s; text-align:center; }
        .role-btn.active { border-color:var(--purple2); background:rgba(107,47,181,0.08); color:var(--purple2); }
        .terms-row { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .terms-text { font-size:12px; color:var(--muted); line-height:1.4; cursor:pointer; }
        .error-box { background:#fff0f5; border:1.5px solid #ffb3cc; border-radius:10px; padding:9px 13px; font-size:13px; color:#cc2255; margin-bottom:12px; text-align:center; }
        .btn-reg { width:100%; padding:13px; background:linear-gradient(135deg,var(--purple2),var(--purple)); color:white; border:none; border-radius:14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 8px 24px rgba(74,26,138,0.35); display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-reg:hover { transform:translateY(-2px); }
        .btn-reg:disabled { opacity:0.7; cursor:not-allowed; transform:none; }
        .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-link { text-align:center; margin-top:14px; font-size:13px; color:var(--muted); }
        .login-link a { color:var(--purple2); font-weight:700; text-decoration:none; }
        .success-wrap { text-align:center; padding:8px 0; }
        .s-icon { font-size:60px; margin-bottom:14px; animation:bounce 0.6s ease; }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        .s-title { font-size:22px; font-weight:800; color:var(--purple); margin-bottom:8px; }
        .s-sub { font-size:14px; color:var(--muted); line-height:1.6; margin-bottom:20px; }
        .btn-amber { width:100%; padding:13px; background:var(--amber); color:var(--purple); border:none; border-radius:14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .btn-amber:hover { background:var(--amber2); transform:translateY(-2px); }
        @media (max-width:640px) {
          .card-wrap { justify-content:center; padding:80px 16px 24px; align-items:flex-start; }
          .card { max-width:100%; }
        }
      `}</style>

      <div className="scene">
        <div className="stars"/>
        <div className="city">
          {[55,80,45,95,60,40,110,50,75,35,90,65,48,85,42,70,100,38].map((h,i)=>(
            <div key={i} className="building" style={{height:h, width:i%3===0?28:i%2===0?20:16}}/>
          ))}
        </div>
        <div className="road">
          <div className="road-edge"/>
          <div className="road-line"/>
        </div>
        <div className="trees">
          {[...Array(12)].map((_,i)=>(
            <div key={i} className="tree" style={{marginTop:i%2===0?0:8}}>
              <div className="tree-top" style={{height:i%3===0?34:24}}/>
              <div className="tree-trunk"/>
            </div>
          ))}
        </div>
        <div className="speed-lines">
          <div className="speed-line"/><div className="speed-line"/><div className="speed-line"/>
        </div>
        <div className="car-wrap">
          <div className="headlight-beam"/>
          <svg className="car-svg" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <rect x="90" y="58" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>
            <rect x="118" y="58" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>
          </svg>
        </div>
      </div>

      <div className="card-wrap">
        <div className="card">
          <div className="logo">
            <div className="logo-icon">🚗</div>
            <div className="logo-text">Local<span>Ride</span></div>
          </div>

          {success ? (
            <div className="success-wrap">
              <div className="s-icon">🎉</div>
              <div className="s-title">Account Ban Gaya!</div>
              <div className="s-sub">
                <strong>{form.name}</strong> — aapka account successfully create ho gaya!<br/>
                Ab login karke ride book karo ya post karo.
              </div>
              <button className="btn-amber" onClick={()=>window.location.href="/login"}>
                🚀 Login Karo
              </button>
            </div>
          ) : (
            <>
              <div className="card-title">Naya Account 🚗</div>
              <div className="card-sub">Free register karo — sirf 30 second lagenge!</div>
              {error && <div className="error-box">⚠️ {error}</div>}
              <form onSubmit={submit}>
                <div className="field">
                  <label>Poora Naam</label>
                  <input name="name" placeholder="Sarfaraz Ali" value={form.name} onChange={handle} required/>
                </div>
                <div className="row2">
                  <div className="field">
                    <label>Phone</label>
                    <input name="phone" placeholder="03XXXXXXXXX" value={form.phone} onChange={handle} required/>
                  </div>
                  <div className="field">
                    <label>CNIC</label>
                    <input name="cnic" placeholder="XXXXX-XXXXXXX-X" value={form.cnic} onChange={handle} required/>
                  </div>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handle} required/>
                </div>
                <div className="field"><label>Main hoon</label></div>
                <div className="role-row">
                  <button type="button" className={`role-btn ${form.role==="passenger"?"active":""}`}
                    onClick={()=>setForm(prev=>({...prev,role:"passenger"}))}>
                    🧳 Passenger
                  </button>
                  <button type="button" className={`role-btn ${form.role==="driver"?"active":""}`}
                    onClick={()=>setForm(prev=>({...prev,role:"driver"}))}>
                    🚗 Driver
                  </button>
                </div>

                {/* ✅ FIX: div se onClick hataya, sirf label click karne se checkbox toggle hoga */}
                <div className="terms-row">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handle}
                    style={{width:18,height:18,cursor:"pointer",accentColor:"#6b2fb5",flexShrink:0}}
                  />
                  <label htmlFor="terms-checkbox" className="terms-text">
                    Main <strong style={{color:"#6b2fb5"}}>Terms & Conditions</strong> accept karta/karti hoon
                  </label>
                </div>

                <button type="submit" className="btn-reg" disabled={loading}>
                  {loading ? <><div className="spinner"/>Creating...</> : "🚀 Account Banao"}
                </button>
              </form>
              <div className="login-link">
                Already registered? <a href="/login">Login Karo</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}