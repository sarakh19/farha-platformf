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

    <title>تعديل فعالية - فرحة</title>

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
        'resources/css/edit-event.css',
        'resources/js/dashboard-common.js',
        'resources/js/edit-event.js',
    ])
</head>
<body>

<div
    class="app"
    id="editEventPage"

    data-event-id="{{ request()->route('event') }}"
    data-show-base-url="{{ url('/api/events') }}"
    data-update-base-url="{{ url('/api/events') }}"
    data-delete-base-url="{{ url('/api/events') }}"
    data-categories-url="{{ url('/api/categories') }}"

    data-events-page-url="{{ url('/organizer/events') }}"
    data-dashboard-url="{{ url('/organizer/dashboard') }}"
    data-login-url="{{ url('/login') }}"
    data-logout-url="{{ url('/api/logout') }}"
>

    {{-- =====================================================
         Sidebar
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
                جاري تحميل البيانات...
            </h3>

            <p>منظم فعاليات</p>

        </div>
<nav class="menu">

    <a href="{{ url('/organizer/dashboard') }}" class="menu-link">
        <i class="bi bi-house-door"></i>
        لوحة التحكم
    </a>

    <a href="{{ url('/organizer/events') }}" class="menu-link">
        <i class="bi bi-calendar-event"></i>
        فعالياتي
    </a>

    <a href="{{ url('/organizer/events/create') }}" class="menu-link">
        <i class="bi bi-plus-circle"></i>
        إضافة فعالية
    </a>

    <a href="{{ url('/organizer/reports') }}" class="menu-link">
        <i class="bi bi-bar-chart-fill"></i>
        التقارير
    </a>

    <a href="{{ url('/organizer/settings') }}" class="menu-link">
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

    {{-- خلفية القائمة في الجوال --}}
    <div class="sidebar-overlay"></div>

    {{-- =====================================================
         Content
    ====================================================== --}}
    <main class="content edit-event-content">

        <button
            type="button"
            class="menu-toggle d-lg-none"
            aria-label="فتح القائمة"
        >
            <i class="bi bi-list"></i>
        </button>

        {{-- Topbar --}}
        <header class="topbar">

            <div class="user-area">

                <strong class="simple-welcome">
                    مرحباً
                    <span id="welcomeOrganizerName">بك</span>

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

                <a href="{{ url('/organizer/events') }}">
                    فعالياتي
                </a>

                <span class="breadcrumb-separator">›</span>

                <span class="current">
                    تعديل فعالية
                </span>

            </div>

        </header>

        {{-- =================================================
             Loading
        ================================================== --}}
        <section
            class="edit-event-loading"
            id="editEventLoading"
        >
            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>

            <span>جاري تحميل بيانات الفعالية...</span>
        </section>

        {{-- =================================================
             محتوى الصفحة
        ================================================== --}}
        <div
            id="editEventContent"
            class="d-none"
        >

            {{-- Header --}}
            <section class="edit-event-head">

                <div class="edit-title-wrap">

                    <div class="title-icon">
                        <i class="bi bi-pencil-square"></i>
                    </div>

                    <div>
                        <h1>تعديل فعالية</h1>

                        <p>
                            يمكنك تعديل بيانات الفعالية وإعادة حفظ التغييرات.
                        </p>
                    </div>

                </div>

                <a
                    href="{{ url('/organizer/events') }}"
                    class="back-btn"
                >
                    الرجوع إلى فعالياتي
                </a>

            </section>

            {{-- =================================================
                 Layout
            ================================================== --}}
            <section class="edit-event-layout">

                {{-- =============================================
                     Preview and Status
                ============================================== --}}
                <aside class="edit-side-panel">

                    <div class="preview-card">

                        <img
                            src="{{ asset('images/default-event.png') }}"
                            alt="صورة الفعالية"
                            id="previewImg"
                        >

                        <div>
                            <h3 id="previewTitle">
                                جاري تحميل العنوان...
                            </h3>

                            <span
                                class="row-status review"
                                id="previewStatusBadge"
                            >
                                قيد التحميل
                            </span>
                        </div>

                    </div>

                    <div class="edit-info-box">

                        <h4>معلومات سريعة</h4>

                        <p>
                            <span>عدد المسجلين</span>

                            <strong id="infoCapacity">
                                0 / 0
                            </strong>
                        </p>

                        <p>
                            <span>تاريخ الإنشاء</span>

                            <strong id="infoCreatedDate">
                                غير محدد
                            </strong>
                        </p>

                        <p>
                            <span>حالة المراجعة</span>

                            <strong id="infoReviewStatus">
                                غير محددة
                            </strong>
                        </p>

                    </div>

                    {{-- يظهر فقط إذا كانت الفعالية مرفوضة --}}
                    <div
                        class="rejection-reason-box d-none"
                        id="rejectionReasonBox"
                    >
                        <h4>
                            <i class="bi bi-exclamation-triangle-fill"></i>
                            سبب الرفض
                        </h4>

                        <p id="rejectionReasonText"></p>
                    </div>

                    <button
                        type="button"
                        class="delete-event-btn"
                        id="deleteEventButton"
                    >
                        <i class="bi bi-trash3"></i>
                        حذف الفعالية
                    </button>

                </aside>

                {{-- =============================================
                     Form
                ============================================== --}}
                <form
                    class="edit-event-form"
                    id="editEventForm"
                    enctype="multipart/form-data"
                    novalidate
                >
                    @csrf

                    {{-- =========================================
                         Basic Information
                    ========================================== --}}
                    <section class="edit-form-card">

                        <div class="form-section-title">

                            <span>
                                <i class="bi bi-info-circle-fill"></i>
                            </span>

                            <h2>معلومات الفعالية الأساسية</h2>

                        </div>

                        <div class="edit-grid two">

                            {{-- اسم الفعالية --}}
                            <div class="edit-group">

                                <label for="titleInput">
                                    اسم الفعالية *
                                </label>

                                <input
                                    type="text"
                                    id="titleInput"
                                    name="title"
                                    maxlength="255"
                                    required
                                >

                                <small
                                    class="event-field-error"
                                    id="titleError"
                                    aria-live="polite"
                                ></small>

                            </div>

                            {{-- الفئة --}}
                            <div class="edit-group">

                                <label for="categoryInput">
                                    الفئة *
                                </label>

                                <select
                                    id="categoryInput"
                                    name="category_id"
                                    required
                                >
                                    <option value="">
                                        جاري تحميل الفئات...
                                    </option>
                                </select>

                                <small
                                    class="event-field-error"
                                    id="categoryError"
                                    aria-live="polite"
                                ></small>

                            </div>

                        </div>

                        <div class="edit-grid two">

                            {{-- نوع الفعالية --}}
                            <div class="edit-group">

                                <label for="eventTypeInput">
                                    نوع الفعالية *
                                </label>

                                <select
                                    id="eventTypeInput"
                                    name="event_type"
                                    required
                                >
                                    <option value="">
                                        اختر نوع الفعالية
                                    </option>

                                    <option value="حضورية">
                                        حضورية
                                    </option>

                                    <option value="أونلاين">
                                        أونلاين
                                    </option>
                                </select>

                                <small
                                    class="event-field-error"
                                    id="eventTypeError"
                                    aria-live="polite"
                                ></small>

                            </div>

                            {{-- العمر المناسب --}}
                            <div class="edit-group">

                                <label for="ageGroupInput">
                                    العمر المناسب *
                                </label>

                                <select
                                    id="ageGroupInput"
                                    name="age_group"
                                    required
                                >
                                    <option value="">
                                        اختر العمر
                                    </option>

                                    <option value="5-8">
                                        5 - 8 سنوات
                                    </option>

                                    <option value="8-12">
                                        8 - 12 سنة
                                    </option>

                                    <option value="12-15">
                                        12 - 15 سنة
                                    </option>
                                </select>

                                <small
                                    class="event-field-error"
                                    id="ageGroupError"
                                    aria-live="polite"
                                ></small>

                            </div>

                        </div>

                        {{-- الوصف --}}
                        <div class="edit-group">

                            <label for="descriptionInput">
                                وصف الفعالية *
                            </label>

                            <textarea
                                id="descriptionInput"
                                name="description"
                                required
                            ></textarea>

                            <small
                                class="event-field-error"
                                id="descriptionError"
                                aria-live="polite"
                            ></small>

                        </div>

                    </section>

                    {{-- =========================================
                         Date, Time and Location
                    ========================================== --}}
                    <section class="edit-form-card">

                        <div class="form-section-title">

                            <span>
                                <i class="bi bi-geo-alt-fill"></i>
                            </span>

                            <h2>التاريخ والوقت والمكان</h2>

                        </div>

                        <div class="edit-grid three">

                            {{-- التاريخ --}}
                            <div class="edit-group">

                                <label for="eventDateInput">
                                    تاريخ الفعالية *
                                </label>

                                <input
                                    type="date"
                                    id="eventDateInput"
                                    name="event_date"
                                    required
                                >

                                <small
                                    class="event-field-error"
                                    id="eventDateError"
                                    aria-live="polite"
                                ></small>

                            </div>

                            {{-- البداية --}}
                            <div class="edit-group">

                                <label for="startTimeInput">
                                    وقت البداية *
                                </label>

                                <input
                                    type="time"
                                    id="startTimeInput"
                                    name="start_time"
                                    required
                                >

                                <small
                                    class="event-field-error"
                                    id="startTimeError"
                                    aria-live="polite"
                                ></small>

                            </div>

                            {{-- النهاية --}}
                            <div class="edit-group">

                                <label for="endTimeInput">
                                    وقت النهاية *
                                </label>

                                <input
                                    type="time"
                                    id="endTimeInput"
                                    name="end_time"
                                    required
                                >

                                <small
                                    class="event-field-error"
                                    id="endTimeError"
                                    aria-live="polite"
                                ></small>

                            </div>

                        </div>

                        <div class="edit-grid two">

                            {{-- المكان --}}
                            <div class="edit-group">

                                <label for="locationInput">
                                    المكان *
                                </label>

                                <input
                                    type="text"
                                    id="locationInput"
                                    name="location"
                                    maxlength="255"
                                    required
                                >

                                <small
                                    class="event-field-error"
                                    id="locationError"
                                    aria-live="polite"
                                ></small>

                            </div>

                            {{-- العنوان التفصيلي --}}
                            <div class="edit-group">

                                <label for="addressInput">
                                    العنوان التفصيلي
                                </label>

                                <input
                                    type="text"
                                    id="addressInput"
                                    name="address"
                                    maxlength="255"
                                >

                                <small
                                    class="event-field-error"
                                    id="addressError"
                                    aria-live="polite"
                                ></small>

                            </div>

                        </div>

                    </section>

                    {{-- =========================================
                         Participation
                    ========================================== --}}
                    <section class="edit-form-card">

                        <div class="form-section-title">

                            <span>
                                <i class="bi bi-people-fill"></i>
                            </span>

                            <h2>الفئة المستهدفة والمشاركة</h2>

                        </div>

                        <div class="edit-grid two">

                            {{-- عدد المشاركين --}}
                            <div class="edit-group">

                                <label for="capacityInput">
                                    عدد المشاركين *
                                </label>

                                <input
                                    type="number"
                                    id="capacityInput"
                                    name="capacity"
                                    min="1"
                                    required
                                >

                                <small
                                    class="event-field-error"
                                    id="capacityError"
                                    aria-live="polite"
                                ></small>

                            </div>

                            {{-- حالة الفعالية --}}
                            <div class="edit-group">

                                <label for="statusInput">
                                    حالة الإرسال
                                </label>

                                <select
                                    id="statusInput"
                                    name="status"
                                >
                                    <option value="pending">
                                        إرسال للمراجعة
                                    </option>

                                    <option value="draft">
                                        حفظ كمسودة
                                    </option>
                                </select>

                                <small
                                    class="event-field-error"
                                    id="statusError"
                                    aria-live="polite"
                                ></small>

                            </div>

                        </div>

                        {{-- المتطلبات --}}
                        <div class="edit-group">

                            <label for="requirementsInput">
                                المتطلبات أو الملاحظات
                            </label>

                            <textarea
                                id="requirementsInput"
                                name="requirements"
                            ></textarea>

                            <small
                                class="event-field-error"
                                id="requirementsError"
                                aria-live="polite"
                            ></small>

                        </div>

                    </section>

                    {{-- =========================================
                         Image
                    ========================================== --}}
                    <section class="edit-form-card">

                        <div class="form-section-title">

                            <span>
                                <i class="bi bi-image-fill"></i>
                            </span>

                            <h2>صورة الفعالية</h2>

                        </div>

                        <div class="edit-upload-area">

                            <div
                                class="current-image"
                                id="currentImageBox"
                            >
                                <img
                                    src="{{ asset('images/default-event.png') }}"
                                    alt="صورة الفعالية الحالية"
                                    id="currentImage"
                                >
                            </div>

                            <label
                                class="change-image-box"
                                for="editEventImageInput"
                            >
                                <i class="bi bi-cloud-arrow-up-fill"></i>

                                <strong>
                                    تغيير صورة الفعالية
                                </strong>

                                <p>
                                    JPG أو PNG أو WEBP بحد أقصى 2MB
                                </p>
                            </label>

                            <input
                                type="file"
                                id="editEventImageInput"
                                name="image"
                                accept="image/png,image/jpeg,image/webp"
                                hidden
                            >

                        </div>

                        <small
                            class="event-field-error"
                            id="imageError"
                            aria-live="polite"
                        ></small>

                    </section>

                    {{-- =========================================
                         Actions
                    ========================================== --}}
                    <section class="edit-actions">

                        <a
                            href="{{ url('/organizer/events') }}"
                            class="cancel-edit-btn"
                        >
                            إلغاء
                        </a>

                        <button
                            type="submit"
                            class="save-edit-btn"
                            id="saveEditButton"
                        >
                            <span class="save-edit-text">
                                حفظ التعديلات
                            </span>

                            <span
                                class="spinner-border spinner-border-sm d-none"
                                id="saveEditSpinner"
                                aria-hidden="true"
                            ></span>
                        </button>

                    </section>

                </form>

            </section>

        </div>

        {{-- يظهر عند فشل تحميل الفعالية --}}
        <section
            class="edit-event-error d-none"
            id="editEventError"
        >
            <i class="bi bi-exclamation-circle"></i>

            <h2>تعذر تحميل الفعالية</h2>

            <p id="editEventErrorMessage">
                قد تكون الفعالية غير موجودة أو لا تملك صلاحية تعديلها.
            </p>

            <a href="{{ url('/organizer/events') }}">
                الرجوع إلى فعالياتي
            </a>
        </section>

    </main>

</div>

{{-- =========================================================
     Delete Confirmation Modal
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
                    هل أنت متأكد من حذف هذه الفعالية؟
                </p>

                <strong id="deleteModalEventTitle">
                    الفعالية
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
                    id="confirmDeleteButton"
                >
                    <span class="delete-confirm-text">
                        حذف
                    </span>

                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="deleteSpinner"
                        aria-hidden="true"
                    ></span>
                </button>

            </div>

        </div>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>

</body>