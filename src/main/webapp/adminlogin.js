/* ==========================================================================
   CyberShield — Admin Login (vanilla JS)
   Client-side checks for a smooth experience. Always re-validate on the server.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminForm');
    const btn = document.getElementById('loginBtn');
    const msg = document.getElementById('formMessage');
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    const fields = {
        email: { wrap: document.getElementById('emailField'), err: document.getElementById('emailError'), input: email },
        password: { wrap: document.getElementById('passwordField'), err: document.getElementById('passwordError'), input: pass }
    };
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* --- validation --- */
    const rules = {
        email: v => !v.trim() ? 'Enter your admin email.' : !EMAIL_RE.test(v.trim()) ? 'Enter a valid email, like name@company.com.' : '',
        password: v => !v ? 'Enter your password.' : v.length < 6 ? 'Password must be at least 6 characters.' : ''
    };

    function setError(key, text) {
        const f = fields[key];
        f.wrap.classList.toggle('is-invalid', !!text);
        f.err.textContent = text;
        if (text) {
            f.wrap.classList.remove('shake');
            void f.wrap.offsetWidth;            // restart the shake animation
            f.wrap.classList.add('shake');
        }
    }

    function showMessage(text, type) {
        msg.textContent = text;
        msg.classList.remove('is-error', 'is-success', 'is-visible');
        if (text) msg.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
    }

    Object.keys(fields).forEach(key => {
        fields[key].input.addEventListener('input', () => {
            if (fields[key].wrap.classList.contains('is-invalid')) setError(key, '');
            showMessage('', null);
        });
        fields[key].input.addEventListener('blur', () => {
            if (fields[key].input.value) setError(key, rules[key](fields[key].input.value));
        });
    });

    /* --- show / hide password --- */
    const toggle = document.getElementById('togglePassword');
    toggle.addEventListener('click', () => {
        const hide = pass.type === 'text';
        pass.type = hide ? 'password' : 'text';
        toggle.setAttribute('aria-pressed', String(!hide));
        toggle.setAttribute('aria-label', hide ? 'Show password' : 'Hide password');
        toggle.querySelector('.eye__open').hidden = !hide;
        toggle.querySelector('.eye__closed').hidden = hide;
        pass.focus();
    });

    /* --- Caps Lock hint --- */
    const caps = document.getElementById('capsHint');
    const checkCaps = e => caps.classList.toggle('is-visible', !!(e.getModifierState && e.getModifierState('CapsLock')));
    pass.addEventListener('keydown', checkCaps);
    pass.addEventListener('keyup', checkCaps);
    pass.addEventListener('blur', () => caps.classList.remove('is-visible'));

    /* --- submit --- */
    form.addEventListener('submit', e => {
        const eMsg = rules.email(email.value);
        const pMsg = rules.password(pass.value);
        setError('email', eMsg);
        setError('password', pMsg);

        if (eMsg || pMsg) {
            e.preventDefault();
            showMessage('Fix the highlighted fields and try again.', 'error');
            (eMsg ? email : pass).focus();
            return;
        }
        // Valid: show loading state and let the form post to the servlet.
        btn.classList.add('is-loading');
        btn.querySelector('.btn__label').textContent = 'Verifying…';
        showMessage('', null);
        setTimeout(() => { btn.disabled = true; }, 0);   // disable after submit starts, so the POST still fires
    });

    // Restore the button if the user returns with the back button (bfcache).
    window.addEventListener('pageshow', ev => {
        if (ev.persisted) {
            btn.disabled = false;
            btn.classList.remove('is-loading');
            btn.querySelector('.btn__label').textContent = 'Sign in to admin panel';
        }
    });

    /* --- subtle mouse parallax on the radar --- */
    const radar = document.getElementById('radar');
    const stage = document.getElementById('stage');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (radar && stage && !calm) {
        stage.addEventListener('mousemove', ev => {
            const r = stage.getBoundingClientRect();
            const x = (ev.clientX - r.left) / r.width - 0.5;
            const y = (ev.clientY - r.top) / r.height - 0.5;
            radar.style.transform = `translate(${x * 18}px, ${y * 18}px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        });
        stage.addEventListener('mouseleave', () => { radar.style.transform = ''; });
    }

    // Server redirect karke wapas bheje: admin-login.html?error=1  (ya ?error=custom+message)
    const qs = new URLSearchParams(window.location.search);
    if (qs.has('error')) {
        const custom = qs.get('error');
        showMessage(custom && custom !== '1' && custom !== 'true' ? custom : 'Invalid admin email or password.', 'error');
    }

    // Focus the first empty field.
    (email.value ? pass : email).focus({ preventScroll: true });
});