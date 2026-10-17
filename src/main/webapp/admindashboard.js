const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const titles={dashboard:['Dashboard','Live overview of your protected network'],users:['Manage Users','Control who can reach your systems'],
    scans:['Scan History','Every sweep, with results at a glance'],threats:['Threat Records','Review and respond to detected threats']};

/* Data */
const stats=[['Threats blocked',12480,'+8.2% today','--c:#22f0ff'],['Active users',248,'12 online now','--c:#2cffb0'],
    ['Scans completed',1936,'Last run 4 min ago','--c:#ffb84d'],['Open threats',3,'Needs review','--c:#ff4d6d']];
const users=[['Aarav Mehta','Super Admin','2 min ago',1],['Priya Nair','Analyst','18 min ago',1],['Rohan Das','Analyst','3 hr ago',1],
    ['Sneha Patel','Auditor','Yesterday',0],['Kabir Singh','Operator','2 days ago',1],['Ishita Roy','Operator','5 days ago',0]];
const scans=[['Full system scan','Core servers','Today 09:12','Clean',100],['Malware sweep','Employee devices','Today 06:30','2 found',100],
    ['Vulnerability scan','Web gateway','Yesterday','1 found',100],['Port audit','Firewall','Yesterday','Clean',100],['Deep scan','Database cluster','Running now','In progress',64]];
const threats=[['Ransomware dropper','185.220.101.4','Critical','Isolated'],['Brute-force login','103.77.12.90','High','Blocked'],
    ['SQL injection attempt','45.9.148.22','High','Open'],['Phishing link','91.240.118.7','Medium','Quarantined'],['Port scanner','198.51.100.8','Medium','Open'],['Suspicious download','10.0.4.37','Critical','Open']];
const feed=[['Blocked brute-force attack from 103.77.12.90','#ff4d6d','Just now'],['Scan finished on Web gateway','#2cffb0','4 min ago'],
    ['New admin login from Bhubaneswar','#22f0ff','22 min ago'],['Firewall rules updated','#ffb84d','1 hr ago']];
const sev={Critical:'#ff4d6d',High:'#ffb84d',Medium:'#22f0ff'};
const initials=n=>n.split(' ').map(w=>w[0]).join('');

/* Dashboard */
$('#stats').innerHTML=stats.map(([l,v,n,c],i)=>`<div class="stat" style="${c};animation:vin .7s ${i*.1}s var(--ease) both"><small>${l}</small><b data-n="${v}">0</b><em>${n}</em></div>`).join('');
function countUp(){$$('.stat b').forEach(el=>{const t=+el.dataset.n,s=performance.now();
    (function f(now){const p=Math.min((now-s)/1400,1),e=1-Math.pow(1-p,4);el.textContent=Math.round(t*e).toLocaleString();p<1&&requestAnimationFrame(f)})(s)})}
$('#feed').innerHTML=feed.map(([t,c,w],i)=>`<li style="--c:${c};animation-delay:${.4+i*.12}s"><i></i>${t}<time>${w}</time></li>`).join('');

function drawChart(){
    const d=[40,65,48,90,72,120,98],days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],W=600,H=220,max=140;
    const pts=d.map((v,i)=>[i*(W/6),H-12-(v/max)*(H-30)]);
    let p=`M${pts[0]}`;for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],cx=(x0+x1)/2;p+=` C${cx},${y0} ${cx},${y1} ${x1},${y1}`}
    $('#chart').innerHTML=`<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22f0ff" stop-opacity=".35"/><stop offset="1" stop-color="#22f0ff" stop-opacity="0"/></linearGradient></defs>
  <path class="ar" d="${p} L${W},${H} L0,${H}Z"/><path class="ln" id="ln" d="${p}" vector-effect="non-scaling-stroke"/>`;
    const l=$('#ln'),len=l.getTotalLength();l.style.strokeDasharray=len;l.style.strokeDashoffset=len;
    l.getBoundingClientRect();l.style.transition='stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)';l.style.strokeDashoffset=0;
    $('#days').innerHTML=days.map(x=>`<span>${x}</span>`).join('');
}

/* Tables */
const row=(i,h)=>`<tr style="animation-delay:${i*.07}s">${h}</tr>`;
function renderUsers(f=''){
    $('#uBody').innerHTML=users.map((u,i)=>({u,i})).filter(({u})=>(u[0]+u[1]).toLowerCase().includes(f.toLowerCase()))
        .map(({u,i},k)=>row(k,`<td><div class="u"><div class="av">${initials(u[0])}</div><div>${u[0]}</div></div></td><td>${u[1]}</td><td>${u[2]}</td>
  <td><button class="sw ${u[3]?'on':''}" data-i="${i}" aria-label="Toggle access for ${u[0]}"></button></td>`)).join('')||'<tr><td colspan="4">No users match that search.</td></tr>';
}
$('#uBody').addEventListener('click',e=>{const b=e.target.closest('.sw');if(b){b.classList.toggle('on');users[b.dataset.i][3]=+b.classList.contains('on')}});
$('#q').addEventListener('input',e=>renderUsers(e.target.value));

function renderScans(){
    $('#sBody').innerHTML=scans.map((s,i)=>{const c=s[3]==='Clean'?'#2cffb0':s[3]==='In progress'?'#22f0ff':'#ffb84d';
        return row(i,`<td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td><span class="tag" style="--c:${c}">${s[3]}</span></td><td><div class="pg"><i data-w="${s[4]}"></i></div></td>`)}).join('');
    requestAnimationFrame(()=>requestAnimationFrame(()=>$$('.pg i').forEach(i=>i.style.width=i.dataset.w+'%')));
}
let filter='all';
function renderThreats(){
    $('#tBody').innerHTML=threats.filter(t=>filter==='all'||t[2]===filter).map((t,i)=>
        row(i,`<td>${t[0]}</td><td>${t[1]}</td><td><span class="tag" style="--c:${sev[t[2]]}">${t[2]}</span></td><td>${t[3]}</td>`)).join('');
}
$('#chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    $$('#chips button').forEach(x=>x.classList.toggle('on',x===b));filter=b.dataset.f;renderThreats()});

/* Navigation */
const nav=$('#nav'),pill=$('#pill');
function movePill(){const a=$('.nav button.active');pill.style.height=a.offsetHeight+'px';pill.style.transform=`translateY(${a.offsetTop}px)`}
const hooks={dashboard(){countUp();drawChart()},users(){renderUsers($('#q').value)},scans:renderScans,threats:renderThreats};
function go(v){
    $$('.nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
    $$('.view').forEach(s=>{s.classList.remove('show');if(s.id===v){void s.offsetWidth;s.classList.add('show')}});
    $('#title').textContent=titles[v][0];$('#sub').textContent=titles[v][1];
    hooks[v]();movePill();$('.main').scrollTo({top:0,behavior:'smooth'});
}
nav.addEventListener('click',e=>{const b=e.target.closest('button[data-view]');if(b)go(b.dataset.view)});
addEventListener('resize',movePill);

/* Logout */
const modal=$('#modal'),lock=$('#lock'),app=$('#app');
$('#logoutBtn').onclick=()=>modal.classList.add('show');
$('#stay').onclick=()=>modal.classList.remove('show');
modal.onclick=e=>{if(e.target===modal)modal.classList.remove('show')};
addEventListener('keydown',e=>e.key==='Escape'&&modal.classList.remove('show'));
$('#confirm').onclick=()=>{modal.classList.remove('show');app.classList.add('out');setTimeout(()=>lock.classList.add('show'),350)};
$('#again').onclick=()=>{lock.classList.remove('show');app.classList.remove('out');go('dashboard')};

(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>go('dashboard'));
go('dashboard');