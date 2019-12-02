
if (typeof(Storage) !== "undefined") {
    if (localStorage.token==null) {
        window.location = "../account/login.html";
    }
} else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
}
function removeToken() {
    window.localStorage.removeItem('token');
}
function add(a, b) {
    return a + b;
}
async function checkSession() {
    let url="http://er-backend.sidz.tools/api/v1/accounts/login";
    let data={
        "user_name": "test12345",
        "password": "12345678",
        "email": "test1234@gmail.com",
        "fullname": "test1234",
        "birthday": "936662400",
        "role_id": 1
    }
    const response= await fetch(url,{
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0MTIzNEBnbWFpbC5jb20iLCJpYXQiOjE1NzUyNTM4ODUsImV4cCI6MTU3NTI1Mzg4Nn0.vW_nQfdThekM_PKK-0Pbc1h4pzCDPfSgDFF0pBzp8gk'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(data)
    });
    let res=await response.json();
    if(res["status"]===22){
        window.location = "../account/login.html";
    }
}