const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    let ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'application/javascript'; break;
    }

    fs.readFile(filePath, (err, data) => {
        if(err){
            res.writeHead(404); res.end('File not found');
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        }
    });
});

server.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});