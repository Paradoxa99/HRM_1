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
    const v = input.value.trim().toLowerCase();
    const list = EmployeeDb.getAllEmployees().filter(e=>{
      if(!v) return false;
      return e.id.toLowerCase()===v || e.name.toLowerCase().includes(v);
    });
    const area = node.querySelector('#del-area'); area.innerHTML='';
    if(!list.length) return;
    // render table of matches
    const t = document.createElement('table');
    t.innerHTML = `<thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>Position</th><th>Action</th></tr></thead>`;
    const tb = document.createElement('tbody');
    list.forEach(e=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${e.id}</td><td>${e.name}</td><td>${e.departmentId}</td><td>${e.positionId}</td><td><button class="del-row" data-id="${e.id}">Delete</button></td>`;
      tb.appendChild(tr);
    });
    t.appendChild(tb); area.appendChild(t);

    area.querySelectorAll('button.del-row').forEach(b=>{
      b.addEventListener('click', (ev)=>{
        const id = ev.target.dataset.id;
        if(!id) return;
        if(confirm(`Confirm delete employee ${id}?`)){
          const ok = EmployeeDb.deleteEmployee(id);
          if(ok){ alert('Deleted'); input.value=''; area.innerHTML=''; }
          else alert('Failed to delete');
        }
      });
    });
  });
}

export default {render};
