import './site-common.js';
import './messages.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    const emailWrapper = document.getElementById('emailWrapper');
    const passwordWrapper = document.getElementById('passwordWrapper');

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const eyeButton = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');

    const submitButton = document.getElementById('loginSubmitButton');
    const submitText = submitButton?.querySelector('.lf2-submit-text');
    const spinner = document.getElementById('loginSpinner');

    if (!form) {
        return;
    }

    function clearErrors() {
        emailWrapper?.classList.remove('is-invalid');
        passwordWrapper?.classList.remove('is-invalid');

        if (emailError) {
            emailError.textContent = '';
        }

        if (passwordError) {
            passwordError.textContent = '';
        }
    }

    function showFieldError(wrapper, errorElement, message) {
        wrapper?.classList.add('is-invalid');

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function setLoading(isLoading) {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isLoading;

        if (submitText) {
            submitText.textContent = isLoading
                ? 'جاري تسجيل الدخول...'
                : 'تسجيل الدخول';
        }

        spinner?.classList.toggle('d-none', !isLoading);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (eyeButton && passwordInput && eyeIcon) {
        eyeButton.addEventListener('click', function () {
            const passwordIsHidden =
                passwordInput.type === 'password';

            passwordInput.type = passwordIsHidden
                ? 'text'
                : 'password';

            eyeIcon.classList.toggle(
                'bi-eye',
                !passwordIsHidden
            );

            eyeIcon.classList.toggle(
                'bi-eye-slash',
                passwordIsHidden
            );

            eyeButton.setAttribute(
                'aria-label',
                passwordIsHidden
                    ? 'إخفاء كلمة المرور'
                    : 'إظهار كلمة المرور'
            );
        });
    }

    emailInput?.addEventListener('input', function () {
        emailWrapper?.classList.remove('is-invalid');

        if (emailError) {
            emailError.textContent = '';
        }
    });

    passwordInput?.addEventListener('input', function () {
        passwordWrapper?.classList.remove('is-invalid');

        if (passwordError) {
            passwordError.textContent = '';
        }
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        clearErrors();

        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';

        const remember =
            document.getElementById('rememberInput')?.checked || false;

        let formIsValid = true;

        if (!email) {
            showFieldError(
                emailWrapper,
                emailError,
                'يرجى إدخال البريد الإلكتروني.'
            );

            formIsValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError(
                emailWrapper,
                emailError,
                'يرجى إدخال بريد إلكتروني صحيح.'
            );

            formIsValid = false;
        }

        if (!password) {
            showFieldError(
                passwordWrapper,
                passwordError,
                'يرجى إدخال كلمة المرور.'
            );

            formIsValid = false;
        }

        if (!formIsValid) {
            window.showMsg?.('login', 'emptyFields');
            return;
        }

        const loginUrl = form.dataset.loginUrl;
        const redirectUrl = form.dataset.redirectUrl;

        setLoading(true);

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',

                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json().catch(function () {
                return {};
            });

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    if (data.errors.email?.length) {
                        showFieldError(
                            emailWrapper,
                            emailError,
                            data.errors.email[0]
                        );
                    }

                    if (data.errors.password?.length) {
                        showFieldError(
                            passwordWrapper,
                            passwordError,
                            data.errors.password[0]
                        );
                    }

                    window.showMsg?.(
                        'login',
                        'invalidFields'
                    );

                    return;
                }

                if (response.status === 401) {
                    window.showMsg?.(
                        'login',
                        'invalidCredentials'
                    );

                    return;
                }

                if (response.status === 403) {
                    window.showMsg?.(
                        'login',
                        'inactiveAccount'
                    );

                    return;
                }

                window.showMsg?.(
                    'login',
                    'serverError'
                );

                return;
            }

            if (!data.token || !data.user) {
                window.showMsg?.(
                    'login',
                    'serverError'
                );

                return;
            }

            /*
             * إذا فعل المستخدم "تذكرني"
             * نخزن البيانات في localStorage.
             * وإلا نخزنها في sessionStorage.
             */
            const storage = remember
                ? window.localStorage
                : window.sessionStorage;

            /*
             * نحذف أي بيانات تسجيل دخول قديمة
             * حتى لا يبقى توكن في التخزينين.
             */
            window.localStorage.removeItem('farha_token');
            window.localStorage.removeItem('farha_user');

            window.sessionStorage.removeItem('farha_token');
            window.sessionStorage.removeItem('farha_user');

            /*
             * حفظ التوكن وبيانات المستخدم.
             */
            storage.setItem(
                'farha_token',
                data.token
            );

            storage.setItem(
                'farha_user',
                JSON.stringify(data.user)
            );

            window.showMsg?.(
                'login',
                'success'
            );

            /*
             * تحديد الصفحة المناسبة حسب دور المستخدم.
             */
            let finalRedirectUrl = redirectUrl || '/';

            if (data.user.role === 'admin') {
                finalRedirectUrl = '/admin/dashboard';
            } else if (data.user.role === 'organizer') {
                finalRedirectUrl = '/organizer/dashboard';
            } else if (data.user.role === 'parent') {
                finalRedirectUrl = '/home';
            }

            window.setTimeout(function () {
                window.location.href = finalRedirectUrl;
            }, 700);
        } catch (error) {
            console.error('Login request failed:', error);

            window.showMsg?.(
                'login',
                'networkError'
            );
        } finally {
            setLoading(false);
        }
    });
});