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
    window.localStorage.removeItem('isAdmin');
   window.location="../account/login.html";
}
//
var editField;
var page=1;
var pageSize=10;
var keywords="";
getRequest();
var del_std_id;
var data_upd_std;
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
        $("#delModal").modal("show");
        curRow = $(this).parents('tr');
        std_info = table.row(curRow).data();
        del_std_id = std_info[1];
        $("#del_info")[0].innerText = std_info[3] +"-"+ std_info[2];
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
        data_upd_std={
            "new_mssv":$("#inputMSSV")[0].value,
            "birthday":$("#inputNgaysinh")[0].value,
            "fullname":$("#inputHoten")[0].value,
            "email": $("#inputEmail")[0].value
        };
        updateStd();
        $("#editModal").modal("hide");
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

    //searching
    $("#input_search").on('input', function () {
        keywords=$(this)[0].value;
        getRequest();
    })

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
    const postResponse= await fetch(url,{
        method: 'POST',
        headers: {
            'token': window.localStorage.token,
        },
        body: data
    });
    let postRes=await postResponse.json();
    if (postRes["status"]==20){
        $("#importModal").modal("hide");
        getRequest();
    }
    else{
        $("#importModal").modal("hide");
        window.alert(postRes["reason"]);
    }

}


async function getRequest(){
    let url=("http://er-backend.sidz.tools/api/v1/students/?page="+page+"&pageSize="+pageSize+"&keywords="+keywords);
    const getResponse= await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let getRes=await getResponse.json();
    if(getRes["status"]==20) {
        table.clear().draw();
        let data = getRes.data.students;
        for (var i = 0; i < data.rows.length; i++) {
            table.row.add([
                (page-1)*pageSize+i+1,
                data.rows[i].id,
                data.rows[i].user_name,
                data.rows[i].fullname,
                convertTime(data.rows[i].birthday),
                data.rows[i].email
            ]).draw(false);
        }

        //paging
        $("#subTable_info")[0].innerText="Hiển thị từ "+(1+(page-1)*pageSize)+" đến "+((page-1)*pageSize+data.rows.length)+" của "+data.count+" sinh viên.";
    }
    else {
        window.alert(getRes['reason']);
    }

}

async function deleteStd() {
    let url="http://er-backend.sidz.tools/api/v1/students/"+del_std_id;
    const delResponse= await fetch(url,{
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let delRes = await delResponse.json();
    if (delRes['status'!=20]){
        window.alert(delRes['reason']);
    }
    getRequest();
}

async function updateStd() {
    let url="http://er-backend.sidz.tools/api/v1/students/";
    const updResponse= await fetch(url,{
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_upd_std)
    });
    let updRes = updResponse.json();
    if (updRes['status'!=20]){
        window.alert(updRes['reason']);
    }
    getRequest();
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
 function paging(page_id) {

 }




