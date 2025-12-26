/**
 * Constructs a complete HTML preview URL from a sandbox base URL and a file path
 * @param sandboxUrl - The base URL of the sandbox (e.g., "https://sandbox.example.com")
 * @param filePath - The file path to preview (e.g., "/index.html" or "src/index.html")
 * @returns The complete preview URL
 */
export function constructHtmlPreviewUrl(
  sandboxUrl: string,
  filePath: string
): string {
  // Remove trailing slash from sandbox URL
  const baseUrl = sandboxUrl.replace(/\/$/, "");

  // Ensure file path starts with /
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

  // Combine base URL and file path
  return `${baseUrl}${normalizedPath}`;
}
