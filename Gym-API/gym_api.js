document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('endpoint-trigger');
    const content = document.getElementById('dropdown-content');
    const arrow = document.getElementById('arrow-icon');
    const form = document.getElementById('add-lid-form');
    
    // Knoppen
    const activateBtn = document.getElementById('btn-activate-form');
    const submitBtn = document.getElementById('btn-submit-form');
    const authTriggerBtn = document.getElementById('btn-auth-trigger');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const requestCodeBtn = document.getElementById('btn-request-code');
    const submitAuthBtn = document.getElementById('btn-submit-auth');
    const deauthModalBtn = document.getElementById('btn-deauthorize-modal');
    
    const step1Div = document.getElementById('auth-step-1');
    const step2Div = document.getElementById('auth-step-2');
    const inputs = form.querySelectorAll('input');
    const responsePanel = document.getElementById('response-panel');
    const responseOutput = document.getElementById('response-output');

    // Live URL naar jouw add_lid_api.py backend
    const API_BASE = 'https://masky.company'; 

    // Dropdown openen/sluiten
    trigger.addEventListener('click', (e) => {
        if (e.target === activateBtn) return;
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        arrow.classList.toggle('open', !isOpen);
    });

    // Add new lid activeren (Try it out)
    activateBtn.addEventListener('click', () => {
        const isCurrentlyDisabled = inputs[0].disabled;
        if (isCurrentlyDisabled) {
            inputs.forEach(input => input.disabled = false);
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            activateBtn.textContent = "Cancel";
            activateBtn.style.backgroundColor = "#ff4d4d";
        } else {
            resetLidForm();
        }
    });

    function resetLidForm() {
        form.reset();
        inputs.forEach(input => input.disabled = true);
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        activateBtn.textContent = "Add new lid";
        activateBtn.style.backgroundColor = "#49cc90";
    }

    // --- AUTHENTICATIE FLOW ---
    authTriggerBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        const token = localStorage.getItem('gym_keycard');
        if (token) {
            step1Div.style.display = 'none';
            step2Div.style.display = 'block';
            deauthModalBtn.style.display = 'block';
            submitAuthBtn.style.display = 'none';
        } else {
            step1Div.style.display = 'block';
            step2Div.style.display = 'none';
            deauthModalBtn.style.display = 'none';
            submitAuthBtn.style.display = 'block';
        }
    });

    closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });

    requestCodeBtn.addEventListener('click', async () => {
        const emailVal = document.getElementById('auth-email').value;
        if (!emailVal) return alert('Vul een e-mailadres in.');

        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/code-aanvragen`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailVal })
            });
            if (res.ok) {
                step1Div.style.display = 'none';
                step2Div.style.display = 'block';
            } else {
                const data = await res.json();
                alert(data.detail || 'Fout bij aanvragen code.');
            }
        } catch (err) { alert('Geen verbinding met backend.'); }
    });

    submitAuthBtn.addEventListener('click', async () => {
        const emailVal = document.getElementById('auth-email').value;
        const codeVal = document.getElementById('auth-code').value;

        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailVal, tijdelijk_wachtwoord: codeVal })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('gym_keycard', data.access_token);
                updateAuthUI(true);
                authModal.style.display = 'none';
                
                setTimeout(() => {
                    logoutUser();
                    alert('Sessie van 30 minuten verlopen!');
                }, data.expires_in_seconds * 1000);
            } else { alert(data.detail || 'Ongeldige code.'); }
        } catch (err) { alert('Inloggen mislukt.'); }
    });

    deauthModalBtn.addEventListener('click', () => { logoutUser(); });

    async function logoutUser() {
        const token = localStorage.getItem('gym_keycard');
        if (token) {
            try {
                await fetch(`${API_BASE}/api/v1/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {}
        }
        localStorage.removeItem('gym_keycard');
        updateAuthUI(false);
        authModal.style.display = 'none';
    }

    function updateAuthUI(isAuthorized) {
        if (isAuthorized) {
            authTriggerBtn.textContent = 'Deautoriseren 🔒';
            authTriggerBtn.classList.add('locked');
        } else {
            authTriggerBtn.textContent = 'Autoriseer 🔓';
            authTriggerBtn.classList.remove('locked');
            resetLidForm();
        }
    }

    // --- LID VERZENDEN NAAR DATABASE ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('gym_keycard');
        
        if (!token) {
            responsePanel.style.display = 'block';
            responseOutput.textContent = 'Fout: 401 Unauthorized. Je moet eerst rechtsboven Autoriseren!';
            return;
        }

        const payload = {
            naam: document.getElementById('input-name').value,
            age: parseInt(document.getElementById('input-age').value),
            email: document.getElementById('input-email').value
        };

        try {
            const response = await fetch(`${API_BASE}/api/v1/leden`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const resultData = await response.json();
            responsePanel.style.display = 'block';
            responseOutput.textContent = JSON.stringify(resultData, null, 2);

            if (response.ok) resetLidForm();
        } catch (error) {
            responsePanel.style.display = 'block';
            responseOutput.textContent = `Netwerkfout met de backend.`;
        }
    });

    if (localStorage.getItem('gym_keycard')) updateAuthUI(true);
});
