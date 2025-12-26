/**
 * Backend API client
 * Provides a simple wrapper around fetch for making API calls
 */

interface ApiClient {
  get: (url: string, config?: RequestInit) => Promise<any>;
  post: (url: string, data?: any, config?: RequestInit) => Promise<any>;
  put: (url: string, data?: any, config?: RequestInit) => Promise<any>;
  delete: (url: string, config?: RequestInit) => Promise<any>;
}

const baseURL = typeof window !== 'undefined' ? window.location.origin : '';

async function request(
  method: string,
  url: string,
  data?: any,
  config?: RequestInit
): Promise<any> {
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(config?.headers || {}),
  };

  const requestConfig: RequestInit = {
    method,
    headers,
    ...(config || {}),
  };

  if (data) {
    requestConfig.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, requestConfig);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export const backendApi: ApiClient = {
  get: (url: string, config?: RequestInit) => request('GET', url, undefined, config),
  post: (url: string, data?: any, config?: RequestInit) => request('POST', url, data, config),
  put: (url: string, data?: any, config?: RequestInit) => request('PUT', url, data, config),
  delete: (url: string, config?: RequestInit) => request('DELETE', url, undefined, config),
};
