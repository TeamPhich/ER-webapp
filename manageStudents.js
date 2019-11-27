//js filter
$(document).ready(function(){
    $("#myInput-mssv").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".mssv").filter(function() {
            $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$(document).ready(function(){
    $("#myInput-hoten").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".hoten").filter(function() {
            $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$(document).ready(function(){
    $("#myInput-ngaysinh").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".ngaysinh").filter(function() {
            $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$(document).ready(function(){
    $("#myInput-tentaikhoan").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".tentaikhoan").filter(function() {
            $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$(document).ready(function(){
    $("#myInput-matkhau").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".matkhau").filter(function() {
            $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$(document).ready(function(){
    $("#myInput-lop").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".lop").filter(function() {
            $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

//js add modal
function modelAdd(t) {
    $("#addModal").modal("show");
    var temp=$(t).parent().parent().children();
    $("#inputMSSV").val(temp[1].innerText);
    $("#inputHoten").val(temp[2].innerText);
    $("#inputLop").val(temp[3].innerText);
    $("#inputNgaysinh").val(temp[4].innerText);
    $("#inputTentaikhoan").val(temp[5].innerText);
    $("#inputMatkhau").val(temp[6].innerText);
}
