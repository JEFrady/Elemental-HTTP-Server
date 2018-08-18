const http = require('http');
const PORT = process.env.PORT || 8000;
const fs = require('fs');
const qs = require('querystring');

const server = http.createServer( (req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/css/styles.css') {
            fs.readFile('./public/css/styles.css', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(503);
                    res.write('{status: 503 Service Unavailable}');
                    res.end();
                }
                res.writeHead(200, {'content-type': 'text/css'});
                res.write(data);
                res.end();
            })
        }
        else {
            let page = getPage(req.url);
            fs.readFile(page, 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(503);
                    res.write('{status: 503 Service Unavailable}');
                    res.end();
                }
                res.writeHead(200, { 'content-type': 'text/html' });
                res.write(data);
                res.end();
                })
        }
    }
    if (req.method === 'POST') {
        if (req.url === '/elements') {
            let body = [];
            req
                .on('data', (chunk) => { 
                    body.push(chunk);
                })
                .on('end', () => {
                    body = Buffer.concat(body).toString();
                    let bodyParsed = qs.parse(body);
                    console.log("inner",bodyParsed)
                    const resBody = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <title>The Elements - ${bodyParsed.elementName}/title>
                      <link rel="stylesheet" href="/css/styles.css">
                    </head>
                    <body>
                      <h1>${bodyParsed.elementName}</h1>
                      <h2>${bodyParsed.elementSymbol}</h2>
                      <h3>${bodyParsed.elementAtomicNumber}</h3>
                      <p>${bodyParsed.elementDescription}</p>
                      <p><a href="/">back</a></p>
                    </body>
                    </html>`;
                    let name = bodyParsed.elementName;
                    fs.writeFile(`./public/${bodyParsed.elementName}.html`,resBody, 
                        err => {
                            if (err) {
                                res.writeHead(503);
                                res.write('{status: 503 Service Unavailable}');
                                res.end();
                                }
                            res.writeHead(200);
                            res.write('{status: ok}');
                            res.end();
                        }
                    );
                })
        }
    }
        
});

server.listen(PORT, () => {
    console.log('Listening on port ', PORT);
})

function getPage (uri) {
    if (uri === '/' || uri === '/index' || uri === '/index.html') {
        let page = './public/index.html';
        return page;
    }
    else if (uri === '/hydrogen' || uri === '/hydrogen.html') {
        let page = './public/hydrogen.html';
        return page;
    }
    else if (uri === '/helium' || uri === '/helium.html') {
        let page = './public/helium.html';
        return page;
    }
    else {
        let page = './public/404.html';
        return page;
    }
}

function addPage () {

}

