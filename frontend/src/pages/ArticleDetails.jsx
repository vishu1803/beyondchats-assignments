import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const isHTML = (text = "") => /<\/?[a-z][\s\S]*>/i.test(text);

  async function fetchArticle() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}`);
      const data = await res.json();
      setArticle(data);
    } catch (err) {
      console.error("Failed fetching article", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticle();
  }, []);

  // ================= TRIGGER NODE LLM =================
  async function triggerLLM() {
    try {
      setGenerating(true);

      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!data.success) throw new Error("LLM Failed");

      alert("AI Article Generated Successfully 🎯");

      fetchArticle();
    } catch (e) {
      alert("Failed to generate. Make sure Node server is running on 5000.");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );

  if (!article)
    return <div className="text-center text-red-500 mt-10">Article not found</div>;

  const isGenerated = article.is_generated;

  const cleanAIContent = (text = "") =>
    text.replace(/References[\s\S]*$/i, "").trim();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition mb-4"
      >
        ← Back
      </button>

      {/* ================= ORIGINAL ARTICLE ================= */}
      {!isGenerated && (
        <>
          <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 border dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {article.title}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Original Article
            </p>

            {article.source_url && (
              <div className="mt-3">
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-medium"
                >
                  View Original Source
                </a>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={triggerLLM}
              disabled={generating}
              className="mt-4 px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {generating ? "Generating..." : "⚡ Generate AI Version"}
            </button>

            <div
              className="mt-6 text-gray-800 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            ></div>
          </div>

          {/* AI GENERATED LIST */}
          {article.generated_versions?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                AI Generated Versions
              </h2>

              <div className="space-y-4">
                {article.generated_versions.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold dark:text-white">
                      {g.title}
                    </h3>

                    <button
                      onClick={() => navigate(`/article/${g.id}`)}
                      className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View AI Generated Article →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= AI GENERATED PAGE ================= */}
      {isGenerated && (
        <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI Generated Article
          </p>

          {article.original && (
            <button
              onClick={() => navigate(`/article/${article.original.id}`)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Original Article →
            </button>
          )}

          <div className="prose dark:prose-invert max-w-none mt-6">
            {isHTML(article.content) ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: cleanAIContent(article.content),
                }}
              ></div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {cleanAIContent(article.content)}
              </ReactMarkdown>
            )}
          </div>

          {/* References */}
          {article.references?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold dark:text-white">Reference Sources</h3>
              <ul className="list-disc pl-6">
                {article.references.map((r, idx) => (
                  <li key={idx}>
                    <a
                      href={r}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      {r}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
