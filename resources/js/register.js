import './site-common.js';
import './messages.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');

    if (!form) {
        return;
    }

    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const cityInput = document.getElementById('cityInput');
    const roleInput = document.getElementById('roleInput');
    const passwordInput =
        document.getElementById('registerPassword');
    const confirmPasswordInput =
        document.getElementById('confirmPassword');

    const submitButton =
        document.getElementById('registerSubmitButton');
    const submitText =
        submitButton?.querySelector('.reg-submit-text');
    const spinner =
        document.getElementById('registerSpinner');

    const fields = {
        name: {
            input: nameInput,
            wrapper: document.getElementById('nameWrapper'),
            error: document.getElementById('nameError'),
        },

        email: {
            input: emailInput,
            wrapper: document.getElementById('emailWrapper'),
            error: document.getElementById('emailError'),
        },

        phone: {
            input: phoneInput,
            wrapper: document.getElementById('phoneWrapper'),
            error: document.getElementById('phoneError'),
        },

        city: {
            input: cityInput,
            wrapper: document.getElementById('cityWrapper'),
            error: document.getElementById('cityError'),
        },

        role: {
            input: roleInput,
            wrapper: document.getElementById('roleWrapper'),
            error: document.getElementById('roleError'),
        },

        password: {
            input: passwordInput,
            wrapper: document.getElementById('passwordWrapper'),
            error: document.getElementById('passwordError'),
        },

        password_confirmation: {
            input: confirmPasswordInput,
            wrapper:
                document.getElementById('confirmPasswordWrapper'),
            error:
                document.getElementById('confirmPasswordError'),
        },
    };

    /*
     * إظهار وإخفاء كلمة المرور.
     */
    function wirePasswordToggle(
        inputId,
        buttonSelector,
        iconId
    ) {
        const input = document.getElementById(inputId);
        const button = document.querySelector(buttonSelector);
        const icon = document.getElementById(iconId);

        if (!input || !button || !icon) {
            return;
        }

        button.addEventListener('click', function () {
            const isHidden = input.type === 'password';

            input.type = isHidden ? 'text' : 'password';

            icon.classList.toggle('bi-eye', !isHidden);
            icon.classList.toggle('bi-eye-slash', isHidden);

            button.setAttribute(
                'aria-label',
                isHidden
                    ? 'إخفاء كلمة المرور'
                    : 'إظهار كلمة المرور'
            );
        });
    }

    wirePasswordToggle(
        'registerPassword',
        '.reg-eye[data-target="registerPassword"]',
        'registerEye'
    );

    wirePasswordToggle(
        'confirmPassword',
        '.reg-eye[data-target="confirmPassword"]',
        'confirmEye'
    );

    /*
     * مسح خطأ حقل واحد.
     */
    function clearFieldError(fieldName) {
        const field = fields[fieldName];

        field?.wrapper?.classList.remove('is-invalid');

        if (field?.error) {
            field.error.textContent = '';
        }
    }

    /*
     * مسح جميع الأخطاء.
     */
    function clearAllErrors() {
        Object.keys(fields).forEach(function (fieldName) {
            clearFieldError(fieldName);
        });
    }

    /*
     * إظهار رسالة خطأ تحت حقل محدد.
     */
    function showFieldError(fieldName, message) {
        const field = fields[fieldName];

        field?.wrapper?.classList.add('is-invalid');

        if (field?.error) {
            field.error.textContent = message;
        }
    }

    /*
     * تغيير حالة زر الإرسال.
     */
    function setLoading(isLoading) {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isLoading;

        if (submitText) {
            submitText.textContent = isLoading
                ? 'جاري إنشاء الحساب...'
                : 'إنشاء حساب';
        }

        spinner?.classList.toggle('d-none', !isLoading);
    }

    /*
     * فحص صيغة البريد الإلكتروني.
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /*
     * إزالة خطأ الحقل بمجرد أن يعدّل المستخدم قيمته.
     */
    Object.keys(fields).forEach(function (fieldName) {
        const input = fields[fieldName].input;

        input?.addEventListener('input', function () {
            clearFieldError(fieldName);
        });

        input?.addEventListener('change', function () {
            clearFieldError(fieldName);
        });
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        clearAllErrors();

        const name = nameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const phone = phoneInput?.value.trim() || '';
        const city = cityInput?.value || '';
        const role = roleInput?.value || '';
        const password = passwordInput?.value || '';
        const passwordConfirmation =
            confirmPasswordInput?.value || '';

        let formIsValid = true;

        /*
         * التحقق من الاسم.
         */
        if (!name) {
            showFieldError(
                'name',
                'يرجى إدخال الاسم الكامل.'
            );

            formIsValid = false;
        }

        /*
         * التحقق من البريد.
         */
        if (!email) {
            showFieldError(
                'email',
                'يرجى إدخال البريد الإلكتروني.'
            );

            formIsValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError(
                'email',
                'يرجى إدخال بريد إلكتروني صحيح.'
            );

            formIsValid = false;
        }

        /*
         * التحقق من الهاتف.
         */
        if (!phone) {
            showFieldError(
                'phone',
                'يرجى إدخال رقم الجوال.'
            );

            formIsValid = false;
        } else if (!/^[0-9+\-\s]{7,20}$/.test(phone)) {
            showFieldError(
                'phone',
                'يرجى إدخال رقم جوال صحيح.'
            );

            formIsValid = false;
        }

        /*
         * التحقق من المدينة.
         */
        if (!city) {
            showFieldError(
                'city',
                'يرجى اختيار المدينة.'
            );

            formIsValid = false;
        }

        /*
         * التحقق من نوع الحساب.
         */
        if (!role) {
            showFieldError(
                'role',
                'يرجى اختيار نوع الحساب.'
            );

            formIsValid = false;
        }

        /*
         * التحقق من كلمة المرور.
         */
        if (!password) {
            showFieldError(
                'password',
                'يرجى إدخال كلمة المرور.'
            );

            formIsValid = false;
        } else if (password.length < 8) {
            showFieldError(
                'password',
                'كلمة المرور يجب ألا تقل عن 8 أحرف.'
            );

            formIsValid = false;
        }

        /*
         * التحقق من تأكيد كلمة المرور.
         */
        if (!passwordConfirmation) {
            showFieldError(
                'password_confirmation',
                'يرجى تأكيد كلمة المرور.'
            );

            formIsValid = false;
        } else if (passwordConfirmation !== password) {
            showFieldError(
                'password_confirmation',
                'كلمة المرور وتأكيدها غير متطابقين.'
            );

            formIsValid = false;
        }

        if (!formIsValid) {
            window.showMsg?.(
                'register',
                'missingFields'
            );

            return;
        }

        const registerUrl = form.dataset.registerUrl;

        if (!registerUrl) {
            console.error(
                'data-register-url is missing from registerForm.'
            );

            window.showMsg?.(
                'register',
                'serverError'
            );

            return;
        }

        setLoading(true);

        try {
            /*
             * إرسال البيانات إلى Laravel API.
             */
            const response = await fetch(registerUrl, {
                method: 'POST',

                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    city,
                    role,
                    password,
                    password_confirmation:
                        passwordConfirmation,
                }),
            });

            const data = await response.json().catch(function () {
                return {};
            });

            /*
             * التعامل مع أخطاء Laravel Validation.
             */
            if (!response.ok) {
                if (
                    response.status === 422 &&
                    data.errors
                ) {
                    Object.entries(data.errors).forEach(
                        function ([fieldName, messages]) {
                            if (
                                fields[fieldName] &&
                                Array.isArray(messages) &&
                                messages.length > 0
                            ) {
                                showFieldError(
                                    fieldName,
                                    messages[0]
                                );
                            }
                        }
                    );

                    if (data.errors.email?.length) {
                        window.showMsg?.(
                            'register',
                            'emailUsed'
                        );
                    } else {
                        window.showMsg?.(
                            'register',
                            'missingFields'
                        );
                    }

                    return;
                }

                window.showMsg?.(
                    'register',
                    'serverError'
                );

                return;
            }

            /*
             * التأكد أن Laravel أعاد المستخدم والتوكن.
             */
            if (!data.user || !data.token) {
                console.error(
                    'Invalid register response:',
                    data
                );

                window.showMsg?.(
                    'register',
                    'serverError'
                );

                return;
            }

            /*
             * حذف بيانات تسجيل الدخول القديمة.
             */
            window.localStorage.removeItem('farha_token');
            window.localStorage.removeItem('farha_user');

            window.sessionStorage.removeItem('farha_token');
            window.sessionStorage.removeItem('farha_user');

            /*
             * حفظ التوكن والمستخدم الجديد.
             */
            window.localStorage.setItem(
                'farha_token',
                data.token
            );

            window.localStorage.setItem(
                'farha_user',
                JSON.stringify(data.user)
            );

            window.showMsg?.(
                'register',
                'success'
            );

            /*
             * توجيه المستخدم حسب نوع الحساب.
             */
            let redirectUrl = '/home';

            if (data.user.role === 'organizer') {
                redirectUrl = '/organizer/dashboard';
            } else if (data.user.role === 'parent') {
                redirectUrl = '/home';
            }

            window.setTimeout(function () {
                window.location.href = redirectUrl;
            }, 800);
        } catch (error) {
            console.error(
                'Register request failed:',
                error
            );

            window.showMsg?.(
                'register',
                'networkError'
            );
        } finally {
            setLoading(false);
        }
    });
});