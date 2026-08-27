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
        إدارة المستخدمين - فرحة
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
        'resources/css/users.css',
        'resources/js/users.js'
    ])

</head>


<body>


<div
    class="app"
    id="adminUsersPage"

    data-users-url="{{ url('/api/admin/users') }}"

    data-toggle-status-base-url="{{ url('/api/admin/users') }}"

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
                class="menu-link active"
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
                class="menu-link"
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
         MAIN CONTENT
    ====================================================== --}}

    <main class="content users-content">


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


            {{-- Breadcrumb --}}

            <div
                class="breadcrumb admin-breadcrumb"
            >


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
                    href="{{ url('/admin/users') }}"
                    class="active"
                >

                    المستخدمين

                </a>


            </div>


        </header>


        {{-- =================================================
             PAGE HEADER
        ================================================== --}}

        <section class="users-head">


            <div class="users-title-wrap">


                <div class="title-icon">

                    <i class="bi bi-people-fill"></i>

                </div>


                <div>


                    <h1>
                        إدارة المستخدمين
                    </h1>


                    <p>
                        عرض وإدارة جميع المستخدمين في المنصة
                    </p>


                </div>


            </div>


        </section>


        {{-- =================================================
             STATISTICS
        ================================================== --}}

        <section class="users-stats">


            {{-- Total --}}

            <article class="users-stat-card">


                <div
                    class="
                        users-stat-icon
                        total
                    "
                >

                    <i class="bi bi-people-fill"></i>

                </div>


                <div>


                    <p>
                        إجمالي المستخدمين
                    </p>


                    <h2 id="totalUsersCount">
                        0
                    </h2>


                    <small>
                        جميع الحسابات
                    </small>


                </div>


            </article>


            {{-- Parents --}}

            <article class="users-stat-card">


                <div
                    class="
                        users-stat-icon
                        parents
                    "
                >

                    <i class="bi bi-person-heart"></i>

                </div>


                <div>


                    <p>
                        أولياء الأمور
                    </p>


                    <h2 id="parentsCount">
                        0
                    </h2>


                    <small>
                        حساب ولي أمر
                    </small>


                </div>


            </article>


            {{-- Organizers --}}

            <article class="users-stat-card">


                <div
                    class="
                        users-stat-icon
                        organizers
                    "
                >

                    <i class="bi bi-calendar2-event-fill"></i>

                </div>


                <div>


                    <p>
                        المنظمون
                    </p>


                    <h2 id="organizersCount">
                        0
                    </h2>


                    <small>
                        حساب منظم
                    </small>


                </div>


            </article>


            {{-- Admins --}}

            <article class="users-stat-card">


                <div
                    class="
                        users-stat-icon
                        admins
                    "
                >

                    <i class="bi bi-shield-lock-fill"></i>

                </div>


                <div>


                    <p>
                        مدراء النظام
                    </p>


                    <h2 id="adminsCount">
                        0
                    </h2>


                    <small>
                        حساب إداري
                    </small>


                </div>


            </article>


        </section>


        {{-- =================================================
             FILTERS
        ================================================== --}}

        <section class="users-filter-box">


            <div class="users-search">


                <i class="bi bi-search"></i>


                <input
                    type="text"
                    id="userSearch"
                    placeholder="ابحث عن اسم أو بريد إلكتروني أو رقم جوال..."
                    autocomplete="off"
                >


            </div>


            <select id="statusFilter">


                <option value="all">
                    كل الحالات
                </option>


                <option value="active">
                    نشط
                </option>


                <option value="inactive">
                    غير مفعل
                </option>


            </select>


            <select id="roleFilter">


                <option value="all">
                    كل الأدوار
                </option>


                <option value="parent">
                    ولي أمر
                </option>


                <option value="organizer">
                    منظم
                </option>


                <option value="admin">
                    مدير
                </option>


            </select>


            <button
                type="button"
                class="filter-icon-btn"
                id="resetFiltersButton"
                title="إعادة ضبط الفلاتر"
            >

                <i class="bi bi-arrow-counterclockwise"></i>

            </button>


        </section>


        {{-- =================================================
             LOADING
        ================================================== --}}

        <section
            class="users-loading"
            id="usersLoading"
        >


            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>


            <span>
                جاري تحميل المستخدمين...
            </span>


        </section>


        {{-- =================================================
             USERS TABLE
        ================================================== --}}

        <section class="users-table">


            <div class="users-table-head">


                <span>
                    المستخدم
                </span>


                <span>
                    الدور
                </span>


                <span>
                    البريد الإلكتروني
                </span>


                <span>
                    رقم الجوال
                </span>


                <span>
                    الحالة
                </span>


                <span>
                    تاريخ التسجيل
                </span>


                <span>
                    الإجراءات
                </span>


            </div>


            <div id="usersContainer"></div>


        </section>


        {{-- =================================================
             EMPTY STATE
        ================================================== --}}

        <section
            class="users-empty-state d-none"
            id="usersEmptyState"
        >


            <i class="bi bi-people"></i>


            <strong>
                لا يوجد مستخدمون
            </strong>


            <p>
                لا توجد نتائج مطابقة للبحث أو الفلاتر المستخدمة.
            </p>


        </section>


        {{-- =================================================
             ERROR STATE
        ================================================== --}}

        <section
            class="users-error-state d-none"
            id="usersErrorState"
        >


            <i class="bi bi-exclamation-circle"></i>


            <h3>
                تعذر تحميل المستخدمين
            </h3>


            <p id="usersErrorMessage">

                حدث خطأ أثناء تحميل بيانات المستخدمين.

            </p>


            <button
                type="button"
                id="retryUsersButton"
            >

                إعادة المحاولة

            </button>


        </section>


        {{-- =================================================
             PAGINATION
        ================================================== --}}

        <section
            class="users-pagination d-none"
            id="usersPagination"
        >


            <div class="show-count">


                عرض


                <select id="usersPerPage">

                    <option value="10">
                        10
                    </option>

                    <option value="25">
                        25
                    </option>

                    <option value="50">
                        50
                    </option>

                </select>


            </div>


            <p id="paginationInfo">

                0 - 0 من 0 مستخدم

            </p>


            <div class="pagination">


                <button
                    type="button"
                    id="previousUsersPage"
                    disabled
                >

                    <i class="bi bi-chevron-right"></i>

                </button>


                <div
                    id="usersPaginationPages"
                    class="pagination-pages"
                ></div>


                <button
                    type="button"
                    id="nextUsersPage"
                    disabled
                >

                    <i class="bi bi-chevron-left"></i>

                </button>


            </div>


        </section>


    </main>


</div>


{{-- =========================================================
     TOGGLE STATUS MODAL
========================================================= --}}

<div
    class="modal fade"
    id="toggleUserStatusModal"
    tabindex="-1"
    aria-hidden="true"
>


    <div
        class="modal-dialog modal-dialog-centered"
    >


        <div class="modal-content">


            <div class="modal-header">


                <h5 class="modal-title">

                    تغيير حالة المستخدم

                </h5>


                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                ></button>


            </div>


            <div class="modal-body">


                <p id="toggleStatusMessage">

                    هل أنت متأكد من تغيير حالة هذا المستخدم؟

                </p>


                <strong id="toggleUserName">

                    المستخدم

                </strong>


            </div>


            <div class="modal-footer">


                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >

                    إلغاء

                </button>


                <button
                    type="button"
                    class="btn btn-primary"
                    id="confirmToggleStatusButton"
                >


                    <span class="toggle-status-text">

                        تأكيد

                    </span>


                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="toggleStatusSpinner"
                    ></span>


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