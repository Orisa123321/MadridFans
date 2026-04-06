import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

// --- Translations Object ---
const translations = {
  he: {
    home: "ראשי",
    news: "כתבות",
    squad: "ההרכב שלי",
    predictions: "תחזיות",
    welcome: "ברוכים הבאים ל-MadridFans 👑",
    subWelcome: "הבית של אוהדי ריאל מדריד בישראל.",
    postArticle: "פרסם כתבה",
    yourName: "השם שלך",
    articleTitle: "כותרת הכתבה",
    writeHere: "כתוב כאן...",
    saveLineup: "שמור הרכב למסד הנתונים",
    submitPred: "שלח תחזית",
    langBtn: "English"
  },
  en: {
    home: "Home",
    news: "News",
    squad: "Squad",
    predictions: "Predictions",
    welcome: "Welcome to MadridFans 👑",
    subWelcome: "The ultimate hub for Real Madrid fans.",
    postArticle: "Post Article",
    yourName: "Your Name",
    articleTitle: "Article Title",
    writeHere: "Write your article here...",
    saveLineup: "Save Lineup to Database",
    submitPred: "Submit Prediction",
    langBtn: "עברית"
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

function App() {
  const [lang, setLang] = useState('he'); // Default is Hebrew
  const t = translations[lang];

  return (
    <Router>
      {/* Dynamic direction based on language */}
      <div className="app-container" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <nav className="navbar">
          <h1 className="logo">MadridFans</h1>
          <div className="nav-links">
            <Link to="/">{t.home}</Link>
            <Link to="/news">{t.news}</Link>
            <Link to="/squad">{t.squad}</Link>
            <Link to="/predictions">{t.predictions}</Link>
            <button className="lang-toggle" onClick={() => setLang(lang === 'he' ? 'en' : 'he')}>
              {t.langBtn}
            </button>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<div className="page"><h2>{t.welcome}</h2><p>{t.subWelcome}</p></div>} />
            <Route path="/news" element={<CommunityNews t={t} />} />
            <Route path="/squad" element={<SquadBuilder t={t} />} />
            <Route path="/predictions" element={<Predictions t={t} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// --- Modified Components to use 't' prop ---

const CommunityNews = ({ t }) => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', author: '', content: '' });

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('articles').insert([newArticle]);
    if (!error) { setNewArticle({ title: '', author: '', content: '' }); fetchArticles(); }
  };

  return (
    <div className="page">
      <h2>{t.news}</h2>
      <form className="news-form" onSubmit={handleSubmit}>
        <input type="text" placeholder={t.articleTitle} value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} />
        <input type="text" placeholder={t.yourName} value={newArticle.author} onChange={(e) => setNewArticle({...newArticle, author: e.target.value})} />
        <textarea placeholder={t.writeHere} value={newArticle.content} onChange={(e) => setNewArticle({...newArticle, content: e.target.value})} />
        <button type="submit" className="action-btn">{t.postArticle}</button>
      </form>
      <div className="articles-feed">
        {articles.map(a => (
          <div key={a.id} className="article-card">
            <h3>{a.title}</h3>
            <small>{a.author}</small>
            <p>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SquadBuilder = ({ t }) => {
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
    await supabase.from('lineups').insert([{ formation_data: lineup }]);
    alert("Saved!");
  };

  return (
    <div className="page">
      <h2>{t.squad}</h2>
      <div className="builder-container">
        <div className="pitch full-pitch">
          <div className="attack-row">
            <div className="position">{lineup.FW1 ? <img src={lineup.FW1.img} /> : "LW"}</div>
            <div className="position">{lineup.FW2 ? <img src={lineup.FW2.img} /> : "ST"}</div>
            <div className="position">{lineup.FW3 ? <img src={lineup.FW3.img} /> : "RW"}</div>
          </div>
          <div className="midfield-row">
            <div className="position">{lineup.MF1 ? <img src={lineup.MF1.img} /> : "CM"}</div>
            <div className="position">{lineup.MF2 ? <img src={lineup.MF2.img} /> : "CDM"}</div>
            <div className="position">{lineup.MF3 ? <img src={lineup.MF3.img} /> : "CM"}</div>
          </div>
          <div className="defense-row">
            <div className="position">{lineup.DF1 ? <img src={lineup.DF1.img} /> : "LB"}</div>
            <div className="position">{lineup.DF2 ? <img src={lineup.DF2.img} /> : "CB"}</div>
            <div className="position">{lineup.DF3 ? <img src={lineup.DF3.img} /> : "CB"}</div>
            <div className="position">{lineup.DF4 ? <img src={lineup.DF4.img} /> : "RB"}</div>
          </div>
          <div className="goalie-row">
            <div className="position">{lineup.GK ? <img src={lineup.GK.img} /> : "GK"}</div>
          </div>
        </div>
        <div className="player-list extended-list">
          <div className="players-grid">
            {playersData.map(p => (
              <div key={p.id} className="player-card" onClick={() => addToLineup(p)}>
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="action-btn" onClick={saveLineup}>{t.saveLineup}</button>
    </div>
  );
};

const Predictions = ({ t }) => {
  const [prediction, setPrediction] = useState({ username: '', home: '', away: '', scorer: '' });
  const handleSubmit = async () => {
    await supabase.from('predictions').insert([{ username: prediction.username, home_score: prediction.home, away_score: prediction.away, scorer: prediction.scorer }]);
    alert("Saved!");
  };
  return (
    <div className="page">
      <h2>{t.predictions}</h2>
      <div className="news-form">
        <input type="text" placeholder={t.yourName} onChange={(e) => setPrediction({...prediction, username: e.target.value})} />
        <button className="action-btn" onClick={handleSubmit}>{t.submitPred}</button>
      </div>
    </div>
  );
};

export default App;
