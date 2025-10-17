import EmployeeDb from './employeeDbModule.js';
import Department from './departmentModule.js';
import Position from './positionModule.js';

function render(container){
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `
    <h3>Sửa nhân viên</h3>
    <div class="row"><label>Tìm (ID hoặc Name)</label><input id="search-term" /></div>
    <div id="edit-area"></div>
  `;
  container.appendChild(node);

  const btn = node.querySelector('#search-term');
  btn.addEventListener('input', ()=>{
    const v = btn.value.trim();
    const found = EmployeeDb.getAllEmployees().find(e=>e.id===v || e.name.toLowerCase().includes(v.toLowerCase()));
    const area = node.querySelector('#edit-area');
    area.innerHTML = '';
    if(!found) return;
    const form = document.createElement('form');
    form.innerHTML = `
      <div class="row"><label>Name</label><input name="name" value="${found.name}" required /></div>
      <div class="row"><label>Department</label><select name="department"></select></div>
      <div class="row"><label>Position</label><select name="position"></select></div>
      <div class="row"><label>Salary</label><input name="salary" type="number" value="${found.salary}" required /></div>
      <div class="row"><label>Hire Date</label><input name="hireDate" type="date" value="${found.hireDate}" required /></div>
      <div class="row"><button type="submit">Save</button></div>
    `;
    area.appendChild(form);

    const deptSel = form.querySelector('select[name=department]');
    const posSel = form.querySelector('select[name=position]');
    Department.getAllDepartments().forEach(d=>{const o=document.createElement('option'); o.value=d.id; o.text=d.name; if(d.id===found.departmentId) o.selected=true; deptSel.appendChild(o);});
    Position.getAllPositions().forEach(p=>{const o=document.createElement('option'); o.value=p.id; o.text=p.title; if(p.id===found.positionId) o.selected=true; posSel.appendChild(o);});

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const updates = {name:fd.get('name').trim(),departmentId:fd.get('department'),positionId:fd.get('position'),salary:Number(fd.get('salary')),hireDate:fd.get('hireDate')};
      // Validate name
      if(!updates.name){ alert('Name is required'); return; }
      // Check duplicate name (allow same record)
      const others = EmployeeDb.getAllEmployees().filter(e=>e.id!==found.id);
      const dup = others.find(e=>e.name.toLowerCase()===updates.name.toLowerCase());
      if(dup){ alert('Another employee with this name exists'); return; }
      // Validate salary limits based on selected position
      const pos = Position.getAllPositions().find(p=>p.id===updates.positionId);
      const minSalary = pos ? Number(pos.salaryBase || 0) : 0;
      const maxSalary = pos ? minSalary * 2 : Number.POSITIVE_INFINITY;
      if(!(updates.salary > 0) || updates.salary < minSalary || updates.salary > maxSalary){ alert(`Salary must be between ${minSalary} and ${maxSalary}`); return; }
      const ok = EmployeeDb.updateEmployee(found.id,updates);
      if(ok) alert('Saved'); else alert('Failed');
    });
  });
}

export default {render};
