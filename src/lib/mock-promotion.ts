export function promotionCopy(schoolName: string, liveUrl: string) {
  return {
    email: {
      label: "Approved sample email copy",
      text: `Subject: Help a student at ${schoolName} this year

Families and alumni,

${schoolName} has a live donation page with the AFC Scholarship Fund. Your gift becomes a scholarship for a student at our school — not a designation to one child.

Give here: ${liveUrl}

Thank you for supporting students at ${schoolName}.`,
    },
    social: {
      label: "Approved sample social copy",
      text: `${schoolName} is raising scholarship funds through AFC. One gift helps a student this year, and eligible donors may claim a federal tax credit. Give: ${liveUrl}`,
    },
    guidance:
      "Share the live URL first. Use the approved email and social copy so the ask, tax-credit language, and destination stay consistent. Post a banner on your site or in a newsletter. Do not promise a gift to a specific student.",
  };
}

export function promotionBanners(schoolName: string) {
  return [
    {
      id: "square",
      name: "Social square",
      filename: "social-square.svg",
      width: 240,
      height: 240,
      svg: bannerSvg(schoolName, 1080, 1080, "Give today"),
    },
    {
      id: "landscape",
      name: "Email banner",
      filename: "email-banner.svg",
      width: 320,
      height: 120,
      svg: bannerSvg(schoolName, 1200, 450, "Donate now"),
    },
  ];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bannerSvg(
  schoolName: string,
  width: number,
  height: number,
  action: string,
) {
  const name = escapeXml(schoolName);
  const label = escapeXml(action);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${name} ${label}">
  <rect width="${width}" height="${height}" fill="#111111"/>
  <text x="${width / 2}" y="${height / 2 - 36}" text-anchor="middle" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="${Math.round(width / 22)}" font-weight="500">${name}</text>
  <text x="${width / 2}" y="${height / 2 + 28}" text-anchor="middle" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="${Math.round(width / 28)}">${label}</text>
  <text x="${width / 2}" y="${height - 48}" text-anchor="middle" fill="#b3b3b3" font-family="Inter, Arial, sans-serif" font-size="${Math.round(width / 36)}">AFC Scholarship Fund</text>
</svg>`;
}
