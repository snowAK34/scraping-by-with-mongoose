$(document).ready(() => {
   
    $("#scrape-complete").modal();
    $("#comment-modal").modal();

    // run scraper on button click
    $("#scrape-btn").on("click", event => {
        event.preventDefault();
        
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(
            $("#scrape-complete").modal("open")
        );
    });

    // click button to populate article list from database
    $("#show-articles").on("click", function(event) {
        event.preventDefault();
        $.get("/articles", data => {
            for (let i = 0; i < data.length; i++) {
                $("#article-list").prepend(`<p data-id=${data[i]._id}><a href=${data[i].link} target=_blank>${data[i].title}</a><br>${data[i].summary}</p>`);
            }
        });
        $("body").addClass("hide-bg");
    });

    // opens the comment modal when p tag is clicked to view, save, or delete comment
    $(document).on("click", "p", function() {
        let id = $(this).attr("data-id");
        
        $("#comment-modal").modal("open");
        
        let commentId;
        $.get("/article/" + id, data => {
            if (data.comment) {
                $("#comment-title").val(data.comment.title);
                $("#comment-body").val(data.comment.body);
                commentId = data.comment._id;
            }
        });

        $("#save-comment").on("click", event => {
            event.preventDefault();
            $.ajax({
                method: "POST",
                url: "/article/" + id,
                data: {
                    title: $("#comment-title").val(),
                    body: $("#comment-body").val()
                }
            }).then(() => {
                $("#comment-title").val("");
                $("#comment-body").val("");
                $("#comment-modal").modal("close");
            });
        });

        $("#delete-comment").on("click", event => {
            event.preventDefault();
            $.ajax({
                method: "DELETE",
                url: "/comment/" + commentId,
            }).then(() => {
                $("#comment-title").val("");
                $("#comment-body").val("");
                $("#comment-modal").modal("close");
            });
        });
    });

    $("#close-modal").on("click", () => {
        $("#comment-title").val("");
        $("#comment-body").val("");
        $("#comment-modal").modal("close");
    });
});