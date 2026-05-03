export async function downloadProgramPdf(programId: string, token?: string): Promise<void> {
  const url = `https://gold-weasel-489740.hostingersite.com/api/governance/programs/${encodeURIComponent(programId)}/export-pdf`;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { method: 'GET', headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to download PDF: ${res.status} ${text}`);
  }

  const blob = await res.blob();
  const contentDisposition = res.headers.get('content-disposition') || '';
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/.exec(contentDisposition);
  const filename = match ? decodeURIComponent(match[1]) : `governance-report-${programId}.pdf`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

// Example usage:
// import { downloadProgramPdf } from './lib/downloadReport';
// downloadProgramPdf('12345', 'YOUR_TOKEN').catch(console.error);
