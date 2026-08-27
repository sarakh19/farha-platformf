import './dashboard-common.js';

document.addEventListener('DOMContentLoaded', function () {

    const page =
        document.getElementById(
            'organizerSettingsPage'
        );

    if (!page) {
        return;
    }


    /* =========================================================
       URLs
    ========================================================= */

    const profileUrl =
        page.dataset.profileUrl;

    const passwordUrl =
        page.dataset.passwordUrl;

    const emailPreferencesUrl =
        page.dataset.emailPreferencesUrl;

    const logoutUrl =
        page.dataset.logoutUrl;

    const loginUrl =
        page.dataset.loginUrl ||
        '/login';


    /* =========================================================
       AUTH
    ========================================================= */

    const token =
        localStorage.getItem('farha_token') ||
        sessionStorage.getItem('farha_token');


    const storedUserRaw =
        localStorage.getItem('farha_user') ||
        sessionStorage.getItem('farha_user');


    let currentUser = null;


    try {

        currentUser =
            storedUserRaw
                ? JSON.parse(storedUserRaw)
                : null;

    } catch (error) {

        console.error(
            'Invalid stored user:',
            error
        );
    }


    if (!token) {

        window.location.href =
            loginUrl;

        return;
    }


    if (
        currentUser &&
        currentUser.role &&
        currentUser.role !== 'organizer'
    ) {

        window.location.href =
            '/home';

        return;
    }


    function apiHeaders() {

        return {
            Accept: 'application/json',

            'Content-Type':
                'application/json',

            Authorization:
                `Bearer ${token}`,
        };
    }


    function clearAuthentication() {

        localStorage.removeItem(
            'farha_token'
        );

        localStorage.removeItem(
            'farha_user'
        );

        sessionStorage.removeItem(
            'farha_token'
        );

        sessionStorage.removeItem(
            'farha_user'
        );
    }


    /* =========================================================
       PAGE ELEMENTS
    ========================================================= */

    const settingsLoading =
        document.getElementById(
            'settingsLoading'
        );


    const settingsContent =
        document.getElementById(
            'settingsContent'
        );


    const organizerName =
        document.getElementById(
            'organizerName'
        );


    const welcomeOrganizerName =
        document.getElementById(
            'welcomeOrganizerName'
        );


    const organizerAvatar =
        document.getElementById(
            'organizerAvatar'
        );


    /* =========================================================
       PROFILE
    ========================================================= */

    const saveProfileButton =
        document.getElementById(
            'saveProfileButton'
        );


    const nameInput =
        document.getElementById(
            'settingsName'
        );


    const emailInput =
        document.getElementById(
            'settingsEmail'
        );


    const phoneInput =
        document.getElementById(
            'settingsPhone'
        );


    const cityInput =
        document.getElementById(
            'settingsCity'
        );


    /* =========================================================
       PASSWORD
    ========================================================= */

    const passwordForm =
        document.getElementById(
            'passwordSettingsForm'
        );


    const updatePasswordButton =
        document.getElementById(
            'updatePasswordButton'
        );


    const currentPasswordInput =
        document.getElementById(
            'currentPassword'
        );


    const newPasswordInput =
        document.getElementById(
            'newPassword'
        );


    const confirmPasswordInput =
        document.getElementById(
            'confirmPassword'
        );


    /* =========================================================
       EMAIL PREFERENCES
    ========================================================= */

    const emailNewEvents =
        document.getElementById(
            'emailNewEvents'
        );


    const emailEventReminder =
        document.getElementById(
            'emailEventReminder'
        );


    const emailRegistrationUpdates =
        document.getElementById(
            'emailRegistrationUpdates'
        );


    const saveEmailPreferencesButton =
        document.getElementById(
            'saveEmailPreferencesButton'
        );


    /* =========================================================
       ORGANIZER DISPLAY
    ========================================================= */

    function setUserDisplay(user) {

        const name =
            user?.name ||
            user?.full_name ||
            'المنظم';


        if (organizerName) {

            organizerName.textContent =
                name;
        }


        if (welcomeOrganizerName) {

            welcomeOrganizerName.textContent =
                name;
        }


        if (organizerAvatar) {

            const words =
                String(name)
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);


            const initials =
                words
                    .slice(0, 2)
                    .map(
                        word =>
                            word.charAt(0)
                    )
                    .join('')
                    .toUpperCase();


            organizerAvatar.textContent =
                initials ||
                'م';
        }
    }


    setUserDisplay(
        currentUser
    );


    /* =========================================================
       LOAD PROFILE
    ========================================================= */

    async function loadProfile() {

        try {

            const response =
                await fetch(
                    profileUrl,
                    {
                        method: 'GET',

                        headers:
                            apiHeaders(),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            if (
                response.status ===
                401
            ) {

                clearAuthentication();

                window.location.href =
                    loginUrl;

                return;
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل بيانات الحساب.'
                );
            }


            const user =
                data.user ||
                data.profile ||
                data;


            currentUser =
                user;


            setUserDisplay(
                user
            );


            if (nameInput) {

                nameInput.value =
                    user.name ||
                    user.full_name ||
                    '';
            }


            if (emailInput) {

                emailInput.value =
                    user.email ||
                    '';
            }


            if (phoneInput) {

                phoneInput.value =
                    user.phone ||
                    '';
            }


            if (cityInput) {

                cityInput.value =
                    user.city ||
                    user.location ||
                    '';
            }


            const storage =
                localStorage.getItem(
                    'farha_token'
                )
                    ? localStorage
                    : sessionStorage;


            storage.setItem(
                'farha_user',
                JSON.stringify(user)
            );


        } catch (error) {

            console.error(
                'Profile load error:',
                error
            );


            window.showToast?.(
                error.message,
                'error'
            );


        } finally {

            settingsLoading
                ?.classList
                .add('d-none');


            settingsContent
                ?.classList
                .remove('d-none');
        }
    }


    /* =========================================================
       UPDATE PROFILE
    ========================================================= */

    async function updateProfile() {

        if (!saveProfileButton) {
            return;
        }


        saveProfileButton.disabled =
            true;


        const oldHtml =
            saveProfileButton.innerHTML;


        saveProfileButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm"
            ></span>

            جاري الحفظ...
        `;


        try {

            const response =
                await fetch(
                    profileUrl,
                    {
                        method: 'PUT',

                        headers:
                            apiHeaders(),

                        body:
                            JSON.stringify({

                                name:
                                    nameInput
                                        ?.value
                                        .trim() ||
                                    '',

                                email:
                                    emailInput
                                        ?.value
                                        .trim() ||
                                    '',

                                phone:
                                    phoneInput
                                        ?.value
                                        .trim() ||
                                    '',

                                city:
                                    cityInput
                                        ?.value
                                        .trim() ||
                                    '',
                            }),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            if (!response.ok) {

                if (
                    response.status ===
                    422
                ) {

                    const errors =
                        data.errors ||
                        {};


                    const firstError =
                        Object.values(
                            errors
                        )
                            .flat()
                            .at(0);


                    throw new Error(
                        firstError ||
                        data.message ||
                        'يرجى التحقق من البيانات.'
                    );
                }


                throw new Error(
                    data.message ||
                    'تعذر حفظ التغييرات.'
                );
            }


            const updatedUser =
                data.user ||
                data.profile ||
                {
                    ...currentUser,

                    name:
                        nameInput
                            ?.value
                            .trim(),

                    email:
                        emailInput
                            ?.value
                            .trim(),

                    phone:
                        phoneInput
                            ?.value
                            .trim(),

                    city:
                        cityInput
                            ?.value
                            .trim(),
                };


            currentUser =
                updatedUser;


            setUserDisplay(
                updatedUser
            );


            const storage =
                localStorage.getItem(
                    'farha_token'
                )
                    ? localStorage
                    : sessionStorage;


            storage.setItem(
                'farha_user',
                JSON.stringify(
                    updatedUser
                )
            );


            window.showToast?.(
                'تم حفظ بيانات الحساب بنجاح.',
                'success'
            );


        } catch (error) {

            console.error(
                'Profile update error:',
                error
            );


            window.showToast?.(
                error.message,
                'error'
            );


        } finally {

            saveProfileButton.disabled =
                false;


            saveProfileButton.innerHTML =
                oldHtml;
        }
    }


    saveProfileButton
        ?.addEventListener(
            'click',
            updateProfile
        );


    /* =========================================================
       PASSWORD VISIBILITY
    ========================================================= */

    document
        .querySelectorAll(
            '.password-toggle'
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    'click',
                    function () {

                        const input =
                            document.getElementById(
                                button.dataset.target
                            );


                        if (!input) {
                            return;
                        }


                        const hidden =
                            input.type ===
                            'password';


                        input.type =
                            hidden
                                ? 'text'
                                : 'password';


                        button.innerHTML =
                            hidden
                                ? '<i class="bi bi-eye"></i>'
                                : '<i class="bi bi-eye-slash"></i>';
                    }
                );
            }
        );


    /* =========================================================
       UPDATE PASSWORD
    ========================================================= */

    passwordForm
        ?.addEventListener(
            'submit',
            async function (event) {

                event.preventDefault();


                const currentPassword =
                    currentPasswordInput
                        ?.value ||
                    '';


                const newPassword =
                    newPasswordInput
                        ?.value ||
                    '';


                const confirmation =
                    confirmPasswordInput
                        ?.value ||
                    '';


                if (
                    !currentPassword ||
                    !newPassword ||
                    !confirmation
                ) {

                    window.showToast?.(
                        'يرجى تعبئة جميع حقول كلمة المرور.',
                        'warning'
                    );

                    return;
                }


                if (
                    newPassword !==
                    confirmation
                ) {

                    window.showToast?.(
                        'تأكيد كلمة المرور الجديدة غير مطابق.',
                        'warning'
                    );

                    return;
                }


                if (
                    newPassword.length <
                    8
                ) {

                    window.showToast?.(
                        'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.',
                        'warning'
                    );

                    return;
                }


                if (updatePasswordButton) {

                    updatePasswordButton.disabled =
                        true;
                }


                try {

                    const response =
                        await fetch(
                            passwordUrl,
                            {
                                method:
                                    'PUT',

                                headers:
                                    apiHeaders(),

                                body:
                                    JSON.stringify({

                                        current_password:
                                            currentPassword,

                                        password:
                                            newPassword,

                                        password_confirmation:
                                            confirmation,
                                    }),
                            }
                        );


                    const data =
                        await response
                            .json()
                            .catch(
                                () => ({})
                            );


                    if (!response.ok) {

                        if (
                            response.status ===
                            422
                        ) {

                            const firstError =
                                Object.values(
                                    data.errors ||
                                    {}
                                )
                                    .flat()
                                    .at(0);


                            throw new Error(
                                firstError ||
                                data.message ||
                                'تعذر تحديث كلمة المرور.'
                            );
                        }


                        throw new Error(
                            data.message ||
                            'تعذر تحديث كلمة المرور.'
                        );
                    }


                    passwordForm.reset();


                    window.showToast?.(
                        'تم تحديث كلمة المرور بنجاح.',
                        'success'
                    );


                } catch (error) {

                    console.error(
                        'Password update error:',
                        error
                    );


                    window.showToast?.(
                        error.message,
                        'error'
                    );


                } finally {

                    if (updatePasswordButton) {

                        updatePasswordButton.disabled =
                            false;
                    }
                }
            }
        );


    /* =========================================================
       LOAD REAL EMAIL PREFERENCES
    ========================================================= */

    async function loadEmailPreferences() {

        if (!emailPreferencesUrl) {

            console.error(
                'Email preferences URL missing.'
            );

            return;
        }


        try {

            const response =
                await fetch(
                    emailPreferencesUrl,
                    {
                        method: 'GET',

                        headers:
                            apiHeaders(),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            if (
                response.status ===
                401
            ) {

                clearAuthentication();

                window.location.href =
                    loginUrl;

                return;
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل تفضيلات البريد الإلكتروني.'
                );
            }


            const preferences =
                data.preferences ||
                {};


            if (emailNewEvents) {

                emailNewEvents.checked =
                    Boolean(
                        preferences.new_events
                    );
            }


            if (emailEventReminder) {

                emailEventReminder.checked =
                    Boolean(
                        preferences.event_reminder
                    );
            }


            if (
                emailRegistrationUpdates
            ) {

                emailRegistrationUpdates.checked =
                    Boolean(
                        preferences.registration_updates
                    );
            }


        } catch (error) {

            console.error(
                'Email preferences load error:',
                error
            );


            window.showToast?.(
                error.message,
                'error'
            );
        }
    }


    /* =========================================================
       SAVE REAL EMAIL PREFERENCES
    ========================================================= */

    async function saveEmailPreferences() {

        if (
            !saveEmailPreferencesButton ||
            !emailPreferencesUrl
        ) {

            return;
        }


        saveEmailPreferencesButton.disabled =
            true;


        const originalHtml =
            saveEmailPreferencesButton.innerHTML;


        saveEmailPreferencesButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm"
            ></span>

            جاري الحفظ...
        `;


        try {

            const response =
                await fetch(
                    emailPreferencesUrl,
                    {
                        method: 'PUT',

                        headers:
                            apiHeaders(),

                        body:
                            JSON.stringify({

                                new_events:
                                    Boolean(
                                        emailNewEvents
                                            ?.checked
                                    ),

                                event_reminder:
                                    Boolean(
                                        emailEventReminder
                                            ?.checked
                                    ),

                                registration_updates:
                                    Boolean(
                                        emailRegistrationUpdates
                                            ?.checked
                                    ),
                            }),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            if (!response.ok) {

                if (
                    response.status ===
                    422
                ) {

                    const firstError =
                        Object.values(
                            data.errors ||
                            {}
                        )
                            .flat()
                            .at(0);


                    throw new Error(
                        firstError ||
                        data.message ||
                        'تعذر حفظ التفضيلات.'
                    );
                }


                throw new Error(
                    data.message ||
                    'تعذر حفظ تفضيلات البريد.'
                );
            }


            const saved =
                data.preferences ||
                {};


            if (emailNewEvents) {

                emailNewEvents.checked =
                    Boolean(
                        saved.new_events
                    );
            }


            if (emailEventReminder) {

                emailEventReminder.checked =
                    Boolean(
                        saved.event_reminder
                    );
            }


            if (
                emailRegistrationUpdates
            ) {

                emailRegistrationUpdates.checked =
                    Boolean(
                        saved.registration_updates
                    );
            }


            window.showToast?.(
                'تم حفظ تفضيلات البريد الإلكتروني بنجاح.',
                'success'
            );


        } catch (error) {

            console.error(
                'Save preferences error:',
                error
            );


            window.showToast?.(
                error.message,
                'error'
            );


        } finally {

            saveEmailPreferencesButton.disabled =
                false;


            saveEmailPreferencesButton.innerHTML =
                originalHtml;
        }
    }


    saveEmailPreferencesButton
        ?.addEventListener(
            'click',
            saveEmailPreferences
        );


    /* =========================================================
       MOBILE SIDEBAR
    ========================================================= */

    const menuToggle =
        document.getElementById(
            'dashboardMenuToggle'
        );


    const sidebar =
        document.querySelector(
            '.sidebar'
        );


    const overlay =
        document.getElementById(
            'dashboardSidebarOverlay'
        );


    menuToggle
        ?.addEventListener(
            'click',
            function () {

                sidebar
                    ?.classList
                    .add('show');


                overlay
                    ?.classList
                    .add('show');
            }
        );


    overlay
        ?.addEventListener(
            'click',
            function () {

                sidebar
                    ?.classList
                    .remove('show');


                overlay
                    ?.classList
                    .remove('show');
            }
        );


    /* =========================================================
       LOGOUT
    ========================================================= */

    const logoutButton =
        document.getElementById(
            'logoutButton'
        );


    logoutButton
        ?.addEventListener(
            'click',
            async function () {

                logoutButton.disabled =
                    true;


                try {

                    if (logoutUrl) {

                        await fetch(
                            logoutUrl,
                            {
                                method: 'POST',

                                headers:
                                    apiHeaders(),
                            }
                        );
                    }


                } catch (error) {

                    console.error(
                        'Logout error:',
                        error
                    );


                } finally {

                    clearAuthentication();


                    window.location.href =
                        loginUrl;
                }
            }
        );


    /* =========================================================
       START
    ========================================================= */

    Promise.all([
        loadProfile(),
        loadEmailPreferences(),
    ]);

});