const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- data ---------- */
const tips = [
    { e:'🔑', t:'Use a password manager', c:'accounts', col:'#5af2c4', d:'Let an app create and remember a unique password for every site. You only remember one strong master password.' },
    { e:'📲', t:'Turn on 2-step login', c:'accounts', col:'#ffd23f', d:'Add a code from an authenticator app or a security key. Even if your password leaks, thieves are stuck.' },
    { e:'🧩', t:'Never reuse passwords', c:'accounts', col:'#ff8fab', d:'One leaked site shouldn’t unlock your email and bank. Every account gets its own password.' },
    { e:'🔄', t:'Update everything', c:'phone', col:'#6ec6ff', d:'Updates patch holes hackers love. Switch on automatic updates for your phone, apps and computer.' },
    { e:'🧐', t:'Check app permissions', c:'phone', col:'#5af2c4', d:'A torch app doesn’t need your contacts. Open Settings → Privacy and remove access that makes no sense.' },
    { e:'🏪', t:'Install from official stores', c:'phone', col:'#ffd23f', d:'Stick to Google Play and the App Store. Apps from random links or chat groups often hide malware.' },
    { e:'🎣', t:'Spot phishing bait', c:'scams', col:'#ff8fab', d:'Urgent threats, odd sender addresses and “click now” links are red flags. Go to the site yourself instead.' },
    { e:'🔢', t:'Never share your OTP', c:'scams', col:'#6ec6ff', d:'Banks never ask for your OTP, PIN or CVV. Anyone who does is a scammer, even if they sound friendly.' },
    { e:'☎️', t:'Hang up on “officials”', c:'scams', col:'#5af2c4', d:'Fake police or courier calls create panic. Hang up, then call the official number you find yourself.' },
    { e:'☕', t:'Be careful on public Wi-Fi', c:'network', col:'#ffd23f', d:'Avoid banking on cafe or airport Wi-Fi. Use mobile data or a trusted VPN instead.' },
    { e:'📡', t:'Secure your home router', c:'network', col:'#ff8fab', d:'Change the default admin password, use WPA3 or WPA2, and keep the router firmware updated.' },
    { e:'💾', t:'Back up your data', c:'network', col:'#6ec6ff', d:'Follow 3-2-1: three copies, two kinds of storage, one off-site. Ransomware can’t hold you hostage then.' },
];
const villains = [
    { e:'🎣', n:'Phisher Phil', p:'Sends fake emails and texts pretending to be your bank or boss.', f:'Check the sender, never click blindly.' },
    { e:'🐛', n:'Malware Mo', p:'Hides inside free downloads and cracked software to spy on you.', f:'Download only from trusted sources.' },
    { e:'🔒', n:'Ransom Rex', p:'Locks your files and demands money to give them back.', f:'Keep offline backups.' },
    { e:'🕵️', n:'Snoop Sid', p:'Watches unprotected Wi-Fi traffic to steal logins.', f:'Use HTTPS sites and a VPN.' },
    { e:'🎭', n:'Fake Fiona', p:'Builds fake profiles and offers that look too good to be true.', f:'Verify before you trust or pay.' },
    { e:'🔨', n:'Brute Bo', p:'Guesses millions of passwords per second.', f:'Use long, random passphrases.' },
];
const checks = [
    'I use a different password for each account', 'I have 2-step login on my email',
    'My phone and apps update automatically', 'I never share OTPs or PINs',
    'I back up my important files', 'I lock my phone with a PIN or biometrics',
    'I think before clicking links in messages',
];

/* ---------- background bubbles ---------- */
const bw = $('#bubbles');
for (let i = 0; i < 18; i++) {
    const b = document.createElement('span'), s = 20 + Math.random() * 80;
    b.className = 'bubble';
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;--dx:${(Math.random() - .5) * 200}px;animation-duration:${14 + Math.random() * 20}s;animation-delay:${-Math.random() * 30}s`;
    bw.appendChild(b);
}

/* ---------- tips ---------- */
const grid = $('#tipGrid');
tips.forEach((t, i) => {
    const el = document.createElement('button');
    el.className = 'tip'; el.dataset.c = t.c; el.style.animationDelay = i * 50 + 'ms';
    el.setAttribute('aria-label', t.t + ': tap to flip');
    el.innerHTML = `<div class="inner"><div class="face front"><span class="emo">${t.e}</span><h3>${t.t}</h3><small>Tap to flip</small></div><div class="face back" style="--c:${t.col}"><p>${t.d}</p></div></div>`;
    el.onclick = () => el.classList.toggle('flip');
    grid.appendChild(el);
});
$('#filters').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach(c => c.classList.toggle('active', c === b));
    $$('.tip').forEach((t, i) => {
        const show = b.dataset.f === 'all' || t.dataset.c === b.dataset.f;
        t.classList.toggle('hide', !show);
        t.classList.remove('flip');
        t.style.animation = 'none'; t.offsetHeight; t.style.animation = ''; t.style.animationDelay = i * 40 + 'ms';
    });
};

/* ---------- villains ---------- */
$('#villains').innerHTML = villains.map(v =>
    `<article class="vil reveal"><span class="emo">${v.e}</span><h3>${v.n}</h3><p>${v.p}</p><div class="fix">🛡️ ${v.f}</div></article>`).join('');

/* ---------- password lab ---------- */
const pw = $('#pw'), faces = ['😴', '😈', '😏', '🙂', '😎', '🤩'];
const levels = [['Waiting for a password', '#ff6f91'], ['Very weak', '#ff6f91'], ['Weak', '#ff9f6f'], ['Okay', '#ffd23f'], ['Strong', '#9ae86a'], ['Unbreakable!', '#5af2c4']];
function crackTime(p) {
    let pool = 0;
    if (/[a-z]/.test(p)) pool += 26; if (/[A-Z]/.test(p)) pool += 26;
    if (/\d/.test(p)) pool += 10; if (/[^A-Za-z0-9]/.test(p)) pool += 32;
    let sec = Math.pow(pool || 1, p.length) / 1e10 / 2;
    if (/^(password|123456|qwerty|letmein|admin)/i.test(p)) sec = 0;
    if (sec < 1) return 'instantly';
    const u = [[60, 'seconds'], [60, 'minutes'], [24, 'hours'], [365, 'days'], [100, 'years'], [10, 'centuries']];
    let v = sec, unit = 'seconds';
    for (let i = 0; i < u.length; i++) { unit = u[i][1]; if (v < u[i][0] || i === u.length - 1) break; v /= u[i][0]; }
    return v > 1e6 ? 'billions of years' : Math.round(v).toLocaleString() + ' ' + unit;
}
function check() {
    const p = pw.value;
    const r = { len: p.length >= 12, up: /[A-Z]/.test(p), low: /[a-z]/.test(p), num: /\d/.test(p), sym: /[^A-Za-z0-9]/.test(p) };
    $$('#rules li').forEach(li => li.classList.toggle('ok', r[li.dataset.r]));
    let s = Object.values(r).filter(Boolean).length;
    if (p.length >= 16) s = Math.min(5, s + 1);
    if (!p) s = 0; else s = Math.max(1, Math.min(5, s));
    const [lab, col] = levels[s];
    $('#label').textContent = lab; $('#face').textContent = faces[s];
    $('#bar').style.width = (s * 20) + '%'; $('#bar').style.background = col;
    $('#time').textContent = p ? 'A hacker needs about ' + crackTime(p) + ' to crack it.' : 'Start typing…';
    $('#face').style.transform = 'scale(1.25) rotate(' + (s % 2 ? -10 : 10) + 'deg)';
    setTimeout(() => $('#face').style.transform = '', 250);
}
pw.oninput = check;
$('#toggle').onclick = e => { const h = pw.type === 'password'; pw.type = h ? 'text' : 'password'; e.target.textContent = h ? 'Hide' : 'Show'; };
$('#gen').onclick = () => {
    const w = ['Purple', 'Rocket', 'Panda', 'Cactus', 'Pickle', 'Comet', 'Waffle', 'Dragon', 'Banana', 'Thunder'];
    const r = n => w[crypto.getRandomValues(new Uint32Array(1))[0] % w.length];
    pw.value = [r(), r(), r(), r()].join('-') + (crypto.getRandomValues(new Uint32Array(1))[0] % 90 + 10) + '!';
    pw.type = 'text'; $('#toggle').textContent = 'Hide'; check();
    toast('Fresh passphrase made. Save it in a password manager!');
};

/* ---------- checklist ---------- */
const items = $('#items');
checks.forEach(c => {
    const d = document.createElement('div'); d.className = 'item'; d.tabIndex = 0; d.setAttribute('role', 'checkbox');
    d.innerHTML = `<i>✓</i>${c}`;
    const tog = () => { d.classList.toggle('on'); d.setAttribute('aria-checked', d.classList.contains('on')); score(); };
    d.onclick = tog; d.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tog(); } };
    items.appendChild(d);
});
function score() {
    const n = $$('.item.on').length, pct = Math.round(n / checks.length * 100);
    $('#ringFill').style.strokeDashoffset = 327 - 327 * pct / 100;
    $('#ringFill').style.stroke = pct > 70 ? '#5af2c4' : pct > 35 ? '#ffd23f' : '#ff6f91';
    $('#score').textContent = pct + '%';
    $('#scoreMsg').textContent = pct === 100 ? '🎉 Cyber hero! Shieldy is so proud.' : pct > 70 ? '💪 Nearly there. Just a couple more habits!' : pct > 35 ? '🙂 Good start. Keep going!' : n ? '🌱 Every habit counts. Keep ticking!' : 'Tick a few boxes to begin.';
    if (pct === 100) { $('#mascotWrap').classList.add('wow'); setTimeout(() => $('#mascotWrap').classList.remove('wow'), 700); confetti(); }
}

/* ---------- mascot: eyes follow pointer, click to jump ---------- */
const pl = $('#pupilL'), pr = $('#pupilR'), mw = $('#mascotWrap');
addEventListener('pointermove', e => {
    const r = $('.mascot').getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .45;
    const a = Math.atan2(e.clientY - cy, e.clientX - cx), d = Math.min(8, Math.hypot(e.clientX - cx, e.clientY - cy) / 40);
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    pl.setAttribute('cx', 88 + x); pl.setAttribute('cy', 120 + y); pr.setAttribute('cx', 152 + x); pr.setAttribute('cy', 120 + y);
});
mw.onclick = () => { mw.classList.remove('wow'); mw.offsetHeight; mw.classList.add('wow'); toast(['Hi! I’m Shieldy 👋', 'Stay safe out there!', 'Did you enable 2-step login?'][Math.floor(Math.random() * 3)]); };

/* ---------- counters + reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
$$('.section h2, .sub, .lab-box, .check-box, .reveal').forEach(el => { el.classList.add('reveal'); io.observe(el); });
$$('.vil').forEach((v, i) => v.style.transitionDelay = i * 80 + 'ms');
$$('[data-count]').forEach(el => {
    const end = +el.dataset.count, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
});

/* ---------- helpers ---------- */
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2400); }
function confetti() {
    const em = ['🎉', '⭐', '✨', '🛡️', '💚'];
    for (let i = 0; i < 26; i++) {
        const s = document.createElement('span');
        s.textContent = em[i % em.length];
        s.style.cssText = `position:fixed;top:-30px;left:${Math.random() * 100}vw;font-size:${18 + Math.random() * 22}px;z-index:60;pointer-events:none;transition:transform ${2 + Math.random() * 2}s ease-in,opacity 2s .8s`;
        document.body.appendChild(s);
        requestAnimationFrame(() => { s.style.transform = `translateY(110vh) rotate(${Math.random() * 720}deg)`; s.style.opacity = 0; });
        setTimeout(() => s.remove(), 4500);
    }
}