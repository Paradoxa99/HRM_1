import EmployeeDb from './employeeDbModule.js';
import Department from './departmentModule.js';
import Position from './positionModule.js';
import Utils from './utilsModule.js';

function render(container){
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `
    <h3>Thêm nhân viên</h3>
    <form id="add-emp-form">
      <div class="row"><label>Name</label><input name="name" required /></div>
      <div class="row"><label>Department</label><select name="department" required></select></div>
      <div class="row"><label>Position</label><select name="position" required></select></div>
      <div class="row"><label>Salary</label><input name="salary" type="number" required /></div>
      <div class="row"><label>Hire Date</label><input name="hireDate" type="date" required /></div>
      <div class="row"><button type="submit">Add</button></div>
    </form>
    <div id="add-result"></div>
  `;
  container.appendChild(node);

  const deptSel = node.querySelector('select[name=department]');
  const posSel = node.querySelector('select[name=position]');
  Department.getAllDepartments().forEach(d=>{
    const o = document.createElement('option'); o.value = d.id; o.text = d.name; deptSel.appendChild(o);
  });
  Position.getAllPositions().forEach(p=>{const o = document.createElement('option'); o.value=p.id; o.text=p.title; posSel.appendChild(o);});

  const form = node.querySelector('#add-emp-form');
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name').trim();
    const department = fd.get('department');
    const position = fd.get('position');
    const salary = Number(fd.get('salary'));
    const hireDate = fd.get('hireDate');
    if(!name || salary<=0){
      document.getElementById('add-result').innerText = 'Invalid input';
      return;
    }
    const emp = {id: Utils.genId('emp'),name,departmentId:department,positionId:position,salary,bonus:0,deduction:0,hireDate};
    EmployeeDb.addEmployee(emp);
    document.getElementById('add-result').innerText = 'Added successfully';
    form.reset();
  });
}

export default {render};
