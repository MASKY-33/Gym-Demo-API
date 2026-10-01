document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // TAALINSTELLINGEN
    // ============================================================

    const translations = {

        nl: {

            // ... jouw bestaande translations blijven exact hetzelfde ...

            pageTitle: "Masky Gym API - Beveiligde UI",

            authorizeButton: "Autoriseren 🔓",
            deauthorizeButton: "Deautoriseren",
            authorizeButtonModal: "Autoriseer",
            cancelButton: "Annuleren",

            postSummary: "Maak een nieuw gym-lid aan",
            parametersRequestBody: "Parameters / Request Body",
            addNewLid: "Nieuw lid toevoegen",

            nameLabel: "Naam:",
            ageLabel: "Leeftijd:",
            emailLabel: "E-mail:",

            namePlaceholder: "bv. Yasir",
            agePlaceholder: "bv. 25",
            emailPlaceholder: "bv. yasir.voorbeeld@gemail.com",

            submitButton: "Verzenden",
            responseBody: "Response Body",

            updateSummary: "Bestaand gym-lid aanpassen",
            updateLid: "Lid aanpassen",

            lidIdLabel: "Lid ID:",
            newNameLabel: "Nieuwe naam:",
            newAgeLabel: "Nieuwe leeftijd:",
            newEmailLabel: "Nieuw e-mailadres:",

            updateIdPlaceholder: "bv. 7",
            updateNamePlaceholder: "bv. Yasir",
            updateAgePlaceholder: "bv. 26",
            updateEmailPlaceholder: "bv. nieuw@email.com",

            updateSubmitButton: "Lid aanpassen",

            deleteSummary: "Bestaand gym-lid verwijderen",
            parameters: "Parameters",
            deleteLid: "Lid verwijderen",
            deleteIdPlaceholder: "bv. 16",
            deleteSubmitButton: "Lid verwijderen",

            databaseTitle: "🗄️ Live SQLite Database Monitor",
            databaseTablePrefix: "Tabel:",
            databaseRealtime: "(Real-time weergave)",

            tableId: "ID",
            tableName: "Naam",
            tableAge: "Leeftijd",
            tableEmail: "E-mail",
            tableActive: "is_Active",

            active: "Actief",
            inactive: "Inactief",

            authModalTitle: "Autoriseren",

            authInstruction:
                'Geef het e-mailadres "wachtwoord@gmail.com" in om een tijdelijk wachtwoord te krijgen.',

            emailAddressLabel: "E-mailadres:",
            requestCodeButton: "Vraag tijdelijke code aan",

            codeGenerated:
                "Er is een 6-cijferige code gegenereerd!",

            temporaryPasswordLabel:
                "Tijdelijk Wachtwoord (Pincode):",

            codePlaceholder: "6-cijferige code",

            authorizedMessage:
                "Je bent momenteel geautoriseerd.",

            unauthorizedError:
                "Fout: 401 Unauthorized. Je moet eerst rechtsboven Autoriseren!",

            networkError:
                "Netwerkfout met de backend.",

            requestCodeError:
                "Fout bij aanvragen code.",

            backendConnectionError:
                "Geen verbinding met backend.",

            invalidCode:
                "Ongeldige code.",

            loginFailed:
                "Inloggen mislukt.",

            sessionExpired:
                "Sessie van 3 minuten verlopen!",

            demoNotificationTitle:
                "[DEMO NOTIFICATIE]",

            demoNotificationMessage:
                "Hier is het tijdelijk wachtwoord om toegang te krijgen:"
        },


        en: {

            pageTitle: "Masky Gym API - Secure UI",

            authorizeButton: "Authorize 🔓",
            deauthorizeButton: "Deauthorize",
            authorizeButtonModal: "Authorize",
            cancelButton: "Cancel",

            postSummary: "Create a new gym member",
            parametersRequestBody: "Parameters / Request Body",
            addNewLid: "Add new member",

            nameLabel: "Name:",
            ageLabel: "Age:",
            emailLabel: "Email:",

            namePlaceholder: "e.g. Yasir",
            agePlaceholder: "e.g. 25",
            emailPlaceholder: "e.g. yasir.voorbeeld@gemail.com",

            submitButton: "Submit",
            responseBody: "Response Body",

            updateSummary: "Update existing gym member",
            updateLid: "Update member",

            lidIdLabel: "Member ID:",
            newNameLabel: "New name:",
            newAgeLabel: "New age:",
            newEmailLabel: "New email address:",

            updateIdPlaceholder: "e.g. 7",
            updateNamePlaceholder: "e.g. Yasir",
            updateAgePlaceholder: "e.g. 26",
            updateEmailPlaceholder: "e.g. new@email.com",

            updateSubmitButton: "Update member",

            deleteSummary: "Delete existing gym member",
            parameters: "Parameters",
            deleteLid: "Delete member",
            deleteIdPlaceholder: "e.g. 16",
            deleteSubmitButton: "Delete member",

            databaseTitle: "🗄️ Live SQLite Database Monitor",
            databaseTablePrefix: "Table:",
            databaseRealtime: "(Real-time view)",

            tableId: "ID",
            tableName: "Name",
            tableAge: "Age",
            tableEmail: "E-mail",
            tableActive: "is_Active",

            active: "Active",
            inactive: "Inactive",

            authModalTitle: "Authorize",

            authInstruction:
                'Enter the email address "wachtwoord@gmail.com" to receive a temporary password.',

            emailAddressLabel: "Email address:",
            requestCodeButton: "Request temporary code",

            codeGenerated:
                "A 6-digit code has been generated!",

            temporaryPasswordLabel:
                "Temporary Password (PIN):",

            codePlaceholder: "6-digit code",

            authorizedMessage:
                "You are currently authorized.",

            unauthorizedError:
                "Error: 401 Unauthorized. You must authorize first using the button in the top-right!",

            networkError:
                "Network error with the backend.",

            requestCodeError:
                "Error requesting code.",

            backendConnectionError:
                "No connection to backend.",

            invalidCode:
                "Invalid code.",

            loginFailed:
                "Login failed.",

            sessionExpired:
                "3-minute session expired!",

            demoNotificationTitle:
                "[DEMO NOTIFICATION]",

            demoNotificationMessage:
                "Here is the temporary password to gain access:"
        }
    };


    // ============================================================
    // HUIDIGE TAAL
    // ============================================================

    let currentLanguage =
        localStorage.getItem('preferredLanguage') || 'nl';


    if (!translations[currentLanguage]) {
        currentLanguage = 'nl';
    }


    // ============================================================
    // RESPONSE BODY STATUS
    // ============================================================

    let laatstePostResponse = null;
    let laatsteUpdateResponse = null;
    let laatsteDeleteResponse = null;


    // ============================================================
    // NIEUWE LID - RESPONSE BODY VERTALEN
    // ============================================================

    function vertaalPostResponseBody(data) {

        const vertaald =
            JSON.parse(
                JSON.stringify(data)
            );


        // Alleen de gewenste velden worden aangepast.
        // Alle andere response-data blijft exact hetzelfde.

        if (
            vertaald &&
            typeof vertaald === 'object'
        ) {

            if (
                typeof vertaald.message === 'string'
            ) {

                const nederlandsePrefix =
                    "Lid '";

                const nederlandseSuffix =
                    "' is succesvol en permanent opgeslagen in de database!";


                if (
                    currentLanguage === 'en'
                ) {

                    if (
                        vertaald.message.startsWith(
                            nederlandsePrefix
                        ) &&
                        vertaald.message.endsWith(
                            nederlandseSuffix
                        )
                    ) {

                        const naam =
                            vertaald.message.slice(
                                nederlandsePrefix.length,
                                -nederlandseSuffix.length
                            );


                        vertaald.message =
                            `Member '${naam}' has been successfully and permanently saved to the database!`;

                    }

                }

            }


            if (
                vertaald.data &&
                typeof vertaald.data === 'object'
            ) {

                // ====================================================
                // BELANGRIJK:
                // "naam" / "name" blijft op exact dezelfde positie.
                // ====================================================

                const nieuweData = {};

                Object.keys(vertaald.data).forEach(
                    key => {

                        if (
                            currentLanguage === 'en' &&
                            key === 'naam'
                        ) {

                            nieuweData.name =
                                vertaald.data[key];

                        } else if (
                            currentLanguage === 'nl' &&
                            key === 'name'
                        ) {

                            nieuweData.naam =
                                vertaald.data[key];

                        } else {

                            nieuweData[key] =
                                vertaald.data[key];

                        }

                    }
                );

                vertaald.data = nieuweData;

            }

        }


        return JSON.stringify(
            vertaald,
            null,
            2
        );

    }


    // ============================================================
    // TAAL TOEPASSEN
    // ============================================================

    function applyLanguage(lang) {

        if (!translations[lang]) {
            lang = 'nl';
        }

        currentLanguage = lang;

        document.documentElement.setAttribute(
            'lang',
            lang
        );

        document.title =
            translations[lang].pageTitle;


        document.querySelectorAll(
            '[data-i18n]'
        ).forEach(element => {

            const key =
                element.getAttribute(
                    'data-i18n'
                );


            if (
                translations[lang][key] !==
                undefined
            ) {

                element.textContent =
                    translations[lang][key];

            }

        });


        document.querySelectorAll(
            '[data-i18n-placeholder]'
        ).forEach(element => {

            const key =
                element.getAttribute(
                    'data-i18n-placeholder'
                );


            if (
                translations[lang][key] !==
                undefined
            ) {

                element.placeholder =
                    translations[lang][key];

            }

        });


        // Alleen POST opnieuw renderen bij taalwissel.

        if (
            laatstePostResponse !== null &&
            responsePanel.style.display ===
                'block'
        ) {

            responseOutput.textContent =
                vertaalPostResponseBody(
                    laatstePostResponse
                );

        }


        laadDatabaseTabel();

    }


    // ============================================================
    // DOM ELEMENTEN
    // ============================================================

    const trigger =
        document.getElementById('endpoint-trigger');

    const content =
        document.getElementById('dropdown-content');

    const arrow =
        document.getElementById('arrow-icon');

    const form =
        document.getElementById('add-lid-form');


    // ============================================================
    // KNOPPEN
    // ============================================================

    const activateBtn =
        document.getElementById('btn-activate-form');

    const submitBtn =
        document.getElementById('btn-submit-form');

    const authTriggerBtn =
        document.getElementById('btn-auth-trigger');

    const authModal =
        document.getElementById('auth-modal');

    const closeModalBtn =
        document.getElementById('btn-close-modal');

    const requestCodeBtn =
        document.getElementById('btn-request-code');

    const submitAuthBtn =
        document.getElementById('btn-submit-auth');

    const deauthModalBtn =
        document.getElementById(
            'btn-deauthorize-modal'
        );


    const step1Div =
        document.getElementById('auth-step-1');

    const step2Div =
        document.getElementById('auth-step-2');


    const authFormStep1 =
        document.getElementById(
            'auth-form-step-1'
        );

    const authFormStep2 =
        document.getElementById(
            'auth-form-step-2'
        );

    const authFormLogout =
        document.getElementById(
            'auth-form-logout'
        );


    const inputs =
        form.querySelectorAll('input');


    const responsePanel =
        document.getElementById(
            'response-panel'
        );

    const responseOutput =
        document.getElementById(
            'response-output'
        );


    // ============================================================
    // UPDATE BESTAAND GYM-LID
    // ============================================================

    const updateTrigger =
        document.getElementById(
            'update-endpoint-trigger'
        );

    const updateContent =
        document.getElementById(
            'update-dropdown-content'
        );

    const updateArrow =
        document.getElementById(
            'update-arrow-icon'
        );


    const updateActivateBtn =
        document.getElementById(
            'btn-activate-update'
        );

    const updateForm =
        document.getElementById(
            'update-lid-form'
        );

    const updateSubmitBtn =
        document.getElementById(
            'btn-submit-update'
        );


    const updateInputs =
        updateForm.querySelectorAll('input');


    const updateResponsePanel =
        document.getElementById(
            'update-response-panel'
        );

    const updateResponseOutput =
        document.getElementById(
            'update-response-output'
        );


    // ============================================================
    // DELETE BESTAAND GYM-LID
    // ============================================================

    const deleteTrigger =
        document.getElementById(
            'delete-endpoint-trigger'
        );

    const deleteContent =
        document.getElementById(
            'delete-dropdown-content'
        );

    const deleteArrow =
        document.getElementById(
            'delete-arrow-icon'
        );


    const deleteActivateBtn =
        document.getElementById(
            'btn-activate-delete'
        );

    const deleteForm =
        document.getElementById(
            'delete-lid-form'
        );

    const deleteSubmitBtn =
        document.getElementById(
            'btn-submit-delete'
        );

    const deleteInput =
        document.getElementById(
            'delete-input-id'
        );


    const deleteResponsePanel =
        document.getElementById(
            'delete-response-panel'
        );

    const deleteResponseOutput =
        document.getElementById(
            'delete-response-output'
        );


    // ============================================================
    // API BASIS
    // ============================================================

    const API_BASE =
        'https://masky.company';

    let opgeslagenEmail = '';


    // ============================================================
    // DATABASE TABEL
    // ============================================================

    async function laadDatabaseTabel() {

        const container =
            document.getElementById(
                'db-rows-container'
            );

        if (!container) return;


        let leden = [];


        try {

            const response =
                await fetch(
                    `${API_BASE}/api/v1/leden`
                );


            if (response.ok) {

                leden =
                    await response.json();

            }

        } catch (error) {

            console.error(
                "Fout bij het laden van de database monitor:",
                error
            );

        }


        container.innerHTML = '';


        const totaleRijen =
            Math.max(
                5,
                leden.length
            );


        for (
            let i = 0;
            i < totaleRijen;
            i++
        ) {

            const lid =
                leden[i];


            const row =
                document.createElement('div');

            row.className =
                'db-data-row';


            if (lid) {

                const activeText =
                    translations[
                        currentLanguage
                    ].active;

                const inactiveText =
                    translations[
                        currentLanguage
                    ].inactive;


                row.innerHTML = `
                    <div class="db-cell">
                        ${lid.id}
                    </div>

                    <div class="db-cell">
                        ${lid.naam}
                    </div>

                    <div class="db-cell">
                        ${lid.age}
                    </div>

                    <div class="db-cell">
                        ${lid.email}
                    </div>

                    <div class="db-cell">
                        <span class="status-badge">
                            ${lid.is_active ? activeText : inactiveText}
                        </span>
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


    // ============================================================
    // POST DROPDOWN
    // ============================================================

    trigger.addEventListener(
        'click',
        (e) => {

            if (e.target === activateBtn) return;


            const isOpen =
                content.style.display ===
                'block';


            content.style.display =
                isOpen
                    ? 'none'
                    : 'block';


            arrow.classList.toggle(
                'open',
                !isOpen
            );

        }
    );


    // ============================================================
    // UPDATE DROPDOWN
    // ============================================================

    updateTrigger.addEventListener(
        'click',
        (e) => {

            if (
                e.target ===
                updateActivateBtn
            ) return;


            const isOpen =
                updateContent.style.display ===
                'block';


            updateContent.style.display =
                isOpen
                    ? 'none'
                    : 'block';


            updateArrow.classList.toggle(
                'open',
                !isOpen
            );

        }
    );


    // ============================================================
    // DELETE DROPDOWN
    // ============================================================

    deleteTrigger.addEventListener(
        'click',
        (e) => {

            if (
                e.target ===
                deleteActivateBtn
            ) return;


            const isOpen =
                deleteContent.style.display ===
                'block';


            deleteContent.style.display =
                isOpen
                    ? 'none'
                    : 'block';


            deleteArrow.classList.toggle(
                'open',
                !isOpen
            );

        }
    );


    // ============================================================
    // UPDATE FORMULIER ACTIVEREN
    // ============================================================

    updateActivateBtn.addEventListener(
        'click',
        () => {

            const isCurrentlyDisabled =
                updateInputs[0].disabled;


            if (isCurrentlyDisabled) {

                updateInputs.forEach(
                    input =>
                        input.disabled = false
                );


                updateSubmitBtn.disabled =
                    false;

                updateSubmitBtn.style.opacity =
                    "1";


                updateActivateBtn.textContent =
                    translations[
                        currentLanguage
                    ].cancelButton;

                updateActivateBtn.style.backgroundColor =
                    "#ff4d4d";

            } else {

                resetUpdateForm();

            }

        }
    );


    function resetUpdateForm() {

        updateForm.reset();


        updateInputs.forEach(
            input =>
                input.disabled = true
        );


        updateSubmitBtn.disabled =
            true;

        updateSubmitBtn.style.opacity =
            "0.5";


        updateActivateBtn.textContent =
            translations[
                currentLanguage
            ].updateLid;


        updateActivateBtn.style.backgroundColor =
            "#49cc90";

    }


    // ============================================================
    // DELETE FORMULIER ACTIVEREN
    // ============================================================

    deleteActivateBtn.addEventListener(
        'click',
        () => {

            const isCurrentlyDisabled =
                deleteInput.disabled;


            if (isCurrentlyDisabled) {

                deleteInput.disabled =
                    false;


                deleteSubmitBtn.disabled =
                    false;

                deleteSubmitBtn.style.opacity =
                    "1";


                deleteActivateBtn.textContent =
                    translations[
                        currentLanguage
                    ].cancelButton;

                deleteActivateBtn.style.backgroundColor =
                    "#ff4d4d";


                deleteInput.focus();

            } else {

                resetDeleteForm();

            }

        }
    );


    function resetDeleteForm() {

        deleteForm.reset();


        deleteInput.disabled =
            true;


        deleteSubmitBtn.disabled =
            true;

        deleteSubmitBtn.style.opacity =
            "0.5";


        deleteActivateBtn.textContent =
            translations[
                currentLanguage
            ].deleteLid;


        deleteActivateBtn.style.backgroundColor =
            "#f93e3e";

    }


    // ============================================================
    // ADD NEW LID ACTIVEREN
    // ============================================================

    activateBtn.addEventListener(
        'click',
        () => {

            const isCurrentlyDisabled =
                inputs[0].disabled;


            if (isCurrentlyDisabled) {

                inputs.forEach(
                    input =>
                        input.disabled = false
                );


                submitBtn.disabled =
                    false;

                submitBtn.style.opacity =
                    "1";


                activateBtn.textContent =
                    translations[
                        currentLanguage
                    ].cancelButton;

                activateBtn.style.backgroundColor =
                    "#ff4d4d";

            } else {

                resetLidForm();

            }

        }
    );


    function resetLidForm() {

        form.reset();


        inputs.forEach(
            input =>
                input.disabled = true
        );


        submitBtn.disabled =
            true;

        submitBtn.style.opacity =
            "0.5";


        activateBtn.textContent =
            translations[
                currentLanguage
            ].addNewLid;


        activateBtn.style.backgroundColor =
            "#49cc90";

    }


    // ============================================================
    // AUTHENTICATIE FLOW
    // ============================================================

    authTriggerBtn.addEventListener(
        'click',
        () => {

            if (
                !authModal ||
                !authFormStep1 ||
                !authFormStep2 ||
                !authFormLogout
            ) {
                return;
            }


            authModal.style.display =
                'flex';


            const token =
                localStorage.getItem(
                    'gym_keycard'
                );


            if (token) {

                authFormStep1.style.display =
                    'none';

                authFormStep2.style.display =
                    'none';

                authFormLogout.style.display =
                    'block';

            } else {

                authFormStep1.style.display =
                    'block';

                authFormStep2.style.display =
                    'none';

                authFormLogout.style.display =
                    'none';

            }

        }
    );


    closeModalBtn.addEventListener(
        'click',
        () => {

            authModal.style.display =
                'none';

        }
    );


    // ============================================================
    // AUTH STAP 1
    // ============================================================

    authFormStep1.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            const emailInput =
                document.getElementById(
                    'auth-email'
                );


            opgeslagenEmail =
                emailInput
                    ? emailInput.value
                    : '';


            try {

                const res =
                    await fetch(
                        `${API_BASE}/api/v1/auth/code-aanvragen`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                email:
                                    opgeslagenEmail
                            })
                        }
                    );


                const data =
                    await res.json();


                if (res.ok) {

                    alert(
                        `${translations[currentLanguage].demoNotificationTitle}\n\n` +
                        `${translations[currentLanguage].demoNotificationMessage}\n` +
                        `🔑 ${data.demo_code}`
                    );


                    authFormStep1.style.display =
                        'none';

                    authFormStep2.style.display =
                        'block';


                    const codeInput =
                        document.getElementById(
                            'auth-code'
                        );


                    if (codeInput) {

                        codeInput.focus();

                    }

                } else {

                    alert(
                        data.detail ||
                        translations[
                            currentLanguage
                        ].requestCodeError
                    );

                }


            } catch (err) {

                alert(
                    translations[
                        currentLanguage
                    ].backendConnectionError
                );

            }

        }
    );


    // ============================================================
    // AUTH STAP 2
    // ============================================================

    authFormStep2.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            const codeVal =
                document
                    .getElementById(
                        'auth-code'
                    )
                    .value;


            try {

                const res =
                    await fetch(
                        `${API_BASE}/api/v1/auth/login`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({

                                email:
                                    opgeslagenEmail,

                                tijdelijk_wachtwoord:
                                    codeVal

                            })
                        }
                    );


                const data =
                    await res.json();


                if (res.ok) {

                    localStorage.setItem(
                        'gym_keycard',
                        data.access_token
                    );


                    updateAuthUI(true);


                    authModal.style.display =
                        'none';


                    setTimeout(() => {

                        logoutUser();


                        alert(
                            translations[
                                currentLanguage
                            ].sessionExpired
                        );

                    }, data.expires_in_seconds * 1000);


                } else {

                    alert(
                        data.detail ||
                        translations[
                            currentLanguage
                        ].invalidCode
                    );

                }


            } catch (err) {

                alert(
                    translations[
                        currentLanguage
                    ].loginFailed
                );

            }

        }
    );


    // ============================================================
    // DEAUTORISEREN
    // ============================================================

    deauthModalBtn.addEventListener(
        'click',
        (e) => {

            e.preventDefault();

            logoutUser();

        }
    );


    async function logoutUser() {

        const token =
            localStorage.getItem(
                'gym_keycard'
            );


        if (token) {

            try {

                await fetch(
                    `${API_BASE}/api/v1/auth/logout`,
                    {
                        method: 'POST',

                        headers: {
                            'Authorization':
                                `Bearer ${token}`
                        }
                    }
                );

            } catch (e) {}

        }


        localStorage.removeItem(
            'gym_keycard'
        );


        updateAuthUI(false);


        authModal.style.display =
            'none';

    }


    // ============================================================
    // AUTH UI
    // ============================================================

    function updateAuthUI(isAuthorized) {

        if (
            !authTriggerBtn ||
            !authFormStep1 ||
            !authFormStep2 ||
            !authFormLogout
        ) {
            return;
        }


        if (isAuthorized) {

            authTriggerBtn.textContent =
                translations[
                    currentLanguage
                ].deauthorizeButton +
                " 🔒";


            authTriggerBtn.classList.add(
                'locked'
            );


            authFormStep1.style.display =
                'none';

            authFormStep2.style.display =
                'none';

            authFormLogout.style.display =
                'block';


        } else {

            authTriggerBtn.textContent =
                translations[
                    currentLanguage
                ].authorizeButton;


            authTriggerBtn.classList.remove(
                'locked'
            );


            resetLidForm();


            resetUpdateForm();


            resetDeleteForm();


            authFormStep1.reset();

            authFormStep2.reset();

            authFormLogout.reset();


            authFormStep1.style.display =
                'block';

            authFormStep2.style.display =
                'none';

            authFormLogout.style.display =
                'none';

        }

    }


    // ============================================================
    // LID VERZENDEN NAAR DATABASE
    // ============================================================

    form.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            const token =
                localStorage.getItem(
                    'gym_keycard'
                );


            if (!token) {

                responsePanel.style.display =
                    'block';


                responseOutput.textContent =
                    translations[
                        currentLanguage
                    ].unauthorizedError;


                return;

            }


            const payload = {

                naam:
                    document
                        .getElementById(
                            'input-name'
                        )
                        .value,

                age:
                    parseInt(
                        document
                            .getElementById(
                                'input-age'
                            )
                            .value
                    ),

                email:
                    document
                        .getElementById(
                            'input-email'
                        )
                        .value

            };


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/v1/leden`,
                        {
                            method: 'POST',

                            headers: {

                                'Content-Type':
                                    'application/json',

                                'Authorization':
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const resultData =
                    await response.json();


                laatstePostResponse =
                    resultData;


                responsePanel.style.display =
                    'block';


                responseOutput.textContent =
                    vertaalPostResponseBody(
                        resultData
                    );


                if (response.ok) {

                    resetLidForm();

                    laadDatabaseTabel();

                }


            } catch (error) {

                responsePanel.style.display =
                    'block';


                responseOutput.textContent =
                    translations[
                        currentLanguage
                    ].networkError;

            }

        }
    );


    // ============================================================
    // BESTAAND LID AANPASSEN
    // ============================================================

    updateForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            const token =
                localStorage.getItem(
                    'gym_keycard'
                );


            if (!token) {

                updateResponsePanel.style.display =
                    'block';


                updateResponseOutput.textContent =
                    translations[
                        currentLanguage
                    ].unauthorizedError;


                return;

            }


            const lidId =
                parseInt(
                    document
                        .getElementById(
                            'update-input-id'
                        )
                        .value
                );


            const payload = {

                naam:
                    document
                        .getElementById(
                            'update-input-name'
                        )
                        .value,

                age:
                    parseInt(
                        document
                            .getElementById(
                                'update-input-age'
                            )
                            .value
                    ),

                email:
                    document
                        .getElementById(
                            'update-input-email'
                        )
                        .value

            };


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/v1/leden/${lidId}`,
                        {
                            method: 'PUT',

                            headers: {

                                'Content-Type':
                                    'application/json',

                                'Authorization':
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const resultData =
                    await response.json();


                laatsteUpdateResponse =
                    resultData;


                updateResponsePanel.style.display =
                    'block';


                updateResponseOutput.textContent =
                    JSON.stringify(
                        resultData,
                        null,
                        2
                    );


                if (response.ok) {

                    resetUpdateForm();

                    laadDatabaseTabel();

                }


            } catch (error) {

                updateResponsePanel.style.display =
                    'block';


                updateResponseOutput.textContent =
                    translations[
                        currentLanguage
                    ].networkError;

            }

        }
    );


    // ============================================================
    // BESTAAND LID VERWIJDEREN
    // ============================================================

    deleteForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            const token =
                localStorage.getItem(
                    'gym_keycard'
                );


            if (!token) {

                deleteResponsePanel.style.display =
                    'block';


                deleteResponseOutput.textContent =
                    translations[
                        currentLanguage
                    ].unauthorizedError;


                return;

            }


            const lidId =
                parseInt(
                    deleteInput.value
                );


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/v1/leden/${lidId}`,
                        {
                            method: 'DELETE',

                            headers: {

                                'Authorization':
                                    `Bearer ${token}`

                            }
                        }
                    );


                const resultData =
                    await response.json();


                laatsteDeleteResponse =
                    resultData;


                deleteResponsePanel.style.display =
                    'block';


                deleteResponseOutput.textContent =
                    JSON.stringify(
                        resultData,
                        null,
                        2
                    );


                if (response.ok) {

                    resetDeleteForm();

                    laadDatabaseTabel();

                }


            } catch (error) {

                deleteResponsePanel.style.display =
                    'block';


                deleteResponseOutput.textContent =
                    translations[
                        currentLanguage
                    ].networkError;

            }

        }
    );


    // ============================================================
    // START DATABASE TABEL
    // ============================================================

    laadDatabaseTabel();


    // ============================================================
    // BIJ OPENEN ALTIJD UITLOGGEN
    // ============================================================

    localStorage.removeItem(
        'gym_keycard'
    );


    updateAuthUI(false);


    // ============================================================
    // ENTER-TOETS BLOKKEREN
    // ============================================================

    const authEmailInput =
        document.getElementById(
            'auth-email'
        );


    const authCodeInput =
        document.getElementById(
            'auth-code'
        );


    if (authEmailInput) {

        authEmailInput.addEventListener(
            'keydown',
            (e) => {

                if (e.key === 'Enter') {

                    e.preventDefault();

                }

            }
        );

    }


    if (authCodeInput) {

        authCodeInput.addEventListener(
            'keydown',
            (e) => {

                if (e.key === 'Enter') {

                    e.preventDefault();

                }

            }
        );

    }


    // ============================================================
    // TAAL DIRECT TOEPASSEN BIJ OPENEN
    // ============================================================

    applyLanguage(
        currentLanguage
    );


    // ============================================================
    // TAAL SYNCHRONISEREN MET DE HOOFDSITE
    // ============================================================

    window.addEventListener(
        'storage',
        (event) => {

            if (
                event.key ===
                    'preferredLanguage' &&
                event.newValue
            ) {

                applyLanguage(
                    event.newValue
                );

            }

        }
    );

});
