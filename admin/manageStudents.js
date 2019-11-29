//js delete row
$(document).ready(function(){
    $(".fa-trash-alt").on("click", function() {
            console.log($(this).parent().parent().toggle());
            //update to server here
    });
    $("#subTable").dataTable( {
        "columnDefs": [
            { "orderable": false, "targets": 'no-sort' }
        ],
        order: [[1, 'asc']]
    } );
});

//no-sort col

//js add modal
var editField;
function addModel(v) {
    $("#modalEdit").modal("show");
    editField=$(v).parent().parent().children();
    $("#inputMSSV").val(editField[1].innerText);
    $("#inputHoten").val(editField[2].innerText);
    $("#inputLop").val(editField[3].innerText);
    $("#inputNgaysinh").val(editField[4].innerText);
    $("#inputTentaikhoan").val(editField[5].innerText);
    $("#inputMatkhau").val(editField[6].innerText);
}
//js confirm and close modal
function confirmEdit(v) {
    editField[1].innerText=$("#inputMSSV")[0].value;
    editField[2].innerText=$("#inputHoten")[0].value;
    editField[3].innerText=$("#inputLop")[0].value;
    editField[4].innerText=$("#inputNgaysinh")[0].value;
    editField[5].innerText=$("#inputTentaikhoan")[0].value;
    editField[6].innerText=$("#inputMatkhau")[0].value;
    $("#modalEdit").modal("hide");
    //update to server here
}


