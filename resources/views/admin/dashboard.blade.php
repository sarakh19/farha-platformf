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
        لوحة التحكم - فرحة
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
        'resources/css/admin-dashboard.css',
        'resources/js/admin-dashboard.js',
    ])

</head>


<body>


<div
    class="app"
    id="adminDashboardPage"

    data-dashboard-url="{{ url('/api/admin/dashboard') }}"

    data-pending-events-url="{{ url('/api/admin/pending-events') }}"

    data-users-api-url="{{ url('/api/admin/users') }}"

    data-registrations-api-url="{{ url('/api/registrations') }}"

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
         Sidebar
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
                class="menu-link active"
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

                المستخدمون

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
         Main Content
    ====================================================== --}}

    <main class="content admin-content">


        <button
            type="button"
            class="menu-toggle d-lg-none"
            aria-label="فتح القائمة"
        >

            <i class="bi bi-list"></i>

        </button>


        {{-- =================================================
             Topbar
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


            <div class="breadcrumb">


                <a href="{{ url('/home') }}">

                    الرئيسية

                </a>


                <span>
                    ›
                </span>


                <a
                    href="{{ url('/admin/dashboard') }}"
                    class="active"
                >

                    لوحة التحكم

                </a>


            </div>


        </header>


        {{-- =================================================
             Loading
        ================================================== --}}

        <section
            class="admin-dashboard-loading"
            id="adminDashboardLoading"
        >

            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>


            <span>
                جاري تحميل بيانات لوحة التحكم...
            </span>

        </section>


        {{-- =================================================
             Dashboard Content
        ================================================== --}}

        <div
            id="adminDashboardContent"
            class="d-none"
        >


            {{-- Date --}}

            <section class="admin-date-row">


                <button
                    type="button"
                    class="date-filter"
                    id="dashboardDateButton"
                >

                    <span id="dashboardDate">
                        تاريخ اليوم
                    </span>


                    <i class="bi bi-calendar3"></i>


                </button>


            </section>


            {{-- =================================================
                 Statistics
            ================================================== --}}

            <section class="admin-stats">


                {{-- Users --}}

                <article class="admin-stat-card">


                    <div
                        class="
                            admin-stat-icon-img
                            stat-users
                        "
                    >

                        <i class="bi bi-people-fill"></i>

                    </div>


                    <div>

                        <p>
                            إجمالي المستخدمين
                        </p>


                        <h2 id="totalUsers">
                            0
                        </h2>


                        <small class="up">

                            <i class="bi bi-people"></i>

                            جميع المستخدمين المسجلين

                        </small>

                    </div>


                </article>


                {{-- Events --}}

                <article class="admin-stat-card">


                    <div
                        class="
                            admin-stat-icon-img
                            stat-events
                        "
                    >

                        <i class="bi bi-calendar-event-fill"></i>

                    </div>


                    <div>

                        <p>
                            إجمالي الفعاليات
                        </p>


                        <h2 id="totalEvents">
                            0
                        </h2>


                        <small class="up">

                            <i class="bi bi-calendar-check"></i>

                            جميع الفعاليات

                        </small>

                    </div>


                </article>


                {{-- Pending --}}

                <article class="admin-stat-card">


                    <div
                        class="
                            admin-stat-icon-img
                            stat-pending
                        "
                    >

                        <i class="bi bi-hourglass-split"></i>

                    </div>


                    <div>

                        <p>
                            الفعاليات قيد المراجعة
                        </p>


                        <h2 id="pendingEvents">
                            0
                        </h2>


                        <small class="down">

                            <i class="bi bi-clock"></i>

                            تحتاج إلى مراجعتك

                        </small>

                    </div>


                </article>


                {{-- Approved --}}

                <article class="admin-stat-card">


                    <div
                        class="
                            admin-stat-icon-img
                            stat-approved
                        "
                    >

                        <i class="bi bi-check-circle-fill"></i>

                    </div>


                    <div>

                        <p>
                            الفعاليات المنشورة
                        </p>


                        <h2 id="approvedEvents">
                            0
                        </h2>


                        <small class="up">

                            <i class="bi bi-check-circle"></i>

                            فعاليات مقبولة

                        </small>

                    </div>


                </article>


            </section>


            {{-- =================================================
                 Charts
            ================================================== --}}

            <section class="admin-charts-grid">


                {{-- Categories --}}

                <article
                    class="
                        admin-card
                        chart-card
                        category-card
                    "
                >


                    <h3>
                        الفعاليات حسب الفئة
                    </h3>


                    <div class="category-chart-wrap">


                        <div
                            class="donut-chart"
                            id="categoryDonutChart"
                        >


                            <div class="donut-inner">


                                <strong
                                    id="categoryEventsTotal"
                                >
                                    0
                                </strong>


                                <span>
                                    فعالية
                                </span>


                            </div>


                        </div>


                        <ul
                            class="chart-legend"
                            id="categoryChartLegend"
                        >

                            <li
                                class="dashboard-placeholder-row"
                            >

                                جاري تحميل التصنيفات...

                            </li>

                        </ul>


                    </div>


                </article>


                {{-- Registrations Chart --}}

                <article
                    class="
                        admin-card
                        chart-card
                        line-card
                    "
                >


                    <div class="card-title-row">


                        <h3>
                            التسجيلات في الفعاليات
                        </h3>


                        <select
                            class="small-select"
                            id="registrationsPeriodSelect"
                        >

                            <option value="7">
                                آخر 7 أيام
                            </option>


                            <option value="30">
                                آخر 30 يومًا
                            </option>

                        </select>


                    </div>


                    <div
                        class="line-chart-box"
                        id="registrationsChartBox"
                    >


                        <svg
                            id="registrationsChart"
                            viewBox="0 0 620 260"
                            preserveAspectRatio="none"
                        >


                            <path
                                class="chart-grid-line"
                                d="M20 205 H600"
                            ></path>


                            <path
                                class="chart-grid-line"
                                d="M20 155 H600"
                            ></path>


                            <path
                                class="chart-grid-line"
                                d="M20 105 H600"
                            ></path>


                            <path
                                class="chart-line"
                                id="registrationsChartLine"
                                d=""
                            ></path>


                            <line
                                class="
                                    chart-marker
                                    d-none
                                "
                                id="registrationsChartMarker"

                                x1="0"
                                y1="0"

                                x2="0"
                                y2="220"
                            ></line>


                            <circle
                                class="
                                    chart-point
                                    d-none
                                "
                                id="registrationsChartPoint"

                                cx="0"
                                cy="0"

                                r="6"
                            ></circle>


                        </svg>


                        <div
                            class="chart-days"
                            id="registrationsChartDays"
                        >

                            <span>
                                لا توجد بيانات بعد
                            </span>

                        </div>


                        <div
                            class="
                                chart-empty-message
                                d-none
                            "
                            id="registrationsChartEmpty"
                        >

                            لا توجد تسجيلات ضمن الفترة المحددة.

                        </div>


                    </div>


                </article>


            </section>


            {{-- =================================================
                 Bottom
            ================================================== --}}

            <section class="admin-bottom-grid">


                {{-- Latest Events --}}

                <article
                    class="
                        admin-card
                        latest-events-card
                    "
                >


                    <div class="card-title-row">


                        <h3>
                            أحدث الفعاليات المضافة
                        </h3>


                        <a
                            href="{{ url('/admin/events') }}"
                        >

                            عرض جميع الفعاليات

                        </a>


                    </div>


                    <div
                        class="admin-event-list"
                        id="latestEventsContainer"
                    >


                        <div
                            class="dashboard-list-loading"
                        >

                            <span
                                class="
                                    spinner-border
                                    spinner-border-sm
                                "
                            ></span>

                            جاري تحميل الفعاليات...

                        </div>


                    </div>


                    <div
                        class="
                            dashboard-empty-list
                            d-none
                        "
                        id="latestEventsEmpty"
                    >

                        <i class="bi bi-calendar-x"></i>


                        <p>
                            لا توجد فعاليات حتى الآن.
                        </p>

                    </div>


                    <a
                        href="{{ url('/admin/events') }}"
                        class="show-more-link"
                    >

                        عرض جميع الفعاليات

                        <i class="bi bi-arrow-left"></i>

                    </a>


                </article>


                {{-- Registrations --}}

                <article
                    class="
                        admin-card
                        latest-registrations-card
                    "
                >


                    <div class="card-title-row">


                        <h3>
                            آخر التسجيلات
                        </h3>


                        <a
                            href="{{ url('/admin/registrations') }}"
                        >

                            عرض جميع التسجيلات

                        </a>


                    </div>


                    <div
                        class="registration-list"
                        id="latestRegistrationsContainer"
                    >


                        <div
                            class="dashboard-list-loading"
                        >

                            <span
                                class="
                                    spinner-border
                                    spinner-border-sm
                                "
                            ></span>

                            جاري تحميل التسجيلات...

                        </div>


                    </div>


                    <div
                        class="
                            dashboard-empty-list
                            d-none
                        "
                        id="latestRegistrationsEmpty"
                    >

                        <i class="bi bi-journal-x"></i>


                        <p>
                            لا توجد تسجيلات حتى الآن.
                        </p>

                    </div>


                    <a
                        href="{{ url('/admin/registrations') }}"
                        class="show-more-link"
                    >

                        عرض جميع التسجيلات

                        <i class="bi bi-arrow-left"></i>

                    </a>


                </article>


            </section>


        </div>


        {{-- =================================================
             Error
        ================================================== --}}

        <section
            class="
                admin-dashboard-error
                d-none
            "
            id="adminDashboardError"
        >


            <i class="bi bi-exclamation-circle"></i>


            <h2>
                تعذر تحميل لوحة التحكم
            </h2>


            <p id="adminDashboardErrorMessage">

                حدث خطأ أثناء تحميل البيانات.

            </p>


            <button
                type="button"
                id="retryDashboardButton"
            >

                إعادة المحاولة

            </button>


        </section>


    </main>


</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>