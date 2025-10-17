import EmployeeDb from './employeeDbModule.js';
const KEY='hrm_attendance_v1';
let logs = [];

function init(){
  const raw = localStorage.getItem(KEY);
  if(raw) logs = JSON.parse(raw); else logs = [];
}

function save(){localStorage.setItem(KEY,JSON.stringify(logs));}

function checkIn(employeeId){
  const date = new Date();
  logs.push({id:employeeId,employeeId,date:date.toISOString(),checkIn:date.toISOString(),checkOut:null});
  save();
}

function checkOut(employeeId){
  // find last without checkout
  for(let i=logs.length-1;i>=0;i--){if(logs[i].employeeId===employeeId && !logs[i].checkOut){logs[i].checkOut=new Date().toISOString();save();return true;}}
  return false;
}

function getAttendanceReport(employeeId,fromDate,toDate){
  const from = new Date(fromDate); const to = new Date(toDate);
  return logs.filter(l=>l.employeeId===employeeId && new Date(l.date)>=from && new Date(l.date)<=to).map(l=>({date:l.date,checkIn:l.checkIn,checkOut:l.checkOut, hours: l.checkOut?((new Date(l.checkOut)-new Date(l.checkIn))/36e5):0}));
}

function render(container){
  const node=document.createElement('div');node.className='card';
  node.innerHTML = `<h3>Attendance</h3>
    <div class="row"><label>Employee ID</label><input id="att-emp" /></div>
    <div class="row"><button id="cin">Check In</button><button id="cout">Check Out</button></div>
    <div id="att-log"></div>`;
  container.appendChild(node);
  node.querySelector('#cin').addEventListener('click', ()=>{const id=node.querySelector('#att-emp').value.trim(); if(id){checkIn(id); alert('Checked in');}});
  node.querySelector('#cout').addEventListener('click', ()=>{const id=node.querySelector('#att-emp').value.trim(); if(id){const ok=checkOut(id); alert(ok?'Checked out':'No open check-in');}});
}

export default {init,checkIn,checkOut,getAttendanceReport,render};
