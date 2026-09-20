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

    const authFormStep1 = document.getElementById('auth-form-step-1');
    const authFormStep2 = document.getElementById('auth-form-step-2');
    const authFormLogout = document.getElementById('auth-form-logout');

    const inputs = form.querySelectorAll('input');
    const responsePanel = document.getElementById('response-panel');
    const responseOutput = document.getElementById('response-output');

    // Live URL naar jouw add_lid_api.py backend
    const API_BASE = 'https://masky.company';
    let opgeslagenEmail = '';


    // ==================
    // DE REFRESH-FUNCTIE
    // ==================
    async function laadDatabaseTabel() {
        const container = document.getElementById('db-rows-container');
        if (!container) return;

        let leden = [];
        try {
            const response = await fetch(`${API_BASE}/api/v1/leden`);
            if (response.ok) {
                leden = await response.json();
            }
        } catch (error) {
            console.error("Fout bij het laden van de database monitor:", error);
        }

        container.innerHTML = '';

        const totaleRijen = Math.max(5, leden.length);
        
        
        for (let i = 0; i < totaleRijen; i++) {
            const lid = leden[i];
            const row = document.createElement('div');
            row.className = 'db-data-row';
            
            if (lid) {
                row.innerHTML = `
                    <div class="db-cell">${lid.id}</div>
                    <div class="db-cell">${lid.naam}</div>
                    <div class="db-cell">${lid.age}</div>
                    <div class="db-cell">${lid.email}</div>
                    <div class="db-cell">
                        <span class="status-badge">${lid.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                `;
            } else {
                row.innerHTML = `
                    <div class="db-cell">&nbsp;</div>
                    <div class="db-cell">&nbsp;</div>
                    <div class="db-cell">&nbsp;</div>
                    <div class="db-cell">&nbsp;</div>
                    <div class="db-cell">&nbsp;</div>
                `;
            }
            container.appendChild(row);
        }
    }
    
    
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


    // --- AUTHENTICATIE FLOW (OPENEN VAN POP-UP) ---
    authTriggerBtn.addEventListener('click', () => {
        if (!authModal || !authFormStep1 || !authFormStep2 || !authFormLogout) return;

        authModal.style.display = 'flex';
        const token = localStorage.getItem('gym_keycard');

        if (token) {
            // Gebruiker is AL ingelogd -> Verberg inlogvelden, toon ALLEEN de rode knop!
            authFormStep1.style.display = 'none';
            authFormStep2.style.display = 'none';
            authFormLogout.style.display = 'block';
        } else {
            // Gebruiker moet nog inloggen -> Toon ALLEEN stap 1 (e-mail)
            authFormStep1.style.display = 'block';
            authFormStep2.style.display = 'none';
            authFormLogout.style.display = 'none';
        }
    });


    closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });


    // 1. Stap 1: Email verzenden (Werkt met klik én enter)
    authFormStep1.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('auth-email');
        opgeslagenEmail = emailInput ? emailInput.value : '';
        
        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/code-aanvragen`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: opgeslagenEmail })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert(`[DEMO NOTIFICATIE]\n\nHier is het tijdelijk wachtwoord om toegang te krijgen:\n🔑 ${data.demo_code}`);
                
                authFormStep1.style.display = 'none';
                authFormStep2.style.display = 'block';
                
                const codeInput = document.getElementById('auth-code');
                if (codeInput) codeInput.focus();
            } else {
                alert(data.detail || 'Fout bij aanvragen code.');
            }
        } catch (err) { alert('Geen verbinding met backend.'); }
    });


    // 2. Stap 2: Pincode verzenden (Luistert naar het formulier -> Werkt ALTIJD met klik én enter!)
    authFormStep2.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codeVal = document.getElementById('auth-code').value;
        
        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: opgeslagenEmail, tijdelijk_wachtwoord: codeVal })
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
            } else {
                alert(data.detail || 'Ongeldige code.');
            }
        } catch (err) { alert('Inloggen mislukt.'); }
    });
    
    
    // 3. Deautoriseren knop
    deauthModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });
    
    
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
        if (!authTriggerBtn || !authFormStep1 || !authFormStep2 || !authFormLogout) return;
        if (isAuthorized) {
            authTriggerBtn.textContent = 'Deautoriseren 🔒';
            authTriggerBtn.classList.add('locked');
            
            // Zorg dat de pop-up direct goed staat op het uitlogscherm met de rode knop!
            authFormStep1.style.display = 'none';
            authFormStep2.style.display = 'none';
            authFormLogout.style.display = 'block';
        } else {
            authTriggerBtn.textContent = 'Autoriseer 🔓';
            authTriggerBtn.classList.remove('locked');
            resetLidForm();
            
            // Reset alle 3 de formulieren naar de beginstand voor een nieuwe inlog
            authFormStep1.reset();
            authFormStep2.reset();
            authFormLogout.reset();
            
            authFormStep1.style.display = 'block';
            authFormStep2.style.display = 'none';
            authFormLogout.style.display = 'none';
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

            if (response.ok) {
                resetLidForm();
                laadDatabaseTabel(); // <-- DIT triggers de real-time refresh direct op je pagina!
            }
        } catch (error) {
            responsePanel.style.display = 'block';
            responseOutput.textContent = `Netwerkfout met de backend.`;
        }
    });


    // Start de tabel direct op zodra de bezoeker de pagina opent
    laadDatabaseTabel();
    
    
    if (localStorage.getItem('gym_keycard')) updateAuthUI(true);


    // BLOKKEER DE ENTER-TOETS OP JOUW AUTORISATIE INVOERVELDEN
    const authEmailInput = document.getElementById('auth-email');
    const authCodeInput = document.getElementById('auth-code');

    if (authEmailInput) {
        authEmailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stopt de Enter-toets direct bij het e-mailveld
            }
        });
    }

    if (authCodeInput) {
        authCodeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stopt de Enter-toets direct bij het pincodeveld
            }
        });
    }
});