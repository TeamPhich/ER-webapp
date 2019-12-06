localStorage.clear();
async function postRequest(){
    let urlLogin="http://er-backend.sidz.tools/api/v1/accounts/login";
    let data={
        "user_name":document.getElementById("inputUserName").value,
        "password":document.getElementById("inputPassword").value
    }
    const response= await fetch(urlLogin,{
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(data)
    });
    let res=await response.json();
    console.log(res);
    if(res["status"]==20){
        if(res["data"]["isAdmin"]) {
            $('#loginmodal').modal('show');
            document.getElementById("loi_user").style.display="none";
        }
        else{
            document.getElementById("login").href="../index.html";
        }
    }
    else {
        document.getElementById("loi_user").innerHTML = "User name hoặc password không đúng";
    }
    window.localStorage.setItem('token', res["data"]["token"]);
}
function isAdmin() {
    window.localStorage.setItem('isAdmin','isadmin');
    window.location="../admin/admin.html";
}
$(document).on('keypress',function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        if($("#inputUserName").val()=="")
        document.getElementById("loi_user").innerHTML ="User name không được để trống";
        else if($("#inputPassword").val()==""){
            document.getElementById("loi_user").innerHTML="Password không được để trống";
        }
        else{
            postRequest();
        }
    }
});
//remember me
$(function () {

    if (localStorage.chkbox && localStorage.chkbox != '') {
        $('#rememberMe').attr('checked', 'checked');
        $('#inputUserName').val(localStorage.username);
        $('#inputPassword').val(localStorage.pass);
    } else {
        $('#rememberMe').removeAttr('checked');
        $('#inputUserName').val('');
        $('#inputPassword').val('');
    }
});
$("#rememberMe").click(function () {
    if ($('#rememberMe').is(':checked')) {
        // save username and password
        localStorage.username = $("#inputUserName").val();
        localStorage.pass = $("#inputPassword").val();
        localStorage.chkbox = $('#rememberMe').val();
    } else {
        localStorage.username = '';
        localStorage.pass = '';
        localStorage.chkbox = '';
    }
});
