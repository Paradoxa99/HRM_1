import EmployeeDb from './employeeDbModule.js';

function render(container){
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `
    <h3>Xóa nhân viên</h3>
    <div class="row"><label>Tìm (ID or name)</label><input id="del-search" /></div>
    <div id="del-area"></div>
  `;
  container.appendChild(node);

  const input = node.querySelector('#del-search');
  input.addEventListener('input', ()=>{
    const v = input.value.trim();
    const found = EmployeeDb.getAllEmployees().find(e=>e.id===v || e.name.toLowerCase().includes(v.toLowerCase()));
    const area = node.querySelector('#del-area'); area.innerHTML='';
    if(!found) return;
    const info = document.createElement('div');
    info.innerHTML = `<p>${found.id} - ${found.name}</p><button id="del-btn">Delete</button>`;
    area.appendChild(info);
    info.querySelector('#del-btn').addEventListener('click', ()=>{
      if(confirm('Confirm delete?')){
        const ok = EmployeeDb.deleteEmployee(found.id);
        if(ok){ alert('Deleted'); area.innerHTML=''; input.value=''; }
        else alert('Failed');
      }
    });
  });
}

export default {render};
