import jsPDF from "jspdf";

export type ExportFormat = "md" | "markdown" | "html" | "pdf" | "txt" | "docx";

interface ExportDocumentOptions {
  content: string;
  fileName: string;
  format: ExportFormat;
}

/**
 * Exports a document in the specified format
 * @param options - Export options including content, fileName, and format
 */
export async function exportDocument({
  content,
  fileName,
  format,
}: ExportDocumentOptions): Promise<void> {
  const timestamp = new Date().toISOString().split("T")[0];
  const baseFileName = `${fileName}_${timestamp}`;

  switch (format) {
    case "md":
    case "markdown":
      downloadFile(content, `${baseFileName}.md`, "text/markdown");
      break;

    case "html":
      const htmlContent = markdownToHtml(content);
      downloadFile(htmlContent, `${baseFileName}.html`, "text/html");
      break;

    case "pdf":
      await exportToPdf(content, baseFileName);
      break;

    case "txt":
      downloadFile(content, `${baseFileName}.txt`, "text/plain");
      break;

    case "docx":
      // For now, export as plain text with .docx extension
      // In production, you'd want to use a library like docx to create proper Word documents
      downloadFile(content, `${baseFileName}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      break;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Downloads a file with the given content
 */
function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts markdown to HTML
 */
function markdownToHtml(markdown: string): string {
  // Basic markdown to HTML conversion
  // For a production app, you'd want to use a library like marked or remark
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1, h2, h3 { margin-top: 1.5em; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `.trim();
}

/**
 * Exports content to PDF
 */
async function exportToPdf(content: string, fileName: string): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  // Split content into lines that fit the page width
  const lines = doc.splitTextToSize(content, maxWidth);

  // Add text to PDF with proper pagination
  let y = margin;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - margin;

  lines.forEach((line: string) => {
    if (y + lineHeight > maxY) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save(`${fileName}.pdf`);
}
