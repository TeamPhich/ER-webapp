$(document).ready(function() {
    $("#add").click(function () {
        $("#subTable  > tbody")
            .append($('<tr>')
                .append($('<td>')
                    .addClass("p-0")
                    .append($('<input>')
                        .attr("type", "text")
                        .attr("id","autofocus")
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
                    .text("Show")
                )
            )
            )
        $("#autofocus").focus();
    })
    $("#delete").click(function () {
        let x=document.querySelectorAll("tbody > tr");
        $(x[x.length-1]).remove();
        $("#autofocus").focus();
    })
    })
