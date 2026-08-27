<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        فرحة - الرئيسية
    </title>


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
        'resources/css/home.css',
        'resources/js/home.js'
    ])

</head>


<body class="farha-home-final">


<div
    id="homePage"

    data-events-api="{{ url('/api/events') }}"

    data-categories-api="{{ url('/api/categories') }}"

    data-events-page="{{ url('/events') }}"

    data-event-api-base="{{ url('/api/events') }}"
>


    {{-- =====================================================
         HEADER
    ====================================================== --}}

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


                <a
                    href="{{ url('/') }}"
                    class="active"
                >
                    الرئيسية
                </a>


                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>


                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>


                <a href="{{ url('/organizers') }}">
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


    {{-- =====================================================
         MAIN
    ====================================================== --}}

    <main class="hp-main">


        {{-- =================================================
             HERO
        ================================================== --}}

        <section class="hp-hero">


            <div class="wrap hp-hero-row">


                <div class="hp-hero-image">


                    <img
                        src="{{ asset('images.1/hero-kids.png') }}"
                        alt="أطفال يستمتعون بفعالية فرحة"
                    >


                </div>


                <div class="hp-hero-text">


                    <h1>

                        اكتشف وشارك

                        <br>

                        في فعاليات ممتعة وآمنة

                    </h1>


                    <p>
                        لأن كل لحظة مع طفلك تستحق فرحة
                    </p>


                    <div class="hp-hero-actions">


                        <a
                            href="{{ url('/events') }}"
                            class="hp-primary-btn"
                        >
                            استعرض الفعاليات
                        </a>


                        <a
                            href="{{ url('/about') }}"
                            class="hp-outline-btn"
                        >
                            اعرف أكثر
                        </a>


                    </div>


                </div>


            </div>


        </section>


        {{-- =================================================
             QUOTE
        ================================================== --}}

        <section
            class="wrap hp-quote"
            id="quoteBox"
        >


            <span class="hp-quote-icon">
                ”
            </span>


            <div class="hp-quote-content">


                <h3 id="quoteText">
                    كل لحظة لعب هي فرصة جديدة للتعلم والنمو.
                </h3>


                <p>

                    رسالة فرحة

                    <i class="bi bi-stars"></i>

                </p>


            </div>


        </section>


        {{-- =================================================
             SEARCH
        ================================================== --}}

        <section class="wrap hp-search">


            {{-- Search --}}

            <div class="hp-search-field hp-search-main">


                <span>
                    <i class="bi bi-search"></i>
                </span>


                <input
                    type="text"
                    id="homeSearchInput"
                    placeholder="ابحث عن فعالية"
                >


            </div>


            {{-- Category --}}

            <div class="hp-search-field">


                <span>
                    <i class="bi bi-grid-fill"></i>
                </span>


                <select id="homeCategorySelect">


                    <option value="">
                        جميع الفئات
                    </option>


                </select>


            </div>


            {{-- Location --}}

            <div class="hp-search-field">


                <span>
                    <i class="bi bi-geo-alt-fill"></i>
                </span>


                <input
                    type="text"
                    id="homeLocationInput"
                    placeholder="المنطقة"
                >


            </div>


            {{-- Age --}}

            <div class="hp-search-field">


                <span>
                    <i class="bi bi-people-fill"></i>
                </span>


                <select id="homeAgeSelect">


                    <option value="">
                        الفئة العمرية
                    </option>


                    <option value="5 - 8 سنوات">
                        5 - 8 سنوات
                    </option>


                    <option value="8 - 12 سنة">
                        8 - 12 سنة
                    </option>


                    <option value="12 - 15 سنة">
                        12 - 15 سنة
                    </option>


                </select>


            </div>


            <button
                type="button"
                class="hp-search-btn"
                id="homeSearchButton"
            >
                بحث
            </button>


        </section>


        {{-- =================================================
             CATEGORIES
        ================================================== --}}

        <section class="wrap hp-section">


            <div class="hp-section-head">


                <h2>
                    كل الفئات
                </h2>


                <a href="{{ url('/events') }}">
                    عرض الكل
                </a>


            </div>


            <div
                class="hp-categories"
                id="homeCategoriesContainer"
            >


                <a
                    href="{{ url('/events') }}"
                    class="hp-category active"
                >


                    <span>
                        <i class="bi bi-grid-fill"></i>
                    </span>


                    <strong>
                        جميع الفئات
                    </strong>


                </a>


            </div>


        </section>


        {{-- =================================================
             UPCOMING EVENTS
        ================================================== --}}

        <section class="wrap hp-section">


            <div class="hp-section-head">


                <h2>
                    الفعاليات القادمة
                </h2>


                <a href="{{ url('/events') }}">
                    عرض المزيد
                </a>


            </div>


            {{-- Loading --}}

            <div
                id="homeEventsLoading"
                class="text-center py-4"
            >


                <span
                    class="spinner-border spinner-border-sm"
                ></span>


                جاري تحميل الفعاليات...


            </div>


            {{-- Events --}}

            <div
                class="hp-events-grid"
                id="homeEventsGrid"
            ></div>


            {{-- Empty --}}

            <div
                id="homeEventsEmpty"
                class="text-center py-4 d-none"
            >

                لا توجد فعاليات قادمة حالياً.

            </div>


            {{-- Error --}}

            <div
                id="homeEventsError"
                class="alert alert-danger d-none"
            >


                <span id="homeEventsErrorMessage">
                    تعذر تحميل الفعاليات.
                </span>


            </div>


        </section>


        {{-- =================================================
             BENEFITS
        ================================================== --}}

        <section class="wrap hp-benefits">


            <div class="hp-benefit">


                <span>
                    <i class="bi bi-shield-check"></i>
                </span>


                <div>


                    <h3>
                        آمن وموثوق
                    </h3>


                    <p>
                        جميع الفعاليات مناسبة للأطفال.
                    </p>


                </div>


            </div>


            <div class="hp-benefit">


                <span>
                    <i class="bi bi-bell-fill"></i>
                </span>


                <div>


                    <h3>
                        إشعارات فورية
                    </h3>


                    <p>
                        احصل على تنبيهات لأحدث الفعاليات.
                    </p>


                </div>


            </div>


            <div class="hp-benefit">


                <span>
                    <i class="bi bi-stars"></i>
                </span>


                <div>


                    <h3>
                        فعاليات متنوعة
                    </h3>


                    <p>
                        تعليمية، رياضية، فنية وترفيهية.
                    </p>


                </div>


            </div>


            <div class="hp-benefit">


                <span>
                    <i class="bi bi-people-fill"></i>
                </span>


                <div>


                    <h3>
                        مناسبة للأطفال
                    </h3>


                    <p>
                        اختيار فعاليات حسب العمر المناسب.
                    </p>


                </div>


            </div>


        </section>


    </main>


    {{-- =====================================================
         FOOTER
    ====================================================== --}}

    <footer class="site-footer">


        <div class="wrap site-footer-grid">


            <div class="site-footer-brand">


                <img
                    src="{{ asset('images.1/logo.png') }}"
                    alt="فرحة"
                >


                <p>
                    منصة فرحة تجمع الفعاليات المخصصة للأطفال
                    وأولياء الأمور في مكان واحد، لتجربة ممتعة
                    وآمنة وموثوقة.
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


{{-- =========================================================
     EVENT DETAILS MODAL
     نفس الصفحة - بدون إنشاء صفحة جديدة
========================================================= --}}

<div
    class="modal fade"
    id="homeEventDetailsModal"
    tabindex="-1"
    aria-labelledby="homeEventDetailsModalLabel"
    aria-hidden="true"
>


    <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >


        <div
            class="modal-content border-0 rounded-4 overflow-hidden shadow"
        >


            {{-- Modal Header --}}

            <div class="modal-header border-0 px-4 pt-4 pb-2">


                <h5
                    class="modal-title fw-bold"
                    id="homeEventDetailsModalLabel"
                >

                    تفاصيل الفعالية

                </h5>


                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="إغلاق"
                ></button>


            </div>


            <div class="modal-body p-4">


                {{-- Loading --}}

                <div
                    id="homeEventDetailsLoading"
                    class="text-center py-5"
                >


                    <span
                        class="spinner-border text-primary"
                        role="status"
                    ></span>


                    <p class="mt-3 mb-0 text-muted">

                        جاري تحميل تفاصيل الفعالية...

                    </p>


                </div>


                {{-- Error --}}

                <div
                    id="homeEventDetailsError"
                    class="alert alert-danger d-none"
                >

                    تعذر تحميل تفاصيل الفعالية.

                </div>


                {{-- Content --}}

                <div
                    id="homeEventDetailsContent"
                    class="d-none"
                >


                    {{-- Event Image --}}

                    <div
                        class="position-relative rounded-4 overflow-hidden mb-4"
                        style="height: 300px; background:#f5f2ff;"
                    >


                        <img
                            id="detailsEventImage"
                            src=""
                            alt="صورة الفعالية"
                            class="w-100 h-100"
                            style="object-fit: cover;"
                        >


                        <span
                            id="detailsEventCategory"
                            class="position-absolute top-0 end-0 m-3 badge rounded-pill bg-light text-primary px-3 py-2"
                        >

                            فعالية

                        </span>


                    </div>


                    {{-- Title --}}

                    <div class="mb-4">


                        <h2
                            id="detailsEventTitle"
                            class="fw-bold mb-2"
                        >
                            -
                        </h2>


                        <p
                            id="detailsEventDescription"
                            class="text-muted mb-0"
                            style="line-height: 1.9;"
                        >
                            -
                        </p>


                    </div>


                    {{-- Info Grid --}}

                    <div class="row g-3 mb-4">


                        <div class="col-md-6">


                            <div
                                class="p-3 rounded-4 h-100"
                                style="background:#faf9ff;"
                            >


                                <div class="d-flex align-items-center gap-3">


                                    <div
                                        class="d-flex align-items-center justify-content-center rounded-3"
                                        style="
                                            width:42px;
                                            height:42px;
                                            background:#eee8ff;
                                            color:#7354db;
                                        "
                                    >

                                        <i class="bi bi-calendar3"></i>

                                    </div>


                                    <div>


                                        <small class="text-muted d-block">
                                            التاريخ
                                        </small>


                                        <strong id="detailsEventDate">
                                            -
                                        </strong>


                                    </div>


                                </div>


                            </div>


                        </div>


                        <div class="col-md-6">


                            <div
                                class="p-3 rounded-4 h-100"
                                style="background:#faf9ff;"
                            >


                                <div class="d-flex align-items-center gap-3">


                                    <div
                                        class="d-flex align-items-center justify-content-center rounded-3"
                                        style="
                                            width:42px;
                                            height:42px;
                                            background:#eee8ff;
                                            color:#7354db;
                                        "
                                    >

                                        <i class="bi bi-clock"></i>

                                    </div>


                                    <div>


                                        <small class="text-muted d-block">
                                            الوقت
                                        </small>


                                        <strong id="detailsEventTime">
                                            -
                                        </strong>


                                    </div>


                                </div>


                            </div>


                        </div>


                        <div class="col-md-6">


                            <div
                                class="p-3 rounded-4 h-100"
                                style="background:#faf9ff;"
                            >


                                <div class="d-flex align-items-center gap-3">


                                    <div
                                        class="d-flex align-items-center justify-content-center rounded-3"
                                        style="
                                            width:42px;
                                            height:42px;
                                            background:#eee8ff;
                                            color:#7354db;
                                        "
                                    >

                                        <i class="bi bi-geo-alt"></i>

                                    </div>


                                    <div>


                                        <small class="text-muted d-block">
                                            المكان
                                        </small>


                                        <strong id="detailsEventLocation">
                                            -
                                        </strong>


                                    </div>


                                </div>


                            </div>


                        </div>


                        <div class="col-md-6">


                            <div
                                class="p-3 rounded-4 h-100"
                                style="background:#faf9ff;"
                            >


                                <div class="d-flex align-items-center gap-3">


                                    <div
                                        class="d-flex align-items-center justify-content-center rounded-3"
                                        style="
                                            width:42px;
                                            height:42px;
                                            background:#eee8ff;
                                            color:#7354db;
                                        "
                                    >

                                        <i class="bi bi-people"></i>

                                    </div>


                                    <div>


                                        <small class="text-muted d-block">
                                            الفئة العمرية
                                        </small>


                                        <strong id="detailsEventAgeGroup">
                                            -
                                        </strong>


                                    </div>


                                </div>


                            </div>


                        </div>


                        <div class="col-md-6">


                            <div
                                class="p-3 rounded-4 h-100"
                                style="background:#faf9ff;"
                            >


                                <div class="d-flex align-items-center gap-3">


                                    <div
                                        class="d-flex align-items-center justify-content-center rounded-3"
                                        style="
                                            width:42px;
                                            height:42px;
                                            background:#eaf7f0;
                                            color:#1ea866;
                                        "
                                    >

                                        <i class="bi bi-person-badge"></i>

                                    </div>


                                    <div>


                                        <small class="text-muted d-block">
                                            المنظم
                                        </small>


                                        <strong id="detailsEventOrganizer">
                                            -
                                        </strong>


                                    </div>


                                </div>


                            </div>


                        </div>


                        <div class="col-md-6">


                            <div
                                class="p-3 rounded-4 h-100"
                                style="background:#faf9ff;"
                            >


                                <div class="d-flex align-items-center gap-3">


                                    <div
                                        class="d-flex align-items-center justify-content-center rounded-3"
                                        style="
                                            width:42px;
                                            height:42px;
                                            background:#fff5df;
                                            color:#d8991e;
                                        "
                                    >

                                        <i class="bi bi-people-fill"></i>

                                    </div>


                                    <div>


                                        <small class="text-muted d-block">
                                            المقاعد المتبقية
                                        </small>


                                        <strong id="detailsEventSeats">
                                            -
                                        </strong>


                                    </div>


                                </div>


                            </div>


                        </div>


                    </div>


                    {{-- Requirements --}}

                    <div
                        id="detailsRequirementsBox"
                        class="p-3 rounded-4 d-none"
                        style="background:#faf9ff;"
                    >


                        <strong class="d-block mb-2">

                            <i class="bi bi-list-check text-primary"></i>

                            المتطلبات

                        </strong>


                        <p
                            id="detailsEventRequirements"
                            class="mb-0 text-muted"
                        >
                            -
                        </p>


                    </div>


                </div>


            </div>


            <div class="modal-footer border-0 px-4 pb-4">


                <button
                    type="button"
                    class="btn btn-light px-4"
                    data-bs-dismiss="modal"
                >

                    إغلاق

                </button>


                <a
                    href="{{ url('/events') }}"
                    class="btn btn-primary px-4"
                >

                    استعرض جميع الفعاليات

                </a>


            </div>


        </div>


    </div>


</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>