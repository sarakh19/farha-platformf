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
        مراجعة الفعاليات - فرحة
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
        'resources/css/review-events.css',
        'resources/js/review-events.js'
    ])

</head>


<body>


<div
    class="app"
    id="reviewEventsPage"

    data-events-url="{{ url('/api/admin/events') }}"

    data-approve-base-url="{{ url('/api/admin/events') }}"

    data-reject-base-url="{{ url('/api/admin/events') }}"

    data-home-url="{{ url('/home') }}"

    data-dashboard-page-url="{{ url('/admin/dashboard') }}"

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
                class="menu-link"
            >

                <i class="bi bi-grid-1x2-fill"></i>

                لوحة التحكم

            </a>


            <a
                href="{{ url('/admin/events') }}"
                class="menu-link active"
            >

                <i class="bi bi-calendar-event-fill"></i>

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
         Content
    ====================================================== --}}

    <main class="content review-content">


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


            <div class="breadcrumb admin-breadcrumb">


                <a href="{{ url('/home') }}">
                    الرئيسية
                </a>


                <span>›</span>


                <a href="{{ url('/admin/dashboard') }}">
                    لوحة التحكم
                </a>


                <span>›</span>


                <a
                    href="{{ url('/admin/events') }}"
                    class="active"
                >
                    الفعاليات
                </a>


            </div>


        </header>


        {{-- =================================================
             Page Header
        ================================================== --}}

        <section class="review-head">


            <div class="review-title-wrap">


                <div class="title-icon">

                    <i class="bi bi-calendar-check"></i>

                </div>


                <div>

                    <h1>
                        مراجعة الفعاليات
                    </h1>


                    <p>
                        مراجعة الفعاليات المقدمة من المنظمين قبل نشرها
                    </p>

                </div>


            </div>


        </section>


        {{-- =================================================
             Statistics
        ================================================== --}}

        <section class="review-stats">


            <article class="review-stat-card">

                <div class="review-stat-icon total">

                    <i class="bi bi-calendar-event-fill"></i>

                </div>

                <div>

                    <p>
                        إجمالي الفعاليات
                    </p>

                    <h2 id="totalEventsCount">
                        0
                    </h2>

                </div>

            </article>


            <article class="review-stat-card">

                <div class="review-stat-icon rejected">

                    <i class="bi bi-x-circle-fill"></i>

                </div>

                <div>

                    <p>
                        مرفوضة
                    </p>

                    <h2 id="rejectedEventsCount">
                        0
                    </h2>

                </div>

            </article>


            <article class="review-stat-card">

                <div class="review-stat-icon approved">

                    <i class="bi bi-check-circle-fill"></i>

                </div>

                <div>

                    <p>
                        مقبولة
                    </p>

                    <h2 id="approvedEventsCount">
                        0
                    </h2>

                </div>

            </article>


            <article class="review-stat-card">

                <div class="review-stat-icon pending">

                    <i class="bi bi-hourglass-split"></i>

                </div>

                <div>

                    <p>
                        قيد المراجعة
                    </p>

                    <h2 id="pendingEventsCount">
                        0
                    </h2>

                </div>

            </article>


        </section>


        {{-- =================================================
             Filters
        ================================================== --}}

        <section class="review-filter-box">


            <div class="review-search">

                <i class="bi bi-search"></i>

                <input
                    type="text"
                    id="reviewSearch"
                    placeholder="ابحث عن فعالية أو منظم..."
                    autocomplete="off"
                >

            </div>


            <input
                class="review-date"
                type="date"
                id="reviewDate"
            >


            <select id="statusSelect">

                <option value="all">
                    كل الحالات
                </option>

                <option value="pending">
                    قيد المراجعة
                </option>

                <option value="approved">
                    مقبولة
                </option>

                <option value="rejected">
                    مرفوضة
                </option>

            </select>


            <select id="placeSelect">

                <option value="all">
                    كل الأماكن
                </option>

            </select>


            <select id="categorySelect">

                <option value="all">
                    كل الفئات
                </option>

            </select>


        </section>


        {{-- =================================================
             Tabs
        ================================================== --}}

        <section class="review-tabs">


            <button
                type="button"
                class="active"
                data-filter="all"
                id="allTab"
            >

                الكل (0)

            </button>


            <button
                type="button"
                data-filter="pending"
                id="pendingTab"
            >

                قيد المراجعة (0)

            </button>


            <button
                type="button"
                data-filter="approved"
                id="approvedTab"
            >

                مقبولة (0)

            </button>


            <button
                type="button"
                data-filter="rejected"
                id="rejectedTab"
            >

                مرفوضة (0)

            </button>


        </section>


        {{-- =================================================
             Loading
        ================================================== --}}

        <section
            class="review-loading"
            id="reviewLoading"
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
             Table
        ================================================== --}}

        <section class="review-table">


            <div class="review-table-head">

                <span>الفعالية</span>

                <span>المنظم</span>

                <span>التاريخ والمكان</span>

                <span>الفئة</span>

                <span>تاريخ الإضافة</span>

                <span>حالة المراجعة</span>

                <span>الإجراءات</span>

            </div>


            <div id="reviewEventsContainer"></div>


        </section>


        {{-- =================================================
             Empty
        ================================================== --}}

        <section
            class="review-empty d-none"
            id="reviewEmptyState"
        >

            <div class="review-empty-icon">

                <i class="bi bi-calendar-x"></i>

            </div>


            <h3>
                لا توجد فعاليات
            </h3>


            <p>
                لا توجد فعاليات مطابقة للفلاتر الحالية.
            </p>

        </section>


    </main>


</div>


{{-- =========================================================
     Reject Modal
========================================================= --}}

<div
    class="modal fade"
    id="rejectEventModal"
    tabindex="-1"
    aria-labelledby="rejectEventModalLabel"
    aria-hidden="true"
>

    <div class="modal-dialog modal-dialog-centered">


        <div class="modal-content">


            <div class="modal-header">


                <h5
                    class="modal-title"
                    id="rejectEventModalLabel"
                >

                    رفض الفعالية

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
                    أنت على وشك رفض:
                </p>


                <strong id="rejectEventTitle">
                    هذه الفعالية
                </strong>


                <div class="mt-3">


                    <label
                        for="rejectionReasonInput"
                        class="form-label"
                    >

                        سبب الرفض

                    </label>


                    <textarea
                        class="form-control"
                        id="rejectionReasonInput"
                        rows="4"
                        placeholder="اكتب سبب رفض الفعالية..."
                    ></textarea>


                    <small
                        class="text-danger"
                        id="rejectionReasonError"
                    ></small>


                </div>


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
                    id="confirmRejectButton"
                >

                    <span class="reject-button-text">
                        رفض الفعالية
                    </span>


                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="rejectSpinner"
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