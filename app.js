import Auth from './modules/authModule.js';
import EmployeeDb from './modules/employeeDbModule.js';
import AddEmployee from './modules/addEmployeeModule.js';
import EditEmployee from './modules/editEmployeeModule.js';
import DeleteEmployee from './modules/deleteEmployeeModule.js';
import SearchEmployee from './modules/searchEmployeeModule.js';
import Department from './modules/departmentModule.js';
import Position from './modules/positionModule.js';
import Salary from './modules/salaryModule.js';
import Attendance from './modules/attendanceModule.js';
import Leave from './modules/leaveModule.js';
import Performance from './modules/performanceModule.js';
import Utils from './modules/utilsModule.js';

// Simple router based on data-route attributes
const content = document.getElementById('content');
const pageTitle = document.getElementById('page-title');
const menu = document.getElementById('menu');
const userArea = document.getElementById('user-area');

async function init(){
  await EmployeeDb.init();
  await Department.init();
  await Position.init();
  await Auth.init();

  bindMenu();
  updateUserArea();

  if(!Auth.isAuthenticated()){
    renderLogin();
    return;
  }

  navigate('dashboard');
}

function updateUserArea(){
  const user = Auth.getCurrentUser();
  if(user){
    userArea.innerText = `Hi, ${user.username}`;
  } else userArea.innerText = '';
}

function bindMenu(){
  menu.addEventListener('click', (e)=>{
    const li = e.target.closest('li[data-route]');
    if(!li) return;
    const route = li.dataset.route;
    Array.from(menu.querySelectorAll('li')).forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    navigate(route);
  });

  document.getElementById('logout').addEventListener('click', ()=>{
    Auth.logout();
    location.reload();
  });
}

function clearContent(){
  content.innerHTML = '';
}

function renderLogin(){
  clearContent();
  pageTitle.innerText = 'Login';
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `
    <h3>Login</h3>
    <form id="login-form">
      <div class="row"><label>Username</label><input name="username" required /></div>
      <div class="row"><label>Password</label><input type="password" name="password" required /></div>
      <div class="row"><button type="submit">Login</button></div>
    </form>
    <p>Default admin: admin / admin</p>
  `;
  content.appendChild(node);
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get('username');
    const password = fd.get('password');
    const ok = await Auth.login(username,password);
    if(ok){
      updateUserArea();
      navigate('dashboard');
    } else alert('Invalid credentials');
  });
}

function navigate(route){
  if(!Auth.isAuthenticated() && route !== 'login'){
    renderLogin();
    return;
  }
  clearContent();
  pageTitle.innerText = Utils.titleForRoute(route);
  switch(route){
    case 'dashboard':
      renderDashboard();
      break;
    case 'add':
      AddEmployee.render(content);
      break;
    case 'edit':
      EditEmployee.render(content);
      break;
    case 'delete':
      DeleteEmployee.render(content);
      break;
    case 'search':
      SearchEmployee.render(content);
      break;
    case 'departments':
      Department.render(content);
      break;
    case 'positions':
      Position.render(content);
      break;
    case 'salary':
      Salary.render(content);
      break;
    case 'attendance':
      Attendance.render(content);
      break;
    case 'leave':
      Leave.render(content);
      break;
    case 'performance':
      Performance.render(content);
      break;
    default:
      content.innerText = 'Not implemented';
  }
}

function renderDashboard(){
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `
    <h3>Dashboard</h3>
    <p>Welcome to HRM app (Vanilla JS). Use the menu to navigate modules.</p>
    <div id="dash-stats"></div>
  `;
  content.appendChild(node);
  const stats = document.getElementById('dash-stats');
  const emps = EmployeeDb.getAllEmployees();
  const depts = Department.getAllDepartments();
  stats.innerHTML = `<p>Employees: ${emps.length}</p><p>Departments: ${depts.length}</p>`;
}

window.addEventListener('DOMContentLoaded', init);
export default {navigate};
