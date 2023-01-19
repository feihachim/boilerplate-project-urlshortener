require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const validator=require('validator');
const app = express();
const dns=require('dns');
// const Counter = require('./models/counter');
const ShortUrl = require('./models/shorturl');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
mongoose.set("strictQuery",false);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

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
  
    const url=new URL(originalUrl);
    if(url.origin!=="null"){
      const hostname=url.hostname;
    dns.lookup(hostname,(err,address)=>{
      if(err){
        console.log('erreur hote');
        res.json({error:'invalid url'});
        return;
      }
      ShortUrl.find()
              .then((result)=>{
                const urlCount=result.length;
                const newUrl=new ShortUrl({original_url:originalUrl,short_url:urlCount+1});
                newUrl.save(function(err,insertedUrl){
                  if(err){
                    res.json({error:'no new url'});
                  }
                  else{
                    res.json(insertedUrl);
                  }
                })
                /*newUrl.save((err)=>{
                  res.json({error:'pas nouveau'});
                  return;
                });
                res.json(newUrl);*/
              }).catch((error)=>{
                console.log('erreur liste url');
                res.json({error:'invalid url'});
              })
      
    });
    }else{
      console.log('origine inconnue');
      res.json({error:'invalid url'});
    }
  
  
});

app.get('/api/shorturl/:shorturl',function(req,res){
  const shortUrl=Number(req.params.shorturl);
  ShortUrl.find({short_url:shortUrl},function(err,urls){
    if(err){
      res.json(err);
    }
    else{
      res.redirect(urls[0].original_url);
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
