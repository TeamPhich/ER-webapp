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
    await getRooms();
    getPageNumber();
    //js show add modal
    $("#add_btn").on("click",function () {
        $("#addModal").modal("show");
    });
    //js confirm and close add modal
    $("#confirmAddButton").on("click",async function () {
        let urlCreate="http://er-backend.sidz.tools/api/v1/rooms";
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
            let addRom="<tr><td></td><td class='d-none'></td>"
                +"<td>" + $("#inputPhong").val()
                + "</td><td>" + $("#inputSoMay").val()
                + "</td><td class='no-sort'><div class='d-flex'><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
            $("#subTable>tbody").append(addRom);
            $("#addModal").modal("hide");
            await getRooms();
            getPageNumber()
        }
        else {
            $("#addModal").modal("hide");
            window.alert("Phòng thi đã tồn tại");
        }
    });

    //js delete row
    $('#subTable tbody').on( 'click', '.btn-danger',function () {
        let room_id=$(this).parent().parent().parent().children();
        let room=$(this).parent().parent().parent();
        $("#deleteModal").modal("show");
        $("#confirmDelete").on('click',async function() {
            $("#deleteModal").modal("hide");
            let urlDelete="http://er-backend.sidz.tools/api/v1/rooms/"+room_id[1].innerText;
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
                room.remove();
                await getRooms()
                getPageNumber();
            }
        })

    } );
    var editField;
    var subjectIdOld;
    $("#subTable tbody").on('click','.btn-info',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().parent().children();
        $("#editPhong").val(editField[2].innerText);
        subjectIdOld=editField[1].innerText;
        $("#editSoMay").val(editField[3].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        $("#editModal").modal("hide");
        //update to server here
        let urlUpdate="http://er-backend.sidz.tools/api/v1/rooms/"+subjectIdOld;
        let dataUpdate={
            "new_name":$("#editPhong")[0].value,
            "new_slot":$("#editSoMay")[0].value,
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
            editField[2].innerText=$("#editPhong")[0].value;
            editField[3].innerText=$("#editSoMay")[0].value;
        }
    });
    $('select[name="subTable_length"]').on("change",async function () {
        pageSize=$(this)[0].value;
        console.log(pageSize);
        await getRooms();
        getPageNumber();
    });
    $("#input_search").on('input', async function () {
        keywords=$(this)[0].value;
        page=1;
        await getRooms();
        getPageNumber();
    })
});
async function getRooms() {
    let url=("http://er-backend.sidz.tools/api/v1/rooms?page="+page+"&pageSize="+pageSize+"&keywords="+keywords);
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
    length=res['data']['rooms']["count"];
    var datatbody;
    if(res["status"]==20) {
        $("#subTable tbody tr").remove();
        for (var i = 0; i < res['data']['rooms']["rows"].length; i++) {
            let stt=(page-1)*pageSize+i+1;
            datatbody += "<tr><td>"+stt+"</td><td class='d-none'>"+ res['data']['rooms']['rows'][i]['id']
                +"</td><td>" + res['data']['rooms']["rows"][i]['name']
                + "</td><td>" + res['data']['rooms']["rows"][i]['slot']
                + "</td><td class='no-sort'><div class='d-flex'><button class=\"btn btn-info\"><i class=\"far fa-edit\" ></i></button><button class=\"btn btn-danger\"><i class=\"far fa-trash-alt\"></i></button></div></td></tr>";
        }
        $("#subTable>tbody").append(datatbody)
        if(length>0){
            $("#subTable_info")[0].innerText = "Hiển thị từ " + (1 + (page - 1) * pageSize) + " đến " + ((page - 1) * pageSize + res['data']['rooms']["rows"].length) + " của " + length + " phòng thi.";
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
    getRooms();
}
async function previousPage() {
    let elementPrev= $(".active").prev();
    if($(".active")[0].childNodes[0].firstChild.nodeValue>1){
        $(".active").removeClass('active');
        elementPrev[0].className+=" active";
        page= elementPrev[0].childNodes[0].firstChild.nodeValue;
        getRooms();
    }
}
async function nexPage() {
    let elementNext;
    elementNext= $(".active").next();
    if($(".active")[0].childNodes[0].firstChild.nodeValue <pageNumber){
        $(".active").removeClass('active');
        elementNext[0].className+=" active";
        page= elementNext[0].childNodes[0].firstChild.nodeValue;
        getRooms();
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