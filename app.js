const express = require('express');
const fetch = require('node-fetch');
const cheerio = require ('cheerio');
const stream = require('stream');
const path = require('path');
const archiver = require('archiver');


function getTransformStream(url, recLevel, replaceManager, doCrawlAndDownloadResource) {
  let transformStream = new stream.Transform();
  let buffer='';

  transformStream._transform = function(chunk, encoding, callback) {
    buffer += chunk.toString();
    callback();
  };

  transformStream._flush = function(callback){
    this.push(transformStream._replace(buffer));
    callback();
  }

  transformStream._replace = function(chunk){
      $ = cheerio.load(chunk);
      $('a').each(function (i, link){
        let href = $(this).attr('href');
        let downloadableURL = URLManager.getDownloadableURL(url,href);
        let newhref = replaceManager.lookupName(downloadableURL);
        $(this).attr('href', newhref);

        doCrawlAndDownloadResource(downloadableURL, recLevel - 1, newhref);

      }); //end $a.each
      return $.html();
  };

  return transformStream;
}//end getTransformStream

//TODO function function URLManager()

//TODO function ReplaceManager(maxFiles)

function startCrawling(req, res){
  let downloadedFiles = [];
}

const app = express()
const port = 3000


app.use(express.static(path.join(__dirname, ’public’)));

//here goes the routing 

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
