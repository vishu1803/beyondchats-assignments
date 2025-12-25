
# 🚀 BeyondChats AI Article Enhancement Platform

— Scrape → Analyze → Enhance → Publish

Live Frontend: [https://beyondchats-assignments.vercel.app/](https://beyondchats-assignments.vercel.app/)

Backend API: [https://beyondchats-assignments.onrender.com/api/articles](https://beyondchats-assignments.onrender.com/api/articles)

AI Worker Service: [https://beyondchats-assignments-1.onrender.com](https://beyondchats-assignments-1.onrender.com)

🧠 Project Goal

This project automates AI-powered enhancement of BeyondChats blog articles.

It fetches real BeyondChats posts, then:

1️⃣ Fetches original article
2️⃣ Finds relevant references via Google Search
3️⃣ Scrapes useful content
4️⃣ Rewrites the article using Gemini AI
5️⃣ Publishes improved version
6️⃣ Frontend displays both versions in a clean UI

This provides measurable SEO enhancement, readability improvement, and content enrichment — completely automated.
```

🏗️ High Level Architecture
BeyondChats WordPress API
        ↓
 Laravel Backend  ─── Supabase PostgreSQL
        ↓
User clicks "Generate AI"
        ↓
 Node AI Worker (Express + Gemini)
        ↓
Google Search → Scraping → AI Rewrite
        ↓
Saves Generated Article
        ↓
React Frontend UI Displays
 ├─ Original Article
 └─ AI Generated Improved Article
```

🧵 Detailed Data Flow
🔹 Step 1 — Get Real BeyondChats Articles

We reverse-engineered BeyondChats and identified their official WordPress REST API:

[https://beyondchats.com/wp-json/wp/v2/posts?per_page=10\&orderby=date](https://beyondchats.com/wp-json/wp/v2/posts?per_page=10&orderby=date)
```
From here, we extract:


| Field | Purpose |
| :-- | :-- |
| title.rendered | Article Title |
| content.rendered | Full HTML Article |
| excerpt.rendered | Short Summary |
| link | Original Article URL |

Saved into DB as Original Article (is_generated = false)
```
🔹 Step 2 — Trigger AI Generation

Frontend provides a button:

⚡ Generate AI Version

This makes a request to Node AI Worker.

🔹 Step 3 — Intelligent Web Research

Node service uses SerpAPI to search Google:

✔ Finds highly relevant sources
✔ Extracts reference URLs
✔ Ensures quality blog-level sites only

🔹 Step 4 — Web Scraping

Scraping done via Cheerio + Axios with:

Cloudflare detection

Content quality checks

Fallback strategies

Clean readable text is extracted.

🔹 Step 5 — Gemini AI Enhancement

We feed:

Original article

2 high-quality reference articles

Then ask Gemini AI to:

✔ Improve clarity
✔ Improve SEO
✔ Better structure
✔ Professional tone
✔ Maintain meaning
✔ No plagiarism
✔ Add final reference list

🔹 Step 6 — Store Improved Article

Saved back into Laravel DB as:

is_generated = true
original_article_id = parentID
references = [ “url1”, “url2” ]

This maintains a parent-child relationship.

🔹 Step 7 — Frontend Presentation

Frontend cleanly shows:

Original Article

Raw HTML format

Original source link

“Generate AI” button

AI version listing

AI Generated Article

Clean structured view

Proper typography

Reference section

Back navigation

Link back to original article

🎨 Frontend Features (React + Vite + Tailwind)

✔ Responsive Professional UI
✔ Pagination
✔ Filter:

All

Only Original

Only AI Generated

✔ Dark Mode Support
✔ Article Details Page
✔ Reference Links
✔ Back Navigation
✔ Cursor UX Enhancements

Live: [https://beyondchats-assignments.vercel.app/](https://beyondchats-assignments.vercel.app/)

🔧 Backend (Laravel + Supabase)

✔ REST API
✔ PostgreSQL (Supabase)
✔ Relationship Handling

original_article

generated_versions

✔ Production Ready Docker
✔ Render Deployment
✔ SSL DB Connections
✔ Queue Ready Structure
✔ Structured Controllers

Live API:

GET /api/articles
GET /api/articles/{id}
POST /api/articles
GET /api/articles-latest

🤖 AI Worker (Node + Gemini)

✔ Google's Gemini AI
✔ Google Search via SerpAPI
✔ Cheerio Web Scraping
✔ Article ID based generation
✔ Retry Handling
✔ Logging (Winston)
✔ Dockerized Production
✔ Deployed on Render

⚙️ Technologies Used
🎯 Frontend

React

Vite

TailwindCSS

React Router

Remark Markdown

Dark Mode Support

🧩 Backend

Laravel 11

PHP 8

PostgreSQL — Supabase

Eloquent ORM

REST API

Docker

🤖 AI Worker

Node.js 20

Express

Axios

Cheerio

SerpAPI

Google Gemini AI

Winston Logging

Docker

Render Hosting

🛠️ Local Setup
🟦 Backend — Laravel

```bash
cd backend-laravel/backend-laravel
composer install
cp .env.example .env
```

Update DB credentials to Supabase:

```ini
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-southeast-2.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=xxxxx
DB_PASSWORD=xxxxx
DB_SSLMODE=require
```

Run:

```bash
php artisan migrate
php artisan serve
```

🟩 Node AI Worker

```bash
cd node-llm-worker
npm install
```

Create .env

```ini
GEMINI_API_KEY=xxxx
SERPAPI_KEY=xxxx
LARAVEL_BASE_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

🟦 Frontend

```bash
cd frontend
npm install
```

Create .env

```ini
VITE_API_BASE=http://127.0.0.1:8000
VITE_GENERATOR_API=http://127.0.0.1:5000
```

Run:

```bash
npm run dev
```

🌍 Production Deployment
Backend

Render

Dockerized

Supabase PostgreSQL

Node AI Worker

Render

Dockerized

Frontend

Vercel

Environment based config

Deployed live

⚠️ Real-World Challenges Faced \& Solved
🔎 1️⃣ Finding Article Source

No source given → reverse engineered BeyondChats → found official WP REST API.

🛡️ 2️⃣ Scraping Barriers

Cloudflare + blocked sites handled gracefully with fallback.

🤖 3️⃣ AI Formatting Problems

AI sometimes messy → built Markdown + HTML smart detection.

🔗 4️⃣ Link Relationship

Maintained clean mapping:
Original → Generated AI Versions

🧩 5️⃣ Deployment Struggles

PHP version

DB SSL

Render Docker tuning

ENV issues

Routing issues

Fully fixed 💪

✅ Final Outcome

A fully production-ready AI automation system that:

✔ Works
✔ Scales
✔ Looks professional
✔ Uses real data
✔ AI powered
✔ Architecturally strong
✔ Deployable in real world

```markdown
# 🚀 BeyondChats AI Article Enhancement Platform  
Scrape → Analyze → Enhance → Publish

---

## 🔗 Live Services

- **Live Frontend:**  
  https://beyondchats-assignments.vercel.app/

- **Backend API:**  
  https://beyondchats-assignments.onrender.com/api/articles

- **AI Worker Service:**  
  https://beyondchats-assignments-1.onrender.com

---

## 🧠 Project Goal

This project automates AI-powered enhancement of BeyondChats blog articles using real production‑grade data flow.[file:1]

**Flow:**

1. Fetch original BeyondChats article  
2. Discover relevant references via Google Search  
3. Scrape useful web content  
4. Rewrite article using Gemini AI  
5. Publish improved version to Laravel backend  
6. Frontend shows both original and AI‑generated versions in a clean UI  

This delivers automated SEO improvement, readability upgrades, and content enrichment.

---

## 🏗️ High‑Level Architecture

```

BeyondChats WordPress API
↓
Laravel Backend  ─── Supabase PostgreSQL
↓
User clicks "Generate AI"
↓
Node AI Worker (Express + Gemini)
↓
Google Search → Scraping → AI Rewrite
↓
Saves Generated Article
↓
React Frontend UI
├─ Original Article
└─ AI‑Generated Improved Article

```

---

## 🧵 Detailed Data Flow

### 🔹 Step 1 — Get Real BeyondChats Articles

Reverse‑engineered the BeyondChats site and identified their official WordPress REST API:

`https://beyondchats.com/wp-json/wp/v2/posts?per_page=10&orderby=date`[file:1]

From each post, the following fields are mapped:

| WordPress Field    | Purpose                |
| ------------------ | ---------------------- |
| `title.rendered`   | Article title          |
| `content.rendered` | Full HTML article body |
| `excerpt.rendered` | Short summary          |
| `link`             | Original article URL   |

These are stored in the DB as **original** articles (`is_generated = false`).

---

### 🔹 Step 2 — Trigger AI Generation

The frontend exposes a **“Generate AI Version”** button per article.  
Clicking this sends a request to the **Node AI Worker** with the article ID.

---

### 🔹 Step 3 — Intelligent Web Research

The Node service uses **SerpAPI** to query Google for the article title and:

- Selects highly relevant results  
- Filters for blog / article‑level sources  
- Extracts top reference URLs  

---

### 🔹 Step 4 — Web Scraping

Using **Axios + Cheerio**, the worker:

- Fetches each reference page  
- Handles Cloudflare / blocked sites via fallback strategies  
- Applies content‑quality checks  
- Extracts clean, readable article‑like text  

---

### 🔹 Step 5 — Gemini AI Enhancement

Prompt inputs:

- Original BeyondChats article  
- Two high‑quality reference articles  

Gemini AI is instructed to:

- Improve clarity and structure  
- Enhance SEO and headings  
- Maintain original meaning  
- Avoid plagiarism  
- Append a final **“References”** section listing the scraped URLs  

---

### 🔹 Step 6 — Store Improved Article

The improved article is saved back into the Laravel database as:

- `is_generated = true`  
- `original_article_id = <parent_id>`  
- `references = ["url1", "url2"]`  

This forms a clean **parent → child** relationship between original and AI‑generated versions.

---

### 🔹 Step 7 — Frontend Presentation

The React frontend displays:

**Original Article**

- Raw HTML body  
- Original source link  
- “Generate AI” button  
- List of all generated versions  

**AI‑Generated Article**

- Clean structured content view  
- Proper typography  
- References section with external links  
- Navigation back to the original article  

Live UI: https://beyondchats-assignments.vercel.app/

---

## 🎨 Frontend (React + Vite + Tailwind)

- React + Vite  
- TailwindCSS  
- React Router  
- Remark/Markdown rendering where needed  
- Responsive layout  
- Dark mode support  
- Filters:
  - All
  - Only Original
  - Only AI Generated  
- Pagination  
- Article detail page with references  
- Subtle cursor / UX polish  

---

## 🔧 Backend (Laravel + Supabase)

- Laravel 11, PHP 8  
- RESTful API over **Supabase PostgreSQL**  
- Data model:

  - `original_article`  
  - `generated_versions` (hasMany relation)

- Endpoints:

  - `GET /api/articles`  
  - `GET /api/articles/{id}`  
  - `POST /api/articles`  
  - `GET /api/articles-latest`

- Infra:

  - Dockerized  
  - Deployed on Render  
  - SSL DB connections (Supabase)  
  - Queue‑ready structure and layered controllers  

---

## 🤖 AI Worker (Node + Gemini)

- Node.js 20 + Express  
- Axios + Cheerio for HTTP and scraping  
- SerpAPI for Google Search  
- Google Gemini AI for rewriting  
- Article‑ID based generation endpoints  
- Retry logic and error handling  
- Winston logging  
- Dockerized and deployed on Render  

---

## ⚙️ Technologies Used

### 🎯 Frontend

- React  
- Vite  
- TailwindCSS  
- React Router  
- Remark / Markdown renderer  
- Dark mode support  

### 🧩 Backend

- Laravel 11  
- PHP 8  
- PostgreSQL (Supabase)  
- Eloquent ORM  
- REST API  
- Docker  

### 🤖 AI Worker

- Node.js 20  
- Express  
- Axios  
- Cheerio  
- SerpAPI  
- Google Gemini AI  
- Winston logging  
- Docker  
- Render hosting  

---

## 🛠️ Local Setup

### 🟦 Backend — Laravel

```

cd backend-laravel/backend-laravel
composer install
cp .env.example .env

```

Update `.env` with Supabase credentials:

```

DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-southeast-2.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=xxxxx
DB_PASSWORD=xxxxx
DB_SSLMODE=require

```

Run migrations and dev server:

```

php artisan migrate
php artisan serve

```

---

### 🟩 Node AI Worker

```

cd node-llm-worker
npm install

```

Create `.env`:

```

GEMINI_API_KEY=xxxx
SERPAPI_KEY=xxxx
LARAVEL_BASE_URL=http://127.0.0.1:8000

```

Run locally:

```

npm run dev

```

---

### 🟦 Frontend

```

cd frontend
npm install

```

Create `.env`:

```

VITE_API_BASE=http://127.0.0.1:8000
VITE_GENERATOR_API=http://127.0.0.1:5000

```

Start dev server:

```

npm run dev

```

---

## 🌍 Production Deployment

**Backend**

- Render  
- Dockerized Laravel  
- Supabase PostgreSQL with SSL  

**Node AI Worker**

- Render  
- Dockerized Node/Express service  

**Frontend**

- Vercel  
- Environment‑based config  
- Deployed to: https://beyondchats-assignments.vercel.app/

---

## ⚠️ Real‑World Challenges & Solutions

1. **Finding Article Source**  
   - No explicit source given → reverse‑engineered BeyondChats → located official WordPress REST API.

2. **Scraping Barriers**  
   - Cloudflare / blocked domains → handled with fallbacks and graceful degradation.

3. **AI Formatting Issues**  
   - Gemini sometimes produced messy structure → added Markdown/HTML‑aware normalization.

4. **Link Relationships**  
   - Ensured robust mapping:  
     `Original Article → AI Generated Versions` via `original_article_id`.

5. **Deployment Issues**  
   - PHP version mismatches, DB SSL, Docker tuning, environment & routing problems → iteratively fixed for stable production deployments.

---

## ✅ Final Outcome

A production‑ready AI automation system that:

- Works end‑to‑end  
- Scales with real data  
- Provides a professional UX  
- Uses real BeyondChats content  
- Is AI‑powered and architecture‑driven  
- Is fully deployable in real‑world scenarios  
```



