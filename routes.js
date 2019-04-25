const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const db = require("./models");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/scrape", (req, res) => {
    axios.get("https://www.sounderatheart.com/").then(response => {
        const $ = cheerio.load(response.data);
        
        $(".c-entry-box--compact__body").each(function(i, element) {
            let result = {};

            result.title = $(this).children("h2").text();
            result.link = $(this).children("h2").find("a").attr("href");
            result.summary = $(this).children("p").text();

            db.Article.create(result)
            .catch(err => {
                console.log(err);
            });
        });
    });
});

router.get("/articles", (req, res) => {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    });
});

router.post("/article/:id", (req,res) => {
    db.Comment.create(req.body).then(comm => {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: comm._id }, { new: true });
    }).then(art => {
        res.json(art);
    }).catch(err => {
        res.json(err);
    });
});

router.get("/article/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id }).populate("comment")
    .then(art => {
        res.json(art);
    }).catch(err => {
        res.json(err);
    });
});

router.delete("/comment/:id", (req, res) => {
    db.Comment.deleteOne({ _id: req.params.id }).then(() => {
        console.log("comment deleted");
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;