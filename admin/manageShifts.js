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
var keywordsSub="";
var pageSub=1;
var lengthSub;
var pageSizeSub=5;
var exam;
var shiftId;
var subjectId;
var roomId;
let roomExists=[];
let subjectExists=[];
let ex_name="";
$(document).ready(async function() {
    //js load data subject
    await getProfile();
    await getExam();
    await getShifts()
    getPageNumber();
    //js show add modal
    $("#add_btn").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let date=$("#inputNgay")[0].value;
        console.log(date);
        let start=$("#inputBatDau")[0].value;
        let finish=$("#inputKetThuc")[0].value;
        date=(date.toString()).split("/");
        start=(start.toString()).split(":");
        finish=(finish.toString()).split(":");
        console.log(date);
        let start_time=new Date(date[2],date[1]-1, date[0],start[0],start[1]).getTime()/1000;
        let finish_time=new Date(date[2],date[1]-1, date[0],finish[0],finish[1]).getTime()/1000;
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
    //js edit row
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
    //subTable_length
    $('select[name="subTable_length"]').on("change",async function () {
        pageSize=$(this)[0].value;
        console.log(pageSize);
        await getShifts();
        getPageNumber();
    });
    let thoigianthi;
    $('#subTable tbody').on( 'click','.btn-secondary',async function () {
        $("#addSubjectAndRoom").modal({backdrop:"static"});
        let shift_id=$(this).parent().parent().parent().children();
        shiftId=shift_id[1].innerText;
        thoigianthi=$(this).parent().parent().parent().children()[3].innerText+" "+$(this).parent().parent().parent().children()[2].innerText;
        await getSubjectAndRoom();
        getPageNumberSubject();
    });
    $("#inputHK").on("change",async function () {
        exam =$("#inputHK")[0].value;
        await getShifts();
        getPageNumber()
    });
    //subject and room modal

    //delete subject
    $('#subjectAndRoomTable tbody').on( 'click', '.btn-danger',function () {
        let shiftRoom_id=$(this).parent().parent().parent().children();
        let shiftRoom=$(this).parent().parent().parent();
        $("#deleteModal").modal("show");
        $("#confirmDelete").on('click',async function() {
            $("#deleteModal").modal("hide");
            let urlDelete="http://er-backend.sidz.tools/api/v1/shifts-rooms/"+shiftRoom_id[1].innerText;
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
                shiftRoom.remove();
                await getSubjectAndRoom()
                getPageNumberSubject();
            }
        })

    } );
    //edit room
    let editFieldRoom;
    let editRoomId;
    $("#subjectAndRoomTable tbody").on('click','.edit_room',async function () {
        $("#editRoomModal").modal({backdrop: 'static'});
        $("#addSubjectAndRoom").fadeOut();
        editFieldRoom=$(this).parent().parent().parent().children();
        let url=("http://er-backend.sidz.tools/api/v1/rooms?page=-1");
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
        let datatRoom;
        if(res["status"]==20) {
            $("#editPhong option").remove()
            for (let i = 0; i < res['data']['rooms']["rows"].length; i++) {
                function check(room) {
                    return room==res['data']['rooms']["rows"][i]['name'];
                }
                if(roomExists.find(check)==undefined){
                    datatRoom += "<option value='" + res['data']['rooms']["rows"][i]['id'] + "'>" + res['data']['rooms']["rows"][i]['name'] + "</option>";
                }
            }
        }
        $("#editPhong").append(datatRoom);
        $("#editPhong").val("");
    });
    $("#editPhong").on('change',function () {
        editRoomId=$("#editPhong")[0].value;
    })
    //js confirm and close edit modal
    $("#editRoomModal").on('hidden.bs.modal',function () {
        $("#addSubjectAndRoom").fadeIn();
    });
    $("#confirmEditRoomButton").on("click",async function () {
        $("#editRoomModal").modal("hide");
        //update to server here
        let urlUpdate="http://er-backend.sidz.tools/api/v1/shifts-rooms/"+editFieldRoom[1].innerText+"/shift/"+shiftId;
        console.log(editRoomId);
        let dataUpdate={
            "room_id":editRoomId,
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
        console.log(res);
        if(res["status"]==21){
            window.alert("Phòng đã tồn tại");
        }
        else {
            await getSubjectAndRoom();
            getPageNumberSubject();
        }
    });
    //subAndRoomTable_length
    $('select[name="subAndRoomTable_length"]').on("change",async function () {
        pageSizeSub=$(this)[0].value;
        console.log(pageSizeSub);
        await getSubjectAndRoom();
        getPageNumberSubject();
    });
    //seach subject
    $("#input_search").on('input', async function () {
        keywordsSub=$(this)[0].value;
        pageSub=1;
        await getSubjectAndRoom();
        getPageNumberSubject();
    })
    // add subject and room
    $("#addSubjectButton").on('click',async function () {
        $("#addSubject").modal({backdrop: 'static'});
        $("#addSubjectAndRoom").fadeOut();
        $("#inputMon option").remove();
        $("#inputPhong option").remove();
        await getSubject();
        getRoms();
    });
    $("#inputMon").select2();
    $('#inputPhong').select2();
    $('#editPhong').select2();
    $("#addSubject").on('hidden.bs.modal',function () {
        $("#addSubjectAndRoom").fadeIn();
    });
    $("#confirmAddSubjectButton").on('click',async function () {
        $("#addSubject").modal('hide');
        let url=("http://er-backend.sidz.tools/api/v1/shifts-rooms/shift/"+shiftId);
        console.log(url);
        let dataCreate={
            "exam_subject_id": subjectId,
            "room_id":roomId
        }
        const resCreate= await fetch(url,{
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
        console.log(res);
        if(res['status']==20){
            await getSubjectAndRoom();
            getPageNumberSubject();
        }

    })
    $("#inputPhong").on("change", function () {
        roomId=$("#inputPhong")[0].value;
        console.log(roomId)
    })
    $("#inputMon").on("change", function () {
        subjectId=$("#inputMon")[0].value;
        console.log(subjectId);
    })
    $("#editBatDau").timepicker({
        uiLibrary: 'bootstrap4',
    });
    $("#editKetThuc").timepicker({
        uiLibrary: 'bootstrap4',
    });
    $("#inputBatDau").timepicker({
        uiLibrary: 'bootstrap4',
    });
    $("#inputKetThuc").timepicker({
        uiLibrary: 'bootstrap4',
    })
    $("#inputNgay").datepicker({
        format:"dd/mm/yyyy",
        uiLibrary: 'bootstrap4',
    })
    $("#subjectAndRoomTable tbody").on('click','.in_sub',async function () {
        let shiftRoom_id=$(this).parent().parent().children();
        let mon=$(this).parent().parent().children()[4].innerText;
        let phong=$(this).parent().parent().children()[5].innerText;
        console.log(shiftRoom_id[1].innerText);
        let url=("http://er-backend.sidz.tools/api/v1/shifts-rooms/"+shiftRoom_id[1].innerText+"/students");
        const resGetStudent= await fetch(url,{
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'token': window.localStorage.token
            },
        });
        let res= await resGetStudent.json();
        console.log(res);
        $("#subjectTable tbody tr").remove();
        let data="";
        for(let i=0;i<res['data']["students"].length;i++){
            let stt=i+1;
            data+="<tr><td style=\"border: 1px solid #000;text-align: center\">"+stt
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +res['data']['students'][i]['account']['fullname']
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +res['data']['students'][i]['account']['user_name']
                +"</td></tr>\n"
            console.log(data);
        }
        let html="<div class=\"container-fluid\" id=\"contentPrint\">\n" +
            "    <h1 style=\"text-align: center; text-transform: uppercase; font-weight: bold; font-size: 14pt; margin: 30px 0 0 0; padding: 0;\">KẾT QUẢ ĐĂNG KÝ THI "+ex_name +"</h1>\n" +
            "    <p style=\"text-align: center; font-weight: bold; margin: 0; padding: 0; font-size: 14pt;\" id=\"timeThi\">\n" +
            "    </p>\n" +
            "    <table  style=\"width: 100%; border: none; border-collapse: collapse; margin-top: 30px; margin-bottom: 30px\">\n" +
            "        <tr>\n" +
            "            <td>Môn: </td>\n" +
            "            <td><b id=\"mon\">"+mon+"</b></td>\n" +
            "            <td>Phòng: </td>\n" +
            "            <td><b id=\"phong\">"+phong+"</b></td>\n" +
            "            <td>Thời gian thi: </td>\n" +
            "            <td><b id=\"time\">"+thoigianthi+"</b></td>\n" +
            "        </tr>\n" +
            "    </table>\n" +

            "    <table style=\"border:none; width: 100%; border-collapse:collapse;\">\n" +
            "        <thead>\n" +
            "        <tr>\n" +
            "            <th style=\"border:1px solid #000; text-align:center;\">STT</th>\n" +
            "            <th style=\"border: 1px solid #000; text-align: center;\">Họ và tên</th>\n" +
            "            <th style=\"border: 1px solid #000; text-align: center;\">MSSV</th>\n" +
            "        </tr>\n" +
            "        </thead>\n" +
            "        <tbody>\n" +
            "\n" + data +
            "        </tbody>\n" +
            "    </table>\n" +
            "</div>"
        let w = window.open();
        $(w.document.body).html(html);
        w.print();
    })

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

//get exam
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
    ex_name = Examdata.rows[Examdata.count-1].name;
    for (let i=Examdata.count-1;i>=0;i--){
        let opt = "<option value='"+Examdata.rows[i].id+"'>"+Examdata.rows[i].name+"</option>";
        $('#inputHK').append(opt);
    }
}
//conver date

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
// conver time

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
//get Subject and room

async function getSubjectAndRoom(){
    let url=("http://er-backend.sidz.tools/api/v1/shifts-rooms/shift/"+shiftId+"/exam/"+exam+"?page="+pageSub+"&pageSize="+pageSizeSub+"&keywords="+keywordsSub)
    $("#subjectAndRoomTable tbody tr").remove();
    const getSRResponse= await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getSRResponse.json();
    console.log(res)
    lengthSub=res['data']['shifts_rooms']['count'];
    let dataTable;
    roomExists=[];
    subjectExists=[];
    if(res['status']==20){
        console.log(res['data']['shifts_rooms']['rows'].length);
        for(let i=0;i<res['data']['shifts_rooms']['rows'].length;i++){
            let stt=(pageSub-1)*pageSizeSub+i+1;
            roomExists.push(res['data']['shifts_rooms']['rows'][i]['room']['name']);
            subjectExists.push(res['data']['shifts_rooms']['rows'][i]['exam_subject']['subject']['name']);
            dataTable+="<tr><td>"+stt
                +"</td><td class='d-none'>"+res['data']['shifts_rooms']['rows'][i]['id']
                +"</td><td class='d-none'>"+res['data']['shifts_rooms']['rows'][i]['exam_subject_id']
                +"</td><td class='d-none'>"+res['data']['shifts_rooms']['rows'][i]['room']['id']
                +"</td><td>"+res['data']['shifts_rooms']['rows'][i]['exam_subject']['subject']['name']
                +"</td><td>"+res['data']['shifts_rooms']['rows'][i]['room']['name']
                +"</td><td><button class=\"btn btn-info in_sub\"><i class=\"fas fa-fw fa-print\" ></i></button>"
                + "</td><td class='no-sort'><div class='d-flex '><button class=\"btn btn-info edit_room\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger delete_subject\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
        }
        $("#subjectAndRoomTable>tbody").append(dataTable);
    }

}
async function getSubject() {
    let url=("http://er-backend.sidz.tools/api/v1/exam-subjects/exam/"+exam+"/?page=-1");
    console.log(url)
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
    let datatbody="<option class='d-none h-0'></option>";
    if(res["status"]==20) {
        for (let i = 0; i < res['data']['exam_subjects']["rows"].length; i++) {
            datatbody +="<option value="+res['data']['exam_subjects']['rows'][i]['id']+">"+res['data']['exam_subjects']['rows'][i]['subject']['name']+"</option>"
        }
    }
    $("#inputMon").append(datatbody);

}
async function getRoms(){
    let url=("http://er-backend.sidz.tools/api/v1/rooms?page=-1");
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
    let datatbody="<option class='d-none'></option>";;
    if(res["status"]==20) {
        for (let i = 0; i < res['data']['rooms']["rows"].length; i++) {
            function checkRoom(room) {
                return room==res['data']['rooms']["rows"][i]['name'];
            }
            if(roomExists.find(checkRoom)==undefined){
                datatbody += "<option value='" + res['data']['rooms']["rows"][i]['id'] + "'>" + res['data']['rooms']["rows"][i]['name'] + "</option>";
            }
        }
        $("#inputPhong").append(datatbody);
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
                + "<a class=\"page-link\"id='"+num+"' name='new' onclick='activePageSub(this)'>" + num + "</a>"
                + "</li>"
        }
        else{
            syntaxPage += "</div><li class=\"paginate_button page-item\">"
                + "<a class=\"page-link\"id='"+num+"' name='new' onclick='activePageSub(this)'>" + num + "</a>"
                + "</li>"
        }

    }
    $(".preSub").after(syntaxPage);
}
function activePageSub(e) {
    $(".page_sub_active").removeClass('active');
    $(".page_sub_active").removeClass('page_sub_active');
    e.parentNode.className+=' active page_sub_active';
    pageSub=e.firstChild.nodeValue;
    getSubjectAndRoom();
}
function previousPageSub() {
    let elementPrev= $(".page_sub_active").prev();
    if($(".page_sub_active")[0].childNodes[0].firstChild.nodeValue>1){
        $(".page_sub_active").removeClass('active');
        $(".page_sub_active").removeClass('page_sub_active');
        elementPrev[0].className+=" active page_sub_active";
        pageSub= elementPrev[0].childNodes[0].firstChild.nodeValue;
        console.log(pageSub)
        getSubjectAndRoom();
    }
}
function nextPageSub() {
    let elementNext;
    elementNext= $(".page_sub_active").next();
    if($(".page_sub_active")[0].childNodes[0].firstChild.nodeValue <pageNumberSub){
        $(".page_sub_active").removeClass('active');
        $(".page_sub_active").removeClass('page_sub_active');
        elementNext[0].className+=" active page_sub_active";
        pageSub= elementNext[0].childNodes[0].firstChild.nodeValue;
        console.log(pageSub)
        getSubjectAndRoom();
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