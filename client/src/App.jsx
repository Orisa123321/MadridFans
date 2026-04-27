import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient'; // מייבאים מהקובץ שלך!
import './App.css';

// --- Admin Config ---
const ADMIN_EMAIL = "ori.shar10@gmail.com"; 

// --- Translations ---
const translations = {
  he: {
    welcome: "ברוכים הבאים ל-MadridFans",
    subWelcome: "קהילת האוהדים הגדולה של ריאל מדריד בישראל",
    login: "התחברות",
    logout: "התנתקות",
    profile: "פרופיל",
    news: "קהילה וחדשות",
    predictions: "תחזיות",
    leagueTable: "טבלת הליגה",
    latestNews: "חדשות חמות",
    readMore: "קרא עוד",
    rank0: "שחקן אקדמיה 🌱",
    rank1: "שחקן הרכב ⚽",
    rank2: "גלאקטיקו ⭐️",
    rank3: "אגדת מועדון 👑",
    adminPanel: "פאנל ניהול",
    deleteBtn: "מחק",
    team: "קבוצה",
    played: "מש'",
    points: "נק'",
    liveChat: "צ'אט חי: חדר מלחמה 🏟️",
    nextMatch: "המשחק הבא",
    liveNow: "LIVE"
  },
  en: {
    welcome: "Welcome to MadridFans",
    subWelcome: "The ultimate hub for Madridistas",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    news: "Community",
    predictions: "Predictions",
    leagueTable: "League Table",
    latestNews: "Latest News",
    readMore: "Read More",
    rank0: "Academy Player 🌱",
    rank1: "First Team ⚽",
    rank2: "Galáctico ⭐️",
    rank3: "Club Legend 👑",
    adminPanel: "Admin Panel",
    deleteBtn: "Delete",
    team: "Team",
    played: "P",
    points: "Pts",
    liveChat: "Matchday Live Chat 🏟️",
    nextMatch: "Next Match",
    liveNow: "LIVE"
  }
};

// --- Helper: Match Status Bar ---
const MatchStatusBar = ({ t }) => {
  const [match] = useState({ isLive: false, home: "Real Madrid", away: "Man City", date: new Date(Date.now() + 18000000) });
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const dist = match.date - new Date();
      const h = Math.floor((dist % 86400000) / 3600000);
      const m = Math.floor((dist % 3600000) / 60000);
      const s = Math.floor((dist % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [match.date]);

  return (
    <div className="match-status-bar">
      <div className="countdown-status">
        <span>{t.nextMatch}:</span> <b>{match.home} vs {match.away}</b> <span className="timer-box">{timeLeft}</span>
      </div>
    </div>
  );
};

// --- Helper: Rank Badge ---
const UserRankBadge = ({ authorName, articlesData, commentsData, predictionsData, t }) => {
  const artCount = articlesData?.filter(a => a.author === authorName).length || 0;
  const comCount = commentsData?.filter(c => c.author === authorName).length || 0;
  const likes = articlesData?.filter(a => a.author === authorName).reduce((s, a) => s + (a.likes || 0), 0) || 0;
  const predPts = predictionsData?.filter(p => p.username === authorName).reduce((s, p) => s + (p.points_earned || 0), 0) || 0;

  const score = (artCount * 5) + (comCount * 2) + (likes * 10) + predPts;
  let rank = t.rank0, cls = "rank-0";
  if (score >= 150) { rank = t.rank3; cls = "rank-3"; }
  else if (score >= 50) { rank = t.rank2; cls = "rank-2"; }
  else if (score >= 15) { rank = t.rank1; cls = "rank-1"; }

  return <span className={`user-rank-badge ${cls}`} title={`ניקוד מוניטין: ${score}`}>{rank}</span>;
};

// --- Sub-Component: Live Chat ---
const LiveChat = ({ t, user }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    supabase.from('live_chat').select('*').order('created_at', { ascending: false }).limit(10).then(({data}) => setMsgs(data?.reverse() || []));
    const sub = supabase.channel('chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_chat' }, (p) => setMsgs(prev => [...prev, p.new])).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await supabase.from('live_chat').insert([{ content: input, author: user.email.split('@')[0], avatar_url: user.user_metadata.avatar_url, user_email: user.email }]);
    setInput("");
  };

  return (
    <div className="live-chat-container">
      <h3>{t.liveChat}</h3>
      <div className="chat-messages">
        {msgs.map(m => (
          <div key={m.id} className={`chat-bubble ${user?.email === m.user_email ? 'my-msg' : ''}`}>
            <img src={m.avatar_url} className="chat-avatar" alt="av" />
            <div className="msg-content"><strong>{m.author}</strong><span>{m.content}</span></div>
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={send} className="chat-input-area">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="..." />
          <button type="submit">↗️</button>
        </form>
      ) : <p className="login-msg">התחבר כדי לצ'אט</p>}
    </div>
  );
};

// --- Home Components ---
const LaLigaTable = ({ t }) => {
  const data = [
    { pos: 1, name: "Real Madrid", p: 38, pts: 95 },
    { pos: 2, name: "Barcelona", p: 38, pts: 85 },
    { pos: 3, name: "Girona", p: 38, pts: 81 },
    { pos: 4, name: "Atlético Madrid", p: 38, pts: 76 }
  ];
  return (
    <div className="league-table-container">
      <h3 className="section-title">{t.leagueTable} 🏆</h3>
      <table className="league-table">
        <thead><tr><th>#</th><th className="team-col">{t.team}</th><th>{t.played}</th><th>{t.points}</th></tr></thead>
        <tbody>
          {data.map(i => (
            <tr key={i.pos} className={i.name === "Real Madrid" ? "highlight-rm" : ""}>
              <td>{i.pos}</td><td className="team-col">{i.name}</td><td>{i.p}</td><td>{i.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HomeFeed = ({ t }) => {
  const [news, setNews] = useState([]);
  useEffect(() => {
    supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(3).then(({data}) => setNews(data || []));
  }, []);
  return (
    <div className="home-feed-container">
      <h3 className="section-title">{t.latestNews} 🔥</h3>
      <div className="feed-grid">
        {news.map(a => (
          <div key={a.id} className="feed-card">
            <h4>{a.title}</h4>
            <p>{a.content.substring(0, 80)}...</p>
            <Link to="/news" className="read-more-btn">{t.readMore}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Page: Community ---
const CommunityNews = ({ t, user }) => {
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [preds, setPreds] = useState([]);
  const [newArt, setNewArt] = useState({ title: '', content: '' });

  const fetchData = async () => {
    const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    const { data: com } = await supabase.from('comments').select('*').order('created_at', { ascending: true });
    const { data: pr } = await supabase.from('predictions').select('*');
    setArticles(art || []); setComments(com || []); setPreds(pr || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePost = async () => {
    if (!newArt.title || !newArt.content) return;
    await supabase.from('articles').insert([{ title: newArt.title, content: newArt.content, author: user.email, avatar_url: user.user_metadata.avatar_url }]);
    setNewArt({ title: '', content: '' }); fetchData();
  };

  return (
    <div className="page">
      {user && (
        <div className="news-form">
          <input placeholder="כותרת הכתבה" value={newArt.title} onChange={e => setNewArt({...newArt, title: e.target.value})} />
          <textarea placeholder="מה אתם חושבים?" value={newArt.content} onChange={e => setNewArt({...newArt, content: e.target.value})} />
          <button className="action-btn" onClick={handlePost}>פרסם</button>
        </div>
      )}
      <div className="articles-feed">
        {articles.map(a => (
          <div key={a.id} className="article-card">
            <div className="author-info">
              <img src={a.avatar_url} className="author-avatar" alt="av" />
              <div className="author-details">
                <strong>{a.author}</strong>
                <UserRankBadge authorName={a.author} articlesData={articles} commentsData={comments} predictionsData={preds} t={t} />
              </div>
            </div>
            <h3>{a.title}</h3>
            <p>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [lang, setLang] = useState('he');
  const [session, setSession] = useState(null);
  const t = translations[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_e, s) => setSession(s));
  }, []);

  return (
    <div className="app-container" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <nav className="navbar">
        <MatchStatusBar t={t} />
        <h1 className="logo">Madrid<span>Fans</span></h1>
        <div className="nav-links">
          <Link to="/">ראשי</Link>
          <Link to="/news">{t.news}</Link>
          {session ? (
            <>
              {session.user.email === ADMIN_EMAIL && <Link to="/admin" className="admin-link">ניהול</Link>}
              <button className="logout-btn" onClick={() => supabase.auth.signOut()}>{t.logout}</button>
            </>
          ) : (
            <button className="login-btn-nav" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>{t.login}</button>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <div className="hero-section"><h2>{t.welcome}</h2><p>{t.subWelcome}</p></div>
              <div className="home-content-grid">
                <HomeFeed t={t} />
                <div className="side-column">
                  <LaLigaTable t={t} />
                  <LiveChat t={t} user={session?.user} />
                </div>
              </div>
            </>
          } />
          <Route path="/news" element={<CommunityNews t={t} user={session?.user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
