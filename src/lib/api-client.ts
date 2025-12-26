/**
 * Backend API client stub
 * Simple wrapper around fetch for making HTTP requests
 */

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async request(method: string, url: string, options?: RequestOptions) {
    const fullURL = this.baseURL + url;
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    if (options?.body) {
      requestInit.body = JSON.stringify(options.body);
    }

    const response = await fetch(fullURL, requestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  }

  async get(url: string, options?: RequestOptions) {
    return this.request('GET', url, options);
  }

  async post(url: string, body?: any, options?: RequestOptions) {
    return this.request('POST', url, { ...options, body });
  }

  async put(url: string, body?: any, options?: RequestOptions) {
    return this.request('PUT', url, { ...options, body });
  }

  async patch(url: string, body?: any, options?: RequestOptions) {
    return this.request('PATCH', url, { ...options, body });
  }

  async delete(url: string, options?: RequestOptions) {
    return this.request('DELETE', url, options);
  }
}

export const backendApi = new ApiClient();
