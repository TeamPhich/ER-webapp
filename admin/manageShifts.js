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
$(document).ready(async function() {
    //js load data subject
    await getShifts();
    getPageNumber();
    //js show add modal
    $("#addButton").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let urlCreate="http://er-backend.sidz.tools/api/v1/exams/";
        let dataCreate={
            "name": $("#inputPhong").val(),
            "slot":$("#inputSoMay").val()
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
            let addRom="<tr><td></td><td>" + $("#inputPhong").val()
                + "</td><td>" + $("#inputSoMay").val()
                + "</td><td>"
                + "</td><td>"
                + "</td><td class='no-sort'><div class='d-flex'><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
            $("#subTable>tbody").append(addRom);
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
        let subject_id=$(this).parent().parent().parent().children();
        let subject=$(this).parent().parent().parent();
        $("#deleteModal").modal("show");
        $("#confirmDelete").on('click',async function() {
            $("#deleteModal").modal("hide");
            let urlDelete="http://er-backend.sidz.tools/api/v1/exams/"+subject_id[1].innerText;
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
                subject.remove();
                await getShifts()
                getPageNumber();
            }
        })

    } );
    var editField;
    var subjectIdOld;
    $("#subTable tbody").on('click','.btn-info',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().parent().children();
        $("#editPhong").val(editField[1].innerText);
        subjectIdOld=editField[1].innerText;
        $("#editSoMay").val(editField[2].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        $("#editModal").modal("hide");
        //update to server here
        let urlUpdate="http://er-backend.sidz.tools/api/v1/exams";
        let dataUpdate={
            "id":subjectIdOld,
            "new_id":$("#editPhong")[0].value,
            "new_name":$("#editSoMay")[0].value,
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
            editField[1].innerText=$("#editPhong")[0].value;
            editField[2].innerText=$("#editSoMay")[0].value;
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
    $('#subTable tbody').on( 'click','.btn-secondary',function () {
        $("#addSubjectModal").modal("show");
    })
});
async function getShifts() {
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
    length=res['data']['exams']["count"];
    let datatbody;
    if(res["status"]==20) {
        $("#subTable tbody tr").remove();
        for (var i = 0; i < res['data']['exams']["rows"].length; i++) {
            let stt=(page-1)*pageSize+i+1;
            datatbody += "<tr><td>"+stt+"</td><td>" + res['data']['exams']["rows"][i]['id']
                + "</td><td>"
                + "</td><td>"
                + "</td><td class='no-sort-1'> <div class='d-flex justify-content-center'><button class='btn btn-secondary showSubject'><i class='far fa-eye'></i> </button></div>"
                + "</td><td class='no-sort'><div class='d-flex '><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
        }
        $("#subTable>tbody").append(datatbody)
        $("#subTable_info")[0].innerText = "Hiển thị từ " + (1 + (page - 1) * pageSize) + " đến " + ((page - 1) * pageSize + res['data']['exams']["rows"].length) + " của " + length + " kỳ thi.";
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
<!--modal add subject-->

async function getSubject() {
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
        $("#addSubjectModal_info")[0].innerText = "Hiển thị từ " + (1 + (pageSub - 1) * pageSizeSub) + " đến " + ((pageSub - 1) * pageSizeSub+ res['data']['exam_subjects']["rows"].length) + " của " + lengthSub + " môn.";

    }

}
async function getPageNumberSubject(){
    pageNumberSub=lengthSub/pageSizeSub;
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