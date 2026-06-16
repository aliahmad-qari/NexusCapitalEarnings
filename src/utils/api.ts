// Single source of truth for the API base URL.
// VITE_API_URL is baked in at build time by Vite.
// The fallback to localhost ONLY runs in local dev (npm run dev).
// In the production build (website + APK) the Render URL is hardcoded by Vite.
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string) ||
  'https://nexuscapitalearnings.onrender.com'; // explicit prod fallback — never localhost

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};