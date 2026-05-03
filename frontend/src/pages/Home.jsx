import { useState, useEffect } from "react";

const CITIES = [
  "Karachi","Hyderabad","Sukkur","Larkana","Nawabshah",
  "Mirpurkhas","Jacobabad","Shikarpur","Dadu","Thatta",
  "Matli","Badin","Tando Adam","Tando Allahyar","Kotri",
];

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (from && to) {
      window.location.href = `/rides?from=${from}&to=${to}&date=${date}`;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g1: #0b4f2e; --g2: #1a7a42; --g3: #25a85a;
          --accent: #f5c842; --white: #fff; --off: #f4f9f6;
          --text: #0e2018; --muted: #6b8c78;
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--off); overflow-x: hidden; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 32px; display: flex; align-items: center;
          justify-content: space-between; height: 68px; transition: background 0.3s;
        }
        .nav.scrolled { background: rgba(11,79,46,0.97); box-shadow: 0 2px 24px rgba(0,0,0,0.18); }
        .nav-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px;
          color: white; display: flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .nav-logo .dot { color: #f5c842; }
        .logo-icon { width:36px; height:36px; background:#f5c842; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .nav-links { display:flex; align-items:center; gap:4px; list-style:none; }
        .nav-links a { color:rgba(255,255,255,0.82); text-decoration:none; font-size:14px; font-weight:500; padding:7px 14px; border-radius:8px; transition:all 0.2s; }
        .nav-links a:hover { color:white; background:rgba(255,255,255,0.12); }
        .nav-cta { background:#f5c842 !important; color:#0b4f2e !important; font-weight:700 !important; }
        .nav-avatar { width:32px; height:32px; background:#f5c842; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#0b4f2e; font-size:14px; }
        .nav-user { display:flex; align-items:center; gap:8px; color:white; font-size:13px; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:8px; }
        .hamburger span { display:block; width:24px; height:2px; background:white; border-radius:2px; }
        .mob-menu { display:none; position:fixed; top:68px; left:0; right:0; background:var(--g1); z-index:99; padding:16px 24px 24px; }
        .mob-menu.open { display:block; }
        .mob-menu a { display:block; color:rgba(255,255,255,0.85); text-decoration:none; padding:12px 0; font-size:15px; border-bottom:1px solid rgba(255,255,255,0.08); }

        .hero {
          min-height:100vh; background:linear-gradient(150deg,var(--g1) 0%,var(--g2) 55%,#1d6b3a 100%);
          display:flex; align-items:center; justify-content:center;
          padding:100px 24px 60px; position:relative; overflow:hidden;
        }
        .hero::before { content:''; position:absolute; width:600px; height:600px; border-radius:50%; background:rgba(255,255,255,0.04); top:-200px; right:-150px; }
        .hero-inner { max-width:900px; width:100%; text-align:center; position:relative; z-index:2; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(245,200,66,0.15); border:1px solid rgba(245,200,66,0.3); border-radius:100px; padding:6px 16px; color:#f5c842; font-size:13px; font-weight:600; margin-bottom:24px; }
        .hero-title { font-family:'Syne',sans-serif; font-size:clamp(40px,7vw,80px); font-weight:800; color:white; line-height:1.05; letter-spacing:-2px; margin-bottom:20px; }
        .hero-title .hl { color:#f5c842; }
        .hero-sub { font-size:18px; color:rgba(255,255,255,0.7); max-width:500px; margin:0 auto 40px; line-height:1.6; }

        .sbox { background:white; border-radius:20px; padding:28px; box-shadow:0 30px 80px rgba(0,0,0,0.25); max-width:720px; margin:0 auto; }
        .sbox h3 { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:var(--g1); margin-bottom:18px; }
        .srow { display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:12px; align-items:end; }
        .sfield label { display:block; font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
        .sfield select, .sfield input { width:100%; padding:12px 14px; border:2px solid #e0ede7; border-radius:12px; font-size:14px; font-family:'DM Sans',sans-serif; background:var(--off); outline:none; transition:border-color 0.2s; appearance:none; }
        .sfield select:focus, .sfield input:focus { border-color:var(--g3); background:white; }
        .sbtn { background:linear-gradient(135deg,var(--g2),var(--g1)); color:white; border:none; border-radius:12px; padding:13px 24px; font-size:15px; font-weight:700; font-family:'Syne',sans-serif; cursor:pointer; transition:all 0.2s; box-shadow:0 6px 20px rgba(11,79,46,0.3); }
        .sbtn:hover { transform:translateY(-2px); }

        .stats { display:flex; justify-content:center; gap:40px; margin-top:36px; flex-wrap:wrap; }
        .stat { text-align:center; color:white; }
        .stat-n { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; color:#f5c842; display:block; }
        .stat-l { font-size:12px; opacity:0.65; text-transform:uppercase; letter-spacing:0.8px; }

        .features { padding:80px 24px; background:var(--off); }
        .sec-label { text-align:center; color:var(--g2); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px; }
        .sec-title { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,42px); font-weight:800; color:var(--text); text-align:center; margin-bottom:48px; letter-spacing:-1px; }
        .fgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:20px; max-width:1000px; margin:0 auto; }
        .fcard { background:white; border-radius:20px; padding:28px; border:1.5px solid #e4f0ea; transition:all 0.3s; }
        .fcard:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,0.1); }
        .ficon { width:52px; height:52px; background:linear-gradient(135deg,var(--g1),var(--g2)); border-radius:14px; font-size:24px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .fcard h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px; }
        .fcard p { font-size:14px; color:var(--muted); line-height:1.6; }

        .how { padding:80px 24px; background:linear-gradient(135deg,var(--g1),var(--g2)); }
        .how .sec-title { color:white; }
        .how .sec-label { color:#f5c842; }
        .sgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; max-width:900px; margin:0 auto; }
        .scard { text-align:center; padding:28px 20px; background:rgba(255,255,255,0.08); border-radius:20px; border:1px solid rgba(255,255,255,0.12); transition:background 0.3s; }
        .scard:hover { background:rgba(255,255,255,0.14); }
        .snum { width:48px; height:48px; background:#f5c842; border-radius:50%; font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:var(--g1); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .scard h3 { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:white; margin-bottom:8px; }
        .scard p { font-size:13px; color:rgba(255,255,255,0.65); line-height:1.6; }

        .cta-sec { padding:80px 24px; background:var(--off); text-align:center; }
        .cta-inner { background:linear-gradient(135deg,var(--g1),var(--g2)); border-radius:28px; padding:56px 40px; max-width:700px; margin:0 auto; }
        .cta-inner h2 { font-family:'Syne',sans-serif; font-size:clamp(26px,4vw,40px); font-weight:800; color:white; margin-bottom:12px; letter-spacing:-1px; }
        .cta-inner p { color:rgba(255,255,255,0.7); font-size:16px; margin-bottom:32px; }
        .cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .btn-p { background:#f5c842; color:var(--g1); padding:14px 32px; border-radius:12px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; text-decoration:none; transition:all 0.2s; }
        .btn-p:hover { background:#ffd84d; transform:translateY(-2px); }
        .btn-o { background:transparent; color:white; padding:14px 32px; border-radius:12px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; text-decoration:none; border:2px solid rgba(255,255,255,0.4); transition:all 0.2s; }
        .btn-o:hover { border-color:white; background:rgba(255,255,255,0.08); }

        footer { background:var(--g1); color:rgba(255,255,255,0.6); text-align:center; padding:28px 24px; font-size:13px; }
        footer strong { color:#f5c842; }

        @media (max-width:700px) {
          .nav-links { display:none; } .hamburger { display:flex; }
          .srow { grid-template-columns:1fr 1fr; }
          .sbtn { grid-column:span 2; }
          .stats { gap:24px; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="logo-icon">🚗</div>
          Local<span className="dot">Ride</span>
        </a>
        <ul className="nav-links">
          {[["Home","/"],["Search Ride","/rides"],["Post Ride","/driver/post"],["My Rides","/driver/active"],["Wallet","/driver/wallet"]].map(([l,p]) => (
            <li key={p}><a href={p} className={l==="Post Ride"?"nav-cta":""}>{l}</a></li>
          ))}
          {user ? (
            <li><div className="nav-user"><div className="nav-avatar">{user.name?.[0]?.toUpperCase()||"U"}</div><span>{user.name?.split(" ")[0]}</span></div></li>
          ) : (
            <li><a href="/login" className="nav-cta">Login</a></li>
          )}
        </ul>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span/><span/><span/>
        </div>
      </nav>

      <div className={`mob-menu ${menuOpen ? "open" : ""}`}>
        {[["Home","/"],["Search Ride","/rides"],["Post Ride","/driver/post"],["My Rides","/driver/active"],["Wallet","/driver/wallet"],["Login","/login"]].map(([l,p]) => (
          <a key={p} href={p}>{l}</a>
        ))}
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">🚀 Sindh ka #1 Carpooling App</div>
          <h1 className="hero-title">Apni <span className="hl">Ride</span><br/>Apni Marzi</h1>
          <p className="hero-sub">Sindh ke kisi bhi sheher mein safe, sasti aur aasaan ride — passengers aur drivers ka ek platform.</p>

          <div className="sbox">
            <h3>🔍 Ride Search Karo</h3>
            <form onSubmit={handleSearch}>
              <div className="srow">
                <div className="sfield">
                  <label>Kahan Se</label>
                  <select value={from} onChange={e=>setFrom(e.target.value)} required>
                    <option value="">Sheher chunein</option>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sfield">
                  <label>Kahan Tak</label>
                  <select value={to} onChange={e=>setTo(e.target.value)} required>
                    <option value="">Sheher chunein</option>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sfield">
                  <label>Tarikh</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
                </div>
                <button type="submit" className="sbtn">Search →</button>
              </div>
            </form>
          </div>

          <div className="stats">
            {[["500+","Rides"],["1200+","Passengers"],["50+","Cities"],["4.8★","Rating"]].map(([n,l])=>(
              <div className="stat" key={l}><span className="stat-n">{n}</span><span className="stat-l">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="sec-label">Kyun Local Ride?</div>
        <h2 className="sec-title">Sab kuch ek jagah</h2>
        <div className="fgrid">
          {[["🛡️","100% Safe","Verified drivers, CNIC verified accounts."],["💰","Sasta Safar","Market se 40% kam fare — direct booking."],["📍","Sindh Cover","Hyderabad, Karachi, Sukkur, Larkana aur ziada."],["⚡","Instant Book","60 seconds mein register aur book karo."],["🚗","Driver Earn","Apni car se extra income kamao."],["📱","Mobile Ready","Kisi bhi device par smooth experience."]].map(([ic,t,d])=>(
            <div className="fcard" key={t}>
              <div className="ficon">{ic}</div>
              <h3>{t}</h3><p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="sec-label">Simple Process</div>
        <h2 className="sec-title">Kaise kaam karta hai?</h2>
        <div className="sgrid">
          {[["Register karo","Naam, phone, CNIC se account banao."],["Ride Dhundho","Apna sheher choose karo."],["Book Karo","Seat book karo aur confirm karo."],["Safar Karo","Driver se milo aur enjoy karo!"]].map(([t,d],i)=>(
            <div className="scard" key={t}>
              <div className="snum">{i+1}</div>
              <h3>{t}</h3><p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-inner">
          <h2>Aaj hi shuru karo!</h2>
          <p>Free register karo aur apni pehli ride book karo ya post karo.</p>
          <div className="cta-btns">
            <a href="/register" className="btn-p">Register Karo →</a>
            <a href="/driver/post" className="btn-o">Ride Post Karo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 <strong>LocalRide</strong> — PITP MUET Batch 4 Final Project</p>
        <p style={{marginTop:"6px"}}>Trainer: <strong>Engr. Uzaif Talpur</strong> | Student: <strong>Sarfaraz Ali</strong></p>
      </footer>
    </>
  );
}