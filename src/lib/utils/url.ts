/**
 * Constructs a URL for previewing HTML files in a sandbox environment
 * @param sandboxUrl The base sandbox URL
 * @param filePath The file path to preview
 * @returns The constructed URL for HTML preview
 */
export function constructHtmlPreviewUrl(
  sandboxUrl: string,
  filePath: string
): string {
  // Remove leading slash if present
  const cleanFilePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  // Ensure sandbox URL ends with slash
  const cleanSandboxUrl = sandboxUrl.endsWith("/")
    ? sandboxUrl
    : `${sandboxUrl}/`;

  return `${cleanSandboxUrl}${cleanFilePath}`;
}
