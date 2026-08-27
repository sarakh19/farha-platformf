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

    <title>لوحة تحكم المنظم - فرحة</title>

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

    @vite([
        'resources/css/dashboard-common.css',
        'resources/css/organizer-dashboard.css',
        'resources/js/organizer-dashboard.js',
    ])

</head>


<body>


<div
    class="app"
    id="organizerDashboard"

    data-dashboard-url="{{ url('/api/organizer/dashboard') }}"
    data-events-url="{{ url('/api/organizer/events') }}"

    data-registration-requests-url="{{ url('/api/organizer/registration-requests') }}"
    data-approve-registration-url="{{ url('/api/organizer/registrations') }}"
    data-reject-registration-url="{{ url('/api/organizer/registrations') }}"

    data-logout-url="{{ url('/api/logout') }}"
    data-login-url="{{ url('/login') }}"
    data-home-url="{{ url('/home') }}"
>


    {{-- =====================================================
         SIDEBAR
    ====================================================== --}}

    <aside class="sidebar organizer-sidebar">


        <div class="organizer-profile">

            <div
                class="organizer-avatar"
                id="organizerAvatar"
            >
                م
            </div>


            <h3 id="organizerName">
                منظم فرحة
            </h3>


            <p>
                منظم فعاليات
            </p>

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
                class="menu-link"
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



    {{-- Mobile overlay --}}

    <div
        class="sidebar-overlay"
        id="dashboardSidebarOverlay"
    ></div>



    {{-- =====================================================
         MAIN CONTENT
    ====================================================== --}}

    <main class="content organizer-content">


        <button
            type="button"
            class="menu-toggle d-lg-none"
            id="dashboardMenuToggle"
            aria-label="فتح القائمة"
        >
            <i class="bi bi-list"></i>
        </button>



        {{-- =================================================
             TOPBAR
        ================================================== --}}

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
                        ></span>
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
                                تعليم الكل كمقروء
                            </button>

                        </div>


                        <div
                            class="notification-list"
                            id="notificationList"
                        >

                            <div class="notification-empty">

                                <i class="bi bi-bell"></i>

                                <span>
                                    جاري تحميل الإشعارات...
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


            </div>



            <div class="breadcrumb">

                <a href="{{ url('/home') }}">
                    الرئيسية
                </a>

                <span class="breadcrumb-separator">
                    ›
                </span>

                <span>
                    لوحة التحكم
                </span>

            </div>


        </header>



        {{-- =================================================
             DASHBOARD HEADER
        ================================================== --}}

        <section class="organizer-head">


            <div>

                <h1>
                    لوحة تحكم المنظم
                </h1>

                <p>
                    مرحباً بك في لوحة التحكم الخاصة بك،
                    من هنا يمكنك إدارة فعالياتك ومتابعة التسجيلات.
                </p>

            </div>


            <a
                href="{{ url('/organizer/events/create') }}"
                class="organizer-head-action"
            >
                <i class="bi bi-plus-lg"></i>

                إضافة فعالية جديدة
            </a>


        </section>



        {{-- =================================================
             STATISTICS
        ================================================== --}}

        <section class="organizer-stats">


            <article class="stat-card">

                <div class="stat-icon-box purple">
                    <i class="bi bi-calendar-event"></i>
                </div>

                <div class="stat-content">

                    <p>
                        إجمالي فعالياتي
                    </p>

                    <h2 id="totalEvents">
                        0
                    </h2>

                </div>

            </article>



            <article class="stat-card">

                <div class="stat-icon-box blue">
                    <i class="bi bi-calendar-check"></i>
                </div>

                <div class="stat-content">

                    <p>
                        الفعاليات القادمة
                    </p>

                    <h2 id="upcomingEvents">
                        0
                    </h2>

                </div>

            </article>



            <article class="stat-card">

                <div class="stat-icon-box green">
                    <i class="bi bi-people"></i>
                </div>

                <div class="stat-content">

                    <p>
                        التسجيلات
                    </p>

                    <h2 id="totalRegistrations">
                        0
                    </h2>

                </div>

            </article>



            <article class="stat-card">

                <div class="stat-icon-box pink">
                    <i class="bi bi-calendar-x"></i>
                </div>

                <div class="stat-content">

                    <p>
                        الفعاليات المنتهية
                    </p>

                    <h2 id="finishedEvents">
                        0
                    </h2>

                </div>

            </article>


        </section>



        {{-- =================================================
             REGISTRATION REQUESTS
        ================================================== --}}

        <section class="registration-requests-box">


            <div class="section-head">


                <div>

                    <h2>
                        طلبات التسجيل الجديدة
                    </h2>

                    <p>
                        راجع طلبات تسجيل الأطفال في فعالياتك
                    </p>

                </div>


                <span
                    class="requests-count"
                    id="pendingRequestsCount"
                >
                    0 طلب
                </span>


            </div>



            <div
                class="dashboard-loading"
                id="registrationRequestsLoading"
            >

                <span
                    class="spinner-border spinner-border-sm"
                ></span>

                جاري تحميل طلبات التسجيل...

            </div>



            <div
                class="registration-requests-list d-none"
                id="registrationRequestsContainer"
            ></div>



            <div
                class="dashboard-empty d-none"
                id="noRegistrationRequests"
            >

                <i class="bi bi-person-check"></i>

                <h3>
                    لا توجد طلبات جديدة
                </h3>

                <p>
                    لا يوجد حالياً أي طلب تسجيل بانتظار الموافقة.
                </p>

            </div>


        </section>



        {{-- =================================================
             RECENT EVENTS
        ================================================== --}}

        <section class="recent-events-box">


            <div class="section-head">


                <div>

                    <h2>
                        فعالياتي الأخيرة
                    </h2>

                    <p>
                        آخر الفعاليات التي قمت بإضافتها
                    </p>

                </div>


                <a
                    href="{{ url('/organizer/events') }}"
                    class="small-outline-btn"
                >
                    عرض جميع الفعاليات
                </a>


            </div>



            <div
                class="events-table"
                id="recentEventsContainer"
            >

                <div class="dashboard-loading">

                    <span
                        class="spinner-border spinner-border-sm"
                    ></span>

                    جاري تحميل الفعاليات...

                </div>

            </div>



            <div
                class="dashboard-empty d-none"
                id="noRecentEvents"
            >

                <i class="bi bi-calendar-x"></i>

                <h3>
                    لا توجد فعاليات حتى الآن
                </h3>

                <p>
                    ابدأ بإضافة أول فعالية لك.
                </p>

                <a href="{{ url('/organizer/events/create') }}">
                    إضافة فعالية
                </a>

            </div>


        </section>


    </main>


</div>



<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>