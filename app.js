const express = require('express');
const bodyParser = require("body-parser");
const nconf = require('./config');
const http = require('http');
const path = require('path');
const got = require('got');
const url = require('url');
const loadPage = require('./libs/loadPages');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);



// GET home page
app.get('/', function (req, res) {
  res.render('index');
});

// POST home page
var urlObj;
app.post('/', function (req, res) {
  urlObj = url.parse(req.body.url);

  if(!urlObj.protocol) urlObj.protocol = 'http';

  got(urlObj.href).then(function(data){
    res.send(data.body);
  });
});

app.post('/search', function (req, res) {
  const tagName = req.body.element['tagName'];
  const attributes = req.body.element['attributes'];
  console.log(tagName);
  console.log(attributes);
  const links = req.body.links;
  loadPage(links, urlObj, tagName, attributes);
  res.end();
});

app.listen(nconf.get('port'));