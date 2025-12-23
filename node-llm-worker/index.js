require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const he = require('he');
const { getJson } = require("serpapi");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const BASE_URL = process.env.LARAVEL_BASE_URL || 'http://127.0.0.1:8000';

// -------------------
// Get Latest Article
// -------------------
async function getLatestArticle() {
  const res = await axios.get(`${BASE_URL}/api/articles-latest`);
  return res.data;
}

// -------------------
// Google Search via SerpAPI
// -------------------
async function searchGoogleBlogs(query) {
  console.log("Searching with SerpAPI:", query);

  const results = await getJson({
    api_key: process.env.SERPAPI_KEY,
    engine: "google",
    q: query,
    hl: "en",
    num: 10
  });

  if (!results.organic_results) {
    throw new Error("No Google results returned from SerpAPI");
  }

  const blogs = results.organic_results.filter(r =>
    r.link?.includes("/blog") ||
    r.link?.includes("/post") ||
    r.link?.includes("/news") ||
    r.link?.includes("/article") ||
    r.link?.includes("medium.com") ||
    r.link?.includes("wordpress") ||
    r.link?.includes("substack.com")
  );

  console.log("Filtered blog results:", blogs.length);

  if (blogs.length >= 2) return blogs.slice(0, 10);

  console.log("Fallback: using top organic results");
  return results.organic_results.slice(0, 10);
}

// -------------------
// Scrape Content Safely
// -------------------
async function scrapeMainContent(url) {
  try {
    console.log("Scraping:", url);

    const res = await axios.get(url, {
      timeout: 20000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const html = res.data;

    if (
      html.includes("cf-error-details") ||
      html.includes("Cloudflare") ||
      html.includes("Attention Required")
    ) {
      throw new Error("Cloudflare blocked this site");
    }

    const $ = cheerio.load(html);

    let content =
      $("article").text().trim() ||
      $("main").text().trim() ||
      $(".post-content").text().trim() ||
      $(".entry-content").text().trim();

    content = content.replace(/\s+\n/g, "\n").replace(/\n{2,}/g, "\n\n");

    if (!content || content.length < 200) {
      throw new Error("Content too small / not found");
    }

    return content.slice(0, 15000);
  } catch (err) {
    console.log("SCRAPE FAILED for", url);
    console.log("Reason:", err.message);
    return null;
  }
}

// -------------------
// Gemini Generation
// -------------------
async function generateImprovedArticle(original, ref1, ref2, refUrls) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an SEO expert and professional copywriter.

Original Title: ${original.title}

Original Content:
${original.content || ''}

Reference Article 1 (style only, do not copy):
${ref1.slice(0, 6000)}

Reference Article 2 (style only, do not copy):
${ref2.slice(0, 6000)}

Rewrite task:
- Rewrite original article
- Improve clarity
- Improve SEO
- Better headings
- Better structure
- DO NOT copy sentences from references
- Keep original meaning
- Use clean readable formatting (Markdown / HTML allowed)

At end add:
References:
- ${refUrls[0]}
- ${refUrls[1]}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// -------------------
// Publish to Laravel
// -------------------
async function publishGeneratedArticle(original, newContent, references) {
  const payload = {
    title: original.title + " (Updated)",
    excerpt: original.excerpt,
    content: newContent,
    is_generated: true,
    original_article_id: original.id,
    references,
  };

  const res = await axios.post(`${BASE_URL}/api/articles`, payload);
  return res.data;
}

// -------------------
// MAIN
// -------------------
async function main() {
  try {
    console.log("Fetching latest original article...");
    const latest = await getLatestArticle();
    console.log("Latest article:", latest.title);

    console.log("Searching Google...");
    const cleanTitle = he.decode(latest.title);
    const googleResults = await searchGoogleBlogs(cleanTitle);

    const urls = googleResults.map(r => r.link);
    console.log("Selected reference URLs:", urls);

    let refContents = [];
    let pickedUrls = [];

    for (const url of urls) {
      if (refContents.length === 2) break;

      const content = await scrapeMainContent(url);
      if (content) {
        refContents.push(content);
        pickedUrls.push(url);
      }
    }

    if (refContents.length < 2) {
      throw new Error("Could not scrape 2 valid reference articles");
    }

    console.log("Calling Gemini to generate improved article...");
    const improvedContent = await generateImprovedArticle(
      latest,
      refContents[0],
      refContents[1],
      pickedUrls
    );

    console.log("Publishing generated article to Laravel...");
    const created = await publishGeneratedArticle(latest, improvedContent, pickedUrls);

    console.log("DONE 🎉 Created article id:", created.id);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
