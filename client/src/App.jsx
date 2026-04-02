import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// רשימת השחקנים הקבועה שלנו (במקום API)
const playersData = [
  { id: 1, name: "קורטואה", pos: "GK", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:356a655f-8468-4528-a461-1c322797e885/600x600-COURTOIS_550.png?preferwebp=true" },
  { id: 2, name: "מיליטאו", pos: "DF", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:d593006a-364e-4f51-827b-04473b98754b/600x600-MILITAO_550.png?preferwebp=true" },
  { id: 3, name: "רודיגר", pos: "DF", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:2b399203-d648-4309-8086-11f8102d8474/600x600-RUDIGER_550.png?preferwebp=true" },
  { id: 4, name: "בלינגהאם", pos: "MF", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:0b721867-27b3-4581-8178-013697e01297/600x600-BELLINGHAM_550.png?preferwebp=true" },
  { id: 5, name: "ואלוורדה", pos: "MF", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:54a233b8-61f2-45e0-94e8-8a892b9560f2/600x600-VALVERDE_550.png?preferwebp=true" },
  { id: 6, name: "ויניסיוס", pos: "FW", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:09819779-798b-4971-9f93-51829e1f574d/600x600-VINICIUS_550.png?preferwebp=true" },
  { id: 7, name: "אמבפה", pos: "FW", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:f278c2e6-a05d-4f10-9f17-f5e933e144a1/600x600-MBAPPE_550.png?preferwebp=true" },
  { id: 8, name: "רודריגו", pos: "FW", img: "https://publish-p47754-e237306.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid:f4c49896-1934-45e8-b807-67c858564f20/600x600-RODRYGO_550.png?preferwebp=true" },
];

const SquadBuilder = () => {
  const [lineup, setLineup] = useState({ GK: null, DF1: null, DF2: null, MF1: null, MF2: null, FW1: null });

  const addToLineup = (player, position) => {
    setLineup(prev => ({ ...prev, [position]: player }));
  };

  return (
    <div className="squad-page">
      <h2>ההרכב המנצח שלי ⚽️</h2>
      <div className="builder-container">
        {/* המגרש */}
        <div className="pitch">
          <div className="position gk" onClick={() => alert("בחר שוער מהרשימה")}>
            {lineup.GK ? <img src={lineup.GK.img} alt={lineup.GK.name} title={lineup.GK.name} /> : "שוער"}
          </div>
          <div className="midfield-row">
            <div className="position mf">{lineup.MF1 ? <img src={lineup.MF1.img} /> : "קשר"}</div>
            <div className="position mf">{lineup.MF2 ? <img src={lineup.MF2.img} /> : "קשר"}</div>
          </div>
          <div className="attack-row">
            <div className="position fw">{lineup.FW1 ? <img src={lineup.FW1.img} /> : "חלוץ"}</div>
          </div>
        </div>

        {/* רשימת השחקנים לבחירה */}
        <div className="player-list">
          <h3>בחר שחקן:</h3>
          <div className="players-grid">
            {playersData.map(player => (
              <div key={player.id} className="player-card" onClick={() => {
                if (player.pos === "GK") addToLineup(player, "GK");
                else if (player.pos === "MF") addToLineup(player, "MF1");
                else if (player.pos === "FW") addToLineup(player, "FW1");
              }}>
                <img src={player.img} alt={player.name} />
                <p>{player.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="share-btn" onClick={() => alert("ההרכב נשמר! בקרוב: שיתוף לטלגרם")}>שתף הרכב בטלגרם 🚀</button>
    </div>
  );
};

// עמודים זמניים (נבנה אותם בשלבים הבאים)
const Home = () => (
  <div className="page">
    <h2>הבית של המדרידיסטאס 👑</h2>
    <p>כל הכלים האינטראקטיביים לאוהדי ריאל במקום אחד.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container" dir="rtl">
        <nav className="navbar">
          <h1 className="logo">MadridFans</h1>
          <div className="nav-links">
            <Link to="/">ראשי</Link>
            <Link to="/squad">ההרכב שלי</Link>
            <Link to="/ratings">ציונים</Link>
            <Link to="/predictions">תחזיות</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/squad" element={<SquadBuilder />} />
            <Route path="/ratings" element={<div>עמוד ציונים - בקרוב</div>} />
            <Route path="/predictions" element={<div>עמוד תחזיות - בקרוב</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
