const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const handleRequest = (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const filePath = path.join(__dirname, url.pathname.substring(1)); // Remove leading slash

  switch (req.method) {
    case 'GET':
      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error reading file');
          return;
        }
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      });
      break;
    case 'POST':
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        fs.writeFile(filePath, data, err => {
          if (err) {
            res.statusCode = 500;
            res.end('Error creating file');
            return;
          }
          res.end('File created successfully');
        });
      });
      break;
    case 'DELETE':
      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }
      fs.unlink(filePath, err => {
        if (err) {
          res.statusCode = 500;
          res.end('Error deleting file');
          return;
        }
        res.end('File deleted successfully');
      });
      break;
    default:
      res.statusCode = 405;
      res.end('Method not allowed');
  }
};

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
