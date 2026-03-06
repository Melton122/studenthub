import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const BASE_URL =
  process.env.EXPO_PUBLIC_NEWS_API_BASE_URL || "https://newsapi.org/v2";

const PAGE_SIZE = 10;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const TIMEOUT = 10000;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500";

/* ---------------- helpers ---------------- */

const getImageUrl = (article) => article.urlToImage || FALLBACK_IMAGE;

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const interval = seconds / intervals[key];
    if (interval >= 1) {
      return `${Math.floor(interval)} ${key}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function getRandomColor(seed = "") {
  const colors = [
    "#6C5CE7",
    "#00B894",
    "#FD79A8",
    "#FDCB6E",
    "#74B9FF",
    "#A29BFE",
    "#FF7675",
    "#00CEC9",
  ];

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

const formatArticle = (article) => ({
  id: article.url,
  title: article.title || "Untitled article",
  description: article.description || "No description available",
  content: article.content || article.description || "",
  url: article.url,
  imageUrl: getImageUrl(article),
  source: article.source?.name || "News",
  publishedAt: article.publishedAt,
  timeAgo: article.publishedAt
    ? timeSince(new Date(article.publishedAt))
    : "recently",
  color: getRandomColor(article.source?.name || ""),
});

/* ---------------- timeout fetch ---------------- */

const fetchWithTimeout = async (url) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

/* ---------------- cache helpers ---------------- */

const getCache = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);

    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    if (Date.now() - timestamp > CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

const setCache = async (key, data) => {
  try {
    const payload = {
      data,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch {}
};

/* ---------------- request core ---------------- */

async function request(endpoint) {
  const cacheKey = `news_${endpoint}`;

  const cached = await getCache(cacheKey);

  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}${endpoint}&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "News API error");
    }

    const articles = data.articles
      .filter((a) => a.url && a.title)
      .map(formatArticle);

    await setCache(cacheKey, articles);

    return articles;
  } catch (error) {
    console.error("News API error:", error);

    const fallback = await getCache(cacheKey);

    return fallback || [];
  }
}

/* ---------------- public API ---------------- */

export const fetchNews = async (
  query = "education South Africa",
  page = 1
) => {
  const endpoint = `/everything?q=${encodeURIComponent(
    query
  )}&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${page}`;

  return request(endpoint);
};

export const searchNews = async (query, page = 1) => {
  if (!query.trim()) return [];

  const endpoint = `/everything?q=${encodeURIComponent(
    query
  )}&sortBy=relevancy&pageSize=${PAGE_SIZE}&page=${page}`;

  return request(endpoint);
};