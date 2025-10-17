import Utils from './utilsModule.js';

const STORAGE_KEY = 'hrm_users_v1';
const SESSION_KEY = 'hrm_session_v1';
const SALT_KEY = 'hrm_salt_v1';

// simple closure-based hasher factory (NOT secure, demo only)
function createHasher(salt){
  return (pwd)=>{
    // simple deterministic hash using provided salt
    let s = salt + pwd;
    let h = 0; for(let i=0;i<s.length;i++) h = (h<<5)-h + s.charCodeAt(i);
    return `${h.toString(36)}:${salt}`;
  };
}

let hasher = null;

async function init(){
  // Ensure a persistent salt is available so hashes remain stable across reloads
  let salt = localStorage.getItem(SALT_KEY);
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if(users && users.length){
    // try to extract salt from first user's stored password if not present
    if(!salt){
      const pw = users[0].password || '';
      const parts = pw.split(':');
      if(parts.length>1){ salt = parts[1]; localStorage.setItem(SALT_KEY, salt); }
    }
  }
  if(!salt){
    // generate and persist a salt
    salt = Math.random().toString(36).slice(2);
    localStorage.setItem(SALT_KEY, salt);
  }
  hasher = createHasher(salt);

  // init default admin user if none
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
