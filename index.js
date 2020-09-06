const http = require("http");
const url = require("url");
const fs = require("fs");

const json = fs.readFileSync(`${__dirname}/data/data.json`);
const laptopData = JSON.parse(json);    // オブジェクト配列


const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;
  
  // // TESTING
  // console.log(pathName);
  // console.log(id);
  
  // PRODUCTS OVERVIEW
  if(pathName === '/' || pathName === '/products') {
    
    fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
      if(err) console.log(err);
      let productsOutput = data;
      
      fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
        if(err) console.log(err);
        
        const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
        productsOutput = productsOutput.replace(/{%CARDS%}/g, cardsOutput);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(productsOutput);
      });
    });
    
    
  // LAPTOP DETAILS
  } else if(pathName === '/laptop' && id < laptopData.length) {
    
    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
      if(err) console.log(err);

      const laptop = laptopData[id];
      const laptopOutput = replaceTemplate(data, laptop);
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(laptopOutput);
    });
    
    
  // IMAGES
  } else if((/\.(jpg|jpeg|gif|png)$/i).test(pathName)) {
    
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      if(err) console.log(err);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/jpeg');
      res.end(data);
    });

    
  // URL NOT FOUND
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('URL was not found on the server!');
  }
  
});


function replaceTemplate(originalHTML, laptop) {
  let output = originalHTML.replace(/{%ID%}/g, laptop.id);
  output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  return output;
}


const port = process.env.C9_PORT;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});