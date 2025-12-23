require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const googleIt = require('google-it');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const BASE_URL = process.env.LARAVEL_BASE_URL || 'http://127.0.0.1:8000';

// ---------------- 1️⃣ Fetch Latest Original Laravel Article ----------------
async function getLatestArticle() {
  const res = await axios.get(`${BASE_URL}/api/articles-latest`);
  return res.data;
}

// ---------------- 2️⃣ Google Search for Similar Blogs ----------------
async function searchGoogleBlogs(query) {
  const results = await googleIt({ query, limit: 8 });

  const blogs = results.filter(r =>
    r.link.includes('/blog') ||
    r.link.includes('/article') ||
    r.link.includes('medium.com') ||
    r.link.includes('wordpress') ||
    r.link.includes('substack.com')
  ).slice(0, 2);

  return blogs;
}

// ---------------- 3️⃣ Scrape Blog Content ----------------
async function scrapeMainContent(url) {
  const res = await axios.get(url, { timeout: 15000 });
  const $ = cheerio.load(res.data);

  let content =
    $('article').text().trim() ||
    $('main').text().trim() ||
    $('.post-content').text().trim() ||
    $('.entry-content').text().trim();

  content = content.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n');
  return content.slice(0, 15000);
}

// ---------------- 4️⃣ Gemini — Rewrite Improved Article ----------------
async function generateImprovedArticle(original, ref1, ref2, urls) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro"
  });

  const prompt = `
You are an SEO expert and professional content writer.

Original Article Title:
${original.title}

Original Article Content:
${original.content || ''}

Reference Article 1 (Style Only):
${ref1.slice(0, 6000)}

Reference Article 2 (Style Only):
${ref2.slice(0, 6000)}

TASK:
1️⃣ Rewrite the original article.
2️⃣ Improve structure, clarity, SEO, and readability.
3️⃣ Use headings, bullet points, formatting.
4️⃣ DO NOT copy text from reference articles, only follow style.
5️⃣ Keep meaning same.
6️⃣ At bottom add:

References:
- ${urls[0]}
- ${urls[1]}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ---------------- 5️⃣ Publish Back to Laravel ----------------
async function publishGeneratedArticle(original, newContent, references) {
  const payload = {
    title: original.title + ' (Updated)',
    excerpt: original.excerpt,
    content: newContent,
    is_generated: true,
    original_article_id: original.id,
    references,
  };

  const res = await axios.post(`${BASE_URL}/api/articles`, payload);
  return res.data;
}

// ---------------- 🚀 MAIN SCRIPT ----------------
async function main() {
  try {
    console.log('Fetching latest original article...');
    const latest = await getLatestArticle();
    console.log(`Latest article: ${latest.title}`);

    console.log('Searching Google...');
    const googleResults = await searchGoogleBlogs(latest.title);
    if (googleResults.length < 2) throw new Error('Not enough Google results');

    const urls = googleResults.map(r => r.link);
    console.log('Selected reference URLs:', urls);

    console.log('Scraping reference article 1...');
    const ref1 = await scrapeMainContent(urls[0]);

    console.log('Scraping reference article 2...');
    const ref2 = await scrapeMainContent(urls[1]);

    console.log('Generating improved article using Gemini...');
    const improved = await generateImprovedArticle(latest, ref1, ref2, urls);

    console.log('Publishing generated article to Laravel...');
    const created = await publishGeneratedArticle(latest, improved, urls);

    console.log('DONE 🎉 Created article ID:', created.id);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
  }
}

main();
