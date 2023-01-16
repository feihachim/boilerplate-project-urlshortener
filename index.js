require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('node:dns');
const app = express();

const Counter = require('./models/counter');
const ShortUrl = require('./models/shorturl');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
mongoose.set("strictQuery",false);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',function(req,res){
  const originalUrl = req.body.url;
  const websiteTemplate = /^(https?:\/\/)?[a-zA-Z0-9-_\.]+\.[a-z]{2,4}/;

  if(!websiteTemplate.test(originalUrl)){
    res.json({error:'invalid url'});
    return;
  }
  const hostname = originalUrl.replace(/^https?:\/\//,'');
  
  dns.lookup(hostname,(error,address,family)=>{
    if(error){
      res.json({error:'invalid url'});
      return;
    }
    ShortUrl.find({},(err,urls)=>{
      if(err) return handleError(err);
      const urlCount=urls.length;
      const newUrl=new ShortUrl({original_url:originalUrl,short_url:urlCount+1});
      newUrl.save((err)=>{
        if(err) return handleError(err);
      });
      res.json({original_url:newUrl.original_url,short_url:newUrl.short_url});
    });
    
    /*const newShortUrl = new ShortUrl({ original_url: originalUrl, short_url: urlNumbers + 1 });
    res.json(newShortUrl);
    newShortUrl.save()
                .then((savedUrl)=>{
                  ShortUrl.find({original_url:originalUrl},"original_url short_url",(err,urlResult)=>{
                    if(err){
                      res.json({error:'invalid url'});
                      return;
                    }
                    Counter.find({name:'Number of urls'}).then((counterResult)=>{
                      counterResult.edit({sequence:counterResult.sequence+1}).save();
                      urlResult.edit({short_url:counterResult.sequence}).save();
                    }).catch((error)=>{
                      const newCounter=new Counter({name:'Number of urls',sequence:1});
                      newCounter.save().then((newCounterResult)=>{
                        urlResult.edit({short_url:1}).save();
                      }).catch((error)=>{
                        res.json({error:'booya'});
                        return;
                      });
                    })
                    res.json(urlResult);
                  });
                })
                .catch((error)=>{
                  res.json({error:'invalid url'});
                });*/
  });
});

app.get('/api/shorturl/:shorturl',function(req,res){
  const shortUrl=Number(req.params.shorturl);
  ShortUrl.find({short_url:shortUrl},"original_url short_url",(err,result)=>{
    if(err){
      res.json({error:'invalid url'});
      return;
    }
    res.json(result);
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
