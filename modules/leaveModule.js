const KEY='hrm_leaves_v1';
let leaves=[];
let balances={}; // simple map employeeId->days

function init(){const raw=localStorage.getItem(KEY); if(raw) leaves=JSON.parse(raw); else leaves=[]}
function save(){localStorage.setItem(KEY,JSON.stringify(leaves));}

function requestLeave(employeeId,startDate,endDate,type='annual'){
  const id = `${employeeId}_${Date.now()}`;
  const rec={id,employeeId,startDate,endDate,type,status:'pending'};leaves.push(rec);save();return rec;
}

function approveLeave(leaveId){const idx=leaves.findIndex(l=>l.id===leaveId); if(idx===-1) return false; leaves[idx].status='approved'; // deduct balance
  const days = (new Date(leaves[idx].endDate)-new Date(leaves[idx].startDate))/864e5 + 1;
  balances[leaves[idx].employeeId] = (balances[leaves[idx].employeeId]||20) - days;
  save(); return true;
}

function getLeaveBalance(employeeId){return balances[employeeId]||20}

function getRequests(){return leaves.slice();}

function render(container){
  const node=document.createElement('div');node.className='card';
  node.innerHTML = `<h3>Leave Requests</h3>
    <div id="leave-add" class="row"><input id="lv-emp" placeholder="Emp ID" /><input id="lv-start" type="date" /><input id="lv-end" type="date" /><select id="lv-type"><option value="annual">Annual</option><option value="sick">Sick</option></select><button id="lv-req">Request</button></div>
    <div id="lv-list"></div>`;
  container.appendChild(node);
  node.querySelector('#lv-req').addEventListener('click', ()=>{const emp=node.querySelector('#lv-emp').value.trim();const s=node.querySelector('#lv-start').value;const e=node.querySelector('#lv-end').value; if(!emp||!s||!e) return; requestLeave(emp,s,e,node.querySelector('#lv-type').value); renderList(node.querySelector('#lv-list'));});
  renderList(node.querySelector('#lv-list'));
}

function renderList(container){container.innerHTML='';const list=getRequests();const t=document.createElement('table');t.innerHTML='<thead><tr><th>ID</th><th>Emp</th><th>From</th><th>To</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>';const tb=document.createElement('tbody');list.forEach(l=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${l.id}</td><td>${l.employeeId}</td><td>${l.startDate}</td><td>${l.endDate}</td><td>${l.type}</td><td>${l.status}</td><td>${l.status==='pending'?'<button class="approve" data-id="'+l.id+'">Approve</button>':''}</td>`;tb.appendChild(tr)});t.appendChild(tb);container.appendChild(t);
  container.querySelectorAll('button.approve').forEach(b=>b.addEventListener('click',(e)=>{const id=e.target.dataset.id; approveLeave(id); renderList(container); }));
}

export default {init,requestLeave,approveLeave,getLeaveBalance,getRequests,render};
