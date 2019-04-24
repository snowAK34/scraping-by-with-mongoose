$(document).ready(function() {

const getArticles = () => {
    
    $.get("/articles", function(data) {
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            $("#article-list").append(`<p><a href=${data[i].link} target=_blank>${data[i].title}</a><br>${data[i].summary}</p>`);
        }
    });
}

// scrape from a news site and save to database
    $("#scrape-btn").on("click", event => {
        event.preventDefault();
        
        $.get("/scrape", getArticles());
    });

// read articles from db and display to user headline, summary, and link


// display comment for specific article


// save comment for specific article


// delete comment for specific article


});