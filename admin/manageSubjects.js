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
    await getSubject();
    getPageNumber();
    //js show add modal
    $("#addButton").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let urlCreate="http://er-backend.sidz.tools/api/v1/subjects/";
        let dataCreate={
            "subject_id": $("#inputMaMon").val(),
            "name":$("#inputTenMon").val(),
            "credit": $("#inputTc").val()
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
            let addSubject="<tr><td></td><td>" + $("#inputMaMon").val()
                + "</td><td>" + $("#inputTenMon").val()
                + "</td><td>" + $("#inputTc").val()
                + "</td><td><i class=\"far fa-edit\"></i><i class=\"far fa-trash-alt ml-2\"></i></td></tr>";
            $("#subTable>tbody").append(addSubject);
            $("#addModal").modal("hide");
            await getSubject();
            getPageNumber()
        }
        else {
            $("#addModal").modal("hide");
            window.alert("Tên môn học hoặc mã môn học đã tồn tại");
        }
    });

    //js delete row
    $('#subTable tbody').on( 'click', '.fa-trash-alt',function () {
        let subject_id=$(this).parent().parent().children();
        let subject=$(this).parent().parent();
        $("#deleteModal").modal("show");
        $("#confirmDelete").on('click',async function() {
            $("#deleteModal").modal("hide");
            let urlDelete="http://er-backend.sidz.tools/api/v1/subjects/"+subject_id[1].innerText;
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
                await getSubject()
                getPageNumber();
            }
            else{
                window.alert("can not delete subject");
            }
        })

    } );
    var editField;
    var subjectIdOld;
    $("#subTable tbody").on('click','.fa-edit',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#editMaMon").val(editField[1].innerText);
        subjectIdOld=editField[1].innerText;
        $("#editTenMon").val(editField[2].innerText);
        $("#editTc").val(editField[3].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        $("#editModal").modal("hide");
        //update to server here
        let urlUpdate="http://er-backend.sidz.tools/api/v1/subjects/";
        let dataUpdate={
            "subject_id":subjectIdOld,
            "new_subject_id":$("#editMaMon")[0].value,
            "name":$("#editTenMon")[0].value,
            "credit":$("#editTc")[0].value
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
        console.log(res)
        if(res["status"]==21){
            window.alert("Mã môn học hoặc tên bị trùng với các môn khác");
        }
        else {
            editField[1].innerText=$("#editMaMon")[0].value;
            editField[2].innerText=$("#editTenMon")[0].value;
            editField[3].innerText=$("#editTc")[0].value;
        }
    });
    $('select[name="subTable_length"]').on("change",async function () {
        pageSize=$(this)[0].value;
        console.log(pageSize);
        await getSubject();
        getPageNumber();
    });
    $("#input_search").on('input', async function () {
        keywords=$(this)[0].value;
        page=1;
        await getSubject();
        getPageNumber();
    })
});
async function getSubject() {
    let url=("http://er-backend.sidz.tools/api/v1/subjects/?page="+page+"&pageSize="+pageSize+"&keywords="+keywords);
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
    length=res['data']['subjectsInformation']["count"];
    var datatbody;
    if(res["status"]==20) {
        $("#subTable tbody tr").remove();
        for (var i = 0; i < res['data']['subjectsInformation']["rows"].length; i++) {
            let stt=(page-1)*pageSize+i+1;
            datatbody += "<tr><td>"+stt+"</td><td>" + res['data']['subjectsInformation']["rows"][i]['subject_id']
                + "</td><td>" + res['data']['subjectsInformation']["rows"][i]['name']
                + "</td><td>" + res['data']['subjectsInformation']["rows"][i]['credit']
                + "</td><td><i class=\"far fa-edit\" ></i><i class=\"far fa-trash-alt ml-2\"></i></td></tr>";
        }
        $("#subTable>tbody").append(datatbody)
        $("#subTable_info")[0].innerText = "Hiển thị từ " + (1 + (page - 1) * pageSize) + " đến " + ((page - 1) * pageSize + res['data']['subjectsInformation']["rows"].length) + " của " + length + " môn.";

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
   getSubject();
}
async function previousPage() {
   let elementPrev= $(".active").prev();
   if($(".active")[0].childNodes[0].firstChild.nodeValue>1){
       $(".active").removeClass('active');
       elementPrev[0].className+=" active";
       page= elementPrev[0].childNodes[0].firstChild.nodeValue;
       getSubject();
   }
}
async function nexPage() {
    let elementNext;
    elementNext= $(".active").next();
    if($(".active")[0].childNodes[0].firstChild.nodeValue <pageNumber){
        $(".active").removeClass('active');
        elementNext[0].className+=" active";
        page= elementNext[0].childNodes[0].firstChild.nodeValue;
        getSubject();
    }

}