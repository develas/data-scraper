const url = require('url');
const got = require('got');
const fs = require('fs');
const nconf = require('../config');
const cheerio = require('cheerio');
const log = require('./loger');


module.exports = function(links, urlObj, tagName, attributes){

    var validLinks = [],
      usedLink = [],
      level = nconf.get('depth'),
      maxToParse = nconf.get('maxToParse'),
      promises = [];


  // Clicked element on the page
  var element = tagName + function(){
    var attrs = '';
    attributes.forEach(function(attr){
      attrs += "["+attr.name + "='" + attr.value + "']";
    });
    return attrs;
  }();

    log.info(element);

  // create an array of valid links (not used, not repeated)
  function saveValidLinks(){
    links.forEach(function(item){
      if(item!== undefined && !usedLink.includes(item) && !validLinks.includes(item)){
        try{
          var link = url.parse(item);
        } catch(err){
          log('error', err.message);
        }
        if(urlObj.hostname === link.hostname){
         validLinks.push(item);
        }
      }
    });
  }


  function receiveNewLinksAndSaveContent(body, link){
    var $ = cheerio.load(body);
    $('a').not('a[href^="#"]').not('a[href^="//"]').not('a[href^="/"]').each(function() {
      var href = $(this).attr('href');
      if(!links.includes(href)) links.push( href );
    });

    var content = $(element).text();
    fs.appendFile('./result.json', JSON.stringify({url: link, content: content}, null, 4));    
  }



  function getPages(){
    saveValidLinks();

    validLinks.forEach(function(item){
      if(item !== urlObj.href && !(usedLink.includes(item)) && item != ''){
        var page = got(item);
        promises.push(page);
        page.then(function(data){
          if(!usedLink.includes(item)){

            if(usedLink.length > maxToParse) 
              return;

            usedLink.push(item);
            receiveNewLinksAndSaveContent(data.body, item);
          }
        });
      }
    });

    Promise.all(promises).then(function(){
      if(level !== 0) {
        level--;
        if(usedLink.length > maxToParse) {
          level = 0;
          return;
        }
        getPages();
      }
    });
  }

  getPages();
}

