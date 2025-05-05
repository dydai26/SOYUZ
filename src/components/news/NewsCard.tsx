
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="w-full h-57 object-cover border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/news/${article.id}`}>
        <div className=" relative aspect-video overflow-cover">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-57  object-cover transition-transform hover:scale-105"
          />
          {article.images && article.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-blue-900 text-white text-xs px-2 py-1 rounded-full">
              {article.images.length} фото
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-2">
          {format(new Date(article.date), "d MMMM yyyy", { locale: uk })}
        </div>
        <Link to={`/news/${article.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-brand-blue transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 line-clamp-3">{article.summary}</p>
        <Link 
          to={`/news/${article.id}`}
          className="inline-block mt-4 text-brand-blue hover:underline"
        >
          Читати більше
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
