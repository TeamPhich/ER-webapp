//dang xuat khi token het han
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
//
var editField;
$(document).ready(async function(){
    getRequest();
    //customize table
    table = $("#subTable").DataTable( {
        retrieve: true,
        "columnDefs": [
            { "orderable": false, "targets": 'no-sort' }
        ],
        "columnDefs": [ {
            "targets": -1,
            "data": null,
            "defaultContent": "<i class='fa fa-edit'></i><i class='fa fa-trash-alt ml-2'></i>"
        } ],
        order: [[1, 'asc']],
        language: {
            paginate: {
                next: '<i class="fas fa-angle-double-right"></i>',
                previous: '<i class="fas fa-angle-double-left"></i>'
            }
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

    } );

    //bat su kien nut xoa
    $('#subTable tbody').on( 'click', '.fa-trash-alt', function () {
        table
            .row( $(this).parents('tr') )
            .remove()
            .draw();
    } );

    //bat su kien nut edit
    $('#subTable tbody').on( 'click', '.fa-edit', function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#inputMSSV").val(editField[1].innerText);
        $("#inputHoten").val(editField[2].innerText);
        $("#inputNgaysinh").val(editField[3].innerText);
        $("#inputEmail").val(editField[4].innerText);
    } );

    //js print
    $("#printButton").on("click",function(){
        newWin= window.open("");
        newWin.document.write($('#subTable')[0].outerHTML);
        newWin.print();
        newWin.close();
    })

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

    $("#confirmImportModal").on("click",function () {
        postReq_import(document.getElementById("customFile").files[0]);
    });
});

async function postReq_import(file){
    let url="http://er-backend.sidz.tools/api/v1/students/";
    let data=new FormData();
    data.append("students",file);
    const response= await fetch(url,{
        method: 'POST',
        headers: {
            'token': window.localStorage.token,
        },
        body: data
    });
    let res=await response.json();
    if (res["status"]==20){
        $("#importModal").modal("hide");
        getRequest();
    }
    else{
        $("#importModal").modal("hide");
        window.alert(res["reason"]);
    }

}


async function getRequest(){
    let url="http://er-backend.sidz.tools/api/v1/students/";
    const getResponse= await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getResponse.json();
    if(res["status"]==20) {
        var para = document.createElement("p");
        var node = document.createTextNode("This is new.");
        para.appendChild(node);
        table.clear().draw();
        for (var i = 0; i < res.data.students.length; i++) {
            table.row.add([
                "",
                res.data.students[i].user_name,
                res.data.students[i].fullname,
                convertTime(res.data.students[i].birthday),
                res.data.students[i].email,
                ""
            ]).draw(false);
        }
    }

}

function convertTime(unixtimestamp){
    // Convert timestamp to milliseconds
    let date = new Date(unixtimestamp*1000);
    // Year
    let year = date.getFullYear();
    // Day
    let day = date.getDate();
    // Month
    let month =date.getMonth();

    let convdataTime = day+'/'+month+'/'+year;
    return convdataTime;

}




