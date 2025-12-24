import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/article/${article.id}`}>
      <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">

        {/* Badge */}
        <span
          className={`px-3 py-1 text-xs rounded-full mb-3 inline-block font-semibold
            ${article.is_generated
              ? "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
              : "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
            }`}
        >
          {article.is_generated ? "AI Generated" : "Original"}
        </span>

        {/* Title */}
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p
          className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3"
          dangerouslySetInnerHTML={{ __html: article.excerpt || "" }}
        ></p>

      </div>
    </Link>
  );
}
