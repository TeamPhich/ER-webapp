document.getElementById("autofocus").focus();
$(document).ready(function() {
    $("#add").click(function () {

        $("#subTable  > tbody")
            .append($('<tr>')
                .append($('<td>')
                    .addClass("p-0")
                    .append($('<input>')
                        .attr("type", "text")
                        .attr("id", "autofocus")
                    )
                )
                .append($('<td>')
                    .addClass("p-0")
                    .append($('<input>')
                        .attr("type", "text")
                    )
                )
                .append($('<td>')
                    .addClass("p-0")
                    .append($('<input>')
                        .attr("type", "text")
                    )
                )
                .append($('<td>')
                    .addClass("p-0")
                    .append($('<button>')
                        .addClass("btn btn-secondary m-auto")
                        .attr("type", "button")
                        .text("Import")
                        .attr('id', 'show')
                    )
                )
            )

        $('#autofocus').focus();
    })
})
    function modelAdd() {
        $("#addModal").modal("show");
    }
