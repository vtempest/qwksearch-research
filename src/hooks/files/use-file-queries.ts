/**
 * Fetches file content from a URL
 * @param url - The URL to fetch the file from
 * @param options - Fetch options
 * @returns Promise with the file content as text or ArrayBuffer
 */
export async function fetchFileContent(
  url: string,
  options?: RequestInit
): Promise<string | ArrayBuffer> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  // Check content type to determine how to parse the response
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("text") || contentType?.includes("json")) {
    return await response.text();
  } else {
    return await response.arrayBuffer();
  }
}
