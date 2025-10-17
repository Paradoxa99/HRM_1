import EmployeeDb from './employeeDbModule.js';
import Department from './departmentModule.js';

function render(container){
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `
    <h3>Tìm kiếm nhân viên</h3>
    <form id="search-form">
      <div class="row"><label>Name (regex)</label><input name="name" /></div>
      <div class="row"><label>Department</label><select name="department"><option value="">All</option></select></div>
      <div class="row"><label>Salary Min</label><input name="min" type="number" /></div>
      <div class="row"><label>Salary Max</label><input name="max" type="number" /></div>
      <div class="row"><button type="submit">Search</button></div>
    </form>
    <div id="search-results"></div>
  `;
  container.appendChild(node);

  const deptSel = node.querySelector('select[name=department]');
  Department.getAllDepartments().forEach(d=>{const o=document.createElement('option');o.value=d.id;o.text=d.name;deptSel.appendChild(o);});

  node.querySelector('#search-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name').trim();
    const dep = fd.get('department');
    const min = Number(fd.get('min'))||0;
    const max = Number(fd.get('max'))||Number.POSITIVE_INFINITY;
    let list = EmployeeDb.getAllEmployees();
    if(name){
      const re = new RegExp(name,'i');
      list = list.filter(e=>re.test(e.name));
    }
    if(dep) list = list.filter(e=>e.departmentId===dep);
    list = list.filter(e=>e.salary>=min && e.salary<=max);
    // sort by salary desc
    list.sort((a,b)=>b.salary-a.salary);
    renderTable(node.querySelector('#search-results'),list);
  });
}

function renderTable(container,list){
  container.innerHTML = '';
  const t = document.createElement('table');
  t.innerHTML = `<thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>Salary</th></tr></thead>`;
  const tb = document.createElement('tbody');
  list.forEach(e=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${e.id}</td><td>${e.name}</td><td>${e.departmentId}</td><td>${e.salary}</td>`;tb.appendChild(tr);});
  t.appendChild(tb);container.appendChild(t);
}

export default {render};
