import puppeteer from "puppeteer";

export async function POST(req: Request) {
  const { html } = await req.json();

  // Basic printable HTML wrapper with default styles
  const doc = `
  <html>
    <head>
      <meta charSet="utf-8" />
      <style>
        @page { size: A4; margin: 16mm; }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        img { max-width: 100%; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px; }
        h1,h2,h3 { margin: 0 0 8px; }
        p { margin: 0 0 8px; }
      </style>
    </head>
    <body>${html}</body>
  </html>`.trim();

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(doc, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="notes.pdf"',
    },
  });
}
