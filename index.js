if (typeof(Storage) !== "undefined") {
    if (localStorage.token==null) {
        window.location = "account/login.html";
    }
    else if(localStorage.isAdmin=='isadmin'){
        window.location="admin/admin.html";
    }
} else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
}
function removeToken() {
    window.localStorage.removeItem('token');
    window.location="account/login.html";
}
let exam;
$(document).ready(async function(){
    $('[data-toggle="popover"]').popover();
    await getProfile();
    getExam();
});
async function getExam(){
    let url =("http://er-backend.sidz.tools/api/v1/exams/?page=-1");
    const getExamRes = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
})
    let res=await getExamRes.json();

    let Examdata = res.data.exams;
    exam = +Examdata.rows[Examdata.count-1].id;
    localStorage.setItem('exam',exam);
    let opt = "<p class='m-0' id='"+Examdata.rows[Examdata.count-1].id+"'>"+Examdata.rows[Examdata.count-1].name+"</p>";
    $('#HK_info').append(opt);
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
    if(res['status']==20){
        document.getElementById("profile").innerHTML=res['data']['fullname']+"-"+"["+res['data']['user_name']+"]"
        document.getElementById("name").innerHTML=res['data']['fullname'];
        document.getElementById("birthDay").innerHTML=convertDate(res['data']['birthday']);
        document.getElementById("mssv").innerHTML=res['data']['user_name'];
        document.getElementById("exam").innerHTML=exam
    }
}
async function getES(){
    let urlExam = ("http://er-backend.sidz.tools/api/v1/exams/?page=-1");
    const getExamRes = await fetch(urlExam, {
        method: 'GET',
        headers: {
            'token': window.localStorage.token
        }
    });
    let resExam = await getExamRes.json();
    let ExamdataExam = resExam.data.exams;
    const exam = +ExamdataExam.rows[ExamdataExam.count - 1].id;
    let url =("http://er-backend.sidz.tools/api/v1/students/exam/"+exam+"/exam-subject");
    const getESRes = await fetch(url, {
        method: 'GET',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getESRes.json();
    if (res['status']==21){
        window.alert(res['reason']);
    }
    if(res['status']==20){

        $('#total_ES')[0].innerText = res.data.examSubjects.count;
        $('#ES_available')[0].innerText = res.data.examSubjects.countConditionSubject;
        $('#ES_unavailable')[0].innerText = res.data.examSubjects.countNotConditionSubject;
        let data = res.data.examSubjects.rows;
        let str_es="";
        let str_es_unavailable="";
        let str_es_available="";
        for (let i=0;i<data.length;i++){
            str_es=str_es+data[i].subject.name+'<br\>';
            if (data[i].students[0].enoughCondition){
                str_es_available=str_es_available+data[i].subject.name+'<br\>';
            }
            else
                str_es_unavailable=str_es_unavailable+data[i].subject.name+'<br\>';
        }
        localStorage.setItem('total_es',str_es);
        localStorage.setItem('es_available',str_es_available);
        localStorage.setItem('es_unavailable',str_es_unavailable);
        if (str_es.length>0){
            $('#total_ES_popover').attr({'title':'Danh sách môn','data-toggle':'popover','data-trigger':'hover','data-content':str_es});
        }
        if (str_es_available.length>0){
            $('#ES_available_popover').attr({'title':'Danh sách môn','data-toggle':'popover','data-trigger':'hover','data-content':str_es_available});
        }
        if (str_es_unavailable.length>0){
            $('#ES_unavailable_popover').attr({'title':'Danh sách môn','data-toggle':'popover','data-trigger':'hover','data-content':str_es_unavailable});
        }
        $('[data-toggle="popover"]').popover();
    }
}

    const socket = io('http://er-backend.sidz.tools/', {
        query: {
            token: window.localStorage.token,
            exam_id: window.localStorage.exam
        },

    });
    socket.on('registing.time.start', async () => {
        console.log('start time');
        $('#Error_info').addClass('d-none');
        $('#ES_info').removeClass('d-none');
        await getES();
    });
    socket.on('registing.time.finish',async () => {
        console.log('finishing time');
        $('#Error_info').removeClass('d-none');
        $('#ES_info').addClass('d-none');
    });
    socket.on('exam_subject.time.read',async () => {
        console.log('on review');
        $('#Error_info').addClass('d-none');
        $('#ES_info').removeClass('d-none');
        await getES();
    });
    socket.on("error", (data) => { console.log(data.message) })
