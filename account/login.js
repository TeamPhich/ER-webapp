
async function postRequest(){
    let url="http://18.162.125.153/ER-backend/api/v1/accounts/login";
    let data={
        "user_name":document.getElementById("inputUserName").value,
        "password":document.getElementById("inputPassword").value
    }
    const response= await fetch(url,{
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
    if(res["status"]===20){
        if(res["data"]["isAdmin"]) {
            $('#loginmodal').modal('show');
            document.getElementById("loi_user").style.display="none";
        }
        else{
            document.getElementById("login").href="../index.html";
        }
    }
    else {
        document.getElementById("loi_user").innerHTML = "user name hoặc password không đúng";
    }
    window.localStorage.setItem('token', res["data"]["token"]);
}