const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const siteDir = path.resolve(process.cwd(), '_site');
const outPath = path.resolve(process.cwd(), 'files', 'CV.pdf');
const pagePath = '/cv-print/';
const host = '127.0.0.1';
const port = 4173;

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js') return 'text/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.woff') return 'font/woff';
  if (ext === '.woff2') return 'font/woff2';
  if (ext === '.ttf') return 'font/ttf';
  return 'application/octet-stream';
}

function createStaticServer(rootDir) {
  return http.createServer((req, res) => {
    const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let candidate = path.join(rootDir, requestPath);

    if (!candidate.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (requestPath.endsWith('/')) {
      candidate = path.join(candidate, 'index.html');
    }

    fs.stat(candidate, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': getContentType(candidate) });
      fs.createReadStream(candidate).pipe(res);
    });
  });
}

async function main() {
  if (!fs.existsSync(siteDir)) {
    throw new Error('Site directory not found: ' + siteDir);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const server = createStaticServer(siteDir);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1240, height: 1754 }
    });
    const page = await context.newPage();
    const targetUrl = 'http://' + host + ':' + port + pagePath;

    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__cvPdfReady === true, null, { timeout: 45000 });
    await page.emulateMedia({ media: 'print' });

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="
          width: 100%;
          font-size: 9px;
          color: #666;
          padding: 0 18mm 4mm 18mm;
          text-align: right;
        ">
          <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '16mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    console.log('Generated PDF at', outPath);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
