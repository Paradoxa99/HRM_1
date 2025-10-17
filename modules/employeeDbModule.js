import Utils from './utilsModule.js';
const KEY = 'hrm_employees_v1';

let employees = [];

function init(){
  const raw = localStorage.getItem(KEY);
  if(raw){
    employees = JSON.parse(raw);
  } else {
    // seed default 5 employees
    employees = [
      {id:'e1',name:'Nguyen Van A',departmentId:'d1',positionId:'p1',salary:800,bonus:0,deduction:0,hireDate:'2022-01-15'},
      {id:'e2',name:'Tran Thi B',departmentId:'d2',positionId:'p2',salary:900,bonus:0,deduction:0,hireDate:'2021-03-12'},
      {id:'e3',name:'Le Van C',departmentId:'d1',positionId:'p3',salary:700,bonus:0,deduction:0,hireDate:'2020-07-01'},
      {id:'e4',name:'Pham Thi D',departmentId:'d3',positionId:'p2',salary:950,bonus:0,deduction:0,hireDate:'2019-11-20'},
      {id:'e5',name:'Hoang Van E',departmentId:'d2',positionId:'p1',salary:600,bonus:0,deduction:0,hireDate:'2023-05-05'}
    ];
    localStorage.setItem(KEY, JSON.stringify(employees));
  }
}

function getAllEmployees(){
  return employees.slice();
}

function getEmployeeById(id){
  return employees.find(e=>e.id===id) || null;
}

function saveEmployees(arr){
  employees = arr.slice();
  localStorage.setItem(KEY, JSON.stringify(employees));
}

function addEmployee(emp){
  employees.push(emp);
  saveEmployees(employees);
}

function updateEmployee(id,updates){
  const idx = employees.findIndex(e=>e.id===id);
  if(idx===-1) return false;
  employees[idx] = {...employees[idx],...updates};
  saveEmployees(employees);
  return true;
}

function deleteEmployee(id){
  const idx = employees.findIndex(e=>e.id===id);
  if(idx===-1) return false;
  employees.splice(idx,1);
  saveEmployees(employees);
  return true;
}

// higher-order functions for filtering/sorting
function filterEmployees(predicate){
  return employees.filter(predicate);
}

function sortEmployees(compareFn){
  return employees.slice().sort(compareFn);
}

export default {init,getAllEmployees,getEmployeeById,saveEmployees,addEmployee,updateEmployee,deleteEmployee,filterEmployees,sortEmployees};
