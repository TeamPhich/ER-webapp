document.getElementById("autofocus").focus();
$(document).ready(function() {
    $("#add").click(function () {

        $("#subTable  > tbody")
            .append($('<tr>')
                .append($('<td>')
                    .addClass("p-0")
                )
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
<<<<<<< HEAD
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
=======
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
>>>>>>> d930224b8eeeffdca4be5d8899296cdf23ea9c4c
