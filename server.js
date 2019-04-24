const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
    res.render("index");
})

app.get("/scrape", function(req, res) {
    axios.get("https://www.sounderatheart.com/").then(function(response) {
        const $ = cheerio.load(response.data);
        
        $(".c-entry-box--compact__body").each(function(i, element) {
            let result = {};

            result.title = $(this).children("h2").text();
            result.link = $(this).children("h2").find("a").attr("href");
            result.summary = $(this).children("p").text();

            db.Article.create(result).then(function(dbArticle) {
                console.log(db.Article);
            }).catch(function(err) {
                console.log(err);
            });
        });
        console.log("Scrape complete");
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});


app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});