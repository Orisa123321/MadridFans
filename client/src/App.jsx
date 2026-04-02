import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// פה אנחנו מכינים את "העמודים" שלנו (כרגע הם ריקים, נמלא אותם בהמשך)
const Home = () => (
  <div className="page">
    <h2>ברוכים הבאים ל-MadridFans! 👑</h2>
    <p>הבית של אוהדי ריאל מדריד בישראל. בחרו בתפריט למעלה לאן תרצו להמשיך.</p>
  </div>
);
const SquadBuilder = () => <div className="page"><h2>ההרכב שלי ⚽️</h2><p>כאן נבנה את מגרש הגרירה...</p></div>;
const PlayerRatings = () => <div className="page"><h2>ציוני אוהדים ⭐️</h2><p>כאן נבנה את מערכת ההצבעות...</p></div>;
const Predictions = () => <div className="page"><h2>ליגת התחזיות 🔮</h2><p>כאן נבנה את משחק הניחושים...</p></div>;
const HeadToHead = () => <div className="page"><h2>ראש בראש ⚔️</h2><p>כאן נבנה את זירת העימותים...</p></div>;

function App() {
  return (
    // ה-Router עוטף את כל האפליקציה ומאפשר לה לעבור בין עמודים
    <Router>
      <div className="app-container" dir="rtl">
        
        {/* תפריט הניווט העליון */}
        <nav className="navbar">
          <h1 className="logo">MadridFans</h1>
          <div className="nav-links">
            <Link to="/">ראשי</Link>
            <Link to="/squad">ההרכב שלי</Link>
            <Link to="/ratings">ציונים</Link>
            <Link to="/predictions">תחזיות</Link>
            <Link to="/h2h">ראש בראש</Link>
          </div>
        </nav>

        {/* האזור שבו התוכן מתחלף לפי הכפתור שלחצו עליו */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/squad" element={<SquadBuilder />} />
            <Route path="/ratings" element={<PlayerRatings />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/h2h" element={<HeadToHead />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
