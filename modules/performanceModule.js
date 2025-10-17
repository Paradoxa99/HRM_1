const KEY='hrm_reviews_v1';
let reviews=[];

function init(){const raw=localStorage.getItem(KEY); if(raw) reviews=JSON.parse(raw); else reviews=[]}
function save(){localStorage.setItem(KEY,JSON.stringify(reviews));}

function addReview(employeeId,rating,feedback){const rec={id:`rev_${Date.now()}`,employeeId,rating,date:new Date().toISOString(),feedback};reviews.push(rec);save();return rec}

function getAverageRating(employeeId){const list = reviews.filter(r=>r.employeeId===employeeId); if(!list.length) return 0; return list.reduce((s,r)=>s+r.rating,0)/list.length}

function getTopPerformers(){
  const map = {};
  reviews.forEach(r=>{map[r.employeeId]=(map[r.employeeId]||[]).concat(r)});
  const arr = Object.keys(map).map(emp=>({employeeId:emp,avg: map[emp].reduce((s,r)=>s+r.rating,0)/map[emp].length}));
  return arr.sort((a,b)=>b.avg-a.avg);
}

function render(container){
  const node=document.createElement('div');node.className='card';
  node.innerHTML = `<h3>Performance Reviews</h3>
    <div id="rev-add" class="row"><input id="rev-emp" placeholder="Emp ID" /><input id="rev-rate" type="number" min="1" max="5" placeholder="1-5" /><input id="rev-feedback" placeholder="Feedback" /><button id="rev-add-btn">Add</button></div>
    <div id="rev-list"></div>`;
  container.appendChild(node);
  node.querySelector('#rev-add-btn').addEventListener('click', ()=>{const emp=node.querySelector('#rev-emp').value.trim();const rate=Number(node.querySelector('#rev-rate').value)||0;const fb=node.querySelector('#rev-feedback').value.trim(); if(!emp||rate<1||rate>5) return; addReview(emp,rate,fb); renderList(node.querySelector('#rev-list'));});
  renderList(node.querySelector('#rev-list'));
}

function renderList(container){container.innerHTML='';const t=document.createElement('table');t.innerHTML='<thead><tr><th>Emp</th><th>Avg</th></tr></thead>';const tb=document.createElement('tbody');const tops = getTopPerformers();tops.forEach(x=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${x.employeeId}</td><td>${x.avg.toFixed(2)}</td>`;tb.appendChild(tr)});t.appendChild(tb);container.appendChild(t)}

export default {init,addReview,getAverageRating,getTopPerformers,render};
