
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
    await getProfile()
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
    let res = await getExamRes.json();
    console.log(res);
    let Examdata = res.data.exams;
    exam = +Examdata.rows[Examdata.count-1].id;
    let opt = "<p class='m-0' id='"+Examdata.rows[Examdata.count-1].id+"'>"+Examdata.rows[Examdata.count-1].name+"</p>";
    $('#HK_info').append(opt);
}
var SR="";
var chk="";
var span;
async function getES(onReg){
    let url =("http://er-backend.sidz.tools/api/v1/students/exam/"+exam+"/exam-subject");
    const getESRes = await fetch(url, {
        method: 'GET',
        headers: {
            'token': window.localStorage.token
        }
    });
    let res = await getESRes.json();
    let data = res.data.examSubjects;
    if (res['status']==21){
        window.alert(res['reason']);
    }
    if(res['status']==20){
        $('#ES_container').empty();
        for (var i=0;i<data.rows.length;i++){
            if (data.rows[i].students[0].enoughCondition){
                let dt = data.rows[i];
                SR="";
                let Reged_SR="";
                let dis ="";
                let dis2="";
                for (var j=0;j<dt.students[0].exam_subject.shifts_rooms.length;j++){
                    if (dt.students[0].shift_room){
                        chk='checked';
                        dis = 'disabled';
                        break;
                    }
                }
                if (!onReg){
                    dis = 'disabled'
                }
                for (var j=0;j<dt.students[0].exam_subject.shifts_rooms.length;j++) {
                    let dtSR = dt.students[0].exam_subject.shifts_rooms[j];
                    if (dtSR.id!=dt.students[0].shift_room) {

                        SR = SR + '<div class="d-flex">\n' +
                            '                                                <div class="ml-2">\n' +
                            '<button type="button"  ' + dis + ' id="sr_' + dtSR.id + '" value="' + dtSR.id + '"  class="btn btn-outline-primary mb-3" onclick="reg_SR('+dtSR.id+','+ dt.students[0].id +','+ dt.id +')"><i class="fas fa-plus"></i></button>'+
                            '                                                </div>\n' +
                            '                                                <div class="d-flex mt-2 ml-2">\n' +
                            '                                                    <p>Ca thi từ <span class="text-danger">' + convertTime(dtSR.shift.start_time) + '</span> đến <span class="text-danger">' + convertTime(dtSR.shift.finish_time) + '</span> tại phòng <span class="text-danger">' + dtSR.room.name + '</span> - số slot đã đăng ký: <span class="text-danger font-weight-bold" id="'+ dtSR.id +'">' + (dtSR.current_slot) + '</span> slots</p>\n' +
                            '                                                </div>\n' +
                            '\n' +
                            '                                            </div>\n'
                    }
                    else {
                        if (!onReg){
                            dis2 = 'disabled'
                        }
                        Reged_SR = '<div class="d-flex">\n' +
                            '                                                <div class="ml-2">\n' +
                            '<button type="button" '+ dis2 +'  id="sr_' + dtSR.id + '" value="' + dtSR.id + '" class="btn btn-danger mb-3" onclick="openDelModal('+dtSR.id+','+ dt.students[0].id +','+ dt.id +')"><i class="far fa-trash-alt"></i></button>'+
                            '                                                </div>\n' +
                            '                                                <div class="d-flex mt-2 ml-2">\n' +
                            '                                                    <p>Ca thi từ <span class="text-danger">' + convertTime(dtSR.shift.start_time) + '</span> đến <span class="text-danger">' + convertTime(dtSR.shift.finish_time) + '</span> tại phòng <span class="text-danger">' + dtSR.room.name + '</span> - số slot đã đăng ký: <span class="text-danger font-weight-bold" id="'+ dtSR.id +'">' + (dtSR.current_slot) + '</span> slots</p>\n' +
                            '                                                </div>\n' +
                            '\n' +
                            '                                            </div>\n';
                    }
                }
                $('#ES_container').append('<div class="card-header card-link bg-primary" data-toggle="collapse" href="#'+ dt.subject_id +'" aria-expanded="true">\n' +
                    '                                    <a class="card-link text-white font-weight-bold" data-toggle="collapse" href="#'+ dt.subject_id +'" aria-expanded="true">\n' +
                    '                                        '+ dt.subject.name +'\n' +
                    '                                    </a>\n' +
                    '                                </div>\n' +
                    '                                <div id="'+ dt.subject_id +'" class="collapse show">\n' +
                    '                                    <div class="card-body p-3">\n' +
                    '                                        <form id="'+ dt.id +'">\n' + SR +
                '                                        <div class="divBar"></div>'+ Reged_SR+'</form>\n' );


            }
            else {

            }
        }
        span = document.getElementsByTagName('span');

    }
}

const socket = io('http://er-backend.sidz.tools/', {
    query: {
        token: window.localStorage.token,
        exam_id: window.localStorage.exam
    },

});

socket.on('registing.time.start', () => {
    console.log('start time');
    $('#Error_info').addClass('d-none');
    $('#ES_container').removeClass('d-none');
    getES(true);
});
socket.on('registing.time.finish', () => {
    console.log('finishing time');
    $('#Error_info').removeClass('d-none');
    $('#ES_container').addClass('d-none');
});
socket.on('exam_subject.time.read', () => {
    console.log('on review');
    $('#Error_info').addClass('d-none');
    $('#ES_container').removeClass('d-none');
    getES(false);
});
socket.on("exam_subject.update", (data) => {
    const {shift_room_id} = data;
    socket.emit("current-slot.shift-room.get", {shift_room_id})
});

socket.on("current-slot.shift-room.post", (data) => {
    let sh_r_id = data.shift_room_id;
    let cur_slot = data.current_slot;
    for (var i=0;i<span.length;i++){
        if(span[i].id==sh_r_id){
            span[i].innerText = cur_slot;
            break;
        }
    }
})

socket.on("shift_room.resgisting.err", (data) => {
    window.alert("Đăng ký môn không thành công");
    getES(true);
});
socket.on("shift_room.resgisting.success", (data) => {
    window.alert("Đăng ký môn thành công");
    getES(true);
});

socket.on("shift_room.removing.success", (data) => {
    window.alert("Hủy đăng ký môn thành công");
    getES(true);
});
socket.on("shift_room.removing.err", (data) => {
    window.alert("Hủy đăng ký môn không thành công");
    getES(true);
});

socket.on("err", (data) => {
    window.alert(data)
    location.reload();
});
socket.on("error", (data) => {
    window.alert(data.message)
    location.reload();
});
function remove_SR(shift_room_id, student_id, exam_subject_id) {
    socket.emit("shift_room.removing", {shift_room_id: +shift_room_id, student_id: +student_id, exam_subject_id: exam_subject_id.toString()});

}
function reg_SR(shift_room_id, student_id, exam_subject_id) {
    socket.emit('shift_room.resgisting', {shift_room_id: +shift_room_id, student_id: +student_id, exam_subject_id: exam_subject_id.toString()});
}

function convertTime(unixtimestamp){
    // Convert timestamp to milliseconds
    let date = new Date(unixtimestamp*1000);
    // Year
    let year = formatTime(date.getFullYear());
    // Day
    let day = formatTime(date.getDate());
    // Month
    let month =formatTime((date.getMonth()+1));
    let hour = formatTime(date.getHours());
    let min = formatTime(date.getMinutes());

    let convdataTime = hour+':'+min+' '+day+'/'+month+'/'+year;
    return convdataTime;
}
function formatTime(valTime) {
    if (valTime<10)
        valTime='0'+valTime;
    return valTime;
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
    if(res['status']==20){
        document.getElementById("profile").innerHTML=res['data']['fullname']+"-"+"["+res['data']['user_name']+"]"
    }
}

var del_sr_info;
 function openDelModal(shift_room_id, student_id, exam_subject_id) {
    $('#deleteModal').modal('show');
    del_sr_info = [shift_room_id,student_id,exam_subject_id];
    console.log(del_sr_info);
 }
 function confirmDel() {
     remove_SR(del_sr_info[0],del_sr_info[1],del_sr_info[2]);
 }
var reg_sr_info;
function openRegModal(shift_room_id, student_id, exam_subject_id) {
    $('#regModal').modal('show');
    reg_sr_info = [shift_room_id,student_id,exam_subject_id];
    console.log(reg_sr_info);
}
function confirmReg() {
    reg_SR(reg_sr_info[0],reg_sr_info[1],reg_sr_info[2]);
}
