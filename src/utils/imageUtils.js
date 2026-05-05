export const getImageUrl = (url) => {
  if (!url) return '';
  // If it's already an absolute URL (http, https, data), return it as is
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Get the base API URL (e.g., http://localhost:5000/api)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Remove '/api' from the end to get the server base URL (e.g., http://localhost:5000)
  const serverUrl = apiUrl.replace(/\/api\/?$/, '');
  
  // Ensure the relative path starts with a slash
  const relativePath = url.startsWith('/') ? url : `/${url}`;
  
  return `${serverUrl}${relativePath}`;
};
