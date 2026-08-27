<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>تسجيل الدخول - فرحة</title>

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

    {{-- ملفات CSS وJavaScript الخاصة بالصفحة --}}
    @vite([
        'resources/css/site-common.css',
        'resources/css/login.css',
        'resources/js/login.js',
    ])
</head>

<body class="login-final-v2">

<header class="lf2-header">
    <div class="lf2-header-inner">

        <div class="lf2-back">
            <a href="{{ url('/home') }}">
                العودة للرئيسية
                <i class="bi bi-chevron-left"></i>
            </a>
        </div>

        <nav class="lf2-nav">
            <a href="{{ url('/home') }}">الرئيسية</a>
            <a href="{{ url('/events') }}">الفعاليات</a>
            <a href="{{ url('/about') }}">عن فرحة</a>
            <a href="{{ url('/organizers') }}">للمنظمين</a>
            <a href="{{ url('/contact') }}">تواصل معنا</a>
        </nav>

        <a href="{{ url('/home') }}" class="lf2-logo">
            <img
                src="{{ asset('images.1/logo2.png') }}"
                alt="شعار فرحة"
            >
        </a>

    </div>
</header>

<main class="lf2-main">

    {{-- الزينة --}}
    <div class="lf2-plane">
        <i class="bi bi-send-fill"></i>
    </div>

    <div class="lf2-star">
        <i class="bi bi-star-fill"></i>
    </div>

    <div class="lf2-heart-pink">
        <i class="bi bi-heart-fill"></i>
    </div>

    <div class="lf2-heart-purple">
        <i class="bi bi-heart"></i>
    </div>

    {{-- صور الصفحة --}}
    <img
        src="{{ asset('images.1/Ima11.png') }}"
        alt="أطفال"
        class="lf2-kids-img"
    >

    <img
        src="{{ asset('images.1/login 1.png') }}"
        alt="زينة"
        class="lf2-right-img"
    >

    <section class="lf2-card">

        <div class="lf2-lock-circle">
            <i class="bi bi-lock-fill"></i>
        </div>

        <h1>تسجيل الدخول</h1>

        <p>
            مرحباً بك مجدداً، سجل الدخول للوصول إلى حسابك
        </p>
@if (session('google_error'))

    <div
        class="alert alert-danger mb-3"
        role="alert"
    >
        {{ session('google_error') }}
    </div>

@endif
        <form
            id="loginForm"
            novalidate
            data-login-url="{{ url('/api/login') }}"
            data-redirect-url="{{ url('/home') }}"
        >
            @csrf

            <div class="lf2-form-group">
                <label for="emailInput">
                    البريد الإلكتروني
                </label>

                <div class="lf2-input" id="emailWrapper">
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
                    class="lf2-field-error"
                    id="emailError"
                    aria-live="polite"
                ></small>
            </div>

            <div class="lf2-form-group">
                <label for="passwordInput">
                    كلمة المرور
                </label>

                <div class="lf2-input" id="passwordWrapper">
                    <i class="bi bi-lock-fill"></i>

                    <input
                        id="passwordInput"
                        name="password"
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        autocomplete="current-password"
                        required
                    >

                    <button
                        type="button"
                        class="lf2-eye"
                        id="togglePassword"
                        aria-label="إظهار كلمة المرور"
                    >
                        <i id="eyeIcon" class="bi bi-eye"></i>
                    </button>
                </div>

                <small
                    class="lf2-field-error"
                    id="passwordError"
                    aria-live="polite"
                ></small>
            </div>

            <div class="lf2-options">

                <label for="rememberInput">
                    <input
                        id="rememberInput"
                        name="remember"
                        type="checkbox"
                    >

                    <span>تذكرني</span>
                </label>

                <a href="{{ url('/forgot-password') }}">
                    نسيت كلمة المرور؟
                </a>

            </div>

            <button
                type="submit"
                class="lf2-submit"
                id="loginSubmitButton"
            >
                <i class="bi bi-box-arrow-in-left"></i>

                <span class="lf2-submit-text">
                    تسجيل الدخول
                </span>

                <span
                    class="spinner-border spinner-border-sm d-none"
                    id="loginSpinner"
                    aria-hidden="true"
                ></span>
            </button>

            <div class="lf2-divider">
                <span></span>
                <strong>أو</strong>
                <span></span>
            </div>

            <a
                href="{{ url('/auth/google') }}"
                class="lf2-google"
            >
                <span>G</span>
                تسجيل الدخول باستخدام Google
            </a>

            <div class="lf2-register">
                <span>ليس لديك حساب؟</span>

                <a href="{{ url('/register') }}">
                    <i class="bi bi-person-plus-fill"></i>
                    إنشاء حساب جديد
                </a>
            </div>

        </form>

    </section>

</main>

</body>
</html>