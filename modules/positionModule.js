import Utils from './utilsModule.js';
const KEY='hrm_positions_v1';
let positions = [];

async function init(){
  const raw = localStorage.getItem(KEY);
  if(raw) positions = JSON.parse(raw);
  else {
    positions = [{id:'p1',title:'Sales Rep',description:'Handles sales',salaryBase:700},{id:'p2',title:'HR Manager',description:'Human resources',salaryBase:900},{id:'p3',title:'Developer',description:'Software dev',salaryBase:1000}];
    localStorage.setItem(KEY,JSON.stringify(positions));
  }
}

function getAllPositions(){return positions.slice();}

async function addPosition(title,desc,salaryBase=0){const p={id:Utils.genId('pos'),title,description:desc,salaryBase};positions.push(p);localStorage.setItem(KEY,JSON.stringify(positions));await Utils.delay(200);}

function editPosition(id,updates){const i=positions.findIndex(p=>p.id===id);if(i===-1) return false;positions[i]={...positions[i],...updates};localStorage.setItem(KEY,JSON.stringify(positions));return true}

function deletePosition(id){const i=positions.findIndex(p=>p.id===id);if(i===-1) return false;positions.splice(i,1);localStorage.setItem(KEY,JSON.stringify(positions));return true}

function render(container){
  const node=document.createElement('div');node.className='card';
  node.innerHTML = `<h3>Positions</h3>
    <div id="pos-add" class="row"><input id="pos-title" placeholder="Title" /><input id="pos-salary" placeholder="Base salary" type="number" /><button id="pos-add-btn">Add</button></div>
    <div id="pos-list"></div>`;
  container.appendChild(node);
  node.querySelector('#pos-add-btn').addEventListener('click', async ()=>{const t=node.querySelector('#pos-title').value.trim();const s=Number(node.querySelector('#pos-salary').value)||0; if(!t) return; await addPosition(t,'',s); renderList(node.querySelector('#pos-list')); node.querySelector('#pos-title').value=''; node.querySelector('#pos-salary').value='';});
  renderList(node.querySelector('#pos-list'));
}

function renderList(container){container.innerHTML='';const t=document.createElement('table');t.innerHTML='<thead><tr><th>ID</th><th>Title</th><th>Base</th><th>Actions</th></tr></thead>';const tb=document.createElement('tbody');positions.forEach(p=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${p.id}</td><td>${p.title}</td><td>${p.salaryBase}</td><td><button class="edit" data-id="${p.id}">Edit</button> <button class="del" data-id="${p.id}">Delete</button></td>`;tb.appendChild(tr)});t.appendChild(tb);container.appendChild(t);
  container.querySelectorAll('button.edit').forEach(b=>b.addEventListener('click', (e)=>{const id=e.target.dataset.id; const newTitle = prompt('New title'); if(newTitle) {editPosition(id,{title:newTitle}); renderList(container);} }));
  container.querySelectorAll('button.del').forEach(b=>b.addEventListener('click', (e)=>{const id=e.target.dataset.id; if(confirm('Delete position?')){deletePosition(id); renderList(container);} }));
}

export default {init,getAllPositions,addPosition,editPosition,deletePosition,render};
