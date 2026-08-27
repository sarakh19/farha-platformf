<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>للمنظمين - فرحة</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css"
        rel="stylesheet"
    >

    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    >

    @vite([
        'resources/css/site-common.css',
        'resources/css/organizers.css',
        'resources/js/organizers.js'
    ])

</head>


<body class="orgx-page">

<div
    id="organizersPage"

    data-organizers-api="{{ url('/api/organizers') }}"
    data-categories-api="{{ url('/api/categories') }}"
    data-events-page="{{ url('/events') }}"
>


    <!-- =====================================================
         Header
    ====================================================== -->

    <header class="site-header">

        <div class="wrap site-header-row">


            <a
                href="{{ url('/') }}"
                class="site-logo"
            >
                <img
                    src="{{ asset('images.1/logo2.png') }}"
                    alt="فرحة"
                >
            </a>


            <button
                type="button"
                class="menu-toggle"
                aria-label="فتح القائمة"
            >
                <i class="bi bi-list"></i>
            </button>


            <nav class="site-nav">

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a
                    href="{{ url('/organizers') }}"
                    class="active"
                >
                    للمنظمين
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>

                <a href="{{ url('/faq') }}">
                    الأسئلة الشائعة
                </a>

            </nav>


            <div class="site-auth">

                <a
                    href="{{ url('/login') }}"
                    class="btn-login"
                >
                    <i class="bi bi-box-arrow-in-left"></i>

                    تسجيل دخول
                </a>


                <a
                    href="{{ url('/register') }}"
                    class="btn-register"
                >
                    <i class="bi bi-person-plus-fill"></i>

                    إنشاء حساب
                </a>

            </div>

        </div>

    </header>


    <!-- =====================================================
         Hero
    ====================================================== -->

    <section class="orgx-hero">

        <div class="wrap orgx-hero-inner">


            <div class="orgx-hero-img">

                <img
                    src="{{ asset('images.1/Image (10).png') }}"
                    alt="المنظمون"
                >

            </div>


            <div class="orgx-hero-text">

                <h1>

                    <span>
                        <i class="bi bi-people-fill"></i>
                    </span>

                    المنظمون

                </h1>


                <p>
                    تعرف على الجهات والمنظمات التي تنظم فعاليات ترفيهية وتعليمية
                    <br>
                    آمنة وممتعة للأطفال
                </p>


                <a
                    href="{{ url('/register') }}"
                    class="orgx-hero-btn"
                >
                    <i class="bi bi-plus-circle"></i>

                    كن منظماً
                </a>


                <small>
                    انضم إلى منصة فرحة وانشر فعالياتك
                </small>

            </div>

        </div>

    </section>


    <!-- =====================================================
         Filters
    ====================================================== -->

    <section class="wrap orgx-filters">


        <a
            href="#"
            class="orgx-reset"
            id="resetOrganizerFilters"
        >

            <span>
                <i class="bi bi-arrow-clockwise"></i>
            </span>

            إعادة تعيين

        </a>


        <!-- City -->
        <label class="orgx-select">

            <select id="organizerCityFilter">

                <option value="">
                    جميع المناطق
                </option>

                <option value="غزة">
                    غزة
                </option>

                <option value="خان يونس">
                    خان يونس
                </option>

                <option value="رفح">
                    رفح
                </option>

            </select>


            <b>
                <i class="bi bi-geo-alt-fill"></i>
            </b>

        </label>


        <!-- Category -->
        <label class="orgx-select">

            <select id="organizerCategoryFilter">

                <option value="">
                    جميع الفئات
                </option>

                <!-- JavaScript -->

            </select>


            <b>
                <i class="bi bi-grid-3x3-gap-fill"></i>
            </b>

        </label>


        <!-- Search -->
        <label class="orgx-search">

            <input
                type="text"
                id="organizerSearch"
                placeholder="ابحث عن منظمة أو جهة"
            >

            <span>
                <i class="bi bi-search"></i>
            </span>

        </label>

    </section>


    <!-- =====================================================
         Main
    ====================================================== -->

    <main class="wrap orgx-main">


        <div class="orgx-title">

            <h2>

                <span>
                    <i class="bi bi-people-fill"></i>
                </span>

                جميع المنظمين

            </h2>

        </div>


        <!-- Loading -->
        <div
            id="organizersLoading"
            class="text-center py-5"
        >

            <span class="spinner-border spinner-border-sm"></span>

            جاري تحميل المنظمين...

        </div>


        <!-- Error -->
        <div
            id="organizersError"
            class="alert alert-danger d-none"
        >

            <span id="organizersErrorMessage">
                تعذر تحميل المنظمين.
            </span>

            <button
                type="button"
                id="retryOrganizers"
                class="btn btn-sm btn-outline-danger"
            >
                إعادة المحاولة
            </button>

        </div>


        <!-- Slider -->
        <div
            class="orgx-slider d-none"
            id="organizersContent"
        >


            <button
                type="button"
                class="orgx-arrow orgx-arrow-right"
                id="organizersNext"
                aria-label="التالي"
            >
                ›
            </button>


            <div
                class="orgx-cards"
                id="organizersCards"
            >

                <!-- JavaScript -->

            </div>


            <button
                type="button"
                class="orgx-arrow orgx-arrow-left"
                id="organizersPrevious"
                aria-label="السابق"
            >
                ‹
            </button>

        </div>


        <!-- Empty -->
        <div
            id="organizersEmpty"
            class="text-center py-5 d-none"
        >

            <i class="bi bi-people fs-1"></i>

            <p class="mt-2">
                لا يوجد منظمون مطابقون لبحثك.
            </p>

        </div>


        <!-- =================================================
             Why Join
        ================================================== -->

        <section class="orgx-why">


            <div class="orgx-why-actions">

                <a
                    href="{{ url('/register') }}"
                    class="orgx-join"
                >
                    سجل الآن كمنظم
                </a>


                <a
                    href="{{ url('/about') }}"
                    class="orgx-more"
                >
                    تعرف على المزيد ‹
                </a>

            </div>


            <div class="orgx-why-content">

                <h2>
                    لماذا تنضم كمنظم إلى فرحة
                </h2>


                <div class="orgx-features">


                    <div class="orgx-feature">

                        <span>
                            <i class="bi bi-people-fill"></i>
                        </span>

                        <div>

                            <h3>
                                وصول أكبر
                            </h3>

                            <p>
                                الوصول إلى الأهالي المهتمين بفعاليات الأطفال.
                            </p>

                        </div>

                    </div>


                    <div class="orgx-feature">

                        <span>
                            <i class="bi bi-calendar-event-fill"></i>
                        </span>

                        <div>

                            <h3>
                                إدارة سهلة
                            </h3>

                            <p>
                                إدارة فعالياتك وتسجيلاتك بسهولة من لوحة التحكم.
                            </p>

                        </div>

                    </div>


                    <div class="orgx-feature">

                        <span>
                            <i class="bi bi-shield-check"></i>
                        </span>

                        <div>

                            <h3>
                                بيئة آمنة
                            </h3>

                            <p>
                                نحرص على جودة وموثوقية الفعاليات والمنظمين.
                            </p>

                        </div>

                    </div>


                    <div class="orgx-feature">

                        <span>
                            <i class="bi bi-megaphone-fill"></i>
                        </span>

                        <div>

                            <h3>
                                ترويج فعال
                            </h3>

                            <p>
                                نساعدك في الترويج لفعالياتك بشكل أفضل.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    </main>


    <!-- =====================================================
         Footer
    ====================================================== -->

    <footer class="site-footer">

        <div class="wrap site-footer-grid">


            <div class="site-footer-brand">

                <img
                    src="{{ asset('images.1/logo.png') }}"
                    alt="فرحة"
                >

                <p>
                    منصة فرحة تجمع الفعاليات المخصصة للأطفال وأولياء الأمور في مكان واحد، لتجربة ممتعة وآمنة وموثوقة.
                </p>


                <div class="site-social">

                    <a href="#">
                        <i class="bi bi-facebook"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-youtube"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-twitter-x"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-instagram"></i>
                    </a>

                </div>

            </div>


            <div class="site-footer-col">

                <h4>
                    روابط سريعة
                </h4>

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a href="{{ url('/organizers') }}">
                    المنظمون
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>

            </div>


          <div class="site-footer-col">

    <h4>
        الفئات
    </h4>

    <a href="{{ url('/events?category_id=1') }}">
        تعليمية وثقافية
    </a>

    <a href="{{ url('/events?category_id=2') }}">
        فنية وترفيهية
    </a>

    <a href="{{ url('/events?category_id=3') }}">
        صحة وتوعية
    </a>

    <a href="{{ url('/events?category_id=4') }}">
        حماية ودعم نفسي
    </a>

    <a href="{{ url('/events') }}">
        جميع الفئات
    </a>

</div>


            <div class="site-footer-col">

                <h4>
                    معلومات
                </h4>

                <a href="{{ url('/about') }}">
                    من نحن
                </a>

                <a href="{{ url('/faq') }}">
                    الأسئلة الشائعة
                </a>

            </div>

        </div>


        <p class="site-footer-copy">
            جميع الحقوق محفوظة © 2026 منصة فرحة
        </p>

    </footer>

</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>

</body>

</html>