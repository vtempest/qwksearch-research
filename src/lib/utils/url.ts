/**
 * URL utility functions stub
 */

/**
 * Constructs an HTML preview URL
 * @param sandboxUrl - The sandbox URL
 * @param filePath - The file path
 * @returns The constructed URL
 */
export function constructHtmlPreviewUrl(sandboxUrl: string, filePath: string): string {
  // Stub implementation - combine sandbox URL and file path
  if (!sandboxUrl || !filePath) return "";
  return `${sandboxUrl}/${filePath}`;
}
