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

    <title>التقارير - فرحة</title>

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
        'resources/css/report.css',
        'resources/js/dashboard-common.js',
        'resources/js/report.js',
    ])
</head>

<body>

<div
    class="app"
    id="organizerReportsPage"
    data-report-url="{{ url('/api/organizer/reports') }}"
    data-logout-url="{{ url('/api/logout') }}"
    data-login-url="{{ url('/login') }}"
    data-home-url="{{ url('/home') }}"
>

    {{-- =========================
         Sidebar
    ========================== --}}
    <aside class="sidebar organizer-sidebar">

        <div class="organizer-profile">

            <div
                class="organizer-avatar"
                id="organizerAvatar"
            >
                م
            </div>

            <h3 id="organizerName">
                جاري تحميل البيانات...
            </h3>

            <p>منظم فعاليات</p>

        </div>

        <nav class="menu">

            <a
                href="{{ url('/organizer/dashboard') }}"
                class="menu-link"
            >
                <i class="bi bi-house-door"></i>
                لوحة التحكم
            </a>

            <a
                href="{{ url('/organizer/events') }}"
                class="menu-link"
            >
                <i class="bi bi-calendar-event"></i>
                فعالياتي
            </a>

            <a
                href="{{ url('/organizer/events/create') }}"
                class="menu-link"
            >
                <i class="bi bi-plus-circle"></i>
                إضافة فعالية
            </a>

            <a
                href="{{ url('/organizer/reports') }}"
                class="menu-link active"
            >
                <i class="bi bi-bar-chart-fill"></i>
                التقارير
            </a>

            <a
                href="{{ url('/organizer/settings') }}"
                class="menu-link"
            >
                <i class="bi bi-gear"></i>
                الإعدادات
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

    <div
        class="sidebar-overlay"
        id="dashboardSidebarOverlay"
    ></div>

    {{-- =========================
         Main Content
    ========================== --}}
    <main class="content reports-content">

        <button
            type="button"
            class="menu-toggle d-lg-none"
            id="dashboardMenuToggle"
            aria-label="فتح القائمة"
        >
            <i class="bi bi-list"></i>
        </button>

        {{-- Topbar --}}
        <header class="topbar">

            <div class="user-area">

                <strong class="simple-welcome">
                    مرحباً
                    <span id="welcomeOrganizerName">
                        بك
                    </span>

                    <i class="bi bi-emoji-smile"></i>
                </strong>

                <div class="notification-wrapper">

                    <button
                        type="button"
                        class="notification-button"
                        id="notificationButton"
                        aria-label="الإشعارات"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i class="bi bi-bell"></i>

                        <span
                            class="notification-badge"
                            id="notificationBadge"
                            style="display:none;"
                        >
                            0
                        </span>
                    </button>


                    <div
                        class="notification-dropdown"
                        id="notificationDropdown"
                    >

                        <div class="notification-dropdown-header">

                            <strong>
                                الإشعارات
                            </strong>

                            <button
                                type="button"
                                id="markAllNotificationsRead"
                            >
                                تحديد الكل كمقروء
                            </button>

                        </div>


                        <div
                            class="notification-list"
                            id="notificationList"
                        >
                            <div class="notification-empty">
                                جاري تحميل الإشعارات...
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <div class="breadcrumb">

                <a href="{{ url('/home') }}">
                    الرئيسية
                </a>

                <span class="breadcrumb-separator">›</span>

                <a href="{{ url('/organizer/dashboard') }}">
                    لوحة التحكم
                </a>

                <span class="breadcrumb-separator">›</span>

                <span class="current">
                    التقارير
                </span>

            </div>

        </header>

        {{-- =========================
             Reports Header Box
        ========================== --}}
        <section class="reports-head">

            <div class="reports-head-info">

                <div class="reports-head-icon">
                    <i class="bi bi-bar-chart-line"></i>
                </div>

                <div>
                    <h1>التقارير</h1>

                    <p>
                        تابع أداء فعالياتك، أعداد التسجيلات، ونسب القبول
                        خلال فترة زمنية محددة.
                    </p>
                </div>

            </div>

            <div class="reports-filter">
                <label for="reportPeriod">الفترة الزمنية</label>

                <select id="reportPeriod">
                    <option value="7">آخر 7 أيام</option>
                    <option value="30" selected>آخر 30 يوم</option>
                    <option value="90">آخر 90 يوم</option>
                    <option value="365">آخر سنة</option>
                    <option value="all">كل الفترات</option>
                </select>
            </div>

        </section>

        {{-- =========================
             Summary Cards
        ========================== --}}
        <section class="reports-summary-grid">

            <article class="report-stat-card total">
                <div class="report-stat-icon">
                    <i class="bi bi-calendar2-week"></i>
                </div>

                <div class="report-stat-content">
                    <p>إجمالي الفعاليات</p>
                    <h2 id="reportTotalEvents">0</h2>
                    <small>ضمن الفترة المحددة</small>
                </div>
            </article>

            <article class="report-stat-card registrations">
                <div class="report-stat-icon">
                    <i class="bi bi-journal-check"></i>
                </div>

                <div class="report-stat-content">
                    <p>إجمالي التسجيلات</p>
                    <h2 id="reportTotalRegistrations">0</h2>
                    <small>كل طلبات التسجيل</small>
                </div>
            </article>

            <article class="report-stat-card confirmed">
                <div class="report-stat-icon">
                    <i class="bi bi-check2-circle"></i>
                </div>

                <div class="report-stat-content">
                    <p>الطلبات المقبولة</p>
                    <h2 id="reportConfirmedRegistrations">0</h2>
                    <small>عدد الطلبات الموافق عليها</small>
                </div>
            </article>

            <article class="report-stat-card rate">
                <div class="report-stat-icon">
                    <i class="bi bi-percent"></i>
                </div>

                <div class="report-stat-content">
                    <p>نسبة القبول</p>
                    <h2 id="reportAcceptanceRate">0%</h2>
                    <small>من إجمالي التسجيلات</small>
                </div>
            </article>

        </section>

        {{-- =========================
             Panels
        ========================== --}}
        <section class="reports-grid">

            <article class="report-panel">

                <div class="report-panel-head">
                    <div>
                        <h2>التسجيلات خلال الفترة</h2>
                        <p>تفصيل الطلبات حسب الحالة</p>
                    </div>
                </div>

                <div
                    class="report-breakdown-list"
                    id="reportRegistrationsBreakdown"
                ></div>

            </article>

            <article class="report-panel">

                <div class="report-panel-head">
                    <div>
                        <h2>الفعاليات حسب الفئة</h2>
                        <p>عدد فعالياتك ضمن كل تصنيف</p>
                    </div>
                </div>

                <div
                    class="report-categories-list"
                    id="reportCategoriesList"
                ></div>

            </article>

            <article class="report-panel full-width">

                <div class="report-panel-head">
                    <div>
                        <h2>أكثر الفعاليات تسجيلاً</h2>
                        <p>الفعاليات الأعلى من حيث عدد التسجيلات</p>
                    </div>
                </div>

                <div
                    class="top-events-list"
                    id="reportTopEventsList"
                ></div>

            </article>

        </section>

        {{-- Loading / Error --}}
        <div
            class="report-page-state d-none"
            id="reportLoadingState"
        >
            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>

            جاري تحميل التقارير...
        </div>

        <div
            class="report-page-state report-page-error d-none"
            id="reportErrorState"
        >
            <i class="bi bi-exclamation-circle"></i>

            <p id="reportErrorMessage">
                تعذر تحميل التقارير.
            </p>

            <button
                type="button"
                id="retryReportsButton"
            >
                إعادة المحاولة
            </button>
        </div>

    </main>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>