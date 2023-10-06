const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const app = express();
const episode = require("./models/episode");
const user = require("./models/user");

app.use(morgan('dev'));
app.use(express.json());

mongoose
  .connect("mongodb+srv://luke:qweasd@cluster0.rfltzrv.mongodb.net/?retryWrites=true&w=majority")
  .then((data) => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(`Failed to connect to MongoDB: ${err}`));

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.urlencoded({ extended: true }));

app.get("/ep-from-season/:theSeason", async (req, res) =>{
    const data = await episode.find({season:req.params.theSeason});
    data.sort((a, b) =>{
        return a.episode - b.episode;
    });
    const fin = [];
    data.forEach((i) =>{
        fin.push(i.episode);
    });
    res.json(fin);
});

app.post("/loging", async (req, res) => {
    const us = await user.findOne({username:req.body[0]});
    if (us === null){res.send(false);}
    else if (await bcrypt.compare(req.body[1], us.password)){res.send(true);}
    else{res.send(false);}
});

app.post("/specific-ep/:theSeason/:theEpisode", async (req, res) =>{
    const us = await user.findOne({username:req.body[0]});
    if (us === null){res.status(404);}
    else if (!(await bcrypt.compare(req.body[1], us.password))){ 
        res.status(404); res.send(false);
    }
    else{
        console.log;
        const data = await episode.find({season:req.params.theSeason, episode:req.params.theEpisode});
        res.json(data[0]);
    }
    
})

app.post("/test", async (req, res) =>{
    console.log(req.body);
    await episode.create(req.body);
    res.send("done");
});

module.exports = app;