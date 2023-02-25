const express = require("express");
const fetch = require("node-fetch");
const ytdl = require('ytdl-core');
require("dotenv").config();

const app = express()

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoUrl = req.body.videoUrl
    console.log(videoUrl);
    if(!videoUrl){
        return res.render("index", {success: false, message: "Please enter a valid video url"});
    }else{
        let videoId;
        try{
            videoId = ytdl.getVideoID(videoUrl);
        }catch(err){
            return res.render("index", {success: false, message: "Please enter a valid video url"});
        }

        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method": "GET",
            "headers": {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if(fetchResponse.status === "ok")
            return res.render("index", {success: true, song_title: fetchResponse.title, song_link: fetchResponse.link});
        
        else
            return res.render("index", {success: false, message: fetchResponse.msg})
    }
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})
