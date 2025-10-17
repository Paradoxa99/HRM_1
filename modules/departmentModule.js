import Utils from './utilsModule.js';
const KEY = 'hrm_departments_v1';
let depts = [];

function init(){
  const raw = localStorage.getItem(KEY);
  if(raw){depts = JSON.parse(raw);} else {
    depts = [{id:'d1',name:'Sales',managerId:null},{id:'d2',name:'HR',managerId:null},{id:'d3',name:'IT',managerId:null}];
    localStorage.setItem(KEY, JSON.stringify(depts));
  }
}

function getAllDepartments(){return depts.slice();}
function addDepartment(name){const d={id:Utils.genId('dept'),name,managerId:null};depts.push(d);localStorage.setItem(KEY,JSON.stringify(depts));}
function editDepartment(id,newName){const i=depts.findIndex(x=>x.id===id);if(i===-1) return false;depts[i].name=newName;localStorage.setItem(KEY,JSON.stringify(depts));return true}
function deleteDepartment(id){const i=depts.findIndex(x=>x.id===id);if(i===-1) return false;depts.splice(i,1);localStorage.setItem(KEY,JSON.stringify(depts));return true}

function render(container){
  const node = document.createElement('div'); node.className='card';
  node.innerHTML = `<h3>Phòng ban</h3>
    <div id="dept-add" class="row"><input id="dept-name" placeholder="New department" /><button id="dept-add-btn">Add</button></div>
    <div id="dept-list"></div>`;
  container.appendChild(node);
  node.querySelector('#dept-add-btn').addEventListener('click', ()=>{const name=node.querySelector('#dept-name').value.trim(); if(!name) return; addDepartment(name); renderList(node.querySelector('#dept-list')); node.querySelector('#dept-name').value='';});
  renderList(node.querySelector('#dept-list'));
}

function renderList(container){container.innerHTML='';const t=document.createElement('table');t.innerHTML='<thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>';const tb=document.createElement('tbody');depts.forEach(d=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${d.id}</td><td>${d.name}</td><td><button class="edit" data-id="${d.id}">Edit</button> <button class="del" data-id="${d.id}">Delete</button></td>`;tb.appendChild(tr)});t.appendChild(tb);container.appendChild(t);
  container.querySelectorAll('button.edit').forEach(b=>b.addEventListener('click', (e)=>{const id=e.target.dataset.id; const newName = prompt('New name'); if(newName) {editDepartment(id,newName); renderList(container);} }));
  container.querySelectorAll('button.del').forEach(b=>b.addEventListener('click', (e)=>{const id=e.target.dataset.id; if(confirm('Delete dept?')){deleteDepartment(id); renderList(container);} }));
}

export default {init,getAllDepartments,addDepartment,editDepartment,deleteDepartment,render};
