export type EmailAction = { label: string; url: string };
export type EmailDetail = { label: string; textLabel?: string; value: string };
export type EmailContent = {
  lang?: "en" | "id";
  preheader?: string;
  showPreheader?: boolean;
  title: string;
  greeting: string;
  paragraphs?: string[];
  htmlParagraphs?: string[];
  textTitle?: string;
  textParagraphs?: string[];
  code?: string;
  details?: EmailDetail[];
  action?: EmailAction;
  note?: string;
  signoff: string;
  footerLabel?: string;
  textFooterYear?: boolean;
};

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function renderEmailHtml(content: EmailContent) {
  const year = new Date().getFullYear();
  const logoUrl = `${window.location.origin}/assets/fazzres-icon.png`;
  const paragraphs = content.htmlParagraphs
    ? content.htmlParagraphs.map((paragraph) => `<p style="margin:0 0 16px;color:#344054;font-size:15px;line-height:1.7">${paragraph}</p>`).join("")
    : (content.paragraphs ?? []).map((paragraph) => `<p style="margin:0 0 16px;color:#344054;font-size:15px;line-height:1.7">${escapeEmailHtml(paragraph)}</p>`).join("");
  const code = content.code ? `<div style="margin:24px 0;padding:16px 20px;border:1px solid #dbe3f0;border-radius:10px;background:#f7f9fc;text-align:center;color:#172b4d;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:28px;font-weight:700;letter-spacing:6px">${escapeEmailHtml(content.code)}</div>` : "";
  const details = content.details?.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;border-collapse:collapse">${content.details.map((detail) => `<tr><td style="padding:9px 0;border-bottom:1px solid #edf0f5;color:#667085;font-size:14px">${escapeEmailHtml(detail.label)}</td><td align="right" style="padding:9px 0;border-bottom:1px solid #edf0f5;color:#172b4d;font-size:14px;font-weight:600">${escapeEmailHtml(detail.value)}</td></tr>`).join("")}</table>` : "";
  const action = content.action ? `<div style="margin:24px 0 8px"><a href="${escapeEmailHtml(content.action.url)}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#4616B6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600">${escapeEmailHtml(content.action.label)}</a></div>` : "";
  const note = content.note ? `<p style="margin:20px 0 0;color:#667085;font-size:13px;line-height:1.6">${escapeEmailHtml(content.note)}</p>` : "";
  const signoff = content.signoff.split("\n").map(escapeEmailHtml).join("<br>");
  const preheader = content.showPreheader === false ? "" : `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeEmailHtml(content.preheader ?? content.title)}</div>`;

  return `<!doctype html>
<html lang="${content.lang ?? "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeEmailHtml(content.title)}</title></head>
<body style="margin:0;padding:0;background:#f3f5f9;font-family:Arial,Helvetica,sans-serif;color:#172b4d">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f9"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:1px solid #e4e8ef;border-radius:12px;background:#ffffff;overflow:hidden">
      <tr><td style="padding:18px 32px;background:#20212b;border-bottom:1px solid #343541"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;padding-right:9px"><img src="${escapeEmailHtml(logoUrl)}" alt="" width="38" height="38" style="display:block;width:38px;height:38px;border:0"></td><td style="vertical-align:middle;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:-.3px">FazzRes</td></tr></table></td></tr>
      <tr><td style="padding:32px">
        <h1 style="margin:0 0 22px;color:#172b4d;font-size:22px;line-height:1.35">${escapeEmailHtml(content.title)}</h1>
        <p style="margin:0 0 18px;color:#344054;font-size:15px;line-height:1.7">${escapeEmailHtml(content.greeting)}</p>
        ${paragraphs}${code}${details}${action}${note}
        <p style="margin:26px 0 0;color:#344054;font-size:15px;line-height:1.7">${signoff}</p>
      </td></tr>
    </table>
    <p style="margin:18px 0 0;color:#7b8494;font-size:12px;line-height:1.6">© ${year} FazzRes · ${escapeEmailHtml(content.footerLabel ?? "Support")}: support@fazzres.com</p>
  </td></tr></table>
</body></html>`;
}

export function renderEmailText(content: EmailContent) {
  const year = new Date().getFullYear();
  const lines = [content.textTitle ?? content.title, "", content.greeting, "", ...(content.textParagraphs ?? content.paragraphs ?? [])];
  if (content.code) lines.push("", content.code);
  if (content.details?.length) lines.push("", ...content.details.map((detail) => `${detail.textLabel ?? detail.label}: ${detail.value}`));
  if (content.action) lines.push("", `${content.action.label}: ${content.action.url}`);
  if (content.note) lines.push("", content.note);
  const footerYear = content.textFooterYear === false ? "" : `${year} `;
  lines.push("", ...content.signoff.split("\n"), "", `© ${footerYear}FazzRes · ${content.footerLabel ?? "Support"}: support@fazzres.com`);
  return lines.join("\n");
}
