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

    <title>فعالياتي - فرحة</title>

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
        'resources/css/my-events.css',
        'resources/js/my-events.js'
    ])

</head>


<body class="profile-page-final">


<div
    id="parentMyEventsPage"

    data-profile-url="{{ url('/api/profile') }}"
    data-registrations-url="{{ url('/api/parent/registrations') }}"
    data-logout-url="{{ url('/api/logout') }}"

    data-home-url="{{ url('/home') }}"
    data-events-url="{{ url('/events') }}"
    data-profile-page-url="{{ url('/parent/profile') }}"
    data-my-events-url="{{ url('/parent/my-events') }}"
    data-notifications-url="{{ url('/parent/notifications') }}"
    data-login-url="{{ url('/login') }}"
>


    {{-- =====================================================
         SIDEBAR
    ====================================================== --}}

    <aside class="pf-sidebar">

        <div class="pf-parent-sidebar-head">

            <div
                class="pf-parent-name-circle"
                id="sidebarParentName"
            >
                المستخدم
            </div>

            <div class="pf-parent-role">
                ولي أمر
            </div>

        </div>


        <nav class="pf-side-menu">


            <a
                href="{{ url('/parent/profile') }}"
                class="pf-menu-link"
            >
                <i class="bi bi-person-circle"></i>

                <span>
                    ملفي الشخصي
                </span>
            </a>


            <a
                href="{{ url('/parent/my-events') }}"
                class="pf-menu-link active"
            >
                <i class="bi bi-calendar-check"></i>

                <span>
                    فعالياتي
                </span>
            </a>


            <a
                href="{{ url('/parent/notifications') }}"
                class="pf-menu-link"
            >
                <i class="bi bi-bell"></i>

                <span>
                    الإشعارات
                </span>
            </a>


        </nav>


        <button
            type="button"
            class="pf-logout"
            id="logoutButton"
        >
            <i class="bi bi-box-arrow-right"></i>

            تسجيل خروج
        </button>

    </aside>



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
                aria-label="فتح القائمة"
            >
                <i class="bi bi-list"></i>
            </button>


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
                        فعالياتي
                    </strong>

                </div>


                <a
                    href="{{ url('/parent/notifications') }}"
                    class="pf-header-notification"
                    title="الإشعارات"
                    aria-label="الإشعارات"
                >
                    <i class="bi bi-bell"></i>
                </a>

            </div>


        </header>



        {{-- =================================================
             CONTENT
        ================================================== --}}
<section class="pf-content">

    <div class="parent-events-box">

        <div class="parent-events-heading">

            <div>
                <h1>
                    فعالياتي
                </h1>

                <p>
                    الفعاليات التي قمت بالتسجيل فيها
                </p>
            </div>

            <a
                href="{{ url('/events') }}"
                class="parent-browse-events"
            >
                <i class="bi bi-plus-lg"></i>
                تصفح الفعاليات
            </a>

        </div>


        <div class="parent-events-filters">

            <div class="parent-event-search">

                <i class="bi bi-search"></i>

                <input
                    type="search"
                    id="myEventsSearch"
                    placeholder="ابحث عن فعالية..."
                >

            </div>


            <select id="myEventsStatus">

                <option value="all">
                    جميع الحالات
                </option>

                <option value="pending">
                    قيد الانتظار
                </option>

                <option value="confirmed">
                    مؤكد
                </option>

                <option value="cancelled">
                    ملغي
                </option>

            </select>

        </div>


        <div
            id="myEventsLoading"
            class="parent-events-state"
        >

            <span
                class="spinner-border spinner-border-sm"
            ></span>

            جاري تحميل فعالياتك...

        </div>


        <div
            id="myEventsError"
            class="parent-events-state parent-events-error d-none"
        >

            <i class="bi bi-exclamation-circle"></i>

            <p id="myEventsErrorMessage">
                تعذر تحميل الفعاليات.
            </p>

            <button
                type="button"
                id="retryMyEventsButton"
            >
                إعادة المحاولة
            </button>

        </div>


        <div
            id="myEventsEmpty"
            class="parent-events-empty d-none"
        >

            <div class="parent-empty-icon">
                <i class="bi bi-calendar2-x"></i>
            </div>

            <h2>
                لا توجد فعاليات مسجلة
            </h2>

            <p>
                لم تقم بالتسجيل في أي فعالية حتى الآن.
            </p>

            <a href="{{ url('/events') }}">
                تصفح الفعاليات
            </a>

        </div>


        <div
            class="parent-events-grid d-none"
            id="myEventsContainer"
        ></div>

    </div>

</section>
       
    </main>


</div>



<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>
</html>