if (typeof(Storage) !== "undefined") {
    if (localStorage.token==null) {
        window.location = "../account/login.html";
    }
} else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
}
function removeToken() {
    window.localStorage.removeItem('token');
}
$(document).ready(function() {
    //js show add modal
    $("#addButton").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",function () {
        $("#subTable").find("tbody")
            .append($('<tr>')
                .append($('<td>'))
                .append($('<td>')
                    .text($("#inputMaMon").val())
                )
                .append($('<td>')
                    .text($("#inputTenMon").val())
                )
                .append($('<td>')
                    .text($("#inputTc").val())
                )
                .append($('<td>')
                    .append($('<i>')
                        .addClass("clickable far fa-edit")
                    )
                    .append($('<i>')
                        .addClass("clickable far fa-trash-alt ml-2")
                    )
                )

            );
        $("#addModal").modal("hide");
    });
    //js delete row
    $(".fa-trash-alt").on("click", function () {
        $(this).parent().parent().toggle();
        //update to server here
    });

    //customize table
    table = $("#subTable").DataTable({
        retrieve: true,
        "columnDefs": [
            {"orderable": false, "targets": 'no-sort'}
        ],
        order: [[1, 'asc']],
        language: {
            paginate: {
                next: '<i class="fas fa-angle-double-right"></i>',
                previous: '<i class="fas fa-angle-double-left"></i>'
            }
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

    });
    //js show edit modal
    $(".fa-edit").on("click",function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#editMaMon").val(editField[1].innerText);
        $("#editTenMon").val(editField[2].innerText);
        $("#editTc").val(editField[3].innerText);
    });

    //js confirm and close modal
    $("#confirmEditButton").on("click",function () {
        editField[1].innerText=$("#editMaMon")[0].value;
        editField[2].innerText=$("#editTenMon")[0].value;
        editField[3].innerText=$("#editTc")[0].value;
        $("#editModal").modal("hide");
        //update to server here
    });

})