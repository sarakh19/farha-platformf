<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    <title>تفاصيل الفعالية - فرحة</title>


    {{-- Bootstrap RTL --}}
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css"
        rel="stylesheet"
    >


    {{-- Bootstrap Icons --}}
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    >


    {{-- Project files --}}
    @vite([
        'resources/css/site-common.css',
        'resources/css/event-deteal.css',
        'resources/js/event-detail.js'
    ])

</head>


<body class="event-detail-fixed">


<div
    id="eventDetailPage"

    data-event-id="{{ $eventId ?? '' }}"

    data-event-api-base="{{ url('/api/events') }}"

    data-register-url="{{ url('/api/registrations') }}"

    data-children-url="{{ url('/api/children') }}"

    data-profile-url="{{ url('/api/profile') }}"

    data-login-url="{{ url('/login') }}"

    data-events-url="{{ url('/events') }}"

    data-profile-page-url="{{ url('/parent/profile') }}"

    data-my-events-url="{{ url('/parent/my-events') }}"

    data-notifications-url="{{ url('/parent/notifications') }}"
>


    {{-- =====================================================
         HEADER
    ====================================================== --}}

    <header class="site-header">

        <div class="wrap site-header-row">


            {{-- Logo --}}
            <a
                href="{{ url('/home') }}"
                class="site-logo"
            >

                <img
                    src="{{ asset('images.1/logo2.png') }}"
                    alt="فرحة"
                >

            </a>



            {{-- Mobile menu --}}
            <button
                type="button"
                class="menu-toggle"
                aria-label="فتح القائمة"
            >

                <i class="bi bi-list"></i>

            </button>



            {{-- Navigation --}}
            <nav class="site-nav">

                <a href="{{ url('/home') }}">
                    الرئيسية
                </a>

                <a
                    href="{{ url('/events') }}"
                    class="active"
                >
                    الفعاليات
                </a>

                <a href="{{ url('/organizers') }}">
                    المنظمون
                </a>

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>

            </nav>



            {{-- Header actions --}}
            <div class="site-actions event-detail-actions">


                {{-- Explore events --}}
                <a
                    href="{{ url('/events') }}"
                    class="explore-events-btn"
                >

                    <i class="bi bi-grid"></i>

                    <span>
                        استكشف الفعاليات
                    </span>

                </a>



                {{-- Notifications --}}
                <a
                    href="{{ url('/parent/notifications') }}"
                    class="icon-btn event-header-icon d-none"
                    id="eventNotificationButton"
                    aria-label="الإشعارات"
                    title="الإشعارات"
                >

                    <i class="bi bi-bell"></i>

                </a>



                {{-- Auth area --}}
                <div
                    class="event-auth-area"
                    id="eventAuthArea"
                >

                    <a
                        href="{{ url('/login') }}"
                        class="icon-btn event-header-icon"
                        aria-label="تسجيل الدخول"
                        title="تسجيل الدخول"
                    >

                        <i class="bi bi-person"></i>

                    </a>

                </div>


            </div>


        </div>

    </header>



    {{-- =====================================================
         MAIN
    ====================================================== --}}

    <main class="evd-main">

        <div class="wrap">


            {{-- =================================================
                 BREADCRUMB
            ================================================== --}}

            <div class="evd-breadcrumb">

                <a href="{{ url('/home') }}">
                    الرئيسية
                </a>

                <span>
                    ‹
                </span>

                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>

                <span>
                    ‹
                </span>

                <strong id="breadcrumbEventTitle">
                    تفاصيل الفعالية
                </strong>

            </div>



            {{-- =================================================
                 LOADING
            ================================================== --}}

            <div
                id="eventDetailLoading"
                class="text-center py-5"
            >

                <div
                    class="spinner-border text-primary"
                    role="status"
                >

                    <span class="visually-hidden">
                        جاري التحميل...
                    </span>

                </div>


                <p class="mt-3 mb-0">
                    جاري تحميل تفاصيل الفعالية...
                </p>

            </div>



            {{-- =================================================
                 ERROR
            ================================================== --}}

            <div
                id="eventDetailError"
                class="alert alert-danger d-none"
            >

                <i class="bi bi-exclamation-circle ms-2"></i>


                <span id="eventDetailErrorMessage">
                    تعذر تحميل تفاصيل الفعالية.
                </span>


                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger me-2"
                    id="retryEventDetailButton"
                >
                    إعادة المحاولة
                </button>

            </div>



            {{-- =================================================
                 EVENT CONTENT
            ================================================== --}}

            <div
                id="eventDetailContent"
                class="d-none"
            >


                {{-- =============================================
                     TOP SECTION
                ============================================== --}}

                <section class="evd-top-grid">


                    {{-- =========================================
                         GALLERY
                    ========================================== --}}

                    <div class="evd-gallery">


                        {{-- Main Image --}}
                        <div class="evd-big-image">

                            <img
                                id="eventMainImg"
                                src="{{ asset('images.1/Imag1.png') }}"
                                alt="صورة الفعالية"
                            >

                        </div>



                        {{-- Thumbnails --}}
                        <div
                            class="evd-small-images"
                            id="evdThumbs"
                        >
                        </div>


                    </div>



                    {{-- =========================================
                         DETAILS CARD
                    ========================================== --}}

                    <aside class="evd-card">


                        {{-- Status --}}
                        <span
                            class="evd-status"
                            id="evdStatus"
                        >
                            ...
                        </span>



                        {{-- Event title --}}
                        <h1 id="evdTitle">
                            ...
                        </h1>



                        {{-- Description --}}
                        <p
                            class="evd-description"
                            id="evdDescription"
                        >
                        </p>



                        {{-- Event information --}}
                        <div class="evd-info-list">


                            {{-- Date --}}
                            <div class="evd-info-item">

                                <span class="evd-info-icon">

                                    <i class="bi bi-calendar-event"></i>

                                </span>


                                <div>

                                    <small>
                                        التاريخ
                                    </small>

                                    <strong id="evdDate">
                                        -
                                    </strong>

                                </div>

                            </div>



                            {{-- Time --}}
                            <div class="evd-info-item">

                                <span class="evd-info-icon">

                                    <i class="bi bi-clock"></i>

                                </span>


                                <div>

                                    <small>
                                        الوقت
                                    </small>

                                    <strong id="evdTime">
                                        -
                                    </strong>

                                </div>

                            </div>



                            {{-- Location --}}
                            <div class="evd-info-item">

                                <span class="evd-info-icon">

                                    <i class="bi bi-geo-alt-fill"></i>

                                </span>


                                <div>

                                    <small>
                                        الموقع
                                    </small>

                                    <strong id="evdLocation">
                                        -
                                    </strong>

                                </div>

                            </div>



                            {{-- Age --}}
                            <div class="evd-info-item">

                                <span class="evd-info-icon">

                                    <i class="bi bi-people-fill"></i>

                                </span>


                                <div>

                                    <small>
                                        الفئة العمرية
                                    </small>

                                    <strong id="evdAge">
                                        -
                                    </strong>

                                </div>

                            </div>



                            {{-- Seats --}}
                            <div class="evd-info-item">

                                <span class="evd-info-icon">

                                    <i class="bi bi-ticket-perforated"></i>

                                </span>


                                <div>

                                    <small>
                                        المقاعد المتاحة
                                    </small>

                                    <strong id="evdSeats">
                                        -
                                    </strong>

                                </div>

                            </div>


                        </div>



                        {{-- Register --}}
                        <button
                            type="button"
                            class="evd-register-btn"
                            id="evdRegisterBtn"
                        >
                            سجل الآن
                        </button>



                        {{-- Share --}}
                        <div class="evd-share">

                            <span>
                                مشاركة
                            </span>


                            <a
                                href="#"
                                id="shareWhatsApp"
                                target="_blank"
                                rel="noopener"
                                aria-label="واتساب"
                            >

                                <i class="bi bi-whatsapp"></i>

                            </a>


                            <a
                                href="#"
                                id="shareX"
                                target="_blank"
                                rel="noopener"
                                aria-label="X"
                            >

                                <i class="bi bi-twitter-x"></i>

                            </a>


                            <a
                                href="#"
                                id="shareFacebook"
                                target="_blank"
                                rel="noopener"
                                aria-label="فيسبوك"
                            >

                                <i class="bi bi-facebook"></i>

                            </a>


                            <button
                                type="button"
                                class="evd-copy-link"
                                data-copy-link
                                aria-label="نسخ الرابط"
                            >

                                <i class="bi bi-link-45deg"></i>

                            </button>

                        </div>


                    </aside>


                </section>



                {{-- =============================================
                     ABOUT
                ============================================== --}}

                <section class="evd-section">


                    <h2>

                        <span>
                            <i class="bi bi-question-circle"></i>
                        </span>

                        عن الفعالية

                    </h2>


                    <p id="evdAbout">
                    </p>


                </section>



                {{-- =============================================
                     TERMS + FEATURES
                ============================================== --}}

                <section class="evd-two-cards">


                    {{-- Terms --}}
                    <article class="evd-mini-card">


                        <h2>

                            <span>
                                <i class="bi bi-check-circle"></i>
                            </span>

                            الشروط والأحكام

                        </h2>


                        <ul id="evdTerms">

                            <li>
                                لا توجد شروط مضافة لهذه الفعالية.
                            </li>

                        </ul>


                    </article>



                    {{-- Features --}}
                    <article class="evd-mini-card">


                        <h2>

                            <span>
                                <i class="bi bi-star"></i>
                            </span>

                            مميزات الفعالية

                        </h2>


                        <ul
                            class="evd-checks"
                            id="evdFeatures"
                        >

                            <li>
                                لا توجد مميزات مضافة لهذه الفعالية.
                            </li>

                        </ul>


                    </article>


                </section>



                {{-- =============================================
                     ORGANIZER
                ============================================== --}}

                <section class="evd-organizer-wrap">


                    <h2 class="evd-organizer-title">
                        المنظم
                    </h2>



                    <div class="evd-organizer-card">


                        {{-- Organizer --}}
                        <div class="evd-org-main">


                            <div
                                class="evd-org-logo"
                                id="evdOrgLogo"
                            >

                                <i class="bi bi-building"></i>

                            </div>



                            <div>

                                <h3 id="evdOrgName">
                                    -
                                </h3>


                                <p id="evdOrgDesc">
                                </p>

                            </div>


                        </div>



                        {{-- Stats --}}
                        <div class="evd-org-stats">


                            <div>

                                <strong id="evdOrgFollowers">
                                    -
                                </strong>

                                <span>
                                    متابع
                                </span>

                            </div>



                            <div>

                                <strong id="evdOrgEventsCount">
                                    -
                                </strong>

                                <span>
                                    فعالية
                                </span>

                            </div>


                        </div>


                        {{-- لا يوجد:
                             تواصل مع المنظم
                             عرض جميع الفعاليات
                        --}}


                    </div>


                </section>


            </div>
            {{-- End eventDetailContent --}}


        </div>

    </main>



    {{-- =====================================================
         CHILD SELECTION MODAL
    ====================================================== --}}

    <div
        class="modal fade"
        id="registrationChildModal"
        tabindex="-1"
        aria-hidden="true"
    >

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">


                {{-- Modal Header --}}
                <div class="modal-header">


                    <h5 class="modal-title">
                        تسجيل طفل في الفعالية
                    </h5>


                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="إغلاق"
                    ></button>


                </div>



                {{-- Modal Body --}}
                <div class="modal-body">


                    {{-- Loading --}}
                    <div
                        id="childrenModalLoading"
                        class="text-center py-3 d-none"
                    >

                        <span
                            class="spinner-border spinner-border-sm"
                        ></span>


                        <span class="me-2">
                            جاري تحميل الأطفال...
                        </span>


                    </div>



                    {{-- Empty --}}
                    <div
                        id="childrenModalEmpty"
                        class="text-center py-4 d-none"
                    >

                        <i
                            class="bi bi-people"
                            style="font-size:32px;"
                        ></i>


                        <p class="mt-2 mb-3">
                            لا يوجد أطفال مسجلون في حسابك.
                        </p>


                        <a
                            href="{{ url('/parent/profile') }}#children"
                            class="btn btn-primary btn-sm"
                        >
                            إضافة طفل
                        </a>


                    </div>



                    {{-- Children --}}
                    <div
                        id="childrenSelectionList"
                        class="d-flex flex-column gap-2"
                    >
                    </div>


                </div>


            </div>

        </div>

    </div>


</div>
{{-- End eventDetailPage --}}



{{-- =====================================================
     FOOTER
====================================================== --}}

<footer class="site-footer">

    <div class="wrap site-footer-grid">


        {{-- Brand --}}
        <div class="site-footer-brand">


            <img
                src="{{ asset('images.1/logo.png') }}"
                alt="فرحة"
            >


            <p>
                منصة فرحة تجمع الفعاليات المخصصة للأطفال
                وأولياء الأمور في مكان واحد، لتجربة ممتعة
                وآمنة ومفيدة.
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



        {{-- Quick links --}}
        <div class="site-footer-col">


            <h4>
                روابط سريعة
            </h4>


            <a href="{{ url('/home') }}">
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



        {{-- Categories --}}
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

        {{-- Information --}}
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



{{-- Bootstrap --}}
<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>