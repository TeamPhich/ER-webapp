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
var ESpage=1;
var ESpageSize=10;
var ESkeywords="";
var exam;
var total_page;
var EStotal_page;
getExam();
var del_subjectClass_id;
var data_upd_subjectClass;
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
            'width':"1%", //auto fit
            "data": null,
            "defaultContent": "<div class='d-flex'><button class=\"btn btn-info\" id='editBtn'><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger ml-2\" id='deleteBtn'><i class=\"far fa-trash-alt\"></i></button></div>"
        },
            {
                "targets": 1,
                "visible": false
            },

            {
                "targets": 0,
                "width": "1%" //auto fit
            },
            {
                "targets": 4,
                "width": "9%" //auto fit
            },
            {
                "targets": "_all",
                className: 'align-middle'
            }],
    } );
    EStable = $("#ExamSubjectAddingTable").DataTable( {
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
            'width':"10%", //auto fit
            "data": null,
            "defaultContent": "<div class=\"custom-control custom-checkbox\">\n" +
                "    \n" +
                "      <input type=\"checkbox\" class=\"custom-control-input\" id=\"customCheck\" name=\"example1\">\n" +
                "      <label class=\"custom-control-label\" for=\"customCheck\"></label>\n" +
                "    </div>"
        },
            {
                "targets": 0,
                "width": "1%" //auto fit
            },
            {
                "targets": 4,
                "width": "9%" //auto fit
            },
            {
                "targets": "_all",
                className: 'align-middle'
            }],
    } );

    //bat su kien nut xoa
    $('#subTable tbody').on( 'click', '#deleteBtn', function () {
        $("#delModal").modal("show");
        curRow = $(this).parents('tr');
        std_info = table.row(curRow).data();
        del_subjectClass_id = std_info[1];
        $("#del_info")[0].innerText = std_info[3] +"-"+ std_info[2];
    } );

    //bat su kien nut edit
    $('#subTable tbody').on( 'click', '#editBtn', function () {
        $("#editModal").modal("show");
        curRow = $(this).parents('tr');
        editField = table.row(curRow).data();
        $("#inputMLHP").val(editField[2]);
        $("#inputLHP").val(editField[3]);
        $("#inputSTC").val(editField[4]);
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
        data_upd_subjectClass={
            "id": editField[1],
            "new_mssv":$("#inputMSSV")[0].value,
            "birthday": birthday,
            "fullname":$("#inputHoten")[0].value,
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
        page=1;
        getRequest();
    });
    $("#input_ExamSubject").on('input', function () {
        ESkeywords=$(this)[0].value;
        ESpage=1;
        getESRequest();
    });


    $("#subTable_previous").on("click",function () {
        if (page>1){
            page--;
            getRequest()
        }
    });
    $("#subTable_next").on("click",function () {
        if (page<total_page){
            page++;
            getRequest()
        }
    });
    $('select[name="subTable_length"]').on("change",function () {
        pageSize=$(this)[0].value;
        page=1;
        getRequest();
    });
    $("#ExamSubjectAddingTable_previous").on("click",function () {
        if (ESpage>1){
            ESpage--;
            getESRequest()
        }
    });
    $("#ExamSubjectAddingTable_next").on("click",function () {
        if (ESpage<EStotal_page){
            ESpage++;
            getESRequest()
        }
    });
    $('select[name="ExamSubjectAddingTable_length"]').on("change",function () {
        ESpageSize=$(this)[0].value;
        ESpage=1;
        getESRequest();
    });
    $("#inputHK").on("change",function () {
        exam =$("#inputHK")[0].value;
        getRequest();
    });
    $("#add_btn").on("click", function () {
        $("#addModal").modal("show");
        getESRequest();
    });
    $("#input_add").on('change', function () {

    })
});


async function postReq_addExamSub(sub_id){
    let url="http://er-backend.sidz.tools/api/v1/exam-subjects/exam/"+exam;
    let data={
        "subject_id": sub_id
    };
    const postResponse= await fetch(url,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'token': window.localStorage.token,
        },
        body: JSON.stringify(data)
    });
    let postRes=await postResponse.json();
    if (postRes["status"]==20){
        getRequest();
    }
    else{
        console.log(postRes["reason"]);
    }

}

async function getExam(){
    let url =("http://er-backend.sidz.tools/api/v1/exams/?page=-1");
    const getExamRes = await fetch(url, {
        method: 'GET',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getExamRes.json();
    let Examdata = res.data.exams;
    exam = +Examdata.rows[Examdata.count-1].id;
    for (let i=Examdata.count-1;i>=0;i--){
        let opt = "<option value='"+Examdata.rows[i].id+"'>"+Examdata.rows[i].name+"</option>";
        $('#inputHK').append(opt);
    }
    getRequest();
}



async function getRequest(){
    let url=("http://er-backend.sidz.tools/api/v1/exam-subjects/exam/"+ exam +"/?page="+ page+"&pageSize="+ pageSize+"&keywords="+keywords);
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
        let data = getRes.data.exam_subjects;

        for (var i = 0; i < data.rows.length; i++) {
            table.row.add([
                (page-1)*pageSize+i+1,
                data.rows[i].id,
                data.rows[i].subject_id,
                data.rows[i].subject.name,
                data.rows[i].subject.credit
            ]).draw(false);
        }
        total_page = data.count/pageSize;
        total_page = Math.ceil(+total_page);
        paging();

        if (data.rows.length!=0) {
            $("#subTable_info")[0].innerText = "Hiển thị từ " + (1 + (page - 1) * pageSize) + " đến " + ((page - 1) * pageSize + data.rows.length) + " của " + data.count + " môn thi.";
            $("#subTable_paginate").removeClass('d-none');
        }
        else {
            $("#subTable_info")[0].innerText = "";
            $("#subTable_paginate").addClass('d-none');
        }
    }
    else {
        console.log(getRes['reason']);
    }

}
async function getESRequest(){
    let url=("http://er-backend.sidz.tools/api/v1/subjects?page="+ ESpage+"&pageSize="+ ESpageSize+"&keywords="+ESkeywords);
    const getESResponse= await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let getESRes=await getESResponse.json();
    if(getESRes["status"]==20) {
        EStable.clear().draw();
        let data = getESRes.data.subjectsInformation;

        for (var i = 0; i < data.rows.length; i++) {
            EStable.row.add([
                (ESpage-1)*ESpageSize+i+1,
                data.rows[i].subject_id,
                data.rows[i].name,
                data.rows[i].credit
            ]).draw(false);
        }
        EStotal_page = data.count/ESpageSize;
        EStotal_page = Math.ceil(+EStotal_page);
        ESpaging();

        if (data.rows.length!=0) {
            $("#ExamSubjectAddingTable_info")[0].innerText = "Hiển thị từ " + (1 + (ESpage - 1) * ESpageSize) + " đến " + ((ESpage - 1) * ESpageSize + data.rows.length) + " của " + data.count + " môn thi.";
            $("#ExamSubjectAddingTable_paginate").removeClass('d-none');
        }
        else {
            $("#ExamSubjectAddingTable_info")[0].innerText = "";
            $("#ExamSubjectAddingTable_paginate").addClass('d-none');
        }
    }
    else {
        console.log(getESRes['reason']);
    }

}
async function delete_subjectClass() {
    let url="http://er-backend.sidz.tools/api/v1/subject-classes/"+del_subjectClass_id;
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
        console.log(delRes['reason']);
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
    let updRes = await updResponse.json();
    if (updRes['status'!=20]){
        console.log(updRes['reason']);
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
    let month =date.getMonth()+1;

    let convdataTime = day+'/'+month+'/'+year;
    return convdataTime;
}

//paging
function paging() {
    if (total_page==1){
        $("#page_a").parent().removeClass('d-none');
        $("#page_b").parent().removeClass('d-none');
        $("#page_c").parent().removeClass('d-none');
        $("#page_a")[0].innerText = 1;
        $("#page_b").parent().addClass('d-none');
        $("#page_c").parent().addClass('d-none');
    }
    if (total_page==2){
        $("#page_a").parent().removeClass('d-none');
        $("#page_b").parent().removeClass('d-none');
        $("#page_c").parent().removeClass('d-none');
        $("#page_a")[0].innerText = 1;
        $("#page_b")[0].innerText = 2;
        $("#page_c").parent().addClass('d-none');
    }
    if (total_page>2){
        $("#page_a").parent().removeClass('d-none');
        $("#page_b").parent().removeClass('d-none');
        $("#page_c").parent().removeClass('d-none');
    }
    if (total_page<1){
        $("#page_a").parent().addClass('d-none');
        $("#page_b").parent().addClass('d-none');
        $("#page_c").parent().addClass('d-none');
    }
    if (page==1){
        $("#page_a").parent().removeClass('active');
        $("#page_b").parent().removeClass('active');
        $("#page_c").parent().removeClass('active');
        $("#page_a").parent().addClass('active');
        $("#page_a")[0].innerText = 1;
        $("#page_b")[0].innerText = 2;
        $("#page_c")[0].innerText = 3;
    }
    else {
        if (page == total_page && total_page!=2) {
            $("#page_a").parent().removeClass('active');
            $("#page_b").parent().removeClass('active');
            $("#page_c").parent().removeClass('active');
            $("#page_c").parent().addClass('active');
            $("#page_a")[0].innerText = +page-2;
            $("#page_b")[0].innerText = +page-1;
            $("#page_c")[0].innerText = +page;
        }
        else {
            if (page == total_page &&total_page==2){
                $("#page_a").parent().removeClass('active');
                $("#page_b").parent().removeClass('active');
                $("#page_c").parent().removeClass('active');
                $("#page_b").parent().addClass('active');
                $("#page_a")[0].innerText = +page-1;
                $("#page_b")[0].innerText = +page;
                $("#page_c")[0].innerText = +page;
            }
            else {
                $("#page_a").parent().removeClass('active');
                $("#page_b").parent().removeClass('active');
                $("#page_c").parent().removeClass('active');
                $("#page_b").parent().addClass('active');
                $("#page_a")[0].innerText = +page - 1;
                $("#page_b")[0].innerText = +page;
                $("#page_c")[0].innerText = +page+1;
            }
        }
    }
}
function paging_click(page_id) {
    page=page_id;
    getRequest();
}
function ESpaging() {
    if (EStotal_page==1){
        $("#page_1").parent().removeClass('d-none');
        $("#page_2").parent().removeClass('d-none');
        $("#page_3").parent().removeClass('d-none');
        $("#page_1")[0].innerText = 1;
        $("#page_2").parent().addClass('d-none');
        $("#page_3").parent().addClass('d-none');
    }
    if (EStotal_page==2){
        $("#page_1").parent().removeClass('d-none');
        $("#page_2").parent().removeClass('d-none');
        $("#page_3").parent().removeClass('d-none');
        $("#page_1")[0].innerText = 1;
        $("#page_2")[0].innerText = 2;
        $("#page_3").parent().addClass('d-none');
    }
    if (EStotal_page>2){
        $("#page_1").parent().removeClass('d-none');
        $("#page_2").parent().removeClass('d-none');
        $("#page_3").parent().removeClass('d-none');
    }
    if (EStotal_page<1){
        $("#page_1").parent().addClass('d-none');
        $("#page_2").parent().addClass('d-none');
        $("#page_3").parent().addClass('d-none');
    }
    if (ESpage==1){
        $("#page_1").parent().removeClass('active');
        $("#page_2").parent().removeClass('active');
        $("#page_3").parent().removeClass('active');
        $("#page_1").parent().addClass('active');
        $("#page_1")[0].innerText = 1;
        $("#page_2")[0].innerText = 2;
        $("#page_3")[0].innerText = 3;
    }
    else {
        if (ESpage == EStotal_page && EStotal_page!=2) {
            $("#page_1").parent().removeClass('active');
            $("#page_2").parent().removeClass('active');
            $("#page_3").parent().removeClass('active');
            $("#page_3").parent().addClass('active');
            $("#page_1")[0].innerText = +ESpage-2;
            $("#page_2")[0].innerText = +ESpage-1;
            $("#page_3")[0].innerText = +ESpage;
        }
        else {
            if (ESpage == EStotal_page && EStotal_page==2){
                $("#page_1").parent().removeClass('active');
                $("#page_2").parent().removeClass('active');
                $("#page_3").parent().removeClass('active');
                $("#page_2").parent().addClass('active');
                $("#page_1")[0].innerText = + ESpage-1;
                $("#page_2")[0].innerText = + ESpage;
                $("#page_3")[0].innerText = + ESpage;
            }
            else {
                $("#page_1").parent().removeClass('active');
                $("#page_2").parent().removeClass('active');
                $("#page_3").parent().removeClass('active');
                $("#page_2").parent().addClass('active');
                $("#page_1")[0].innerText = + ESpage - 1;
                $("#page_2")[0].innerText = + ESpage;
                $("#page_3")[0].innerText = + ESpage+1;
            }
        }
    }
}
function ESpaging_click(page_id) {
    ESpage=page_id;
    getESRequest();
}




