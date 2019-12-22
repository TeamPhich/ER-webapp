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
var page=1;
var pageSize=10;
var length;
var pageNumber;
var pageNumberSub;
var keywords="";
var pageSub;
var pageSizeSub=10;
var exam;
$(document).ready(async function() {
    //js load data subject
    await getExam();
    await getShifts();
    getPageNumber();
    //js show add modal
    $("#addButton").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let date=$("#inputNgay")[0].value;
        let start=$("#inputBatDau")[0].value;
        let finish=$("#inputKetThuc")[0].value;
        date=(date.toString()).split("-");
        start=(start.toString()).split(":");
        finish=(finish.toString()).split(":");
        console.log(date);
        let start_time=new Date(date[0],date[1]-1, date[2],start[0],start[1]).getTime()/1000;
        let finish_time=new Date(date[0],date[1]-1, date[2],finish[0],finish[1]).getTime()/1000;
        console.log(start_time)
        let urlCreate="http://er-backend.sidz.tools/api/v1/shifts/exam/"+exam;
        let dataCreate={
            "start_time": start_time,
            "finish_time":finish_time
        }
        const resCreate= await fetch(urlCreate,{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'token': window.localStorage.token
            },
            body:JSON.stringify(dataCreate)
        });
        let res=await resCreate.json();
        console.log(res)
        //location.reload();
        if(res["status"]==20){
            let addShift="<tr><td></td><td class='d-none'>"
                + "</td><td>" + $("#inputNgay").val()
                + "</td><td>" + $("#inputBatDau").val()
                + "</td><td>"+$("#inputKetThuc").val()
                + "</td><td class='no-sort'><div class='d-flex'><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
            $("#subTable>tbody").append(addShift);
            $("#addModal").modal("hide");
            await getShifts();
            getPageNumber()
        }
        else {
            $("#addModal").modal("hide");
            window.alert("Phòng thi đã tồn tại");
        }
    });

    //js delete row
    $('#subTable tbody').on( 'click', '.btn-danger',function () {
        let shift_id=$(this).parent().parent().parent().children();
        let shift=$(this).parent().parent().parent();
        $("#deleteModal").modal("show");
        $("#confirmDelete").on('click',async function() {
            $("#deleteModal").modal("hide");
            let urlDelete="http://er-backend.sidz.tools/api/v1/shifts/"+shift_id[1].innerText;
            const resDelete= await fetch(urlDelete,{
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'token': window.localStorage.token
                }
            });
            let res = await resDelete.json();
            if(res["status"]==20){
                shift.remove();
                await getShifts()
                getPageNumber();
            }
        })

    } );
    var editField;
    var editShiftsId;
    $("#subTable tbody").on('click','.btn-info',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().parent().children();
        editShiftsId=editField[1].innerText;
        $("#editNgay").val(editField[2].innerText);
        $("#editBatDau").val(editField[3].innerText);
        $("#editKetThuc").val(editField[4].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        $("#editModal").modal("hide");
        //update to server here
        let date=$("#editNgay")[0].value;
        let start=$("#editBatDau")[0].value;
        let finish=$("#editKetThuc")[0].value;
        date=(date.toString()).split("/");
        start=(start.toString()).split(":");
        finish=(finish.toString()).split(":");
        let start_time=new Date(date[2],date[1]-1, date[0],start[0],start[1]).getTime()/1000;
        let finish_time=new Date(date[2],date[1]-1, date[0],finish[0],finish[1]).getTime()/1000;
        let urlUpdate="http://er-backend.sidz.tools/api/v1/shifts/"+editShiftsId+"/exam/"+exam;
        let dataUpdate={
            "start_time":start_time,
            "finish_time":finish_time,
        }
        const resUpdate= await fetch(urlUpdate,{
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'token': window.localStorage.token
            },
            body:JSON.stringify(dataUpdate)
        });
        let res=await resUpdate.json();
        if(res["status"]==21){
            window.alert("Mã môn học hoặc tên bị trùng với các môn khác");
        }
        else {
            editField[2].innerText=$("#editNgay")[0].value;
            editField[3].innerText=$("#editBatDau")[0].value;
            editField[4].innerText=$("#editKetThuc")[0].value;
        }
    });
    $('select[name="subTable_length"]').on("change",async function () {
        pageSize=$(this)[0].value;
        console.log(pageSize);
        await getShifts();
        getPageNumber();
    });
    $("#input_search").on('input', async function () {
        keywords=$(this)[0].value;
        page=1;
        await getShifts();
        getPageNumber();
    })
    $('#subTable tbody').on( 'click','.btn-secondary',async function () {
        $("#addSubjectAndRoom").modal("show");
        getPageNumberSubject()
    })
    $("#addSubjectButton").on('click',function () {
        $("#addSubject").modal("show");
    })
    $("#inputHK").on("change",async function () {
        exam =$("#inputHK")[0].value;
        await getShifts();
        getPageNumber()
    });
});
async function getShifts() {
    let url=("http://er-backend.sidz.tools/api/v1/shifts/exam/"+exam+"?page="+page+"&pageSize="+pageSize);
    $("#subTable_info")[0].innerText=""
    const response = await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'token': window.localStorage.token
        }
    });
    let res = await response.json();
    console.log(res)
    length=res['data']['shifts']["count"];
    let datatbody;
    if(res["status"]==20) {
        $("#subTable tbody tr").remove();
        for (var i = 0; i < res['data']['shifts']["rows"].length; i++) {
            let stt=(page-1)*pageSize+i+1;
            datatbody += "<tr><td>"+stt+"</td><td class='d-none'>"+res['data']['shifts']['rows'][i]['id']
                + "</td><td>"+convertDate(res['data']['shifts']['rows'][i]['start_time'])
                + "</td><td>"+convertTime(res['data']['shifts']['rows'][i]['start_time'])
                + "</td><td>"+convertTime(res['data']['shifts']['rows'][i]['finish_time'])
                + "</td><td class='no-sort-1'> <div class='d-flex justify-content-center'><button class='btn btn-secondary showSubject'><i class='far fa-eye'></i> </button></div>"
                + "</td><td class='no-sort'><div class='d-flex '><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
        }
        $("#subTable>tbody").append(datatbody)
        console.log(res['data']['shifts']["rows"].length);
        if(res['data']['shifts']["rows"].length>0){
            $("#subTable_info")[0].innerText = "Hiển thị từ " + (1 + (page - 1) * pageSize) + " đến " + ((page - 1) * pageSize + res['data']['shifts']["rows"].length) + " của " + length + " kỳ thi.";

        }
    }
}
async function getPageNumber(){
    pageNumber=length/pageSize;
    let num;
    let syntaxPage="";
    $("[name='new']").remove();
    for (let i = 0; i < Math.ceil(pageNumber); i++) {
        num = 1+i;
        if(num==1){
            syntaxPage += "</div><li class=\"paginate_button page-item active page_active\">"
                + "<a class=\"page-link\"id='"+num+"' name='new' onclick='activePage(this)'>" + num + "</a>"
                + "</li>"
        }
        else{
            syntaxPage += "</div><li class=\"paginate_button page-item\">"
                + "<a class=\"page-link\"id='"+num+"' name='new' onclick='activePage(this)'>" + num + "</a>"
                + "</li>"
        }

    }
    $(".previous").after(syntaxPage);

}
async function activePage(e) {
    $(".page_active").removeClass('active');
    $(".page_active").removeClass('page_active');
    e.parentNode.className+=' active page_active';
    page=e.firstChild.nodeValue;
    getShifts();
}
async function previousPage() {
    let elementPrev= $(".page_active").prev();
    if($(".page_active")[0].childNodes[0].firstChild.nodeValue>1){
        $(".page_active").removeClass('active');
        $(".page_active").removeClass('page_active');
        elementPrev[0].className+=" active page_active";
        page= elementPrev[0].childNodes[0].firstChild.nodeValue;
        getShifts();
    }
}
async function nexPage() {
    let elementNext;
    elementNext= $(".page_active").next();
    if($(".page_active")[0].childNodes[0].firstChild.nodeValue <pageNumber){
        $(".page_active").removeClass('active');
        $(".page_active").removeClass('page_active');
        elementNext[0].className+=" active page_active";
        page= elementNext[0].childNodes[0].firstChild.nodeValue;
        getShifts();
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
}
function convertDate(unixtimestamp){
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
function convertTime(unixtimestamp){
    // Convert timestamp to milliseconds
    let date = new Date(unixtimestamp*1000);
    // Year
    let hours=date.getHours();
    let minutes=date.getMinutes();
    if(minutes<10){
        minutes='0'+minutes;
    }
    if(hours<10){
        hours='0'+hours;
    }
    let dataTime=hours+':'+minutes;
    return dataTime
}
<!--modal add subject-->

async function getSubject() {
    let url=("http://er-backend.sidz.tools/api/v1/subjects?page="+pageSub+"&pageSize="+ pageSizeSub);
    $("#addSubjectModal_info")[0].innerText="";
    const getESResponse= await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getESResponse.json();
    lengthSub=res['data']['exam_subjects']["count"];
    var datatbody;
    if(res["status"]==20) {
        $("#addSubjectTable tbody tr").remove();
        for (var i = 0; i < res['data']['exam_subjects']["rows"].length; i++) {
            let stt=(pageSub-1)*pageSizeSub+i+1;
            datatbody += "<tr><td>"+stt+"</td><td>" + res['data']['exam_subjects']["rows"][i]['subject_id']
                + "</td><td>" + res['data']['exam_subjects']["rows"][i]['name']
                + "</td><td>" + res['data']['exam_subjects']["rows"][i]['credit']
                + "</td><td class='no-sort'><div class='d-flex'><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
        }
        $("#addSubjectTable>tbody").append(datatbody)
        if(res['data']['exam_subjects']["rows"].length>0){
            $("#addSubjectModal_info")[0].innerText = "Hiển thị từ " + (1 + (pageSub - 1) * pageSizeSub) + " đến " + ((pageSub - 1) * pageSizeSub+ res['data']['exam_subjects']["rows"].length) + " của " + lengthSub + " môn.";
        }
    }

}
async function getPageNumberSubject(){
    pageNumberSub=lengthSub/pageSizeSub;
    let num;
    let syntaxPage="";
    $("[name='new']").remove();
    for (let i = 0; i < Math.ceil(pageNumberSub); i++) {
        num = 1+i;
        if(num==1){
            syntaxPage += "</div><li class=\"paginate_button page-item active page_sub_active\">"
                + "<a class=\"page-link\"id='"+num+"' name='new' onclick='activePage(this)'>" + num + "</a>"
                + "</li>"
        }
        else{
            syntaxPage += "</div><li class=\"paginate_button page-item\">"
                + "<a class=\"page-link\"id='"+num+"' name='new' onclick='activePage(this)'>" + num + "</a>"
                + "</li>"
        }

    }
    $(".preSub").after(syntaxPage);
}
async function activePageSub(e) {
    $(".page_sub_active").removeClass('active');
    $(".page_sub_active").removeClass('page_active');
    e.parentNode.className+=' active page_active';
    page=e.firstChild.nodeValue;
    getSubject();
}
async function previousPageSub() {
    let elementPrev= $(".page_sub_active").prev();
    if($(".page_sub_active")[0].childNodes[0].firstChild.nodeValue>1){
        $(".page_sub_active").removeClass('active');
        $(".page_sub_active").removeClass('page_active');
        elementPrev[0].className+=" active page_active";
        page= elementPrev[0].childNodes[0].firstChild.nodeValue;
        getSubject();
    }
}
async function nextPageSub() {
    let elementNext;
    elementNext= $(".page_sub_active").next();
    if($(".page_sub_active")[0].childNodes[0].firstChild.nodeValue <pageNumber){
        $(".page_sub_active").removeClass('active');
        $(".page_sub_active").removeClass('page_active');
        elementNext[0].className+=" active page_active";
        page= elementNext[0].childNodes[0].firstChild.nodeValue;
        getSubject();
    }

}