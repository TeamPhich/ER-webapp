$(document).ready(function() {
    $("#add").click(function () {
        $("#subTable  > tbody")
            .append($('<tr>')
                .append($('<td>')
                    .addClass("p-0 align-middle")
                )
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
                    .addClass("p-0 align-middle")
                    .append($('<input>')
                        .attr("type", "file")
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
