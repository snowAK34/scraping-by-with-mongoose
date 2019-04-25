const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const db = require("./models");

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/scrape", function(req, res) {
    axios.get("https://www.sounderatheart.com/").then(function(response) {
        const $ = cheerio.load(response.data);
        
        $(".c-entry-box--compact__body").each(function(i, element) {
            let result = {};

            result.title = $(this).children("h2").text();
            result.link = $(this).children("h2").find("a").attr("href");
            result.summary = $(this).children("p").text();

            db.Article.create(result).then(function(dbArticle) {
                console.log("Scrape complete");
            }).catch(function(err) {
                console.log(err);
            });
        });
    });
});

router.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

router.post("/article/:id", function(req,res) {
    db.Comment.create(req.body).then(function(comm) {
        console.log("body: ", req.body, "; comm: ", comm)
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: comm._id }, { new: true });
    }).then(function(art) {
        res.json(art);
    }).catch(function(err) {
        res.json(err);
    });
});

router.get("/article/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("comment")
    .then(function(art) {
        res.json(art);
    }).catch(function(err) {
        res.json(err);
    });
});

router.delete("/comment/:id", function(req, res) {
    db.Comment.deleteOne({ _id: req.params.id }).then(function() {
        console.log("comment deleted");
    }).catch(function(err) {
        res.json(err);
    });
});

module.exports = router;