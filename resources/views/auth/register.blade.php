<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>إنشاء حساب - فرحة</title>

    {{-- Bootstrap RTL --}}
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css"
        rel="stylesheet"
    >

    {{-- Bootstrap Icons --}}
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        rel="stylesheet"
    >

    {{-- ملفات الصفحة --}}
    @vite([
        'resources/css/site-common.css',
        'resources/css/register.css',
        'resources/js/register.js',
    ])
</head>

<body class="register-page-final">

    {{-- Header --}}
    <header class="reg-header">
        <div class="reg-header-inner">

            <div class="reg-back">
                <a href="{{ url('/home') }}">
                    العودة للرئيسية
                    <i class="bi bi-chevron-left"></i>
                </a>
            </div>

            <nav class="reg-nav">
                <a href="{{ url('/home') }}">الرئيسية</a>
                <a href="{{ url('/events') }}">الفعاليات</a>
                <a href="{{ url('/about') }}">عن فرحة</a>
                <a href="{{ url('/organizers') }}">للمنظمين</a>
                <a href="{{ url('/contact') }}">تواصل معنا</a>
            </nav>

            <a href="{{ url('/home') }}" class="reg-logo">
                <img
                    src="{{ asset('images.1/logo2.png') }}"
                    alt="فرحة"
                >
            </a>

        </div>
    </header>

    {{-- Main --}}
    <main class="reg-main">

        {{-- Decorative elements --}}
        <div class="reg-heart-main">
            <i class="bi bi-heart"></i>
        </div>

        <span class="reg-dot dot-one"></span>
        <span class="reg-dot dot-two"></span>
        <span class="reg-dot dot-three"></span>

        <span class="reg-diamond diamond-one"></span>
        <span class="reg-diamond diamond-two"></span>

        <span class="reg-wave">⌒</span>

        <img
            src="{{ asset('images.1/reg1.png') }}"
            alt="أطفال"
            class="reg-kids-img"
        >

        <div class="reg-bg-wave"></div>

        {{-- Register Card --}}
        <section class="reg-card">

            <div class="reg-user-circle">
                <i class="bi bi-person-plus-fill"></i>
            </div>

            <h1>إنشاء حساب</h1>

            <p class="reg-subtitle">
                انضم إلى فرحة واستمتع بتجربة مميزة
            </p>

            <form
                id="registerForm"
                novalidate
                data-register-url="{{ url('/api/register') }}"
                data-login-url="{{ url('/login') }}"
            >
                @csrf

                {{-- الاسم --}}
                <div class="reg-form-group">
                    <label for="nameInput">
                        الاسم الكامل
                    </label>

                    <div class="reg-input" id="nameWrapper">
                        <i class="bi bi-person-fill"></i>

                        <input
                            id="nameInput"
                            name="name"
                            type="text"
                            placeholder="أدخل اسمك الكامل"
                            autocomplete="name"
                            required
                        >
                    </div>

                    <small
                        class="reg-field-error"
                        id="nameError"
                        aria-live="polite"
                    ></small>
                </div>

                {{-- البريد --}}
                <div class="reg-form-group">
                    <label for="emailInput">
                        البريد الإلكتروني
                    </label>

                    <div class="reg-input" id="emailWrapper">
                        <i class="bi bi-envelope-fill"></i>

                        <input
                            id="emailInput"
                            name="email"
                            type="email"
                            placeholder="أدخل بريدك الإلكتروني"
                            autocomplete="email"
                            required
                        >
                    </div>

                    <small
                        class="reg-field-error"
                        id="emailError"
                        aria-live="polite"
                    ></small>
                </div>

                {{-- رقم الجوال --}}
                <div class="reg-form-group">
                    <label for="phoneInput">
                        رقم الجوال
                    </label>

                    <div class="reg-phone-row">

                        <div
                            class="reg-input reg-phone-number"
                            id="phoneWrapper"
                        >
                            <input
                                id="phoneInput"
                                name="phone"
                                type="text"
                                placeholder="أدخل رقم الجوال"
                                autocomplete="tel"
                                required
                            >
                        </div>

                        <div class="reg-country">
                            <i class="bi bi-telephone-fill"></i>
                            <span>+970</span>
                        </div>

                    </div>

                    <small
                        class="reg-field-error"
                        id="phoneError"
                        aria-live="polite"
                    ></small>
                </div>

                {{-- المدينة --}}
                <div class="reg-input" id="cityWrapper">
    <i class="bi bi-geo-alt-fill"></i>

    <select
        id="cityInput"
        name="city"
        class="form-select border-0 shadow-none"
    >
        <option value="">اختر المدينة</option>
        <option value="gaza">غزة</option>
        <option value="rafah">رفح</option>
        <option value="khan-yunis">خان يونس</option>
        <option value="deir-albalah">دير البلح</option>
    </select>
</div>

<small class="reg-field-error" id="cityError"></small>
                {{-- نوع الحساب --}}
                <div class="reg-input" id="roleWrapper">
    <i class="bi bi-people-fill"></i>

    <select
        id="roleInput"
        name="role"
        class="form-select border-0 shadow-none"
    >
        <option value="">اختر نوع الحساب</option>
        <option value="parent">ولي أمر</option>
        <option value="organizer">منظم فعاليات</option>
    </select>
</div>

<small class="reg-field-error" id="roleError"></small>

                {{-- كلمة المرور --}}
                <div class="reg-form-group">
                    <label for="registerPassword">
                        كلمة المرور
                    </label>

                    <div class="reg-input" id="passwordWrapper">
                        <i class="bi bi-lock-fill"></i>

                        <input
                            id="registerPassword"
                            name="password"
                            type="password"
                            placeholder="أدخل كلمة المرور"
                            autocomplete="new-password"
                            required
                        >

                        <button
                            type="button"
                            class="reg-eye"
                            data-target="registerPassword"
                            aria-label="إظهار كلمة المرور"
                        >
                            <i
                                id="registerEye"
                                class="bi bi-eye"
                            ></i>
                        </button>
                    </div>

                    <small
                        class="reg-field-error"
                        id="passwordError"
                        aria-live="polite"
                    ></small>
                </div>

                {{-- تأكيد كلمة المرور --}}
                <div class="reg-form-group">
                    <label for="confirmPassword">
                        تأكيد كلمة المرور
                    </label>

                    <div class="reg-input" id="confirmPasswordWrapper">
                        <i class="bi bi-lock-fill"></i>

                        <input
                            id="confirmPassword"
                            name="password_confirmation"
                            type="password"
                            placeholder="أعد إدخال كلمة المرور"
                            autocomplete="new-password"
                            required
                        >

                        <button
                            type="button"
                            class="reg-eye"
                            data-target="confirmPassword"
                            aria-label="إظهار تأكيد كلمة المرور"
                        >
                            <i
                                id="confirmEye"
                                class="bi bi-eye"
                            ></i>
                        </button>
                    </div>

                    <small
                        class="reg-field-error"
                        id="confirmPasswordError"
                        aria-live="polite"
                    ></small>
                </div>

                <button
                    type="submit"
                    class="reg-submit"
                    id="registerSubmitButton"
                >
                    <span class="reg-submit-text">
                        إنشاء حساب
                    </span>

                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="registerSpinner"
                        aria-hidden="true"
                    ></span>
                </button>

                <div class="reg-divider">
                    <span></span>
                    <strong>أو</strong>
                    <span></span>
                </div>

                <a
                    href="{{ url('/auth/google') }}"
                    class="reg-google"
                >
                    <span>G</span>
                    التسجيل باستخدام Google
                </a>

                <div class="reg-login-text">
                    <span>لديك حساب بالفعل؟</span>

                    <a href="{{ url('/login') }}">
                        تسجيل الدخول
                    </a>
                </div>

            </form>

        </section>

    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>