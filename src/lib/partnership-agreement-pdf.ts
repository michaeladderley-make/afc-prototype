import {
  PARTNERSHIP_AGREEMENT_COPY,
  type AgreementSigner,
} from "@/lib/partnership-agreement";

function pdfEscape(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("’", "'")
    .replaceAll("—", "--");
}

function wrapLine(value: string, maxChars: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function agreementLines(schoolName: string, signer?: AgreementSigner) {
  const lines = [
    "Partnership Agreement",
    schoolName,
    "",
    ...PARTNERSHIP_AGREEMENT_COPY.flatMap((paragraph) => [
      ...wrapLine(paragraph, 86),
      "",
    ]),
  ];
  if (signer) {
    lines.push(`Signed by ${signer.legalName}, ${signer.title}.`);
    lines.push(signer.email);
  } else {
    lines.push("This agreement has been signed.");
  }
  return lines;
}

function buildPdf(lines: string[]) {
  const commands = [
    "BT",
    "/F1 12 Tf",
    "16 TL",
    "72 720 Td",
    ...lines.map((line, index) => {
      const text = `(${pdfEscape(line || " ")})`;
      return index === 0 ? `${text} Tj` : `${text} '`;
    }),
    "ET",
  ].join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${commands.length} >>\nstream\n${commands}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];
  let offset = 0;
  const header = "%PDF-1.4\n";
  const offsets = [0];
  offset = header.length;
  let body = "";
  for (const object of objects) {
    offsets.push(offset);
    body += object;
    offset += object.length;
  }
  const xref = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(offset),
    "%%EOF",
  ].join("\n");
  return header + body + xref;
}

export function downloadPartnershipAgreementPdf({
  schoolName,
  signer,
}: {
  schoolName: string;
  signer?: AgreementSigner;
}) {
  const pdf = buildPdf(agreementLines(schoolName, signer));
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "partnership-agreement.pdf";
  link.click();
  URL.revokeObjectURL(url);
}
