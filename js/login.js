
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
    console.log(res);
    if(res["status"]===20){
        $('#loginmodal').modal('show');
    }
    else{
        document.getElementById("login").href="index.html";
    }
}