import { API_BASE } from "../config";

export async function fetchArticles() {
  const res = await fetch(`${API_BASE}/articles`);
  return res.json();
}

export async function fetchArticle(id) {
  const res = await fetch(`${API_BASE}/articles/${id}`);
  return res.json();
}
