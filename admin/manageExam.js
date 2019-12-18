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
    await getExam();
    getPageNumber();
    //js show add modal
    $("#addButton").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let urlCreate="http://er-backend.sidz.tools/api/v1/exams//";
        let dataCreate={
            "id": $("#inputMaKy").val(),
            "name":$("#inputTenKy").val()
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
            let addSubject="<tr><td></td><td>" + $("#inputMaKy").val()
                + "</td><td>" + $("#inputTenKy").val()
                + "</td><td><i class=\"far fa-edit\"></i><i class=\"far fa-trash-alt ml-2\"></i></td></tr>";
            $("#subTable>tbody").append(addSubject);
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
    $('#subTable tbody').on( 'click', '.fa-trash-alt',function () {
        let exam_id=$(this).parent().parent().children();
        let exam=$(this).parent().parent();
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
    $("#subTable tbody").on('click','.fa-edit',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#editMaKy").val(editField[1].innerText);
        examIdOld=editField[1].innerText;
        $("#editTenKy").val(editField[2].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        $("#editModal").modal("hide");
        //update to server here
        let urlUpdate="http://er-backend.sidz.tools/api/v1/exams";
        let dataUpdate={
            "id":subjectIdOld,
            "new_id":$("#editMaKy")[0].value,
            "new_name":$("#editTenKy")[0].value
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
            window.alert("Mã Kỳ học hoặc tên đã tồn tại");
        }
        else {
            editField[1].innerText=$("#editMaKy")[0].value;
            editField[2].innerText=$("#editTenKy")[0].value;
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
    length=res['data']['exams']["count"];
    var datatbody;
    if(res["status"]==20) {
        $("#subTable tbody tr").remove();
        for (var i = 0; i < res['data']['exams']["rows"].length; i++) {
            let stt=(page-1)*pageSize+i+1;
            datatbody += "<tr><td>"+stt+"</td><td>" + res['data']['exams']["rows"][i]['id']
                + "</td><td>" + res['data']['exams']["rows"][i]['name']
                + "</td><td><i class=\"far fa-edit\" ></i><i class=\"far fa-trash-alt ml-2\"></i></td></tr>";
        }
        $("#subTable>tbody").append(datatbody)
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