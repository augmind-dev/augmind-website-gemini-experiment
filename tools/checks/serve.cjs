// Static server for dist/client with Vercel-like clean URLs and the 404 page.
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2], port = +process.argv[3];
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.md': 'text/markdown' };
http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  const tries = [p, p + '.html', path.join(p, 'index.html')];
  for (const t of tries) {
    const f = path.join(root, t);
    if (f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) {
      s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
      return fs.createReadStream(f).pipe(s);
    }
  }
  s.writeHead(404, { 'content-type': T['.html'] }); fs.createReadStream(path.join(root, '404.html')).pipe(s);
}).listen(port, () => console.log('serving', root, port));
