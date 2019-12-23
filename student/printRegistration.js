if (typeof(Storage) !== "undefined") {
    if (localStorage.token==null) {
        window.location = "../account/login.html";
    }
} else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
}
function removeToken() {
    window.localStorage.removeItem('token');
    window.location="../account/login.html";
}
let exam;
let examId;
$(document).ready(async function () {
    $("#print").on('click',function () {
        var w = window.open();
        var html = $("#contentPrint").html();

        $(w.document.body).html(html);
        w.print();
    })
    await getExam();
    await getProfile();
    await getSubject();
    let today=Date.now()/1000;
    let conver=convertDate(today);
    let date=(conver.toString()).split('/');
    document.getElementById('timeToday').innerHTML="Ngày "+date[0]+" Tháng "+date[1]+" Năm "+date[2];

});
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
async function getExam() {
    let url = ("http://er-backend.sidz.tools/api/v1/exams/?page=-1");
    const response = await fetch(url, {
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
    let count=res['data']['exams']["count"]
    exam=res['data']['exams']['rows'][count-1]['name'];
    examId=res['data']['exams']['rows'][count-1]['id']
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
function convertTime(unixtimestamp){
    // Convert timestamp to milliseconds
    let date = new Date(unixtimestamp*1000);
    // Year
    let hours=date.getHours();
    let minutes=date.getMinutes();
    if(minutes<10){
        minutes='0'+minutes;
    }
    if(hours<10){
        hours='0'+hours;
    }
    let dataTime=hours+':'+minutes;
    return dataTime
}
async function getSubject() {
    console.log(examId)
    let url = ("http://er-backend.sidz.tools/api/v1/students/exam/"+examId+"/exam-subject");
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res = await response.json();
    console.log(res);
    let data;
    for(let i=0;i<res['data']['examSubjects']['rows'].length;i++){
        let stt=i+1;
        if(res['data']['examSubjects']['rows'][i]['students'][0]['exam_subject']['shifts_rooms'].length>0){
            data+="<tr><td style=\"border: 1px solid #000;text-align: center\">"+stt
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +res['data']['examSubjects']['rows'][i]['subject_id']
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +res['data']['examSubjects']['rows'][i]['subject']['name']
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +res['data']['examSubjects']['rows'][i]['subject']['credit']
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +convertDate(res['data']['examSubjects']['rows'][i]['students'][0]['exam_subject']['shifts_rooms'][0]['shift']['start_time'])
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +convertTime(res['data']['examSubjects']['rows'][i]['students'][0]['exam_subject']['shifts_rooms'][0]['shift']['start_time'])
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +convertTime(res['data']['examSubjects']['rows'][i]['students'][0]['exam_subject']['shifts_rooms'][0]['shift']['finish_time'])
                +"</td><td style=\"border: 1px solid #000;text-align: center\">" +res['data']['examSubjects']['rows'][i]['students'][0]['exam_subject']['shifts_rooms'][0]['room']['name']
                +"</td></tr>"

        }

    }
    $("#subjectTable>tbody").append(data);

}