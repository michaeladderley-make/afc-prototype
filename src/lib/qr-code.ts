import { downloadBlob } from "@/lib/download-file";

export function qrImageSrc(text: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=16&data=${encodeURIComponent(text)}`;
}

export async function downloadQrPng(text: string, filename: string) {
  const response = await fetch(qrImageSrc(text));
  if (!response.ok) {
    downloadBlob(
      new Blob([fallbackQrSvg(text)], { type: "image/svg+xml" }),
      filename.replace(/\.png$/i, ".svg"),
    );
    return;
  }
  downloadBlob(await response.blob(), filename);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fallbackQrSvg(text: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <rect width="480" height="480" fill="#ffffff"/>
  <rect x="24" y="24" width="432" height="432" fill="none" stroke="#111111" stroke-width="8"/>
  <text x="240" y="230" text-anchor="middle" fill="#111111" font-family="Inter, Arial, sans-serif" font-size="22">QR unavailable</text>
  <text x="240" y="268" text-anchor="middle" fill="#111111" font-family="Inter, Arial, sans-serif" font-size="14">${escapeXml(text)}</text>
</svg>`;
}
