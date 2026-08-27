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

    <title>قائمة فعالياتي - فرحة</title>


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


    {{-- ملفات الصفحة --}}
    @vite([
        'resources/css/dashboard-common.css',
        'resources/css/organizer-events.css',
        'resources/js/dashboard-common.js',
        'resources/js/organizer-events.js',
    ])

</head>


<body>


<div
    class="app"
    id="organizerEventsPage"

    data-events-url="{{ url('/api/organizer/events') }}"

    data-delete-base-url="{{ url('/api/events') }}"

    data-edit-base-url="{{ url('/organizer/events') }}"

    data-create-url="{{ url('/organizer/events/create') }}"

    data-dashboard-url="{{ url('/organizer/dashboard') }}"

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
                class="menu-link active"
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



    {{-- =====================================================
         MOBILE OVERLAY
    ====================================================== --}}

    <div
        class="sidebar-overlay"
        id="dashboardSidebarOverlay"
    ></div>



    {{-- =====================================================
         MAIN CONTENT
    ====================================================== --}}

    <main class="content organizer-events-content">


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

                <span class="current">
                    فعالياتي
                </span>

            </div>


        </header>



        {{-- =================================================
             PAGE HEADER BOX
        ================================================== --}}

        <section class="events-page-head">


            <div class="events-head-info">


                <div class="events-head-icon">

                    <i class="bi bi-calendar-event"></i>

                </div>


                <div>

                    <h1>
                        قائمة فعالياتي
                    </h1>


                    <p>
                        عرض وإدارة جميع الفعاليات التي قمت بإنشائها
                    </p>

                </div>


            </div>



            <a
                href="{{ url('/organizer/events/create') }}"
                class="events-head-action"
            >

                <i class="bi bi-plus-lg"></i>

                إضافة فعالية جديدة

            </a>


        </section>



        {{-- =================================================
             SUMMARY CARDS
        ================================================== --}}

        <section class="events-summary-grid">


            {{-- إجمالي الفعاليات --}}

            <article class="event-summary-card total">


                <div class="summary-icon-box total">

                    <i class="bi bi-calendar-event"></i>

                </div>


                <div class="summary-content">

                    <p>
                        إجمالي الفعاليات
                    </p>


                    <h2 id="totalEventsCount">
                        0
                    </h2>

                </div>


            </article>



            {{-- الفعاليات المقبولة --}}

            <article class="event-summary-card accepted">


                <div class="summary-icon-box accepted">

                    <i class="bi bi-check-circle"></i>

                </div>


                <div class="summary-content">

                    <p>
                        مقبولة ومنشورة
                    </p>


                    <h2 id="approvedEventsCount">
                        0
                    </h2>

                </div>


            </article>



            {{-- قيد المراجعة --}}

            <article class="event-summary-card pending">


                <div class="summary-icon-box pending">

                    <i class="bi bi-clock-history"></i>

                </div>


                <div class="summary-content">

                    <p>
                        قيد المراجعة
                    </p>


                    <h2 id="pendingEventsCount">
                        0
                    </h2>

                </div>


            </article>



            {{-- المرفوضة --}}

            <article class="event-summary-card rejected">


                <div class="summary-icon-box rejected">

                    <i class="bi bi-x-circle"></i>

                </div>


                <div class="summary-content">

                    <p>
                        مرفوضة
                    </p>


                    <h2 id="rejectedEventsCount">
                        0
                    </h2>

                </div>


            </article>


        </section>



        {{-- =================================================
             SEARCH + FILTERS
        ================================================== --}}

        <section class="events-filter-box">


            <div class="search-box">


                <i class="bi bi-search"></i>


                <input
                    type="text"
                    id="eventSearch"
                    placeholder="ابحث عن فعالية..."
                    autocomplete="off"
                >


            </div>



            <div
                class="filter-tabs"
                id="eventFilterTabs"
            >


                <button
                    type="button"
                    class="filter-tab active"
                    data-filter="all"
                >
                    الكل
                </button>



                <button
                    type="button"
                    class="filter-tab"
                    data-filter="approved"
                >
                    منشورة
                </button>



                <button
                    type="button"
                    class="filter-tab"
                    data-filter="pending"
                >
                    قيد المراجعة
                </button>



                <button
                    type="button"
                    class="filter-tab"
                    data-filter="draft"
                >
                    مسودة
                </button>



                <button
                    type="button"
                    class="filter-tab"
                    data-filter="rejected"
                >
                    مرفوضة
                </button>


            </div>



            <button
                type="button"
                class="view-toggle"
                id="viewToggleButton"
                aria-label="تغيير طريقة العرض"
            >

                <i class="bi bi-grid-3x3-gap-fill"></i>

            </button>


        </section>



        {{-- =================================================
             LOADING
        ================================================== --}}

        <section
            class="events-loading"
            id="eventsLoading"
        >

            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>


            <span>
                جاري تحميل الفعاليات...
            </span>


        </section>



        {{-- =================================================
             EVENTS CONTAINER
        ================================================== --}}

        <section
            class="organizer-events-table"
            id="organizerEventsContainer"
        ></section>



        {{-- =================================================
             EMPTY STATE
        ================================================== --}}

        <section
            class="events-empty d-none"
            id="eventsEmptyState"
        >


            <div class="events-empty-icon">

                <i class="bi bi-calendar-x"></i>

            </div>


            <h2>
                لا توجد فعاليات حتى الآن
            </h2>


            <p>
                ابدأ بإضافة أول فعالية لك من خلال الزر أدناه.
            </p>


            <a
                href="{{ url('/organizer/events/create') }}"
                class="primary-action"
            >

                <i class="bi bi-plus-lg"></i>

                إضافة فعالية جديدة

            </a>


        </section>



        {{-- =================================================
             NO SEARCH RESULTS
        ================================================== --}}

        <section
            class="events-empty d-none"
            id="noSearchResults"
        >


            <div class="events-empty-icon">

                <i class="bi bi-search"></i>

            </div>


            <h2>
                لا توجد نتائج مطابقة
            </h2>


            <p>
                جرّب تغيير كلمات البحث أو اختيار حالة أخرى.
            </p>


        </section>



        {{-- =================================================
             PAGINATION
        ================================================== --}}

        <section
            class="events-pagination d-none"
            id="eventsPagination"
        >


            <button
                type="button"
                id="previousPageButton"
                disabled
            >

                <i class="bi bi-chevron-right"></i>

                السابق

            </button>



            <div
                class="pagination-pages"
                id="paginationPages"
            ></div>



            <button
                type="button"
                id="nextPageButton"
                disabled
            >

                التالي

                <i class="bi bi-chevron-left"></i>

            </button>


        </section>


    </main>


</div>



{{-- =========================================================
     DELETE CONFIRMATION MODAL
========================================================= --}}

<div
    class="modal fade"
    id="deleteEventModal"
    tabindex="-1"
    aria-labelledby="deleteEventModalLabel"
    aria-hidden="true"
>


    <div class="modal-dialog modal-dialog-centered">


        <div class="modal-content">


            <div class="modal-header">


                <h5
                    class="modal-title"
                    id="deleteEventModalLabel"
                >
                    حذف الفعالية
                </h5>


                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="إغلاق"
                ></button>


            </div>



            <div class="modal-body">


                <p>
                    هل أنت متأكد من حذف الفعالية:
                </p>


                <strong id="deleteEventTitle">
                    هذه الفعالية
                </strong>


                <p class="text-danger mt-3 mb-0">
                    لا يمكن التراجع عن عملية الحذف.
                </p>


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
                    class="btn btn-danger"
                    id="confirmDeleteEventButton"
                >


                    <span class="delete-button-text">
                        حذف
                    </span>


                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="deleteEventSpinner"
                        aria-hidden="true"
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