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

    <title>الإعدادات - فرحة</title>


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
        'resources/css/settings.css',
        'resources/js/dashboard-common.js',
        'resources/js/settings.js',
    ])

</head>


<body>


<div
    class="app"
    id="organizerSettingsPage"

    data-profile-url="{{ url('/api/profile') }}"

    data-password-url="{{ url('/api/profile/password') }}"

    data-email-preferences-url="{{ url('/api/organizer/email-preferences') }}"

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
                class="menu-link active"
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



    {{-- =====================================================
         MAIN CONTENT
    ====================================================== --}}

    <main class="content organizer-settings-content">


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

                <a href="{{ url('/organizer/dashboard') }}">
                    لوحة التحكم
                </a>

                <span class="breadcrumb-separator">›</span>

                <span class="current">
                    الإعدادات
                </span>

            </div>


        </header>



        {{-- =================================================
             HEADER BOX
        ================================================== --}}

        <section class="settings-head">


            <div class="settings-head-info">


                <div class="settings-head-icon">
                    <i class="bi bi-gear"></i>
                </div>


                <div>

                    <h1>
                        الإعدادات
                    </h1>

                    <p>
                        إدارة معلوماتك الشخصية وكلمة المرور
                        وتفضيلات حساب المنظم.
                    </p>

                </div>


            </div>


            <button
                type="button"
                class="settings-main-save"
                id="saveProfileButton"
            >
                <i class="bi bi-check2"></i>

                حفظ التغييرات
            </button>


        </section>



        {{-- =================================================
             LOADING
        ================================================== --}}

        <div
            class="settings-loading"
            id="settingsLoading"
        >
            <span class="spinner-border spinner-border-sm"></span>

            جاري تحميل بيانات الحساب...
        </div>



        {{-- =================================================
             SETTINGS
        ================================================== --}}

        <section
            class="settings-grid d-none"
            id="settingsContent"
        >


            {{-- =============================================
                 PERSONAL INFORMATION
            ============================================== --}}

            <article class="settings-card">


                <div class="settings-card-head">


                    <div class="settings-card-icon">
                        <i class="bi bi-person"></i>
                    </div>


                    <div>

                        <h2>
                            المعلومات الشخصية
                        </h2>

                        <p>
                            تحديث بيانات حساب المنظم
                        </p>

                    </div>


                </div>



                <form
                    id="profileSettingsForm"
                    novalidate
                >


                    <div class="settings-form-grid">


                        <div class="settings-form-group">

                            <label for="settingsName">
                                الاسم الكامل
                            </label>

                            <input
                                type="text"
                                id="settingsName"
                                name="name"
                                placeholder="الاسم الكامل"
                            >

                            <small
                                class="settings-field-error"
                                id="settingsNameError"
                            ></small>

                        </div>



                        <div class="settings-form-group">

                            <label for="settingsEmail">
                                البريد الإلكتروني
                            </label>

                            <input
                                type="email"
                                id="settingsEmail"
                                name="email"
                                placeholder="example@email.com"
                            >

                            <small
                                class="settings-field-error"
                                id="settingsEmailError"
                            ></small>

                        </div>



                        <div class="settings-form-group">

                            <label for="settingsPhone">
                                رقم الهاتف
                            </label>

                            <input
                                type="text"
                                id="settingsPhone"
                                name="phone"
                                placeholder="رقم الهاتف"
                            >

                            <small
                                class="settings-field-error"
                                id="settingsPhoneError"
                            ></small>

                        </div>



                        <div class="settings-form-group">

                            <label for="settingsCity">
                                المدينة / المحافظة
                            </label>

                            <input
                                type="text"
                                id="settingsCity"
                                name="city"
                                placeholder="مثال: غزة"
                            >

                            <small
                                class="settings-field-error"
                                id="settingsCityError"
                            ></small>

                        </div>


                    </div>


                </form>


            </article>



            {{-- =============================================
                 PASSWORD
            ============================================== --}}

            <article class="settings-card">


                <div class="settings-card-head">


                    <div class="settings-card-icon password">
                        <i class="bi bi-shield-lock"></i>
                    </div>


                    <div>

                        <h2>
                            تغيير كلمة المرور
                        </h2>

                        <p>
                            استخدم كلمة مرور قوية لحماية حسابك
                        </p>

                    </div>


                </div>



                <form
                    id="passwordSettingsForm"
                    novalidate
                >


                    <div class="settings-password-fields">


                        <div class="settings-form-group password-group">

                            <label for="currentPassword">
                                كلمة المرور الحالية
                            </label>

                            <div class="password-input-wrap">

                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="current_password"
                                    autocomplete="current-password"
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    data-target="currentPassword"
                                >
                                    <i class="bi bi-eye-slash"></i>
                                </button>

                            </div>

                        </div>



                        <div class="settings-form-group password-group">

                            <label for="newPassword">
                                كلمة المرور الجديدة
                            </label>

                            <div class="password-input-wrap">

                                <input
                                    type="password"
                                    id="newPassword"
                                    name="password"
                                    autocomplete="new-password"
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    data-target="newPassword"
                                >
                                    <i class="bi bi-eye-slash"></i>
                                </button>

                            </div>

                        </div>



                        <div class="settings-form-group password-group">

                            <label for="confirmPassword">
                                تأكيد كلمة المرور الجديدة
                            </label>

                            <div class="password-input-wrap">

                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="password_confirmation"
                                    autocomplete="new-password"
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    data-target="confirmPassword"
                                >
                                    <i class="bi bi-eye-slash"></i>
                                </button>

                            </div>

                        </div>


                    </div>



                    <button
                        type="submit"
                        class="settings-password-submit"
                        id="updatePasswordButton"
                    >
                        <i class="bi bi-shield-check"></i>

                        تحديث كلمة المرور
                    </button>


                </form>


            </article>



            {{-- =============================================
                 EMAIL PREFERENCES
            ============================================== --}}

            <article class="settings-card settings-card-full">


                <div class="settings-card-head">


                    <div class="settings-card-icon notifications">
                        <i class="bi bi-envelope"></i>
                    </div>


                    <div>

                        <h2>
                            إشعارات البريد الإلكتروني
                        </h2>

                        <p>
                            اختر أنواع الإشعارات التي ترغب باستلامها
                        </p>

                    </div>


                </div>



                <div class="email-preferences-list">


                    <label class="preference-item">

                        <div class="preference-info">

                            <div class="preference-icon">
                                <i class="bi bi-calendar-check"></i>
                            </div>

                            <div>

                                <strong>
                                    تحديثات حالة الفعالية
                                </strong>

                                <small>
                                    استلم بريداً عند قبول أو رفض فعالياتك
                                </small>

                            </div>

                        </div>


                        <input
                            type="checkbox"
                            id="emailNewEvents"
                        >

                        <span class="preference-switch"></span>

                    </label>



                    <label class="preference-item">

                        <div class="preference-info">

                            <div class="preference-icon">
                                <i class="bi bi-alarm"></i>
                            </div>

                            <div>

                                <strong>
                                    تذكير قبل الفعالية
                                </strong>

                                <small>
                                    استلم تذكيراً عبر البريد قبل موعد فعاليتك
                                </small>

                            </div>

                        </div>


                        <input
                            type="checkbox"
                            id="emailEventReminder"
                        >

                        <span class="preference-switch"></span>

                    </label>



                    <label class="preference-item">

                        <div class="preference-info">

                            <div class="preference-icon">
                                <i class="bi bi-person-plus"></i>
                            </div>

                            <div>

                                <strong>
                                    تحديثات التسجيلات
                                </strong>

                                <small>
                                    استلم بريداً عند وصول طلب تسجيل جديد إلى فعالياتك
                                </small>

                            </div>

                        </div>


                        <input
                            type="checkbox"
                            id="emailRegistrationUpdates"
                        >

                        <span class="preference-switch"></span>

                    </label>


                </div>



                <div class="preferences-footer">

                    <p>
                        يتم حفظ هذه التفضيلات على حسابك ويمكن تعديلها في أي وقت.
                    </p>


                    <button
                        type="button"
                        class="preferences-save-btn"
                        id="saveEmailPreferencesButton"
                    >
                        <i class="bi bi-check2"></i>

                        حفظ تفضيلات البريد
                    </button>


                </div>


            </article>


        </section>


    </main>


</div>



<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>


</body>

</html>