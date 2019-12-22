
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
$(document).ready(async function () {

});

var exam;
getExam();

async function getExam(){
    let url =("http://er-backend.sidz.tools/api/v1/exams/?page=-1");
    const getExamRes = await fetch(url, {
        method: 'GET',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getExamRes.json();
    let Examdata = res.data.exams;
    exam = +Examdata.rows[Examdata.count-1].id;
    let opt = "<p class='m-0' id='"+Examdata.rows[Examdata.count-1].id+"'>"+Examdata.rows[Examdata.count-1].name+"</p>";
    $('#HK_info').append(opt);
    getES();
}
var SR="";
var srQueue = [];
var chk;
async function getES(){
    let url =("http://er-backend.sidz.tools/api/v1/students/exam/"+exam+"/exam-subject");
    const getESRes = await fetch(url, {
        method: 'GET',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res=await getESRes.json();
    let data = res.data.examSubjects;
    if (res['status']==21){
        window.alert(res['reason']);
    }
    if(res['status']==20){
        for (var i=0;i<data.rows.length;i++){
            let dt = data.rows[i];
            SR="";
            for (var j=0;j<dt.students[0].exam_subject.shifts_rooms.length;j++){
                if (dt.students[0].shift_room){
                    chk='checked';
                }
                let dtSR = dt.students[0].exam_subject.shifts_rooms[j];
                SR = SR + '<div class="d-flex">\n' +
                    '                                                <div class="d-flex">\n' +
                    '                                                    <p>Ca thi từ '+ convertTime(dtSR.shift.start_time) + ' đến ' + convertTime(dtSR.shift.finish_time) + ' tại phòng ' + dtSR.room.name + '</p>\n' +
                    '                                                </div>\n' +
                    '\n' +
                    '                                                <div class="custom-control custom-radio ml-auto">\n' +
                    '                                                    <input '+ chk  +' type="radio" class="custom-control-input" name=gr_"'+ dt.id +'" id="sr_'+ dtSR.id+'" onchange="queueSR('+dtSR.id +')">\n' +
                    '                                                    <label class="custom-control-label" for="sr_'+ dtSR.id+'"></label>\n' +
                    '                                                </div>\n' +
                    '                                            </div>\n' +
                    '                                        <div class="divBar"></div>\n'
            }
            $('#ES_container').append('<div class="card-header card-link collapsed bg-primary" data-toggle="collapse" href="#'+ dt.subject_id +'" aria-expanded="false">\n' +
                '                                    <a class="card-link collapsed text-white font-weight-bold" data-toggle="collapse" href="#'+ dt.subject_id +'" aria-expanded="false">\n' +
                '                                        '+ dt.subject.name +'\n' +
                '                                    </a>\n' +
                '                                </div>\n' +
                '                                <div id="'+ dt.subject_id +'" class="collapse">\n' +
                '                                    <div class="card-body p-3">\n' +
                '                                        <form id="'+ dt.id +'">\n' + SR +
                '<div class="d-flex">\n' +
                '                                                <div class="d-flex">\n' +
                '                                                    <p class="text-danger mb-0">Bỏ thi</p>\n' +
                '                                                </div>\n' +
                '\n' +
                '                                                <div class="custom-control custom-radio ml-auto">\n' +
                '                                                    <input type="radio" class="custom-control-input" name=gr_"'+ dt.id +'" id="bothi_'+ dt.id+'">\n' +
                '                                                    <label class="custom-control-label" for="bothi_'+ dt.id+'"></label>\n' +
                '                                                </div>\n' +
                '                                            </div>\n' +
                '                                        </form>\n' +
                '                                    </div>\n' +
                '                                </div>');


        }
    }

}

const socket = io('http://er-webapp.sidz.tools/', {
    query: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzksImVtYWlsIjpudWxsLCJpYXQiOjE1NzcwMDE2MDIsImV4cCI6MTU3OTU5MzYwMn0.wvC1elnuUV8Kaxr4MLzKh-GpT4X_byfjJcrO3azjfq4",
        exam_id: 211
    },

});


function queueSR(sr_id) {
    if (jQuery.inArray(sr_id,srQueue)==-1){
        srQueue.push(sr_id);
    }
    else {
        removeA(srQueue, sr_id);
    }
    console.log(srQueue);
}

function convertTime(unixtimestamp){
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
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
