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
$(document).ready(async function() {
    //js load data subject
    let url="http://er-backend.sidz.tools/api/v1/subjects";
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
    var datatbody;
    if(res["status"]==20) {
        for (var i = 0; i < res["data"]["subjectsInformation"].length; i++) {
            datatbody += "<tr><td></td><td>" + res['data']['subjectsInformation'][i]['subject_id']
                + "</td><td>" + res['data']['subjectsInformation'][i]['name']
                + "</td><td>" + res['data']['subjectsInformation'][i]['credit']
                + "</td><td><i class=\"far fa-edit\" ></i><i class=\"far fa-trash-alt ml-2\"></i></td></tr>";
        }
       $("#subTable>tbody").append(datatbody)
    }
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
        console.log(res);
        //location.reload();
        if(res["status"]==20){
            let addSubject="<tr><td></td><td>" + $("#inputMaMon").val()
                + "</td><td>" + $("#inputTenMon").val()
                + "</td><td>" + $("#inputTc").val()
                + "</td><td><i class=\"far fa-edit\"></i><i class=\"far fa-trash-alt ml-2\"></i></td></tr>";
            $("#subTable>tbody").append(addSubject);
            $("#addModal").modal("hide");
            location.reload();
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
        console.log(subject);
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
            }
            else{
                window.alert("can not delete subject");
            }
        })

    } );

    //customize table
    var table = $("#subTable").DataTable({
        retrieve: true,
        "columnDefs": [
            {"orderable": false, "targets": 'no-sort'}
        ],
        order: [[1, 'asc']],
        language: {
            paginate: {
                next: '<i class="fas fa-angle-double-right"></i>',
                previous: '<i class="fas fa-angle-double-left"></i>'
            }
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

    });
    //js show edit modal
    var editField;
    var subjectIdOld;
    $(".fa-edit").on('click',function () {
        $("#editModal").modal("show");
        editField=$(this).parent().parent().children();
        $("#editMaMon").val(editField[1].innerText);
        subjectIdOld=editField[1].innerText;
        $("#editTenMon").val(editField[2].innerText);
        $("#editTc").val(editField[3].innerText);
    })
    //js confirm and close edit modal
    $("#confirmEditButton").on("click",async function () {
        let subjectOld=editField;
        console.log(subjectOld)
        editField[1].innerText=$("#editMaMon")[0].value;
        editField[2].innerText=$("#editTenMon")[0].value;
        editField[3].innerText=$("#editTc")[0].value;
        $("#editModal").modal("hide");
        //update to server here
        let urlUpdate="http://er-backend.sidz.tools/api/v1/subjects/";
        let dataUpdate={
            "subject_id":subjectIdOld,
            "new_subject_id":editField[1].innerText,
            "name":editField[2].innerText,
            "credit":editField[3].innerText
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
        if(res["reason"]=="Subject_id isn't change"){
            window.alert("Subject_id không thay đổi");
            editField[1].innerText=subjectOld[1].innerText;
            editField[2].innerText=subjectOld[2].innerText;
            editField[3].innerText=subjectOld[3].innerText;
        }
    });

});
