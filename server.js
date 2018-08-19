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
            fs.readFile((`./public${req.url}`), 'utf-8', (err, data) => {

                if (err) {
                    res.writeHead(503);
                    res.write('{status: 503 Service Unavailable}');
                    res.end();
                }
                else {
                   res.writeHead(200, { 'content-type': 'text/html' });
                    res.write(data);
                    res.end(); 
                }
                
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
                    const resBody = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <title>The Elements - ${bodyParsed.elementName}</title>
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
                    fs.writeFile(`./public/${bodyParsed.elementName}.html`,resBody, 
                        err => {
                            if (err) {
                                res.writeHead(503);
                                res.write('{status: 503 Service Unavailable}');
                                res.end();
                                }
                            res.writeHead(200);
                            res.write('{status: ok}');
                            console.log(res);
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
