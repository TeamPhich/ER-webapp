if (typeof(Storage) !== "undefined") {
    if (localStorage.token==null) {
        window.location = "account/login.html";
    }
    else if(localStorage.isAdmin=='true'){
        window.location="admin/admin.html";
    }
} else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
}
function removeToken() {
    window.localStorage.removeItem('token');
}