
function checkAdmin(){
    if(document.getElementById("InputEmail").value=="17020977@vnu.edu.vn"){
        $('#loginmodal').modal('show');
    }
    else{
        $('#loginmodal').modal('hide');
        document.getElementById("login").href="index.html";
    }
}