const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- knowledge base ---------- */
const BRANDS = {
    paypal: ['paypal.com'], google: ['google.com', 'google.co.in', 'googleapis.com', 'gstatic.com', 'youtube.com', 'goo.gl'],
    amazon: ['amazon.com', 'amazon.in', 'amazon.co.uk', 'amazonaws.com'], apple: ['apple.com', 'icloud.com'],
    microsoft: ['microsoft.com', 'live.com', 'office.com', 'microsoftonline.com', 'outlook.com'],
    facebook: ['facebook.com', 'fb.com'], instagram: ['instagram.com'], netflix: ['netflix.com'], whatsapp: ['whatsapp.com'],
    linkedin: ['linkedin.com'], github: ['github.com'], paytm: ['paytm.com'], phonepe: ['phonepe.com'], flipkart: ['flipkart.com'],
    sbi: ['sbi.co.in', 'onlinesbi.sbi'], hdfc: ['hdfcbank.com'], icici: ['icicibank.com'], binance: ['binance.com'], coinbase: ['coinbase.com'],
    dropbox: ['dropbox.com'], twitter: ['twitter.com', 'x.com'], telegram: ['telegram.org', 't.me'],
};
const TRUSTED = new Set([].concat(...Object.values(BRANDS), ['wikipedia.org', 'mozilla.org', 'anthropic.com', 'claude.ai', 'gov.in', 'nic.in', 'stackoverflow.com', 'whatsapp.net']));
const SUS_TLDS = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'click', 'work', 'zip', 'mov', 'icu', 'buzz', 'cyou', 'rest', 'support', 'country', 'loan', 'men', 'monster'];
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'rb.gy', 'ow.ly', 'shorturl.at', 'tiny.cc'];
const KEYWORDS = ['login', 'signin', 'verify', 'secure', 'update', 'account', 'confirm', 'banking', 'bank', 'wallet', 'password', 'otp', 'suspend', 'unlock', 'prize', 'winner', 'claim', 'gift', 'free', 'kyc', 'refund', 'invoice'];
const TWO_LEVEL = new Set(['co.in', 'co.uk', 'com.au', 'org.in', 'gov.in', 'ac.in', 'net.in', 'com.br', 'co.jp', 'co.za', 'org.uk']);
const BAD_FILES = /\.(exe|apk|scr|msi|bat|jar|zip|rar|dmg)(\?|$)/i;

/* ---------- helpers ---------- */
function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
}
const deleet = s => s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't').replace(/rn/g, 'm').replace(/vv/g, 'w');

function parse(raw) {
    let t = raw.trim();
    if (!t) return null;
    if (/\s/.test(t)) return null;
    const hasProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(t);
    try {
        const u = new URL(hasProto ? t : 'http://' + t);
        if (!/^https?:$/.test(u.protocol)) return null;
        if (!u.hostname.includes('.') && !/^\[/.test(u.hostname)) return null;
        return { u, typedProto: hasProto, raw: t };
    } catch { return null; }
}
function splitHost(host) {
    const p = host.split('.');
    const n = TWO_LEVEL.has(p.slice(-2).join('.')) ? 3 : 2;
    return { root: p.slice(-n).join('.'), sub: p.slice(0, -n).join('.'), tld: p.slice(-1)[0], label: p[Math.max(0, p.length - n)] };
}

/* ---------- analysis ---------- */
function analyse(info) {
    const { u, typedProto } = info;
    const host = u.hostname.toLowerCase();
    const full = u.href;
    const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
    const { root, sub, tld, label } = isIP ? { root: host, sub: '', tld: '', label: host } : splitHost(host);
    const F = []; // findings
    const add = (sev, e, title, detail, pts = 0, tag = '') => F.push({ sev, e, title, detail, pts, tag });
    const trusted = !isIP && TRUSTED.has(root);

    // protocol
    if (u.protocol === 'https:') add('ok', '🔒', 'Uses HTTPS', 'The connection is encrypted. Note that scammers can get HTTPS too, so it is not proof of safety.');
    else add('bad', '🔓', 'No HTTPS encryption', 'Data typed on this page could be read by others. Real login pages always use HTTPS.', 15, 'https');

    // IP
    if (isIP) add('bad', '🧨', 'Address is a raw IP number', 'Real companies use names, not numbers. Scammers use IPs to avoid being traced.', 40, 'ip');

    // at sign
    if (/@/.test(info.raw.split('?')[0].replace(/^[a-z]+:\/\//i, '').split('/')[0])) add('bad', '🎭', 'Contains an "@" symbol', 'Everything before "@" is ignored by browsers. It is a classic trick to disguise the real destination.', 25, 'at');

    // punycode
    if (/xn--/.test(host)) add('bad', '👀', 'Look-alike characters (punycode)', 'The domain uses foreign letters that look like English ones, e.g. a Cyrillic "а" in place of "a".', 28, 'puny');

    // brand impersonation
    let brandHit = null, typo = null;
    if (!trusted && !isIP) {
        const tokens = host.split(/[.\-]/);
        for (const [b, legit] of Object.entries(BRANDS)) {
            const inHost = b.length <= 3 ? tokens.includes(b) : tokens.some(t => t.includes(b));
            if (inHost && !legit.includes(root)) { brandHit = b; break; }
        }
        if (!brandHit) {
            for (const [b] of Object.entries(BRANDS)) {
                if (b.length < 5) continue;
                const flat = tokens.map(deleet).join('.');
                if ((flat.includes(b) && !host.includes(b)) || (lev(label, b) <= 1 && label !== b)) { typo = b; break; }
            }
        }
        if (brandHit) add('bad', '🎣', `Pretends to be "${brandHit}"`, `The name "${brandHit}" appears in the address, but the real owner of this site is ${root}, not the official ${BRANDS[brandHit][0]}.`, 40, 'brand');
        if (typo) add('bad', '🕵️', `Look-alike of "${typo}"`, `The domain "${label}" is spelled to resemble ${typo} using swapped characters or small typos.`, 40, 'brand');
    }
    if (trusted) add('ok', '✅', 'Recognised official domain', `${root} belongs to a well-known service. Make sure the rest of the address matches what you expect.`);

    // shortener
    if (SHORTENERS.includes(root)) add('warn', '✂️', 'Shortened link', 'You can\'t see where this really leads. Use a link expander before opening it.', 15, 'short');

    // tld
    if (!isIP && SUS_TLDS.includes(tld)) add('warn', '🌐', `Risky domain ending ".${tld}"`, 'This ending is cheap or free and heavily abused in scam campaigns.', 18, 'tld');

    // subdomains
    const subCount = sub ? sub.split('.').length : 0;
    if (subCount >= 3) add('warn', '🧱', `Too many subdomains (${subCount})`, 'Long chains like "login.secure.bank.evil.com" bury the real domain at the end to fool you.', 12, 'sub');

    // hyphens
    const hy = (host.match(/-/g) || []).length;
    if (hy >= 2) add('warn', '➖', `Many hyphens in the domain (${hy})`, 'Scam domains stitch words together, like "secure-account-verify". Real brands rarely do.', 10, 'hy');

    // digits in label
    if (!isIP && !trusted && /\d/.test(label) && /[a-z]/.test(label) && label.length > 4 && !typo) add('warn', '🔢', 'Numbers mixed into the name', 'Digits inside words can be disguising letters (0 for o, 1 for l).', 6, 'digit');

    // keywords
    const hay = (host + u.pathname + u.search).toLowerCase();
    const kw = KEYWORDS.filter(k => hay.includes(k));
    if (kw.length && !trusted) add(kw.length > 2 ? 'bad' : 'warn', '🗝️', `Pressure words: ${kw.slice(0, 5).join(', ')}`, 'Words like "verify" and "secure" are used to rush you into typing passwords or OTPs.', Math.min(20, kw.length * 4), 'kw');
    if ((brandHit || typo) && kw.length) add('bad', '💥', 'Brand + credential words together', 'A famous name mixed with "login" or "verify" is the textbook phishing pattern.', 10, 'combo');

    // length
    if (full.length > 120) add('warn', '📏', `Very long link (${full.length} characters)`, 'Long links can hide the important part or carry tracking and redirects.', 10, 'long');
    else if (full.length > 75) add('warn', '📏', `Long link (${full.length} characters)`, 'Longer than usual. Look carefully at the domain part.', 5, 'long');

    // port
    if (u.port && !['80', '443'].includes(u.port)) add('warn', '🚪', `Unusual port :${u.port}`, 'Legitimate sites almost always use the standard web ports.', 10, 'port');

    // encoded
    if ((full.match(/%[0-9a-f]{2}/gi) || []).length > 3) add('warn', '🧬', 'Lots of encoded characters', 'Heavy %-encoding is sometimes used to hide what the link really says.', 8, 'enc');

    // redirect
    if (/[?&](url|redirect|redir|next|goto|return|link)=https?/i.test(u.search) || /https?:\/\//i.test(u.pathname + u.hash)) add('warn', '↪️', 'Hidden redirect inside the link', 'Another web address is tucked inside this one and may send you somewhere else.', 12, 'redir');

    // file download
    if (BAD_FILES.test(u.pathname)) add('bad', '💣', 'Links straight to a downloadable file', 'Files like .exe, .apk or .zip from unknown sites can carry malware.', 20, 'file');

    // missing typed protocol note
    if (!typedProto) add('ok', '💡', 'No "https://" was typed', 'Shieldy assumed http:// for scanning. Always include the full link if you can.');

    if (!F.some(f => f.sev !== 'ok') && !trusted) add('ok', '🌿', 'No suspicious patterns found', 'The address looks normal, but Shieldy can\'t know how old or trustworthy the site is.');

    let score = F.reduce((a, f) => a + f.pts, 0);
    if (trusted && !F.some(f => ['at', 'puny', 'file', 'redir'].includes(f.tag))) score = Math.min(score, 8);
    score = Math.max(0, Math.min(100, score));
    const status = score >= 60 ? 'bad' : score >= 25 ? 'warn' : 'safe';
    return { score, status, F, host, root, sub, tld, isIP, trusted };
}

/* ---------- UI data ---------- */
const STAT = {
    safe: { t: 'Safe', mc: '#5af2c4', sub: 'Nothing suspicious in the link. Stay alert anyway!' },
    warn: { t: 'Suspicious', mc: '#ffd23f', sub: 'Some warning signs found. Be very careful.' },
    bad: { t: 'Phishing Detected', mc: '#ff6f91', sub: 'This link looks like a scam. Do not open it.' },
};
const ALERT = {
    safe: ['😊', 'Looks fine, but never share your OTP with anyone.', 'No red flags in the link. Banks and websites will never ask for your OTP over a call or chat.'],
    warn: ['⚠️', 'Be careful! Do not enter passwords or OTPs here.', 'Only continue if you are 100% sure who sent this link and you can confirm it on the official website.'],
    bad: ['🚨', 'STOP! Do not enter passwords, OTPs or card details.', 'This website is very likely trying to steal your information. Close it, and delete the message that sent it.'],
};
const RECS = {
    base: [
        ['🧠', 'Type it yourself', 'For banks, mail and shopping, type the official address or use the official app instead of tapping links.'],
        ['🔢', 'Never share OTPs', 'No bank, courier or support agent will ever ask for your OTP, PIN or CVV.'],
        ['📲', 'Turn on 2-step login', 'Even if a password leaks, a second step keeps thieves out of your account.'],
    ],
    bad: [['🚫', 'Close the page now', 'Do not click anything on it. If you entered a password, change it right away and enable 2-step login.'], ['📢', 'Report it', 'Report the message as phishing, block the sender and tell the real company.']],
    warn: [['🔍', 'Verify first', 'Contact the sender through another channel, such as a known phone number, before you trust the link.']],
    https: [['🔓', 'Avoid unencrypted pages', 'Never enter personal data on a page that begins with http:// instead of https://.']],
    short: [['✂️', 'Expand short links', 'Use a link-expander tool or long-press the link to preview where it truly leads.']],
    brand: [['🏷️', 'Check the real domain', 'The part just before the ".com" or ".in" is the true owner. "paypal.evil.com" belongs to evil.com.']],
    file: [['💾', 'Don\'t download unknown files', 'Install apps only from the official app stores and run antivirus on downloads.']],
    ip: [['🧭', 'Skip number-only links', 'Legitimate services use names. A bare IP address is a strong warning sign.']],
};
const mix = (a, b) => a.concat(b);

/* ---------- history ---------- */
const KEY = 'cybershield_scans';
const loadH = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const saveH = h => { try { localStorage.setItem(KEY, JSON.stringify(h)); } catch { /* storage blocked: history only lasts this visit */ } };
let history = loadH();

function renderHistory() {
    const box = $('#histList');
    $('#histEmpty').hidden = history.length > 0;
    $('#clearHist').hidden = history.length === 0;
    box.innerHTML = history.map((h, i) => `
    <button class="h-item" data-i="${i}" style="animation-delay:${i * 40}ms" aria-label="Scan again: ${esc(h.url)}">
      <span class="e">${{ safe: '😎', warn: '😬', bad: '🚨' }[h.status]}</span>
      <span class="h-url">${esc(h.host)}<small>${esc(h.url)} · ${esc(h.time)}</small></span>
      <span class="h-badge" style="background:${STAT[h.status].mc}">${STAT[h.status].t}</span>
      <span class="h-score" style="color:${STAT[h.status].mc}">${h.score}</span>
    </button>`).join('');
}

/* ---------- render result ---------- */
let countTimer;
function show(res, info) {
    const S = STAT[res.status];
    const r = $('#result');
    r.hidden = false; r.style.animation = 'none'; r.offsetHeight; r.style.animation = '';
    document.documentElement.style.setProperty('--mc', S.mc);

    // alert
    const a = ALERT[res.status];
    const box = $('#alertBox');
    box.className = 'alert ' + res.status;
    box.innerHTML = `<span class="ico">${a[0]}</span><div>${a[1]}<small>${a[2]}</small></div>`;

    // gauge
    $('#gFill').style.strokeDashoffset = 283;
    $('#needle').style.transform = 'rotate(-90deg)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        $('#gFill').style.strokeDashoffset = 283 - 283 * res.score / 100;
        $('#needle').style.transform = `rotate(${-90 + 180 * res.score / 100}deg)`;
    }));
    clearInterval(countTimer);
    let n = 0; const el = $('#scoreNum');
    countTimer = setInterval(() => { n += Math.max(1, Math.ceil((res.score - n) / 8)); if (n >= res.score) { n = res.score; clearInterval(countTimer); } el.textContent = n; }, 40);
    if (res.score === 0) el.textContent = 0;

    const st = $('#status'); st.textContent = S.t; st.style.animation = 'none'; st.offsetHeight; st.style.animation = '';
    $('#statusSub').textContent = S.sub;
    const m = $('#mascot'); m.setAttribute('class', 'mascot ' + res.status);

    // anatomy
    const { u } = info;
    const hostHtml = res.isIP ? `<span class="p-dom bad">${esc(res.host)}</span>` :
        (res.sub ? `<span class="p-sub">${esc(res.sub)}.</span>` : '') + `<span class="p-dom ${res.status === 'safe' ? '' : 'bad'}">${esc(res.root)}</span>`;
    $('#anatomy').innerHTML = `<span class="p-proto ${u.protocol === 'http:' ? 'bad' : ''}">${esc(u.protocol)}//</span>${hostHtml}${u.port ? ':' + esc(u.port) : ''}<span class="p-rest">${esc(u.pathname === '/' && !u.search ? '' : u.pathname + u.search + u.hash)}</span>`;
    $('#parts').innerHTML = [
        ['Protocol', u.protocol.replace(':', '')], ['Subdomain', res.sub || 'none'], [res.isIP ? 'IP address' : 'Real domain', res.root],
        ['Ending', res.tld ? '.' + res.tld : 'n/a'], ['Path', u.pathname.length > 1 ? u.pathname.slice(0, 28) + (u.pathname.length > 28 ? '…' : '') : 'none'],
    ].map(([k, v]) => `<span>${k}: <b>${esc(v)}</b></span>`).join('');

    // findings (bad first)
    const order = { bad: 0, warn: 1, ok: 2 };
    const list = [...res.F].sort((x, y) => order[x.sev] - order[y.sev]);
    $('#findings').innerHTML = list.map((f, i) => `<li class="${f.sev}" style="animation-delay:${200 + i * 70}ms"><span class="fi">${f.e}</span><div><b>${esc(f.title)}</b><p>${esc(f.detail)}</p></div>${f.pts ? `<span class="pts">+${f.pts}</span>` : ''}</li>`).join('');

    // recommendations
    const tags = new Set(res.F.map(f => f.tag));
    let recs = [];
    if (res.status === 'bad') recs = mix(recs, RECS.bad); else if (res.status === 'warn') recs = mix(recs, RECS.warn);
    ['https', 'short', 'brand', 'file', 'ip'].forEach(t => { if (tags.has(t)) recs = mix(recs, RECS[t]); });
    recs = mix(recs, RECS.base).slice(0, 6);
    $('#recs').innerHTML = recs.map((c, i) => `<div class="rec" style="animation-delay:${i * 80}ms"><span class="e">${c[0]}</span><h3>${esc(c[1])}</h3><p>${esc(c[2])}</p></div>`).join('');

    setTimeout(() => r.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

/* ---------- scan flow ---------- */
let busy = false;
function scan(raw) {
    if (busy) return;
    const err = $('#err'); err.textContent = '';
    const info = parse(raw);
    if (!info) {
        err.textContent = !raw.trim() ? 'Paste a link first.' : 'That doesn\'t look like a web link. Example: https://example.com/login';
        const f = $('.field'); f.classList.remove('shake'); f.offsetHeight; f.classList.add('shake');
        return;
    }
    busy = true; $('#scanBtn').disabled = true;
    const sc = $('#scanning'), steps = ['Reading the link…', 'Checking the domain…', 'Hunting look-alike names…', 'Sniffing for scam words…', 'Calculating risk…'];
    sc.classList.add('on');
    let i = 0; $('#stepText').textContent = steps[0];
    const iv = setInterval(() => { i = Math.min(i + 1, steps.length - 1); $('#stepText').textContent = steps[i]; }, 300);
    setTimeout(() => {
        clearInterval(iv); sc.classList.remove('on');
        const res = analyse(info);
        show(res, info);
        history = [{ url: info.u.href.length > 70 ? info.u.href.slice(0, 67) + '…' : info.u.href, full: info.raw, host: res.host, score: res.score, status: res.status,
            time: new Date().toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }, ...history.filter(h => h.full !== info.raw)].slice(0, 15);
        saveH(history); renderHistory();
        busy = false; $('#scanBtn').disabled = false;
    }, 1600);
}

$('#scanForm').addEventListener('submit', e => { e.preventDefault(); scan($('#urlInput').value); });
document.querySelectorAll('.samples .chip').forEach(c => c.onclick = () => { $('#urlInput').value = c.dataset.url; scan(c.dataset.url); });
$('#histList').addEventListener('click', e => {
    const b = e.target.closest('.h-item'); if (!b) return;
    const h = history[+b.dataset.i]; $('#urlInput').value = h.full; window.scrollTo({ top: 0, behavior: 'smooth' }); scan(h.full);
});
$('#clearHist').onclick = () => { history = []; saveH(history); renderHistory(); toast('History cleared 🧹'); };
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2200); }

/* bubbles */
const bw = $('#bubbles');
for (let i = 0; i < 16; i++) {
    const b = document.createElement('span'), s = 20 + Math.random() * 80; b.className = 'bubble';
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;--dx:${(Math.random() - .5) * 200}px;animation-duration:${14 + Math.random() * 20}s;animation-delay:${-Math.random() * 30}s`;
    bw.appendChild(b);
}
renderHistory();