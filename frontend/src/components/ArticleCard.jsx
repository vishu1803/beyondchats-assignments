import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition">
        
        <span className={`px-3 py-1 text-xs rounded-full mb-3 inline-block
          ${article.is_generated ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}
        `}>
          {article.is_generated ? "AI Generated" : "Original"}
        </span>

        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {article.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: article.excerpt }}
        />

      </div>
    </Link>
  );
}
