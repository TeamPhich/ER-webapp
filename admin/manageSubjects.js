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
    //js add modal
    $(".fa-edit").on("click",function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#inputMaMon").val(editField[1].innerText);
        $("#inputTenMon").val(editField[2].innerText);
        $("#inputTc").val(editField[3].innerText);
    });

    //js confirm and close modal
    $("#confirmEditButton").on("click",function () {
        editField[1].innerText=$("#inputMaMon")[0].value;
        editField[2].innerText=$("#inputTenMon")[0].value;
        editField[3].innerText=$("#inputTc")[0].value;
        $("#editModal").modal("hide");
        //update to server here
    });

})