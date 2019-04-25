$(document).ready(function() {

   
    const getArticles = () => {

        $.get("/articles", function(data) {
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                $("#article-list").append(`<p data-id=${data[i]._id}><a href=${data[i].link} target=_blank>${data[i].title}</a><br>${data[i].summary}</p>`);
            }
        });
    }

    $("#scrape-btn").on("click", event => {
        event.preventDefault();

        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(getArticles());

    });

    $(".modal").modal();

    $(document).on("click", "p", function() {
        let id = $(this).attr("data-id");
        console.log(id);
        
        $(".modal").modal("open");
        
        let commentId;
        $.get("/article/" + id, function(data) {
            console.log(data);
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
            }).then(function(res) {
                $("#comment-title").val("");
                $("#comment-body").val("");
                $(".modal").modal("close");
            });
        });

        $("#delete-comment").on("click", event => {
            console.log(commentId);
            event.preventDefault();
            $.ajax({
                method: "DELETE",
                url: "/comment/" + commentId,
            }).then(function(res) {
                $("#comment-title").val("");
                $("#comment-body").val("");
                $(".modal").modal("close");
            });
        });
    });

    $("#close-modal").on("click", function() {
        $("#comment-title").val("");
        $("#comment-body").val("");
        $(".modal").modal("close");
    });
});