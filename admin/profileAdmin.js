
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
    await getProfile();
    getPro();
    let pass;
    $("#newPassWord").on('keydown',function (e) {
        pass+=this.value;
        if(e.keyCode==13){
            $("#reNewPassWord").focus();
            if(this.value.length<8){
                document.getElementById('errorPass').innerHTML="Độ dài password phải lớn hơn 8"
            }
        }
    });
    $("#oldPassWord").on('keydown',function (e){
        if(e.keyCode==13){
            $("#newPassWord").focus();
        }
    })
    $("#newPassWord").blur(function () {
        $("#reNewPassWord").focus();
        if(this.value.length<8){
            document.getElementById('errorPass').innerHTML="Độ dài password phải lớn hơn 8"
        }
    });
    $("#reNewPassWord").on('keydown',function (e) {
        if(e.keyCode==13){
            if(this.value!=$('#newPassWord')[0].value){
                document.getElementById('errorRePass').innerHTML="Password nhập không chính xác"
            }
            else{
                putPass();
            }
        }
    })

});
async function getProfile() {
    let url="http://er-backend.sidz.tools/api/v1/accounts/profile";
    const response = await fetch(url,{
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token,
        }
    });
    let res=await response.json();
    console.log(res);
    document.getElementById("fullName").innerHTML=res['data']['fullname'];
    document.getElementById("birthDay").innerHTML=convertDate(res['data']['birthday']);
    document.getElementById("email").innerHTML=res['data']['email'];
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
async function putPass() {
    let url="http://er-backend.sidz.tools/api/v1/accounts/passwords";
    console.log($("#oldPassWord")[0].value)
    let data={
        "oldPassword": $("#oldPassWord")[0].value,
        "newPassword": $("#newPassWord")[0].value
    }
    const response = await fetch(url,{
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'token': window.localStorage.token
        },
        body:JSON.stringify(data)
    });
    let res=await response.json();
    console.log(res)
    if(res['status']==20){
        alert("Thay đổi thành công");
    }
}
async function getPro() {
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
    if(res['status']==20){
        document.getElementById("profile").innerHTML=res['data']['fullname']+"-"+"["+res['data']['user_name']+"]"
    }
}