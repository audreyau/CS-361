const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath;

  switch (req.url) {
    case '/':
      filePath = './public/index.html';
      break;
    case '/easy_addition':
      filePath = './public/basic_addition.html';
      break;
    case '/med_addition':
      filePath = './public/med_addition.html';
      break;
    case '/hard_addition':
      filePath = './public/hard_addition.html';
      break;
    case '/easy_subtraction':
      filePath = './public/basic_subtraction.html';
      break;
    case '/med_subtraction':
      filePath  = './public/med_subtraction.html';
      break;
    case '/hard_subtraction':
      filePath = './public/hard_subtraction.html';
      break;
    case '/story-addition':
      filePath = './public/story_addition.html';
      break;
    case '/story-subtraction':
      filePath = './public/story_subtraction.html';
      break;
    case '/help':
      filePath = './public/help.html';
      break;
    default:
      filePath = '.' + req.url;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
  }[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
