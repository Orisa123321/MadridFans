> **Disclaimer:** This application was built as a personal portfolio project and educational exercise. It is not affiliated with, endorsed by, or connected to Real Madrid C.F. It is not an active commercial fan community.

# 👑 Real Madrid Galacticos

**The ultimate hub for Real Madrid fans in Israel.** A fully functional, bilingual web application built with React and Supabase.

![Galacticos Banner](https://madrid-fans.vercel.app/og-image.png) *(You can replace this link with a real screenshot of your app later)*

## 🚀 Features

- **User Authentication:** Secure login using Google OAuth or Email/Password via Supabase Auth.
- **Community News:** Read, write, and engage with fan-made articles.
- **Interactive Feedback:** "Like" articles and comment in real-time.
- **Squad Builder:** Create and save your dream starting XI using a visual pitch and player roster.
- **Match Predictions:** Submit your score predictions and first goalscorer for upcoming matches.
- **Personal Profile:** Users can view and manage/delete their own articles.
- **Bilingual Support:** Instantly switch between Hebrew (RTL) and English (LTR).
- **Telegram Integration:** Share articles directly to Telegram with a single click.

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Routing:** React Router DOM
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Custom CSS with CSS Variables
- **Deployment:** Vercel

## 📦 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Supabase
You will need a [Supabase](https://supabase.com/) project with the following tables:
- \`articles\` (id, title, content, author, likes, avatar_url, created_at)
- \`comments\` (id, article_id, author, content, avatar_url, created_at)
- \`predictions\` (id, username, home_score, away_score, scorer, created_at)
- \`lineups\` (id, formation_data, created_at)

### 4. Environment Variables
Create a \`.env.local\` file in the root directory and add your Supabase credentials:
\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. Run the app
\`\`\`bash
npm run dev
\`\`\`

## 🌐 Live Demo
Check out the live version of the app here:
[Real Madrid Galacticos](https://realmadridgalacticos.vercel.app/)

---
*Created with passion for Los Blancos.* ¡Hala Madrid! 🤍
