import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

// --- Translations Object ---
const translations = {
  he: {
    home: "ראשי",
    news: "כתבות",
    squad: "ההרכב שלי",
    predictions: "תחזיות",
    welcome: "Welcome to Real Madrid Galacticos ",
    subWelcome: "הבית של אוהדי ריאל מדריד בישראל.",
    postArticle: "פרסם כתבה",
    yourName: "השם שלך",
    articleTitle: "כותרת הכתבה",
    writeHere: "כתוב כאן...",
    saveLineup: "שמור הרכב למסד הנתונים",
    submitPred: "שלח תחזית",
    langBtn: "English",
    like: "אהבתי",
    comments: "תגובות",
    writeComment: "כתוב תגובה...",
    send: "שלח",
    googleLogin: "התחברות מהירה עם גוגל",
    share: "שתף בטלגרם"
  },
  en: {
    home: "Home",
    news: "News",
    squad: "Squad",
    predictions: "Predictions",
    welcome: "Welcome to Real Madrid Galacticos ",
    subWelcome: "The ultimate hub for Real Madrid fans.",
    postArticle: "Post Article",
    yourName: "Your Name",
    articleTitle: "Article Title",
    writeHere: "Write your article here...",
    saveLineup: "Save Lineup to Database",
    submitPred: "Submit Prediction",
    langBtn: "עברית",
    like: "Like",
    comments: "Comments",
    writeComment: "Write a comment...",
    send: "Send",
    googleLogin: "Login with Google",
    share: "Share on Telegram"
  }
};
const playersData = [
  { id: 1, name: "Courtois", pos: "GK", number: 1, img: "https://ui-avatars.com/api/?name=Thibaut+Courtois&background=f8fafc&color=0f172a&bold=true" },
  { id: 13, name: "Lunin", pos: "GK", number: 13, img: "https://ui-avatars.com/api/?name=Andriy+Lunin&background=f8fafc&color=0f172a&bold=true" },
  { id: 2, name: "Carvajal", pos: "DF", number: 2, img: "https://ui-avatars.com/api/?name=Dani+Carvajal&background=f8fafc&color=0f172a&bold=true" },
  { id: 3, name: "Militao", pos: "DF", number: 3, img: "https://ui-avatars.com/api/?name=Eder+Militao&background=f8fafc&color=0f172a&bold=true" },
  { id: 4, name: "Alaba", pos: "DF", number: 4, img: "https://ui-avatars.com/api/?name=David+Alaba&background=f8fafc&color=0f172a&bold=true" },
  { id: 22, name: "Rudiger", pos: "DF", number: 22, img: "https://ui-avatars.com/api/?name=Antonio+Rudiger&background=f8fafc&color=0f172a&bold=true" },
  { id: 23, name: "Mendy", pos: "DF", number: 23, img: "https://ui-avatars.com/api/?name=Ferland+Mendy&background=f8fafc&color=0f172a&bold=true" },
  { id: 8, name: "Valverde", pos: "MF", number: 8, img: "https://ui-avatars.com/api/?name=Fede+Valverde&background=f8fafc&color=0f172a&bold=true" },
  { id: 14, name: "Tchouameni", pos: "MF", number: 14, img: "https://ui-avatars.com/api/?name=A+Tchouameni&background=f8fafc&color=0f172a&bold=true" },
  { id: 12, name: "Camavinga", pos: "MF", number: 12, img: "https://ui-avatars.com/api/?name=E+Camavinga&background=f8fafc&color=0f172a&bold=true" },
  { id: 5, name: "Bellingham", pos: "MF", number: 5, img: "https://ui-avatars.com/api/?name=Jude+Bellingham&background=f8fafc&color=0f172a&bold=true" },
  { id: 10, name: "Modric", pos: "MF", number: 10, img: "https://ui-avatars.com/api/?name=Luka+Modric&background=f8fafc&color=0f172a&bold=true" },
  { id: 7, name: "Vinicius", pos: "FW", number: 7, img: "https://ui-avatars.com/api/?name=Vinicius+Jr&background=f8fafc&color=0f172a&bold=true" },
  { id: 9, name: "Mbappe", pos: "FW", number: 9, img: "https://ui-avatars.com/api/?name=Kylian+Mbappe&background=f8fafc&color=0f172a&bold=true" },
  { id: 11, name: "Rodrygo", pos: "FW", number: 11, img: "https://ui-avatars.com/api/?name=Rodrygo+Goes&background=f8fafc&color=0f172a&bold=true" },
  { id: 21, name: "Brahim", pos: "FW", number: 21, img: "https://ui-avatars.com/api/?name=Brahim+Diaz&background=f8fafc&color=0f172a&bold=true" },
  { id: 16, name: "Endrick", pos: "FW", number: 16, img: "https://ui-avatars.com/api/?name=Endrick&background=f8fafc&color=0f172a&bold=true" }
];

// --- Authentication Component ---
const AuthScreen = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // נווט אוטומטי

  const handleAuth = async (e) => {
    e.preventDefault();
    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
      
    if (error) alert(error.message);
    else navigate('/'); // חזור לדף הבית אחרי התחברות
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://realmadridgalacticos.vercel.app/' }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="page auth-page">
      <h2>{isLogin ? t.login : t.signup} 🛡️</h2>
      
      <button type="button" className="action-btn google-btn" onClick={handleGoogleLogin}>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
        {t.googleLogin || "התחבר עם Google"}
      </button>

      <div className="divider"><span>או עם אימייל</span></div>

      <form className="news-form auth-form" onSubmit={handleAuth}>
        <input type="email" placeholder={t.email || "אימייל"} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder={t.password || "סיסמה"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
        <button type="submit" className="action-btn submit-auth-btn">{isLogin ? (t.login || "התחבר") : (t.signup || "הירשם")}</button>
      </form>
      <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? (t.noAccount || "אין חשבון? הירשם") : (t.hasAccount || "יש חשבון? התחבר")}
      </p>
    </div>
  );
};

// --- Main App ---
function App() {
  const [lang, setLang] = useState('he');
  const [session, setSession] = useState(null);
  const t = translations[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <div className="app-container" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <nav className="navbar">
          <h1 className="logo">Real Madrid Galacticos</h1>
          <div className="nav-links">
            <button className="lang-toggle" onClick={() => setLang(lang === 'he' ? 'en' : 'he')}>{t.langBtn}</button>
            <Link to="/">{t.home}</Link>
            <Link to="/news">{t.news}</Link>
            <Link to="/squad">{t.squad}</Link>
            <Link to="/predictions">{t.predictions}</Link>
            
            {/* אם מחובר - התנתק. אם אורח - כפתור התחברות */}
            {session ? (
              <button className="logout-btn" onClick={handleLogout}>{t.logout}</button>
            ) : (
              <Link to="/login" className="login-btn-nav">{t.login}</Link>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<div className="page"><h2>{t.welcome}</h2><p>{t.subWelcome}</p></div>} />
            <Route path="/news" element={<CommunityNews t={t} user={session?.user} />} />
            <Route path="/squad" element={<SquadBuilder t={t} />} />
            <Route path="/predictions" element={<Predictions t={t} user={session?.user} />} />
            {/* עמוד התחברות ייעודי */}
            <Route path="/login" element={<AuthScreen t={t} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const CommunityNews = ({ t, user }) => {
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', content: '' });
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({}); 

// --- NEW: Extracting Google Data Safely ---
  const metadata = user?.user_metadata || {};
  
  // Safe extraction: Only try to split email if user and user.email exist
  const pseudoName = user?.email ? user.email.split('@')[0] : 'Fan';
  
  const userName = metadata.full_name || pseudoName;
  const userAvatar = metadata.avatar_url || `https://ui-avatars.com/api/?name=${userName}&background=38bdf8&color=0f172a&bold=true`;

  const [likedArticles, setLikedArticles] = useState(() => {
    const saved = localStorage.getItem('madridFansLikes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { fetchArticles(); fetchComments(); }, []);

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('articles').insert([{ 
      title: newArticle.title, 
      content: newArticle.content, 
      author: userName, // השם האמיתי מגוגל
      avatar_url: userAvatar // התמונה מגוגל
    }]);
    if (!error) { setNewArticle({ title: '', content: '' }); fetchArticles(); }
  };

  const handleLike = async (id, currentLikes) => {
    if (likedArticles.includes(id)) return;
    const { error } = await supabase.from('articles').update({ likes: currentLikes + 1 }).eq('id', id);
    if (!error) {
      const updatedLikes = [...likedArticles, id];
      setLikedArticles(updatedLikes);
      localStorage.setItem('madridFansLikes', JSON.stringify(updatedLikes));
      fetchArticles();
    }
  };

  const handleCommentSubmit = async (articleId) => {
    const input = commentInputs[articleId];
    if (!input || !input.content) return;
    
    const { error } = await supabase.from('comments').insert([{ 
      article_id: articleId, 
      author: userName, // השם האמיתי מגוגל
      content: input.content,
      avatar_url: userAvatar // התמונה מגוגל
    }]);

    if (!error) {
      setCommentInputs({ ...commentInputs, [articleId]: { content: '' } });
      fetchComments();
    }
  };

  const shareToTelegram = (title) => {
    const url = encodeURIComponent("https://realmadridgalacticos.vercel.app/news");
    const text = encodeURIComponent(`קראתי עכשיו את הכתבה "${title}" באפליקציית ריאל מדריד גלאקטיקוס! כנסו לקרוא 👑⚽`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <div className="page">
      <h2>{t.news} 📰</h2>
      
      {/* חסימה חכמה: רק מי שמחובר יכול לראות את טופס הכתיבה */}
      {user ? (
        <>
          <div className="compose-header">
             <img src={userAvatar} alt="My Avatar" className="mini-avatar" />
             <span>פרסם כ-<strong>{userName}</strong></span>
          </div>
          <form className="news-form" onSubmit={handleSubmit}>
            <input type="text" placeholder={t.articleTitle} value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} required />
            <textarea placeholder={t.writeHere} value={newArticle.content} onChange={(e) => setNewArticle({...newArticle, content: e.target.value})} required rows="4" />
            <button type="submit" className="action-btn">{t.postArticle}</button>
          </form>
        </>
      ) : (
        <div className="login-prompt">
          <p>רוצה לפרסם כתבה משלך?</p>
          <Link to="/login" className="action-btn">התחבר כדי לכתוב</Link>
        </div>
      )}
      
      <div className="articles-feed">
        {articles.map(a => {
          const articleComments = comments.filter(c => c.article_id === a.id);
          const hasLiked = likedArticles.includes(a.id);
          // תמונת ברירת מחדל לכתבות ישנות שאין להן תמונה
          const displayAvatar = a.avatar_url || `https://ui-avatars.com/api/?name=${a.author}&background=f8fafc&color=0f172a`;

          return (
            <div key={a.id} className="article-card">
              <h3>{a.title}</h3>
              
              {/* NEW: Author info with picture */}
              <div className="author-info">
                <img src={displayAvatar} alt="Author" className="author-avatar" />
                <small>{a.author} • {new Date(a.created_at).toLocaleDateString()}</small>
              </div>

              <p>{a.content}</p>
              
              <div className="article-actions">
                <button className="action-icon-btn like-btn" onClick={() => handleLike(a.id, a.likes || 0)} style={{ opacity: hasLiked ? 0.5 : 1, cursor: hasLiked ? 'not-allowed' : 'pointer' }}>
                  {hasLiked ? '🤍' : '❤️'} {a.likes || 0} {t.like}
                </button>
                <button className="action-icon-btn comment-btn" onClick={() => setShowComments({...showComments, [a.id]: !showComments[a.id]})}>
                  💬 {articleComments.length} {t.comments}
                </button>
                <button className="action-icon-btn tg-btn" onClick={() => shareToTelegram(a.title)}>
                  ✈️ {t.share}
                </button>
              </div>

              {showComments[a.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {articleComments.map(c => (
                      <div key={c.id} className="comment-bubble">
                        <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${c.author}&background=f8fafc&color=0f172a`} alt="Commenter" className="comment-avatar" />
                        <div className="comment-content">
                           <strong>{c.author}</strong> 
                           <span>{c.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="add-comment-box">
                    <img src={userAvatar} alt="Me" className="mini-avatar" />
                    <input type="text" placeholder={t.writeComment} value={commentInputs[a.id]?.content || ''} onChange={(e) => setCommentInputs({...commentInputs, [a.id]: {content: e.target.value}})} />
                    <button onClick={() => handleCommentSubmit(a.id)}>{t.send}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Squad Builder Component ---
const SquadBuilder = ({ t, user }) => {
  const [lineup, setLineup] = useState({ GK: null, DF1: null, DF2: null, DF3: null, DF4: null, MF1: null, MF2: null, MF3: null, FW1: null, FW2: null, FW3: null });
  
  const addToLineup = (player) => {
    const isAlreadyInLineup = Object.values(lineup).some(p => p && p.id === player.id);
    if (isAlreadyInLineup) return;
    if (player.pos === "GK") setLineup(prev => ({ ...prev, GK: player }));
    else if (player.pos === "DF") {
      if (!lineup.DF1) setLineup(prev => ({ ...prev, DF1: player }));
      else if (!lineup.DF2) setLineup(prev => ({ ...prev, DF2: player }));
      else if (!lineup.DF3) setLineup(prev => ({ ...prev, DF3: player }));
      else if (!lineup.DF4) setLineup(prev => ({ ...prev, DF4: player }));
    } else if (player.pos === "MF") {
      if (!lineup.MF1) setLineup(prev => ({ ...prev, MF1: player }));
      else if (!lineup.MF2) setLineup(prev => ({ ...prev, MF2: player }));
      else if (!lineup.MF3) setLineup(prev => ({ ...prev, MF3: player }));
    } else if (player.pos === "FW") {
      if (!lineup.FW1) setLineup(prev => ({ ...prev, FW1: player }));
      else if (!lineup.FW2) setLineup(prev => ({ ...prev, FW2: player }));
      else if (!lineup.FW3) setLineup(prev => ({ ...prev, FW3: player }));
    }
  };

  const saveLineup = async () => {
    if (!user) return alert("You must be logged in!");
    await supabase.from('lineups').insert([{ formation_data: lineup }]);
    alert("Saved!");
  };

  return (
    <div className="page">
      <h2>{t.squad} ⚽</h2>
      <div className="builder-container">
        <div className="pitch full-pitch">
          <div className="attack-row">
            <div className="position">{lineup.FW1 ? <img src={lineup.FW1.img} alt="FW" /> : "LW"}</div>
            <div className="position">{lineup.FW2 ? <img src={lineup.FW2.img} alt="FW" /> : "ST"}</div>
            <div className="position">{lineup.FW3 ? <img src={lineup.FW3.img} alt="FW" /> : "RW"}</div>
          </div>
          <div className="midfield-row">
            <div className="position">{lineup.MF1 ? <img src={lineup.MF1.img} alt="MF" /> : "CM"}</div>
            <div className="position">{lineup.MF2 ? <img src={lineup.MF2.img} alt="MF" /> : "CDM"}</div>
            <div className="position">{lineup.MF3 ? <img src={lineup.MF3.img} alt="MF" /> : "CM"}</div>
          </div>
          <div className="defense-row">
            <div className="position">{lineup.DF1 ? <img src={lineup.DF1.img} alt="DF" /> : "LB"}</div>
            <div className="position">{lineup.DF2 ? <img src={lineup.DF2.img} alt="DF" /> : "CB"}</div>
            <div className="position">{lineup.DF3 ? <img src={lineup.DF3.img} alt="DF" /> : "CB"}</div>
            <div className="position">{lineup.DF4 ? <img src={lineup.DF4.img} alt="DF" /> : "RB"}</div>
          </div>
          <div className="goalie-row"><div className="position">{lineup.GK ? <img src={lineup.GK.img} alt="GK" /> : "GK"}</div></div>
        </div>
        <div className="player-list extended-list">
          <div className="players-grid">
            {playersData.map(p => (<div key={p.id} className="player-card" onClick={() => addToLineup(p)}><img src={p.img} alt={p.name} /><p>{p.name}</p></div>))}
          </div>
        </div>
      </div>
      
      {/* Smart Gating */}
      {user ? (
        <button className="action-btn" onClick={saveLineup}>{t.saveLineup}</button>
      ) : (
        <div className="login-prompt">
          <p>רוצה לשמור את ההרכב שלך ולשתף עם כולם?</p>
          <Link to="/login" className="action-btn">התחבר כדי לשמור</Link>
        </div>
      )}
    </div>
  );
};

// --- Predictions Component ---
const Predictions = ({ t, user }) => {
  const [prediction, setPrediction] = useState({ home: '', away: '', scorer: '' });

  // Safe extraction of user data (if logged in)
  const metadata = user?.user_metadata || {};
  const pseudoName = user?.email ? user.email.split('@')[0] : 'Fan';
  const userName = metadata.full_name || pseudoName;

  const handleSubmit = async () => {
    if (!user) return;
    await supabase.from('predictions').insert([{ 
      username: userName, 
      home_score: prediction.home, 
      away_score: prediction.away, 
      scorer: prediction.scorer 
    }]);
    alert("Saved!");
  };

  return (
    <div className="page">
      <h2>{t.predictions} 🔮</h2>
      
      {user ? (
        <div className="news-form prediction-form">
          <div className="compose-header">
             <span>שולח תחזית כ-<strong>{userName}</strong></span>
          </div>
          <div className="prediction-board">
            <div className="team-pred">
               <h3>R. Madrid</h3>
               <input type="number" placeholder="0" onChange={(e) => setPrediction({...prediction, home: e.target.value})} />
            </div>
            <div className="vs-text">VS</div>
            <div className="team-pred">
               <h3>Opponent</h3>
               <input type="number" placeholder="0" onChange={(e) => setPrediction({...prediction, away: e.target.value})} />
            </div>
          </div>
          <button className="action-btn" onClick={handleSubmit}>{t.submitPred}</button>
        </div>
      ) : (
         <div className="login-prompt">
          <p>מי לדעתך ינצח במשחק הבא?</p>
          <Link to="/login" className="action-btn">התחבר כדי לשלוח תחזית</Link>
        </div>
      )}
    </div>
  );
};

export default App;
