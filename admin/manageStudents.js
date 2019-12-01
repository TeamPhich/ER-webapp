
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
var editField;
$(document).ready(function(){
    //js delete row
    $(".fa-trash-alt").on("click", function() {
            $(this).parent().parent().toggle();
            //update to server here
    });

    //customize table
    table = $("#subTable").DataTable( {
        retrieve: true,
        "columnDefs": [
            { "orderable": false, "targets": 'no-sort' }
        ],
        order: [[1, 'asc']],
        language: {
            paginate: {
                next: '<i class="fas fa-angle-double-right"></i>',
                previous: '<i class="fas fa-angle-double-left"></i>'
            }
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

    } );
    //js print
    $("#printButton").on("click",function(){
        newWin= window.open("");
        newWin.document.write($('#subTable')[0].outerHTML);
        newWin.print();
        newWin.close();
    })
    //js add modal
    $(".fa-edit").on("click",function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#inputMSSV").val(editField[1].innerText);
        $("#inputHoten").val(editField[2].innerText);
        $("#inputLop").val(editField[3].innerText);
        $("#inputNgaysinh").val(editField[4].innerText);
        $("#inputTentaikhoan").val(editField[5].innerText);
        $("#inputMatkhau").val(editField[6].innerText);
    });

    //js confirm and close modal
    $("#confirmEditButton").on("click",function () {
        editField[1].innerText=$("#inputMSSV")[0].value;
        editField[2].innerText=$("#inputHoten")[0].value;
        editField[3].innerText=$("#inputLop")[0].value;
        editField[4].innerText=$("#inputNgaysinh")[0].value;
        editField[5].innerText=$("#inputTentaikhoan")[0].value;
        editField[6].innerText=$("#inputMatkhau")[0].value;
        $("#modalEdit").modal("hide");
        //update to server here
    });

    //js import and comfirm
    $("#importButton").on("click", function () {
        $("#importModal").modal("show");
    });
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    //js auto increment

});




