<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>الفعاليات - فرحة</title>

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
        'resources/css/events.css',
        'resources/js/events.js'
    ])

</head>

<body class="events-page">

<div
    id="eventsPage"
    data-events-api="{{ url('/api/events') }}"
    data-categories-api="{{ url('/api/categories') }}"
    data-event-details-base="{{ url('/events') }}"
>

    <!-- Header -->
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

                <a
                    href="{{ url('/events') }}"
                    class="active"
                >
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


    <!-- Hero -->
    <section class="events-hero">

        <div class="wrap hero-content">

            <div class="hero-text">

                <h1>
                    الفعاليات
                </h1>

                <p>
                    اكتشف واستكشف الفعاليات والأنشطة الترفيهية والتعليمية المناسبة لأطفالك في منطقتك
                </p>


                <div class="site-breadcrumb">

                    <a href="{{ url('/') }}">
                        الرئيسية
                    </a>

                    <span>‹</span>

                    <strong>
                        الفعاليات
                    </strong>

                </div>

            </div>


            <div class="hero-image">

                <img
                    src="{{ asset('images.1/Imag3.png') }}"
                    alt="الفعاليات"
                >

            </div>

        </div>

    </section>


    <!-- Filters -->
    <section class="wrap filter-bar">

        <!-- Search -->
        <div class="filter-input">

            <span>
                <i class="bi bi-search"></i>
            </span>

            <input
                type="text"
                id="eventsSearch"
                placeholder="ابحث عن فعالية"
            >

        </div>


        <!-- Category -->
        <div class="filter-select">

            <span>
                <i class="bi bi-grid-3x3-gap-fill"></i>
            </span>

            <select id="eventsCategoryFilter">

                <option value="">
                    جميع الفئات
                </option>

                <!-- JS -->

            </select>

        </div>


        <!-- Location -->
        <div class="filter-select">

            <span>
                <i class="bi bi-geo-alt-fill"></i>
            </span>

            <select id="eventsLocationFilter">

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

        </div>


        <!-- Age -->
        <div class="filter-select">

            <span>
                <i class="bi bi-people-fill"></i>
            </span>

            <select id="eventsAgeFilter">

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


        <!-- Date -->
        <div class="filter-select">

            <span>
                <i class="bi bi-calendar-event-fill"></i>
            </span>

            <select id="eventsDateFilter">

                <option value="">
                    التاريخ
                </option>

                <option value="today">
                    اليوم
                </option>

                <option value="week">
                    هذا الأسبوع
                </option>

                <option value="month">
                    هذا الشهر
                </option>

            </select>

        </div>


        <button
            type="button"
            class="filter-button"
            id="applyEventsFilters"
        >
            تصفية
            <i class="bi bi-sliders"></i>
        </button>

    </section>


    <!-- Page Content -->
    <main class="wrap events-layout">

        <!-- Sidebar -->
        <aside class="events-sidebar">

            <div class="sidebar-title">

                <h3>
                    الفئات
                </h3>

                <span>
                    <i class="bi bi-grid-3x3-gap-fill"></i>
                </span>

            </div>


            <ul
                class="category-list"
                id="eventsCategoryList"
            >

                <li>
                    <a
                        href="#"
                        data-category=""
                        class="active"
                    >
                        <span>
                            جميع الفعاليات
                        </span>

                        <b id="allEventsCount">
                            0
                        </b>
                    </a>
                </li>

                <!-- JS -->

            </ul>


            <div class="quick-filter">

                <h3>
                    فلترة سريعة
                </h3>


                <label>

                    <input
                        type="checkbox"
                        id="openRegistrationFilter"
                    >

                    تقبل التسجيل الآن

                </label>


                <label>

                    <input
                        type="checkbox"
                        id="availableSeatsFilter"
                    >

                    أماكن متوفرة

                </label>


                <a
                    href="#"
                    class="reset-filter"
                    id="resetEventsFilters"
                >
                    إعادة تعيين الفلاتر

                    <i class="bi bi-arrow-clockwise"></i>
                </a>

            </div>

        </aside>


        <!-- Events Area -->
        <section class="events-area">

            <div class="events-toolbar">

                <div class="view-switch">

                    <a
                        href="#"
                        class="active"
                        id="gridViewButton"
                    >
                        <i class="bi bi-grid-fill"></i>
                    </a>

                    <a
                        href="#"
                        id="listViewButton"
                    >
                        <i class="bi bi-list-ul"></i>
                    </a>

                </div>


                <p id="eventsResultCount">
                    عرض 0 من 0 فعالية
                </p>


                <div class="sort-box">

                    <span>
                        ترتيب حسب
                    </span>

                    <select id="eventsSort">

                        <option value="nearest">
                            الأقرب
                        </option>

                        <option value="latest">
                            الأحدث
                        </option>

                        <option value="title">
                            الاسم
                        </option>

                    </select>

                </div>

            </div>


            <!-- Loading -->
            <div
                id="eventsLoading"
                class="text-center py-5"
            >
                <span class="spinner-border spinner-border-sm"></span>

                جاري تحميل الفعاليات...
            </div>


            <!-- Error -->
            <div
                id="eventsError"
                class="alert alert-danger d-none"
            >
                <span id="eventsErrorMessage">
                    تعذر تحميل الفعاليات.
                </span>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    id="retryEventsButton"
                >
                    إعادة المحاولة
                </button>
            </div>


            <!-- Cards -->
            <div
                class="cards-grid"
                id="eventsGrid"
            >
                <!-- JavaScript -->
            </div>


            <!-- Empty -->
            <div
                id="eventsEmpty"
                class="text-center py-5 d-none"
            >
                <i class="bi bi-calendar-x fs-2"></i>

                <p class="mt-2">
                    لا توجد فعاليات مطابقة للفلاتر المحددة.
                </p>
            </div>


            <!-- Pagination -->
            <div
                class="pagination"
                id="eventsPagination"
            >
            </div>

        </section>

    </main>


    <!-- Footer -->
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