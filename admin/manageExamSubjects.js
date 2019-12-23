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
var total_page;
var exam_subject_id;
var exam_subject;

var ESpage=1;
var ESpageSize=5;
var ESkeywords="";
var EStotal_page;
var sub_id;

var Vpage=1;
var VpageSize=10;
var Vkeywords="";
var Vtotal_page;

var exam;




var del_examSubject_id;
var addedSub =[];
$(document).ready(async function(){

            await getProfile();
    //customize table
    table = $("#subTable").DataTable( {
        retrieve: true,
        "paging": false,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "autoWidth": false,
        "language": {
            "emptyTable": "Loading..."
        },

        "columnDefs": [ {
            "targets": -1,
            'width':"1%", //auto fit
            "data": null,
            "defaultContent": "<div class='d-flex'><button style='width: 40px' class=\"btn btn-info\" id='importStdBtn'><i class=\"fas fa-clipboard-list\"></i></button><button style='width: 40px' class=\"btn btn-danger ml-2\" id='deleteBtn'><i class=\"far fa-trash-alt\"></i></button></div>"
        },
            {
                "targets": 5,
                'width':"1%", //auto fit
                "data": null,
                "defaultContent": "<div class='d-flex'><button style='width: 45px' class=\"btn btn-secondary\" id='viewStdBtn'><i class=\"far fa-eye\"></i></button></div>"
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
                "width": "10%" //auto fit
            },
            {
                "targets": -1,
                "width": "15%" //auto fit
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
        "autoWidth": false,

        "info": false,
        "language": {
            "emptyTable": "Loading..."
        },


        "columnDefs": [ {
            "targets": 0,
            'width':"7%", //auto fit
            "data": null,
            "defaultContent": "<input type='checkbox'>"
        },
            {
                "targets": 1,
                "width": "1%" //auto fit
            },
            {
                "targets": 4,
                "width": "15%" //auto fit
            },
            {
                "targets": "_all",
                className: 'align-middle'
            }],
    } );
    Vtable = $("#viewTable").DataTable( {
        retrieve: true,
        "paging": false,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "autoWidth": false,
        "language": {
            "emptyTable": "Loading..."
        },

        "columnDefs": [
            {
                "targets": "_all",
                className: 'align-middle'
            },{
                "targets": 4,
                'width':"20%", //auto fit
            }],
    } );

    getExam();
    //bat su kien nut xoa
    $('#subTable tbody').on( 'click', '#deleteBtn', function () {
        $("#delModal").modal("show");
        curRow = $(this).parents('tr');
        examSubject_info = table.row(curRow).data();
        del_examSubject_id = examSubject_info[1];
        $("#del_info")[0].innerText = examSubject_info[3] +"-"+ examSubject_info[2];
    } );


    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    //bat su kien nut add moon
    $('#subTable tbody').on( 'click', '#importStdBtn', function () {
        $("#importStdModal").modal("show");
        curRow = $(this).parents('tr');
        exam_subject_id = table.row(curRow).data()[1];
    } );
    $('#subTable tbody').on( 'click', '#viewStdBtn', function () {
        curRow = $(this).parent().parent();
        exam_subject_id = table.row(curRow).data()[1];
        exam_subject = table.row(curRow).data()[2]+"-"+table.row(curRow).data()[3];
        $('#header_name')[0].innerText="Quản lý sinh viên môn "+exam_subject;
        $("#viewModal").modal("show");
        getStd();
    } );

    $("#confirmImportModal").on("click",function () {
        postReq_import(document.getElementById("customFile").files[0]);
        $("#importStdModal").modal("hide");
    });


    //searching
    $("#input_search").on('input', function () {
        keywords=$(this)[0].value;
        page=1;
        getRequest();
    });
    $("#input_ExamSubject").on('input', function () {
        ESkeywords=$(this)[0].value;getESRequest
        ESpage=1;
        getESRequest();
    });
    $("#input_viewTable_keywords").on('input', function () {
        Vkeywords=$(this)[0].value;
        Vpage=1;
        getStd();
    });

    //paging
    //subTable
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

    //exam subject table
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

    //view table
    $("#viewTable_previous").on("click",function () {
        if (Vpage>1){
            Vpage--;
            getStd()
        }
    });
    $("#viewTable_next").on("click",function () {
        if (Vpage<Vtotal_page){
            Vpage++;
            getStd()
        }
    });
    $('select[name="viewTable_length"]').on("change",function () {
        VpageSize=$(this)[0].value;
        Vpage=1;
        getStd();
    });

    //xu ly học kỳ
    $("#inputHK").on("change",function () {
        exam =$("#inputHK")[0].value;
        getRequest();
    });

    //thêm môn vào kỳ thi
    $("#add_btn").on("click", function () {
        $("#addModal").modal("show");
        subQueue=[];
        getESRequest();
    });

    $('#ExamSubjectAddingTable tbody').on( 'change', ':checkbox', function () {
       curRow = $(this).parent().parent();
       sub_id = EStable.row(curRow).data()[2];
       addOrRemoveSub(sub_id);
    } );
    $('#ExamSubjectAddingTable input[type="checkbox"]').click(function() {
        console.log('suggested-in-comment', 'click');
    });

});


async function postReq_addExamSub(){
    let url="http://er-backend.sidz.tools/api/v1/exam-subjects/exam/"+exam;
    let data={
        "subjects": subQueue
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
        window.alert("Thành công");
        getRequest();
    }
    else
        window.alert(postRes["reason"]);

}

async function postReq_import(file){
    let url="http://er-backend.sidz.tools/api/v1/exam-subjects/"+exam_subject_id+"/students";
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
        window.alert("Thành công");
        getRequest();
    }
    else{
        $("#importModal").modal("hide");
        window.alert(postRes['reason']);
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
            addedSub.push(data.rows[i].subject_id);
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
            $('#subTable .dataTables_empty')[0].innerText = "Không có môn thi nào!";
        }
    }
    else {
        console.log(getRes['reason']);
        $('#subTable .dataTables_empty')[0].innerText = "Không có môn thi nào!";
    }

}
async function getESRequest(){
    let url=("http://er-backend.sidz.tools/api/v1/exam-subjects/exam/"+exam+"/subjects?page="+ ESpage+"&pageSize="+ ESpageSize+"&keywords="+ESkeywords);
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
            {
                currentRow = EStable.row;
                currentRow.add([,
                    (ESpage-1)*ESpageSize+i+1,
                    data.rows[i].subject_id,
                    data.rows[i].name,
                    data.rows[i].credit
                ]).draw(false);
                if (data.rows[i].exam_subjects==true){
                    EStable.rows( i )
                        .nodes()
                        .to$()
                        .addClass( 'unavailable' );
                    EStable.rows( i)
                        .nodes()
                        .to$()
                        .children().children().prop({"checked":true,'disabled':true});
                }
            }
        }

        EStotal_page = data.count/ESpageSize;
        EStotal_page = Math.ceil(+EStotal_page);
        ESpaging();
        if (data.rows.length!=0) {
            $("#ExamSubjectAddingTable_info")[0].innerText = "Hiển thị từ " + (1 + (ESpage - 1) * ESpageSize) + " đến " + ((ESpage - 1) * ESpageSize + data.rows.length) + " của " + (data.count) + " môn thi.";
            $("#ExamSubjectAddingTable_paginate").removeClass('d-none');
        }
        else {
            $("#ExamSubjectAddingTable_info")[0].innerText = "";
            $("#ExamSubjectAddingTable_paginate").addClass('d-none');
            $('#ExamSubjectAddingTable .dataTables_empty')[0].innerText = "Không có môn thi nào!";
        }
    }
    else {
        console.log(getESRes['reason']);
        $('#ExamSubjectAddingTable .dataTables_empty')[0].innerText = "Không có môn thi nào!";
    }

}

async function getStd(){
    let url=("http://er-backend.sidz.tools/api/v1/exam-subjects/"+exam_subject_id+"/students?page="+Vpage+"&pageSize="+VpageSize+"&keywords="+Vkeywords);
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
        Vtable.clear().draw();
        let data = getRes.data.studentsExamSubject;

        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows[i].enoughCondition)
                cond = "Đủ điều kiện dự thi"
            else
                cond = "Không đủ điều kiện dự thi"
            Vtable.row.add([
                (Vpage-1)*VpageSize+i+1,
                data.rows[i].account.user_name,
                data.rows[i].account.fullname,
                convertTime(data.rows[i].account.birthday),
                cond,
            ]).draw(false);
        }
        Vtotal_page = data.count/VpageSize;
        Vtotal_page = Math.ceil(+Vtotal_page);
        Vpaging();
        if (data.rows.length!=0) {
            $("#viewTable_info")[0].innerText = "Hiển thị từ " + (1 + (Vpage - 1) * VpageSize) + " đến " + ((Vpage - 1) * VpageSize + data.rows.length) + " của " + data.count + " sinh viên.";
            $("#viewTable_paginate").removeClass('d-none');
        }
        else {
            $("#viewTable_info")[0].innerText = "";
            $("#viewTable_paginate").addClass('d-none');
            $('#viewTable .dataTables_empty')[0].innerText = "Không có sinh viên!";
        }
    }
    else {
        console.log(getRes['reason']);
        $('#viewTable .dataTables_empty')[0].innerText = "Không có sinh viên!";
    }

}

async function delete_examSubject() {
    let url="http://er-backend.sidz.tools/api/v1/exam-subjects/"+del_examSubject_id;
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
    if (delRes['status']==20){
        window.alert("Thành công");
    }
    else
        window.alert(delRes['reason']);
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
                $("#page_y")[0].innerText = + ESpage;
                $("#page_3")[0].innerText = + ESpage+1;
            }
        }
    }
}

function ESpaging_click(page_id) {
    ESpage=page_id;
    getESRequest();
}
function Vpaging() {
    if (Vtotal_page==1){
        $("#page_x").parent().removeClass('d-none');
        $("#page_y").parent().removeClass('d-none');
        $("#page_z").parent().removeClass('d-none');
        $("#page_x")[0].innerText = 1;
        $("#page_y").parent().addClass('d-none');
        $("#page_z").parent().addClass('d-none');
    }
    if (Vtotal_page==2){
        $("#page_x").parent().removeClass('d-none');
        $("#page_y").parent().removeClass('d-none');
        $("#page_z").parent().removeClass('d-none');
        $("#page_x")[0].innerText = 1;
        $("#page_y")[0].innerText = 2;
        $("#page_z").parent().addClass('d-none');
    }
    if (Vtotal_page>2){
        $("#page_x").parent().removeClass('d-none');
        $("#page_y").parent().removeClass('d-none');
        $("#page_z").parent().removeClass('d-none');
    }
    if (Vtotal_page<1){
        $("#page_x").parent().addClass('d-none');
        $("#page_y").parent().addClass('d-none');
        $("#page_z").parent().addClass('d-none');
    }
    if (Vpage==1){
        $("#page_x").parent().removeClass('active');
        $("#page_y").parent().removeClass('active');
        $("#page_z").parent().removeClass('active');
        $("#page_x").parent().addClass('active');
        $("#page_x")[0].innerText = 1;
        $("#page_y")[0].innerText = 2;
        $("#page_z")[0].innerText = 3;
    }
    else {
        if (Vpage == Vtotal_page && Vtotal_page!=2) {
            $("#page_x").parent().removeClass('active');
            $("#page_y").parent().removeClass('active');
            $("#page_z").parent().removeClass('active');
            $("#page_z").parent().addClass('active');
            $("#page_x")[0].innerText = +ESpage-2;
            $("#page_y")[0].innerText = +ESpage-1;
            $("#page_z")[0].innerText = +ESpage;
        }
        else {
            if (Vpage == Vtotal_page && Vtotal_page==2){
                $("#page_x").parent().removeClass('active');
                $("#page_y").parent().removeClass('active');
                $("#page_z").parent().removeClass('active');
                $("#page_y").parent().addClass('active');
                $("#page_x")[0].innerText = + Vpage-1;
                $("#page_y")[0].innerText = + Vpage;
                $("#page_z")[0].innerText = + Vpage;
            }
            else {
                $("#page_x").parent().removeClass('active');
                $("#page_y").parent().removeClass('active');
                $("#page_z").parent().removeClass('active');
                $("#page_y").parent().addClass('active');
                $("#page_x")[0].innerText = + Vpage - 1;
                $("#page_y")[0].innerText = + Vpage;
                $("#page_z")[0].innerText = + Vpage+1;
            }
        }
    }
}
function Vpaging_click(page_id) {
    Vpage=page_id;
    getSTd();
}
var subQueue=[];
function addOrRemoveSub(sub_id) {
    if (jQuery.inArray(sub_id,subQueue)==-1){
        subQueue.push(sub_id);
    }
    else {
        for (var i=0;i<subQueue.length;i++){
            if(subQueue[i]==sub_id){
                subQueue.splice(i,1);
                break;
            }
        }
    }

}
async function getProfile() {
    let url=("http://er-backend.sidz.tools/api/v1/accounts/profile");
    const response = await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res = await response.json();
    console.log(res['data']['fullname']+"-"+"["+res['data']['user_name']+"]");
    console.log($("#profile")[0])
    if(res['status']==20){
        document.getElementById("profile").innerHTML=res['data']['fullname']+"-"+"["+res['data']['user_name']+"]"
    }
}




