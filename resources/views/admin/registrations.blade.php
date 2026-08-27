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


    <title>
        إدارة التسجيلات - فرحة
    </title>


    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css"
        rel="stylesheet"
    >


    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        rel="stylesheet"
    >


    @vite([
        'resources/css/dashboard-common.css',
        'resources/css/registrations.css',
        'resources/js/registrations.js'
    ])

</head>


<body>


<div
    class="app"
    id="adminRegistrationsPage"

    data-registrations-url="{{ url('/api/registrations') }}"

    data-me-url="{{ url('/api/me') }}"

    data-home-url="{{ url('/home') }}"

    data-dashboard-page-url="{{ url('/admin/dashboard') }}"

    data-events-page-url="{{ url('/admin/events') }}"

    data-users-page-url="{{ url('/admin/users') }}"

    data-categories-page-url="{{ url('/admin/categories') }}"

    data-registrations-page-url="{{ url('/admin/registrations') }}"

    data-login-url="{{ url('/login') }}"

    data-logout-url="{{ url('/api/logout') }}"
>


    {{-- =====================================================
         SIDEBAR
    ====================================================== --}}

    <aside class="sidebar admin-sidebar">


        <div class="admin-profile">

            <div class="admin-avatar-circle">
                م
            </div>

            <h3>
                مدير النظام
            </h3>

            <p>
                مدير النظام
            </p>

        </div>

        <nav class="menu">


            <a
                href="{{ url('/admin/dashboard') }}"
                class="menu-link"
            >

                <i class="bi bi-grid-1x2-fill"></i>

                لوحة التحكم

            </a>


            <a
                href="{{ url('/admin/events') }}"
                class="menu-link"
            >

                <i class="bi bi-calendar-event"></i>

                الفعاليات

            </a>


            <a
                href="{{ url('/admin/users') }}"
                class="menu-link"
            >

                <i class="bi bi-people-fill"></i>

                المستخدمين

            </a>


            <a
                href="{{ url('/admin/categories') }}"
                class="menu-link"
            >

                <i class="bi bi-tags-fill"></i>

                التصنيفات

            </a>


            <a
                href="{{ url('/admin/registrations') }}"
                class="menu-link active"
            >

                <i class="bi bi-journal-check"></i>

                التسجيلات

            </a>


        </nav>


        <button
            type="button"
            class="logout"
            id="logoutButton"
        >

            <i class="bi bi-box-arrow-right"></i>

            تسجيل خروج

        </button>


    </aside>


    <div class="sidebar-overlay"></div>


    {{-- =====================================================
         CONTENT
    ====================================================== --}}

    <main class="content registrations-content">


        <button
            type="button"
            class="menu-toggle d-lg-none"
            aria-label="فتح القائمة"
        >

            <i class="bi bi-list"></i>

        </button>


        {{-- =================================================
             TOPBAR
        ================================================== --}}

        <header class="topbar">


            <div class="user-area">

                <strong class="simple-welcome admin-simple-welcome">
                    مرحبا
                    <span id="adminName">
                        مدير النظام
                    </span>
                </strong>

<a
                    href="{{ url('/admin/messages') }}"
                    class="top-icon"
                    aria-label="الرسائل"
                >

                    <i class="bi bi-envelope"></i>

                </a>


            </div>


            <div class="breadcrumb admin-breadcrumb">


                <a href="{{ url('/home') }}">

                    الرئيسية

                </a>


                <span>
                    ›
                </span>


                <a href="{{ url('/admin/dashboard') }}">

                    لوحة التحكم

                </a>


                <span>
                    ›
                </span>


                <a
                    href="{{ url('/admin/registrations') }}"
                    class="active"
                >

                    التسجيلات

                </a>


            </div>


        </header>


        {{-- =================================================
             PAGE HEADER
        ================================================== --}}

        <section class="registrations-head">


            <div class="registrations-title-wrap">


                <div class="title-icon">

                    <i class="bi bi-journal-check"></i>

                </div>


                <div>


                    <h1>
                        إدارة التسجيلات
                    </h1>


                    <p>
                        عرض ومتابعة جميع تسجيلات الفعاليات في المنصة
                    </p>


                </div>


            </div>


        </section>


        {{-- =================================================
             STATISTICS
        ================================================== --}}

        <section class="registrations-stats">


            <article class="registration-stat-card">


                <div class="registration-stat-icon total">

                    <i class="bi bi-journal-text"></i>

                </div>


                <div>

                    <p>
                        إجمالي التسجيلات
                    </p>

                    <h2 id="totalRegistrationsCount">
                        0
                    </h2>

                    <small>
                        جميع الطلبات
                    </small>

                </div>


            </article>


            <article class="registration-stat-card">


                <div class="registration-stat-icon confirmed">

                    <i class="bi bi-check-circle-fill"></i>

                </div>


                <div>

                    <p>
                        التسجيلات المؤكدة
                    </p>

                    <h2 id="confirmedRegistrationsCount">
                        0
                    </h2>

                    <small>
                        طلبات تم قبولها
                    </small>

                </div>


            </article>


            <article class="registration-stat-card">


                <div class="registration-stat-icon pending">

                    <i class="bi bi-hourglass-split"></i>

                </div>


                <div>

                    <p>
                        قيد الانتظار
                    </p>

                    <h2 id="pendingRegistrationsCount">
                        0
                    </h2>

                    <small>
                        تحتاج للمراجعة
                    </small>

                </div>


            </article>


            <article class="registration-stat-card">


                <div class="registration-stat-icon cancelled">

                    <i class="bi bi-x-circle-fill"></i>

                </div>


                <div>

                    <p>
                        الملغاة / المرفوضة
                    </p>

                    <h2 id="cancelledRegistrationsCount">
                        0
                    </h2>

                    <small>
                        غير نشطة
                    </small>

                </div>


            </article>


        </section>


        {{-- =================================================
             FILTERS
        ================================================== --}}

        <section class="registrations-filter-box">


            <div class="registrations-search">


                <i class="bi bi-search"></i>


                <input
                    type="text"
                    id="registrationSearch"
                    placeholder="ابحث باسم الطفل أو ولي الأمر أو الفعالية..."
                    autocomplete="off"
                >


            </div>


            <select id="statusFilter">


                <option value="all">
                    كل الحالات
                </option>


                <option value="confirmed">
                    مؤكد
                </option>


                <option value="pending">
                    قيد الانتظار
                </option>


                <option value="cancelled">
                    ملغى / مرفوض
                </option>


            </select>


            <button
                type="button"
                class="reset-registration-filter"
                id="resetRegistrationFilters"
                title="إعادة ضبط الفلاتر"
            >

                <i class="bi bi-arrow-counterclockwise"></i>

            </button>


        </section>


        {{-- =================================================
             LOADING
        ================================================== --}}

        <section
            class="registrations-loading"
            id="registrationsLoading"
        >


            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>


            <span>
                جاري تحميل التسجيلات...
            </span>


        </section>


        {{-- =================================================
             TABLE
        ================================================== --}}

        <section class="registrations-table">


            <div class="registrations-table-head">


                <span>#</span>

                <span>
                    اسم الطفل
                </span>

                <span>
                    ولي الأمر
                </span>

                <span>
                    الفعالية
                </span>

                <span>
                    تاريخ التسجيل
                </span>

                <span>
                    الحالة
                </span>

                <span>
                    الإجراءات
                </span>


            </div>


            <div id="registrationsContainer"></div>


        </section>


        {{-- =================================================
             EMPTY
        ================================================== --}}

        <section
            id="registrationsEmptyState"
            class="registrations-empty-state d-none"
        >


            <div class="registrations-empty-icon">

                <i class="bi bi-journal-x"></i>

            </div>


            <strong>
                لا توجد تسجيلات
            </strong>


            <p>
                لا توجد تسجيلات مطابقة للبحث أو الفلاتر الحالية.
            </p>


        </section>


        {{-- =================================================
             ERROR
        ================================================== --}}

        <section
            id="registrationsErrorState"
            class="registrations-error-state d-none"
        >


            <i class="bi bi-exclamation-circle"></i>


            <strong>
                تعذر تحميل التسجيلات
            </strong>


            <p id="registrationsErrorMessage">

                حدث خطأ أثناء تحميل التسجيلات.

            </p>


            <button
                type="button"
                id="retryRegistrationsButton"
            >

                إعادة المحاولة

            </button>


        </section>


        {{-- =================================================
             PAGINATION
        ================================================== --}}

        <section
            class="events-pagination d-none"
            id="registrationsPagination"
        >


            <button
                type="button"
                id="previousRegistrationPage"
                disabled
            >

                <i class="bi bi-chevron-right"></i>

                السابق

            </button>


            <div
                id="registrationPaginationPages"
                class="pagination-pages"
            ></div>


            <button
                type="button"
                id="nextRegistrationPage"
                disabled
            >

                التالي

                <i class="bi bi-chevron-left"></i>

            </button>


        </section>


    </main>


</div>


{{-- =========================================================
     REGISTRATION DETAILS MODAL
========================================================= --}}

<div
    class="modal fade"
    id="registrationModal"
    tabindex="-1"
    aria-hidden="true"
>


    <div class="modal-dialog modal-dialog-centered">


        <div class="modal-content registration-modal-content">


            <div class="modal-header">


                <div class="registration-modal-title-wrap">


                    <div class="registration-modal-icon">

                        <i class="bi bi-journal-check"></i>

                    </div>


                    <h5 class="modal-title">

                        تفاصيل التسجيل

                    </h5>


                </div>


                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="إغلاق"
                ></button>


            </div>


            <div class="modal-body">


                <div class="reg-detail-row">

                    <span>
                        اسم الطفل
                    </span>

                    <strong id="modalChildName">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        عمر الطفل
                    </span>

                    <strong id="modalChildAge">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        ولي الأمر
                    </span>

                    <strong id="modalParentName">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        البريد الإلكتروني
                    </span>

                    <strong id="modalParentEmail">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        رقم الجوال
                    </span>

                    <strong id="modalParentPhone">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        الفعالية
                    </span>

                    <strong id="modalEventTitle">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        تاريخ الفعالية
                    </span>

                    <strong id="modalEventDate">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        تاريخ التسجيل
                    </span>

                    <strong id="modalRegistrationDate">
                        -
                    </strong>

                </div>


                <div class="reg-detail-row">

                    <span>
                        الحالة
                    </span>

                    <strong
                        id="modalRegistrationStatus"
                        class="reg-status"
                    >
                        -
                    </strong>

                </div>


            </div>


            <div class="modal-footer">


                <button
                    type="button"
                    class="btn-cancel"
                    data-bs-dismiss="modal"
                >

                    إغلاق

                </button>


            </div>


        </div>


    </div>


</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>