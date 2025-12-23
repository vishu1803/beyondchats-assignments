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
      const res = await fetch(
        `${API_BASE}/api/articles?page=${page}${filter}`
      );
      const data = await res.json();
      setArticles(data.data);
      setMeta(data);
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
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-bold dark:text-white">
          BeyondChats Articles
        </h1>

        <button
          onClick={scrapeBlogs}
          disabled={loading}
          className="px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Scrape Blogs
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            setPage(1);
            setFilter("");
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          All
        </button>

        <button
          onClick={() => {
            setPage(1);
            setFilter("&is_generated=0");
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Originals
        </button>

        <button
          onClick={() => {
            setPage(1);
            setFilter("&is_generated=1");
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          AI Generated
        </button>
      </div>

      {/* Articles */}
      {loading ? (
        <p className="text-center text-white mt-8">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {articles?.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <div className="flex gap-6 justify-center mt-10 items-center">
          <button
            disabled={!meta.prev_page_url || loading}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="dark:text-white">
            Page {meta.current_page} of {meta.last_page}
          </span>

          <button
            disabled={!meta.next_page_url || loading}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
