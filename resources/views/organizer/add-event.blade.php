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

    <title>إضافة فعالية جديدة - فرحة</title>


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
          'resources/js/dashboard-common.js',
        'resources/css/add-event.css',
        'resources/js/add-event.js',
    ])

</head>


<body>


<div
    class="app"
    id="addEventPage"

    data-store-url="{{ url('/api/events') }}"

    data-categories-url="{{ url('/api/categories') }}"

    data-dashboard-url="{{ url('/organizer/dashboard') }}"

    data-events-page-url="{{ url('/organizer/events') }}"

    data-logout-url="{{ url('/api/logout') }}"

    data-login-url="{{ url('/login') }}"
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
                class="menu-link active"
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

    <main class="content add-event-content">


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
                    إضافة فعالية
                </span>

            </div>


        </header>



        {{-- =================================================
             PAGE HEADER BOX
        ================================================== --}}

        <section class="add-event-head">


            <div class="add-head-info">


                <div class="add-head-icon">

                    <i class="bi bi-plus-circle"></i>

                </div>


                <div>

                    <h1>
                        إضافة فعالية جديدة
                    </h1>


                    <p>
                        قم بتعبئة البيانات التالية لإرسال
                        الفعالية للمراجعة قبل نشرها.
                    </p>

                </div>


            </div>



            <a
                href="{{ url('/organizer/events') }}"
                class="back-btn"
            >

                <i class="bi bi-arrow-right"></i>

                الرجوع إلى فعالياتي

            </a>


        </section>



        {{-- =================================================
             PAGE LAYOUT
        ================================================== --}}

        <section class="add-event-layout">


            {{-- =================================================
                 HELP PANEL
            ================================================== --}}

            <aside class="event-help-panel">


                <h3>
                    نصائح لإضافة فعالية ناجحة
                </h3>


                <div class="help-item">

                    <span>
                        1
                    </span>

                    <p>
                        اكتب عنوانًا واضحًا ومختصرًا يوضح فكرة الفعالية.
                    </p>

                </div>


                <div class="help-item">

                    <span>
                        2
                    </span>

                    <p>
                        أضف وصفًا بسيطًا يشرح النشاط وما سيستفيد منه الأطفال.
                    </p>

                </div>


                <div class="help-item">

                    <span>
                        3
                    </span>

                    <p>
                        تأكد من صحة التاريخ والوقت والمكان قبل الإرسال.
                    </p>

                </div>


                <div class="help-item">

                    <span>
                        4
                    </span>

                    <p>
                        اختر صورة مناسبة وواضحة تعبّر عن الفعالية.
                    </p>

                </div>


            </aside>



            {{-- =================================================
                 EVENT FORM
            ================================================== --}}

            <form
                class="event-form"
                id="addEventForm"
                enctype="multipart/form-data"
                novalidate
            >

                @csrf



                {{-- =================================================
                     BASIC INFORMATION
                ================================================== --}}

                <section class="form-card">


                    <div class="form-section-title">

                        <span>
                            <i class="bi bi-info-circle-fill"></i>
                        </span>

                        <h2>
                            معلومات الفعالية الأساسية
                        </h2>

                    </div>



                    {{-- اسم الفعالية --}}

                    <div class="form-group">

                        <label for="titleInput">
                            اسم الفعالية *
                        </label>

                        <input
                            id="titleInput"
                            name="title"
                            type="text"
                            placeholder="مثال: بطولة كرة قدم للأطفال"
                            maxlength="255"
                            required
                        >

                        <small
                            class="event-field-error"
                            id="titleError"
                            aria-live="polite"
                        ></small>

                    </div>



                    <div class="form-grid two">


                        {{-- الفئة --}}

                        <div class="form-group">

                            <label for="categoryInput">
                                الفئة *
                            </label>

                            <select
                                id="categoryInput"
                                name="category_id"
                                required
                            >

                                <option value="">
                                    اختر الفئة
                                </option>

                                <option value="1">
                                    رياضية
                                </option>

                                <option value="2">
                                    فنية
                                </option>

                                <option value="3">
                                    ترفيهية
                                </option>

                                <option value="4">
                                    تعليمية
                                </option>

                            </select>

                            <small
                                class="event-field-error"
                                id="categoryError"
                                aria-live="polite"
                            ></small>

                        </div>



                        {{-- نوع الفعالية --}}

                        <div class="form-group">

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


                    </div>



                    {{-- الوصف --}}

                    <div class="form-group">

                        <label for="descriptionInput">
                            وصف الفعالية *
                        </label>

                        <textarea
                            id="descriptionInput"
                            name="description"
                            placeholder="اكتب وصفًا واضحًا للفعالية وما سيتم تقديمه للأطفال..."
                            required
                        ></textarea>

                        <small
                            class="event-field-error"
                            id="descriptionError"
                            aria-live="polite"
                        ></small>

                    </div>


                </section>



                {{-- =================================================
                     DATE / TIME / LOCATION
                ================================================== --}}

                <section class="form-card">


                    <div class="form-section-title">

                        <span>
                            <i class="bi bi-geo-alt-fill"></i>
                        </span>

                        <h2>
                            التاريخ والوقت والمكان
                        </h2>

                    </div>



                    <div class="form-grid three">


                        {{-- التاريخ --}}

                        <div class="form-group">

                            <label for="eventDateInput">
                                تاريخ الفعالية *
                            </label>

                            <input
                                id="eventDateInput"
                                name="event_date"
                                type="date"
                                required
                            >

                            <small
                                class="event-field-error"
                                id="eventDateError"
                                aria-live="polite"
                            ></small>

                        </div>



                        {{-- البداية --}}

                        <div class="form-group">

                            <label for="startTimeInput">
                                وقت البداية *
                            </label>

                            <input
                                id="startTimeInput"
                                name="start_time"
                                type="time"
                                required
                            >

                            <small
                                class="event-field-error"
                                id="startTimeError"
                                aria-live="polite"
                            ></small>

                        </div>



                        {{-- النهاية --}}

                        <div class="form-group">

                            <label for="endTimeInput">
                                وقت النهاية *
                            </label>

                            <input
                                id="endTimeInput"
                                name="end_time"
                                type="time"
                                required
                            >

                            <small
                                class="event-field-error"
                                id="endTimeError"
                                aria-live="polite"
                            ></small>

                        </div>


                    </div>



                    <div class="form-grid two">


                        {{-- المكان --}}

                        <div class="form-group">

                            <label for="locationInput">
                                المكان *
                            </label>

                            <input
                                id="locationInput"
                                name="location"
                                type="text"
                                placeholder="مثال: ملعب المدرسة"
                                maxlength="255"
                                required
                            >

                            <small
                                class="event-field-error"
                                id="locationError"
                                aria-live="polite"
                            ></small>

                        </div>



                        {{-- العنوان --}}

                        <div class="form-group">

                            <label for="addressInput">
                                العنوان التفصيلي
                            </label>

                            <input
                                id="addressInput"
                                name="address"
                                type="text"
                                placeholder="غزة - الرمال - شارع..."
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



                {{-- =================================================
                     TARGET AUDIENCE
                ================================================== --}}

                <section class="form-card">


                    <div class="form-section-title">

                        <span>
                            <i class="bi bi-people-fill"></i>
                        </span>

                        <h2>
                            الفئة المستهدفة والمشاركة
                        </h2>

                    </div>



                    <div class="form-grid two">


                        {{-- العمر --}}

                        <div class="form-group">

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



                        {{-- السعة --}}

                        <div class="form-group">

                            <label for="capacityInput">
                                عدد المشاركين *
                            </label>

                            <input
                                id="capacityInput"
                                name="capacity"
                                type="number"
                                min="1"
                                placeholder="50"
                                required
                            >

                            <small
                                class="event-field-error"
                                id="capacityError"
                                aria-live="polite"
                            ></small>

                        </div>


                    </div>



                    {{-- المتطلبات --}}

                    <div class="form-group">

                        <label for="requirementsInput">
                            المتطلبات أو الملاحظات
                        </label>

                        <textarea
                            id="requirementsInput"
                            name="requirements"
                            placeholder="اكتب أي متطلبات خاصة أو ملاحظات للمشاركين..."
                        ></textarea>

                        <small
                            class="event-field-error"
                            id="requirementsError"
                            aria-live="polite"
                        ></small>

                    </div>


                </section>



                {{-- =================================================
                     EVENT IMAGE
                ================================================== --}}

                <section class="form-card">


                    <div class="form-section-title">

                        <span>
                            <i class="bi bi-image-fill"></i>
                        </span>

                        <h2>
                            صورة الفعالية
                        </h2>

                    </div>



                    <div class="upload-area">


                        {{-- Preview --}}

                        <div
                            class="image-preview-box"
                            id="imagePreviewBox"
                        >

                            <i class="bi bi-image"></i>

                            <p>
                                معاينة الصورة
                            </p>

                        </div>



                        {{-- Upload --}}

                        <label
                            class="upload-box"
                            for="eventImageInput"
                        >

                            <i class="bi bi-cloud-arrow-up-fill"></i>

                            <strong>
                                اسحب الصورة هنا أو اختر من جهازك
                            </strong>

                            <p>
                                JPG أو PNG أو WEBP بحد أقصى 2MB
                            </p>

                        </label>



                        <input
                            id="eventImageInput"
                            name="image"
                            type="file"
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



                {{-- =================================================
                     ACTIONS
                ================================================== --}}

                <section class="form-actions">


                    <button
                        type="button"
                        class="draft-btn"
                        id="saveDraftButton"
                    >

                        <i class="bi bi-file-earmark"></i>

                        حفظ كمسودة

                    </button>



                    <button
                        type="submit"
                        class="submit-event-btn"
                        id="submitEventButton"
                    >

                        <i class="bi bi-send"></i>

                        <span class="submit-event-text">
                            إضافة الفعالية
                        </span>

                        <span
                            class="spinner-border spinner-border-sm d-none"
                            id="submitEventSpinner"
                            aria-hidden="true"
                        ></span>

                    </button>


                </section>


            </form>


        </section>


    </main>


</div>



<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>