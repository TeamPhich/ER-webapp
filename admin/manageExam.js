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
var keywords="";
$(document).ready(async function() {
    //js load data subject
    await getProfile();
    await getExam();
    getPageNumber();
    //js show add modal
    $("#addButton").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let start=$("#inputBatDau")[0].value;
        let finish=$("#inputKetThuc")[0].value;
        let date=(start.toString()).split(" ");
        let dateStart=(date[1].toString()).split("/");
        let timeStart=(date[0].toString()).split(":");
        let start_time=new Date(dateStart[2],dateStart[0]-1, dateStart[1],timeStart[0],timeStart[1]).getTime()/1000;
        let date2=(finish.toString()).split(" ");
        let dateFinish=(date2[1].toString()).split("/");
        let timeFinish=(date2[0].toString()).split(":");
        let finish_time=new Date(dateFinish[2],dateFinish[0]-1, dateFinish[1],timeFinish[0],timeFinish[1]).getTime()/1000;
        let urlCreate="http://er-backend.sidz.tools/api/v1/exams//";
        let dataCreate={
            "id": $("#inputMaKy").val(),
            "name":$("#inputTenKy").val(),
            "start_time":parseInt(start_time),
            "finish_time":parseInt(finish_time)
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
            $("#addModal").modal("hide");
            await getExam();
            getPageNumber()
        }
        else {
            $("#addModal").modal("hide");
            window.alert("Mã học kỳ hoặc tên đã tồn tại");
        }
    });

    //js delete row
    $('#subTable tbody').on( 'click', '.btn-danger',function () {
        let exam_id=$(this).parent().parent().parent().children();
        let exam=$(this).parent().parent().parent();
        $("#deleteModal").modal("show");
        $("#confirmDelete").on('click',async function() {
            $("#deleteModal").modal("hide");
            let urlDelete="http://er-backend.sidz.tools/api/v1/exams/"+exam_id[1].innerText;
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
                exam.remove();
                await getExam()
                getPageNumber();
            }
            else{
                window.alert("can not delete subject");
            }
        })

    } );
    var editField;
    var examIdOld;
    $("#subTable tbody").on('click','.btn-info',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().parent().children();
        $("#editMaKy").val(editField[1].innerText);
        examIdOld=editField[1].innerText;
        $("#editTenKy").val(editField[2].innerText);
        $("#editBatDau").val(editField[3].innerText);
        $("#editKetThuc").val(editField[4].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        $("#editModal").modal("hide");
        //update to server here
        let start=$("#editBatDau")[0].value;
        let finish=$("#editKetThuc")[0].value;
        let date=(start.toString()).split(" ");
        let dateStart=(date[1].toString()).split("/");
        let timeStart=(date[0].toString()).split(":");
        let start_time=new Date(dateStart[2],dateStart[0]-1, dateStart[1],timeStart[0],timeStart[1]).getTime()/1000;
        let date2=(finish.toString()).split(" ");
        let dateFinish=(date2[1].toString()).split("/");
        let timeFinish=(date2[0].toString()).split(":");
        let finish_time=new Date(dateFinish[2],dateFinish[0]-1, dateFinish[1],timeFinish[0],timeFinish[1]).getTime()/1000;
        let urlUpdate="http://er-backend.sidz.tools/api/v1/exams";
        let dataUpdate
        if(examIdOld!=$("#editMaKy")[0].value){
            dataUpdate={
                "id":examIdOld,
                "new_id":$("#editMaKy")[0].value,
                "new_name":$("#editTenKy")[0].value,
                "finish_time":parseInt(finish_time),
                "start_time":parseInt(start_time)
            }
        }
        else{
            dataUpdate={
                "id":examIdOld,
                "new_name":$("#editTenKy")[0].value,
                "finish_time":parseInt(finish_time),
                "start_time":parseInt(start_time)
            }
        }
        console.log(dataUpdate)
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
        console.log(res)
        if(res["status"]==21){
            window.alert("Mã Kỳ học hoặc tên đã tồn tại");
        }
        else {
            editField[1].innerText=$("#editMaKy")[0].value;
            editField[2].innerText=$("#editTenKy")[0].value;
            editField[3].innerText=$("#editBatDau")[0].value;
            editField[4].innerText=$("#editKetThuc")[0].value;
        }
    });
    $('select[name="subTable_length"]').on("change",async function () {
        pageSize=$(this)[0].value;
        console.log(pageSize);
        await getExam();
        getPageNumber();
    });
    $("#input_search").on('input', async function () {
        keywords=$(this)[0].value;
        page=1;
        await getExam();
        getPageNumber();
    })
    $("#editBatDau").datetimepicker({
        uiLibrary: 'bootstrap4',
        modal: true,
        footer: true
    });
    $("#editKetThuc").datetimepicker({
        uiLibrary: 'bootstrap4',
        modal: true,
        footer: true
    })
    $("#inputBatDau").datetimepicker({
        uiLibrary: 'bootstrap4',
        modal: true,
        footer: true
    });
    $("#inputKetThuc").datetimepicker({
        uiLibrary: 'bootstrap4',
        modal: true,
        footer: true
    })
});


async function getExam() {
    let url=("http://er-backend.sidz.tools/api/v1/exams/?page="+page+"&pageSize="+pageSize+"&keywords="+keywords);
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
    console.log(res);
    length=res['data']['exams']["count"];
    var datatbody;
    if(res["status"]==20) {
        $("#subTable tbody tr").remove();
        for (var i = 0; i < res['data']['exams']["rows"].length; i++) {
            let stt=(page-1)*pageSize+i+1;
            datatbody += "<tr><td>"+stt+"</td><td>" + res['data']['exams']["rows"][i]['id']
                + "</td><td>" + res['data']['exams']["rows"][i]['name']
                + "</td><td>" + convertDate(res['data']['exams']["rows"][i]['start_time'])
                + "</td><td>" + convertDate(res['data']['exams']["rows"][i]['finish_time'])
                + "</td><td class='no-sort'><div class='d-flex'><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
        }
        $("#subTable>tbody").append(datatbody)
        if(length>0){
            $("#subTable_info")[0].innerText = "Hiển thị từ " + (1 + (page - 1) * pageSize) + " đến " + ((page - 1) * pageSize + res['data']['exams']["rows"].length) + " của " + length + " kỳ thi.";

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
            syntaxPage += "</div><li class=\"paginate_button page-item active\">"
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
    $(".active").removeClass('active');
    e.parentNode.className+=' active';
    page=e.firstChild.nodeValue;
    getExam();
}
async function previousPage() {
    let elementPrev= $(".active").prev();
    if($(".active")[0].childNodes[0].firstChild.nodeValue>1){
        $(".active").removeClass('active');
        elementPrev[0].className+=" active";
        page= elementPrev[0].childNodes[0].firstChild.nodeValue;
        getExam();
    }
}
async function nexPage() {
    let elementNext;
    elementNext= $(".active").next();
    if($(".active")[0].childNodes[0].firstChild.nodeValue <pageNumber){
        $(".active").removeClass('active');
        elementNext[0].className+=" active";
        page= elementNext[0].childNodes[0].firstChild.nodeValue;
        getExam();
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

    let hours=date.getHours();
    let minutes=date.getMinutes();
    if(minutes<10){
        minutes='0'+minutes;
    }
    if(hours<10){
        hours='0'+hours;
    }
    let convdataTime = hours+":"+minutes+" "+day+'/'+month+'/'+year;
    return convdataTime;
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