import EmployeeDb from './employeeDbModule.js';

function calculateNetSalary(emp){
  return Number(emp.salary || 0) + Number(emp.bonus || 0) - Number(emp.deduction || 0);
}

function generatePayrollReport(){
  return EmployeeDb.getAllEmployees().map(e=>({id:e.id,name:e.name,gross:e.salary,bonus:e.bonus||0,deduction:e.deduction||0,net:calculateNetSalary(e)}));
}

function render(container){
  const node = document.createElement('div'); node.className='card';
  node.innerHTML = `<h3>Payroll</h3><div id="payroll"></div>`;
  container.appendChild(node);
  const report = generatePayrollReport();
  const t = document.createElement('table'); t.innerHTML = `<thead><tr><th>ID</th><th>Name</th><th>Gross</th><th>Bonus</th><th>Deduction</th><th>Net</th></tr></thead>`;
  const tb = document.createElement('tbody'); report.forEach(r=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${r.id}</td><td>${r.name}</td><td>${r.gross}</td><td>${r.bonus}</td><td>${r.deduction}</td><td>${r.net}</td>`;tb.appendChild(tr);}); t.appendChild(tb); node.querySelector('#payroll').appendChild(t);
}

export default {calculateNetSalary,generatePayrollReport,render};
