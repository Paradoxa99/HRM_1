import Utils from './utilsModule.js';

const STORAGE_KEY = 'hrm_users_v1';
const SESSION_KEY = 'hrm_session_v1';

// simple closure-based hasher (NOT secure, demo only)
function createHasher(){
  const salt = Math.random().toString(36).slice(2);
  return (pwd)=>{
    // simple reversible-ish hash for demo
    let s = salt + pwd;
    let h = 0; for(let i=0;i<s.length;i++) h = (h<<5)-h + s.charCodeAt(i);
    return `${h.toString(36)}:${salt}`;
  };
}

const hasher = createHasher();

async function init(){
  // init default admin user if none
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if(!users){
    users = [{id:'u_admin',username:'admin',password:hasher('admin'),role:'admin'}];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
}

async function login(username,password){
  await Utils.delay(400);
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const hashed = users.find(u=>u.username===username && u.password===hasher(password));
  if(hashed){
    localStorage.setItem(SESSION_KEY, JSON.stringify({userId:hashed.id,username:hashed.username,ts:Date.now()}));
    return true;
  }
  return false;
}

function logout(){
  localStorage.removeItem(SESSION_KEY);
}

function isAuthenticated(){
  return !!localStorage.getItem(SESSION_KEY);
}

function getCurrentUser(){
  const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  return s;
}

export default {init,login,logout,isAuthenticated,getCurrentUser};
