/**
 * Document export utilities stub
 */

export type ExportFormat = "markdown" | "html" | "pdf" | "docx" | "txt";

export async function exportDocument(options: {
  content: string;
  format: ExportFormat;
  fileName: string;
}): Promise<void> {
  const { content, format, fileName } = options;

  // Simple stub implementation - downloads content as text
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
