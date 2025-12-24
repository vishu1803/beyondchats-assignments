import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";

const API_BASE = "http://127.0.0.1:8000";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [page, filter]);

  async function loadArticles() {
    try {
      setLoading(true);

      const url = `${API_BASE}/api/articles?page=${page}${
        filter ? `&${filter}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();

      setArticles(data.data);
      setMeta({
        current_page: data.current_page,
        last_page: data.last_page,
        next_page_url: data.next_page_url,
        prev_page_url: data.prev_page_url,
      });
    } catch (err) {
      console.log("Error loading articles", err);
      alert("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }

  async function scrapeBlogs() {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/api/scrape`, { method: "POST" });

      alert("Scraping Completed 🎉 Refreshing...");
      setPage(1);
      loadArticles();
    } catch {
      alert("Scrape Failed ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-3xl font-bold dark:text-white">
          BeyondChats Articles
        </h1>

        <button
          onClick={scrapeBlogs}
          disabled={loading}
          className="px-5 py-3 bg-green-600 text-white rounded-lg 
          hover:bg-green-700 disabled:opacity-50 
          cursor-pointer disabled:cursor-not-allowed"
        >
          Scrape Blogs
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mt-6 flex-wrap">
        <button
          onClick={() => {
            setFilter("");
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg 
          hover:bg-gray-600 cursor-pointer"
        >
          All
        </button>

        <button
          onClick={() => {
            setFilter("is_generated=0");
            setPage(1);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg 
          hover:bg-green-700 cursor-pointer"
        >
          Originals
        </button>

        <button
          onClick={() => {
            setFilter("is_generated=1");
            setPage(1);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg 
          hover:bg-purple-700 cursor-pointer"
        >
          AI Generated
        </button>
      </div>

      {/* Articles */}
      {loading ? (
        <div className="text-center text-gray-400 mt-10 text-lg">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {articles?.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <div className="flex justify-center gap-6 items-center mt-12">

          <button
            disabled={!meta.prev_page_url || loading}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg 
            disabled:opacity-40 
            cursor-pointer disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <span className="dark:text-white font-semibold">
            Page {meta.current_page} / {meta.last_page}
          </span>

          <button
            disabled={!meta.next_page_url || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg 
            disabled:opacity-40 
            cursor-pointer disabled:cursor-not-allowed"
          >
            Next →
          </button>

        </div>
      )}
    </div>
  );
}
