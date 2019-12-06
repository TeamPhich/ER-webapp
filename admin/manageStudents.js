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
var page=1;
var pageSize=10;
getRequest();
$(document).ready(async function(){

    //customize table
    table = $("#subTable").DataTable( {
        retrieve: true,
        "paging": false,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "columnDefs": [
            { "orderable": false, "targets": 'no-sort' }
        ],

        "columnDefs": [ {
            "targets": -1,
            "data": null,
            "defaultContent": "<i class='fa fa-edit'></i><i class='fa fa-trash-alt ml-2'></i>"
        },
            {
                "targets": 1,
                "visible": false
            }],
    } );

    //bat su kien nut xoa
    $('#subTable tbody').on( 'click', '.fa-trash-alt', function () {
    console.log($(this).parents('tr'));
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
    // $("#printButton").on("click",function(){
    //     newWin= window.open("");
    //     newWin.document.write($('#subTable')[0].outerHTML);
    //     $(newWin.document.getElementsByTagName("head")).append("<style>\n" +
    //         "table {\n" +
    //         "  font-family: arial, sans-serif;\n" +
    //         "  border-collapse: collapse;\n" +
    //         "  width: 100%;\n" +
    //         "}\n" +
    //         "\n" +
    //         "td, th {\n" +
    //         "  border: 1px solid #dddddd;\n" +
    //         "  text-align: left;\n" +
    //         "  padding: 8px;\n" +
    //         "}\n" +
    //         "\n" +
    //         "tr:nth-child(even) {\n" +
    //         "  background-color: #dddddd;\n" +
    //         "}\n" +
    //         "</style>");
    //     newWin.print();
    //     newWin.close();
    // })

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

    //paging
    $(".page-link").on("click",function () {
        page=$(this)[0].innerText;
        getRequest();
        $(".paginate_button").removeClass("active");
        $(this).parent().addClass("active");
    });
    $(".fa-angle-double-left").on("click",function () {
        if(page>1){
            let page_id = "page_"+page;
            $("#")
        }
    });
    $(".fa-angle-double-right").on("click",function () {

    });
    $('select[name="subTable_length"]').on("change",function () {
        pageSize=$(this)[0].value;
        getRequest();
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
    let url=("http://er-backend.sidz.tools/api/v1/students/?page="+page+"&pageSize="+pageSize);
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
        table.clear().draw();
        let data = res.data.students.rows;
        for (var i = 0; i < data.length; i++) {
            table.row.add([
                (page-1)*pageSize+i+1,
                data[i].id,
                data[i].user_name,
                data[i].fullname,
                convertTime(data[i].birthday),
                data[i].email
            ]).draw(false);
        }
        $("#subTable_info")[0].innerText="Hiển thị từ "+(1+(page-1)*pageSize)+" đến "+page*pageSize+" của "+res.data.students.count+" sinh viên.";
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




