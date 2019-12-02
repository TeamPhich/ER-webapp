
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
    $('#subTable tbody').on( 'click', '.fa-trash-alt', function () {
        table
            .row( $(this).parents('tr') )
            .remove()
            .draw();
    } );
    //js print
    $("#printButton").on("click",function(){
        newWin= window.open("");
        console.log($('#subTable'));
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
        $("#inputNgaysinh").val(editField[3].innerText);
        $("#inputEmail").val(editField[4].innerText);
    });

    //js confirm and close modal
    $("#confirmEditButton").on("click",function () {
        editField[1].innerText=$("#inputMSSV")[0].value;
        editField[2].innerText=$("#inputHoten")[0].value;
        editField[3].innerText=$("#inputNgaysinh")[0].value;
        editField[4].innerText=$("#inputEmail")[0].value;

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




