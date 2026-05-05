import { useMemo, useRef } from "react";

const STARS = Array.from({length: 25}, (_, i) => ({
  id: i,
  w: (((i * 7) % 3) + 1) + 'px',
  top: ((i * 37) % 100) + '%',
  left: ((i * 53) % 100) + '%',
  delay: ((i * 0.3) % 4) + 's',
  dur: ((i * 0.4) % 3 + 2) + 's',
}));

// Get logged in user
const user = JSON.parse(localStorage.getItem('user'));

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export default function Home() {
  const heroRef = useRef(null);

  return (
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotateX(2deg); }
          50% { transform: translateY(-18px) rotateX(-2deg); }
        }
        @keyframes rotateSlow {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(245,200,66,0.4), 0 0 80px rgba(107,47,181,0.3); }
          50% { box-shadow: 0 0 80px rgba(245,200,66,0.7), 0 0 160px rgba(107,47,181,0.5); }
        }
        @keyframes roadScroll {
          from { background-position: 0 0; }
          to { background-position: -200px 0; }
        }
        @keyframes carDrive {
          0% { transform: translateX(-120px) translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          45% { transform: translateX(calc(50vw - 80px)) translateY(-2px); }
          55% { transform: translateX(calc(50vw - 80px)) translateY(2px); }
          90% { opacity: 1; }
          100% { transform: translateX(110vw) translateY(0px); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

        .home-wrapper {
          background: #0a0614;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }

        /* NAVBAR */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(10,6,20,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          animation: fadeSlideUp 0.6s ease both;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
          font-size: 22px; font-weight: 800; color: white; text-decoration: none;
        }
        .nav-logo-icon {
          width: 40px; height: 40px; background: linear-gradient(135deg, #f5c842, #ff9500);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-size: 20px; box-shadow: 0 4px 20px rgba(245,200,66,0.4);
        }
        .nav-logo span { color: #f5c842; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-links a {
          color: rgba(255,255,255,0.7); text-decoration: none;
          font-size: 14px; font-weight: 500; transition: color 0.2s;
        }
        .nav-links a:hover { color: white; }
        .nav-btns { display: flex; align-items: center; gap: 12px; }
        .btn-outline {
          padding: 9px 22px; border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          background: transparent; transition: all 0.2s;
          text-decoration: none; display: inline-flex; align-items: center;
        }
        .btn-outline:hover { border-color: #f5c842; color: #f5c842; }
        .btn-primary {
          padding: 9px 22px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #f5c842, #ff9500);
          color: #1a0a3a; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-flex; align-items: center;
          box-shadow: 0 4px 20px rgba(245,200,66,0.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,200,66,0.5); }
        .nav-user-name {
          color: #f5c842; font-weight: 700; font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-logout {
          padding: 9px 22px; border-radius: 10px;
          border: 1.5px solid rgba(245,200,66,0.4);
          color: #f5c842; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          background: transparent; transition: all 0.2s;
        }
        .btn-logout:hover { background: rgba(245,200,66,0.1); }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; align-items: center;
          position: relative; padding: 120px 48px 80px;
          perspective: 1000px;
        }
        .hero-bg {
          position: absolute; inset: 0; overflow: hidden;
          background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(107,47,181,0.25) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 50% at 20% 80%, rgba(245,200,66,0.08) 0%, transparent 60%);
        }
        .star {
          position: absolute; border-radius: 50%;
          background: white; animation: twinkle 3s ease-in-out infinite;
        }
        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(107,47,181,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,47,181,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 60% 40%, black 30%, transparent 70%);
        }

        .hero-content {
          position: relative; z-index: 2; max-width: 560px;
          animation: fadeSlideLeft 0.8s ease 0.2s both;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 50px;
          background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.3);
          color: #f5c842; font-size: 13px; font-weight: 600; margin-bottom: 24px;
        }
        .hero-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f5c842; animation: pulseGlow 2s ease infinite;
        }
        .hero-title {
          font-size: clamp(42px, 6vw, 72px); font-weight: 800; line-height: 1.05;
          color: white; margin-bottom: 20px; letter-spacing: -2px;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #f5c842, #ff9500, #f5c842);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s linear infinite;
        }
        .hero-sub {
          font-size: 17px; color: rgba(255,255,255,0.6); line-height: 1.7;
          margin-bottom: 36px; max-width: 440px;
        }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
        .btn-hero-primary {
          padding: 15px 32px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #f5c842, #ff9500);
          color: #1a0a3a; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 800; cursor: pointer;
          box-shadow: 0 8px 32px rgba(245,200,66,0.4);
          transition: all 0.25s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          animation: pulseGlow 3s ease infinite;
        }
        .btn-hero-primary:hover { transform: translateY(-3px) scale(1.02); }
        .btn-hero-outline {
          padding: 15px 32px; border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 600; cursor: pointer;
          background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);
          transition: all 0.25s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-hero-outline:hover { border-color: rgba(255,255,255,0.5); transform: translateY(-3px); }

        .hero-stats { display: flex; gap: 32px; }
        .stat { text-align: left; }
        .stat-num {
          font-size: 28px; font-weight: 800; color: white;
          animation: countUp 1s ease 1s both;
        }
        .stat-num span { color: #f5c842; }
        .stat-label { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        /* 3D CAR SCENE */
        .hero-3d {
          position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
          width: 520px; height: 420px; z-index: 2;
          animation: fadeSlideUp 1s ease 0.4s both;
        }
        .floating-card {
          position: absolute; border-radius: 20px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 20px 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: floatY 4s ease-in-out infinite;
        }
        .card-main {
          width: 340px; top: 40px; left: 50%; transform: translateX(-50%);
          animation-delay: 0s;
          background: linear-gradient(135deg, rgba(107,47,181,0.3), rgba(74,26,138,0.4));
          border: 1px solid rgba(139,63,212,0.3);
        }
        .card-small-1 {
          width: 160px; bottom: 60px; left: 0;
          animation-delay: -1.5s; animation-duration: 3.5s;
        }
        .card-small-2 {
          width: 150px; top: 80px; right: 0;
          animation-delay: -0.8s; animation-duration: 4.5s;
        }
        .car-3d-wrap { text-align: center; margin-bottom: 16px; filter: drop-shadow(0 20px 40px rgba(107,47,181,0.6)); }
        .card-title-3d { font-size: 15px; font-weight: 700; color: white; margin-bottom: 4px; }
        .card-sub-3d { font-size: 12px; color: rgba(255,255,255,0.5); }
        .card-route { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
        .route-dot { width: 8px; height: 8px; border-radius: 50%; }
        .route-line { flex: 1; height: 2px; border-radius: 2px; background: linear-gradient(90deg, #6b2fb5, #f5c842); }
        .route-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7); }
        .card-price { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
        .price-val { font-size: 22px; font-weight: 800; color: #f5c842; }
        .price-badge { padding: 4px 10px; border-radius: 20px; background: rgba(245,200,66,0.15); color: #f5c842; font-size: 11px; font-weight: 700; }
        .mini-card-content { display: flex; align-items: center; gap: 10px; }
        .mini-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .mini-text { font-size: 13px; font-weight: 700; color: white; }
        .mini-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        /* ROAD SECTION */
        .road-section { position: relative; height: 120px; overflow: hidden; background: linear-gradient(180deg, transparent, #0f0a1e 30%); }
        .road-strip { position: absolute; bottom: 20px; left: 0; right: 0; height: 60px; background: #1a1a2e; border-top: 3px solid rgba(245,200,66,0.3); border-bottom: 3px solid rgba(245,200,66,0.3); }
        .road-dashes { position: absolute; top: 50%; left: 0; right: 0; height: 4px; transform: translateY(-50%); background: repeating-linear-gradient(90deg, #f5c842 0px, #f5c842 40px, transparent 40px, transparent 80px); animation: roadScroll 0.8s linear infinite; }
        .road-car { position: absolute; bottom: 32px; left: 0; animation: carDrive 5s linear infinite; filter: drop-shadow(0 4px 16px rgba(107,47,181,0.6)); }

        /* FEATURES */
        .features { padding: 80px 48px; background: linear-gradient(180deg, #0f0a1e, #0a0614); position: relative; }
        .section-label { text-align: center; font-size: 13px; font-weight: 700; color: #f5c842; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { text-align: center; font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: white; margin-bottom: 60px; letter-spacing: -1px; line-height: 1.15; }
        .section-title span { background: linear-gradient(135deg, #f5c842, #ff9500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto; }
        .feature-card { padding: 32px 28px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); transition: all 0.3s; position: relative; overflow: hidden; }
        .feature-card:hover { border-color: rgba(107,47,181,0.4); transform: translateY(-6px); }
        .feature-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 20px; background: linear-gradient(135deg, rgba(107,47,181,0.3), rgba(74,26,138,0.3)); border: 1px solid rgba(139,63,212,0.3); }
        .feature-title { font-size: 18px; font-weight: 700; color: white; margin-bottom: 10px; }
        .feature-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.65; }

        /* HOW IT WORKS */
        .how-section { padding: 80px 48px; background: #0a0614; }
        .steps-wrap { display: flex; gap: 0; max-width: 900px; margin: 0 auto; position: relative; }
        .steps-wrap::before { content: ''; position: absolute; top: 28px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, #6b2fb5, #f5c842, #6b2fb5); z-index: 0; }
        .step { flex: 1; text-align: center; position: relative; z-index: 1; padding: 0 16px; }
        .step-num { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #6b2fb5, #4a1a8a); border: 3px solid #f5c842; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #f5c842; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(107,47,181,0.5); }
        .step-title { font-size: 16px; font-weight: 700; color: white; margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; }

        /* CTA */
        .cta-section { padding: 80px 48px; text-align: center; background: linear-gradient(180deg, #0a0614, #0f0a1e); position: relative; overflow: hidden; }
        .cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(107,47,181,0.3), transparent 70%); pointer-events: none; }
        .cta-title { font-size: clamp(32px, 5vw, 56px); font-weight: 800; color: white; margin-bottom: 16px; letter-spacing: -1.5px; position: relative; }
        .cta-sub { font-size: 17px; color: rgba(255,255,255,0.5); margin-bottom: 36px; position: relative; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; position: relative; }

        /* FOOTER */
        .footer { padding: 32px 48px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; background: #0a0614; }
        .footer-logo { font-size: 16px; font-weight: 800; color: white; }
        .footer-logo span { color: #f5c842; }
        .footer-text { font-size: 13px; color: rgba(255,255,255,0.3); }

        @media (max-width: 900px) {
          .hero-3d { display: none; }
          .features-grid { grid-template-columns: 1fr; max-width: 400px; }
          .steps-wrap { flex-direction: column; gap: 32px; }
          .steps-wrap::before { display: none; }
          .navbar { padding: 16px 20px; }
          .nav-links { display: none; }
          .hero { padding: 100px 20px 60px; }
          .features, .how-section, .cta-section { padding: 60px 20px; }
          .footer { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>

      <div className="home-wrapper">

        <nav className="navbar">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">🚗</div>
            Local<span>Ride</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
          </div>
          <div className="nav-btns">
            {user ? (
              <>
                <span className="nav-user-name">👋 {user.name}</span>
                {user.role === 'driver' && (
                  <a href="/driver/active" className="btn-outline">📋 My Dashboard</a>
                )}
                {user.role === 'passenger' && (
                  <a href="/rides" className="btn-outline">Rides Dekho</a>
                )}
                {user.role === 'admin' && (
                  <a href="/admin" className="btn-outline">Admin Panel</a>
                )}
                <button onClick={logout} className="btn-logout">Logout</button>
              </>
            ) : (
              <>
                <a href="/login" className="btn-outline">Login</a>
                <a href="/register" className="btn-primary">Register Karo 🚀</a>
              </>
            )}
          </div>
        </nav>

        <section className="hero" ref={heroRef}>
          <div className="hero-bg">
            <div className="grid-lines"/>
            {STARS.map((s) => (
              <div key={s.id} className="star" style={{
                width: s.w, height: s.w,
                top: s.top, left: s.left,
                animationDelay: s.delay,
                animationDuration: s.dur,
              }}/>
            ))}
          </div>

          <div className="hero-content">
            <div className="hero-badge">
              <div className="hero-badge-dot"/>
              🇵🇰 Pakistan ka #1 Ride Platform
            </div>
            <h1 className="hero-title">
              Apni Ride<br/>
              <span className="highlight">Khud Manage</span><br/>
              Karo
            </h1>
            <p className="hero-sub">
              LocalRide pe passenger ban ke sasti ride book karo,
              ya driver ban ke apni gadi se kamaai karo. Fast, safe, aur local.
            </p>
            <div className="hero-btns">
              {user ? (
                <>
                  {user.role === 'driver' && (
                    <>
                      <a href="/driver/post" className="btn-hero-primary">🚗 Ride Post Karo</a>
                      <a href="/driver/active" className="btn-hero-outline">📋 Active Rides</a>
                    </>
                  )}
                  {user.role === 'passenger' && (
                    <a href="/rides" className="btn-hero-primary">🔍 Ride Dhundo</a>
                  )}
                  {user.role === 'admin' && (
                    <a href="/admin" className="btn-hero-primary">⚙️ Admin Panel</a>
                  )}
                </>
              ) : (
                <>
                  <a href="/register" className="btn-hero-primary">🚀 Abhi Start Karo</a>
                  <a href="/login" className="btn-hero-outline">🔑 Login Karo</a>
                </>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-num">500<span>+</span></div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-num">1K<span>+</span></div>
                <div className="stat-label">Rides Completed</div>
              </div>
              <div className="stat">
                <div className="stat-num">4.9<span>★</span></div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-3d">
            <div className="floating-card card-main">
              <div className="car-3d-wrap">
                <svg width="180" height="80" viewBox="0 0 200 90" fill="none">
                  <rect x="10" y="45" width="175" height="32" rx="8" fill="#6b2fb5"/>
                  <path d="M55 45 C60 20, 75 15, 90 14 L140 14 C155 14, 165 20, 170 45Z" fill="#8b3fd4"/>
                  <path d="M95 18 C100 16, 130 16, 138 18 L165 42 L95 42Z" fill="rgba(245,200,66,0.3)"/>
                  <path d="M62 18 C70 16, 88 16, 93 18 L93 42 L60 42Z" fill="rgba(245,200,66,0.2)"/>
                  <rect x="172" y="50" width="12" height="8" rx="3" fill="#f5c842"/>
                  <rect x="10" y="52" width="8" height="6" rx="2" fill="#ff4466"/>
                  <circle cx="50" cy="77" r="11" fill="#1a1a28"/><circle cx="50" cy="77" r="5" fill="#f5c842"/>
                  <circle cx="148" cy="77" r="11" fill="#1a1a28"/><circle cx="148" cy="77" r="5" fill="#f5c842"/>
                </svg>
              </div>
              <div className="card-title-3d">Ride Book Ho Gayi! ✅</div>
              <div className="card-route">
                <div className="route-dot" style={{background:'#f5c842'}}/>
                <div className="route-line"/>
                <div className="route-dot" style={{background:'#8b3fd4'}}/>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:'6px'}}>
                <span className="route-label">Tando M. Khan</span>
                <span className="route-label">Hyderabad</span>
              </div>
              <div className="card-price">
                <div><div className="price-val">Rs. 450</div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Estimated fare</div></div>
                <div className="price-badge">CONFIRMED</div>
              </div>
            </div>
            <div className="floating-card card-small-1">
              <div className="mini-card-content">
                <div className="mini-icon" style={{background:'rgba(245,200,66,0.15)'}}>🧳</div>
                <div>
                  <div className="mini-text">Passenger</div>
                  <div className="mini-sub">Ride book karo</div>
                </div>
              </div>
            </div>
            <div className="floating-card card-small-2">
              <div className="mini-card-content">
                <div className="mini-icon" style={{background:'rgba(107,47,181,0.3)'}}>🚗</div>
                <div>
                  <div className="mini-text">Driver</div>
                  <div className="mini-sub">Kamaai karo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="road-section">
          <div className="road-strip">
            <div className="road-dashes"/>
          </div>
          <div className="road-car">
            <svg width="100" height="44" viewBox="0 0 200 90" fill="none">
              <rect x="10" y="45" width="175" height="32" rx="8" fill="#6b2fb5"/>
              <path d="M55 45 C60 20, 75 15, 90 14 L140 14 C155 14, 165 20, 170 45Z" fill="#8b3fd4"/>
              <rect x="172" y="50" width="12" height="8" rx="3" fill="#f5c842"/>
              <circle cx="50" cy="77" r="11" fill="#1a1a28"/><circle cx="50" cy="77" r="5" fill="#f5c842"/>
              <circle cx="148" cy="77" r="11" fill="#1a1a28"/><circle cx="148" cy="77" r="5" fill="#f5c842"/>
            </svg>
          </div>
        </div>

        <section className="features" id="features">
          <div className="section-label">WHY LOCALRIDE</div>
          <h2 className="section-title">Kyu Choose Karo <span>LocalRide</span>?</h2>
          <div className="features-grid">
            {[
              { icon: "⚡", title: "Fast Booking", desc: "Sirf 30 second mein ride book ho jaye. Koi jhanjhat nahi, seedha driver se connect." },
              { icon: "💰", title: "Sasti Ride", desc: "Market se 40% sasti rides. Driver direct kamaata hai, beech mein koi nahi." },
              { icon: "🛡️", title: "Safe & Secure", desc: "Verified drivers, CNIC check, aur real-time tracking. Aapki safety humari zimmedari." },
              { icon: "🗺️", title: "Local Routes", desc: "Apne sheher ke local routes par best drivers. TMK, Hyderabad, aur zyada jald." },
              { icon: "📱", title: "Easy App", desc: "Simple Urdu/English interface. Koi bhi use kar sakta hai asaani se." },
              { icon: "💳", title: "Wallet System", desc: "Driver ka wallet app mein. Earnings track karo, history dekho, manage karo." },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="section-label">SIMPLE PROCESS</div>
          <h2 className="section-title">Kaise Kaam Karta Hai?</h2>
          <div className="steps-wrap">
            {[
              { n: "1", title: "Register Karo", desc: "Apna naam, phone, CNIC dalo aur passenger ya driver select karo." },
              { n: "2", title: "Ride Book/Post Karo", desc: "Passenger ride book kare, driver apni ride post kare route ke saath." },
              { n: "3", title: "Connect Ho Jao", desc: "System automatically match karega — driver aur passenger connect." },
              { n: "4", title: "Safar Karo! 🎉", desc: "Ride complete karo aur rating do. Driver wallet mein payment aa jaye." },
            ].map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-glow"/>
          <h2 className="cta-title">Abhi Start Karo! 🚀</h2>
          <p className="cta-sub">Free register karo — sirf 30 second lagenge</p>
          <div className="cta-btns">
            <a href="/register?role=passenger" className="btn-hero-primary">🧳 Passenger Bano</a>
            <a href="/register?role=driver" className="btn-hero-outline">🚗 Driver Bano</a>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-logo">Local<span>Ride</span> 🚗</div>
          <div className="footer-text">© 2026 LocalRide — Mehran UET PITP Project</div>
          <div className="footer-text">By Sarfaraz Ali</div>
        </footer>

      </div>
    </>
  );
}