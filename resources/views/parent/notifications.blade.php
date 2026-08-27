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

    <title>الإشعارات - فرحة</title>


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


    {{-- ملفات المشروع --}}
    @vite([
        'resources/css/site-common.css',
        'resources/css/profile.css',
        'resources/css/notifications.css',
        'resources/js/notifications.js',
    ])

</head>


<body class="profile-page-final">


<div
    id="parentNotificationsPage"

    data-profile-url="{{ url('/api/profile') }}"
    data-notifications-url="{{ url('/api/notifications') }}"
    data-unread-count-url="{{ url('/api/notifications/unread-count') }}"
    data-read-all-url="{{ url('/api/notifications/read-all') }}"
    data-delete-all-url="{{ url('/api/notifications/delete-all') }}"

    data-home-url="{{ url('/home') }}"
    data-profile-page-url="{{ url('/parent/profile') }}"
    data-my-events-url="{{ url('/parent/my-events') }}"
    data-notifications-page-url="{{ url('/parent/notifications') }}"

    data-login-url="{{ url('/login') }}"
    data-logout-url="{{ url('/api/logout') }}"
>
<aside class="pf-sidebar">
        <div class="pf-parent-sidebar-head">
            <div class="pf-parent-name-circle" id="sidebarParentName">
                المستخدم
            </div>
            <div class="pf-parent-role">ولي أمر</div>
        </div>
        <nav class="pf-side-menu">
            <a href="{{ url('/parent/profile') }}" class="pf-menu-link"><i class="bi bi-person-circle"></i><span>ملفي الشخصي</span></a>
            <a href="{{ url('/parent/my-events') }}" class="pf-menu-link"><i class="bi bi-calendar-check"></i><span>فعالياتي</span></a>
            <a href="{{ url('/parent/notifications') }}" class="pf-menu-link active"><i class="bi bi-bell"></i><span>الإشعارات</span><span id="sidebarNotificationBadge" class="pf-sidebar-notification-badge d-none">0</span></a>
        </nav>
        <button type="button" class="pf-logout" id="logoutButton"><i class="bi bi-box-arrow-right"></i> تسجيل خروج</button>
    </aside>


    





     






    {{-- Mobile overlay --}}
    <div
        class="pf-sidebar-overlay"
        id="sidebarOverlay"
    ></div>



    {{-- =====================================================
         MAIN
    ====================================================== --}}

    <main class="pf-main">


        {{-- =================================================
             TOPBAR
        ================================================== --}}

       <header class="pf-topbar">

    <button
        type="button"
        class="pf-menu-toggle-mobile"
        id="mobileMenuButton"
        aria-label="فتح القائمة"
    >
        <i class="bi bi-list"></i>
    </button>


    {{-- =====================================================
         USER
    ====================================================== --}}

    <div class="pf-user-area">

        <img
            src="{{ asset('images.1/Margin.png') }}"
            alt="المستخدم"
            id="topProfileImage"
        >

        <h4 class="pf-parent-welcome">
            مرحباً

            <span id="topUserName">
                المستخدم
            </span>
        </h4>

    </div>


    {{-- =====================================================
         BREADCRUMB + NOTIFICATION
    ====================================================== --}}

    <div class="pf-topbar-left">

        <div class="pf-breadcrumb pf-breadcrumb-top">

            <a href="{{ url('/home') }}">
                الرئيسية
            </a>

            <span>›</span>

            <a href="{{ url('/parent/profile') }}">
                حسابي
            </a>

            <span>›</span>

            <strong>
                الإشعارات
            </strong>

        </div>


        <a
            href="{{ url('/parent/notifications') }}"
            class="pf-header-notification"
            title="الإشعارات"
            aria-label="الإشعارات"
        >
            <i class="bi bi-bell"></i>

            <span
                id="topNotificationBadge"
                class="pf-notification-badge d-none"
            >
                0
            </span>
        </a>

    </div>

</header>


        {{-- =================================================
             CONTENT
        ================================================== --}}

        <section class="pf-content">
<div class="pf-white-page-box notifications-white-box">


            {{-- Breadcrumb --}}
            



            {{-- =================================================
                 PAGE HEADER
            ================================================== --}}

            <section class="notifications-header">


                <div class="notifications-title">


                    <div class="title-icon">

                        <i class="bi bi-bell-fill"></i>

                    </div>


                    <div>

                        <h1>
                            الإشعارات
                        </h1>

                        <p>
                            تابع آخر التنبيهات المتعلقة بحسابك وفعالياتك وتسجيلاتك
                        </p>

                    </div>


                </div>



                <div class="notifications-actions">


                    <button
                        type="button"
                        class="mark-read"
                        id="markAllReadButton"
                    >

                        <i class="bi bi-check2-all"></i>

                        تمييز الكل كمقروء

                    </button>



                    <button
                        type="button"
                        class="delete-all"
                        id="deleteAllNotificationsButton"
                    >

                        <i class="bi bi-trash3"></i>

                        حذف الكل

                    </button>


                </div>


            </section>



            {{-- =================================================
                 TABS
            ================================================== --}}

            <section class="notifications-tabs">


                <button
                    type="button"
                    class="notification-tab active"
                    data-filter="all"
                >

                    الكل

                    <span id="allNotificationsCount">
                        0
                    </span>

                </button>



                <button
                    type="button"
                    class="notification-tab"
                    data-filter="unread"
                >

                    غير مقروءة

                    <span id="unreadNotificationsCount">
                        0
                    </span>

                </button>



                <button
                    type="button"
                    class="notification-tab"
                    data-filter="events"
                >

                    الفعاليات

                    <span id="eventsNotificationsCount">
                        0
                    </span>

                </button>



                <button
                    type="button"
                    class="notification-tab"
                    data-filter="registrations"
                >

                    التسجيلات

                    <span id="registrationsNotificationsCount">
                        0
                    </span>

                </button>



                <button
                    type="button"
                    class="notification-tab"
                    data-filter="system"
                >

                    النظام

                    <span id="systemNotificationsCount">
                        0
                    </span>

                </button>


            </section>



            {{-- =================================================
                 LOADING
            ================================================== --}}

            <section
                id="notificationsLoading"
                class="notifications-empty"
            >

                <span
                    class="spinner-border spinner-border-sm"
                    aria-hidden="true"
                ></span>

                <strong>
                    جاري تحميل الإشعارات...
                </strong>

            </section>



            {{-- =================================================
                 ERROR
            ================================================== --}}

            <section
                id="notificationsError"
                class="notifications-empty d-none"
            >

                <i class="bi bi-exclamation-triangle"></i>


                <strong>
                    تعذر تحميل الإشعارات
                </strong>


                <p id="notificationsErrorMessage">
                    حدث خطأ أثناء تحميل الإشعارات.
                </p>


                <button
                    type="button"
                    class="mark-read"
                    id="retryNotificationsButton"
                >
                    إعادة المحاولة
                </button>

            </section>



            {{-- =================================================
                 NOTIFICATIONS
            ================================================== --}}

            <section
                class="notifications-list d-none"
                id="notificationsList"
            >
            </section>



            {{-- =================================================
                 EMPTY
            ================================================== --}}

            <section
                id="notificationsEmpty"
                class="notifications-empty d-none"
            >

                <i class="bi bi-bell-slash"></i>


                <strong>
                    لا توجد إشعارات لعرضها
                </strong>


                <p>
                    لم يتم العثور على إشعارات ضمن هذا التصنيف.
                </p>

            </section>


        </div>
</section>


    </main>


</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>