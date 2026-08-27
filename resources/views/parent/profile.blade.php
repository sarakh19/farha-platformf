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

    <title>الملف الشخصي - فرحة</title>

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
        'resources/css/profile.css',
        'resources/js/profile.js'
    ])
</head>

<body class="profile-page-final">

<div
    id="parentProfilePage"

    data-profile-url="{{ url('/api/profile') }}"
    data-children-url="{{ url('/api/children') }}"
    data-password-url="{{ url('/api/profile/password') }}"
    data-logout-url="{{ url('/api/logout') }}"

    data-home-url="{{ url('/home') }}"
    data-events-url="{{ url('/events') }}"
    data-my-events-url="{{ url('/parent/my-events') }}"
    data-notifications-url="{{ url('/parent/notifications') }}"
    data-profile-page-url="{{ url('/parent/profile') }}"
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
                class="pf-menu-link active"
            >
                <i class="bi bi-person-circle"></i>
                <span>ملفي الشخصي</span>
            </a>

            <a
                href="{{ url('/parent/my-events') }}"
                class="pf-menu-link"
            >
                <i class="bi bi-calendar-check"></i>
                <span>فعالياتي</span>
            </a>

            <a
                href="{{ url('/parent/notifications') }}"
                class="pf-menu-link"
            >
                <i class="bi bi-bell"></i>
                <span>الإشعارات</span>
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


            {{-- الروابط العلوية --}}



            {{-- Loading --}}
            <div
                id="profileLoading"
                class="text-center py-4"
            >
                <span
                    class="spinner-border spinner-border-sm"
                ></span>

                جاري تحميل الملف الشخصي...
            </div>


            {{-- Error --}}
            <div
                id="profileError"
                class="alert alert-danger d-none"
            >

                <span id="profileErrorMessage">
                    تعذر تحميل الملف الشخصي.
                </span>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    id="retryProfileButton"
                >
                    إعادة المحاولة
                </button>

            </div>


            <div
                class="pf-layout d-none"
                id="profileContent"
            >


                {{-- =================================================
                     PROFILE CARD
                ================================================== --}}

                <aside class="pf-profile-card">

                    <div class="pf-profile-img-wrap">

                        <img
                            src="{{ asset('images.1/Margin.png') }}"
                            alt="الصورة الشخصية"
                            id="profileCardImage"
                        >

                        <button
                            type="button"
                            id="changeProfileImageButton"
                            aria-label="تغيير الصورة الشخصية"
                        >
                            <i class="bi bi-camera"></i>
                        </button>

                        <input
                            type="file"
                            id="profileImageInput"
                            accept="image/jpeg,image/png,image/webp"
                            hidden
                        >

                    </div>


                    <h3 id="profileCardName">
                        المستخدم
                    </h3>

                    <p>
                        ولي أمر
                    </p>

                    <span
                        class="pf-active-status"
                        id="profileActiveStatus"
                    >
                        <i class="bi bi-circle-fill"></i>
                        حساب نشط
                    </span>


                    <div class="pf-profile-tabs">

                        <a
                            href="#personalInformation"
                            class="active"
                        >
                            <i class="bi bi-person"></i>
                            المعلومات الشخصية
                        </a>

                        <a href="#children">
                            <i class="bi bi-people"></i>
                            أطفالي
                        </a>

                        <a href="#password">
                            <i class="bi bi-lock"></i>
                            تغيير كلمة المرور
                        </a>

                    </div>

                </aside>



                {{-- =================================================
                     LEFT
                ================================================== --}}

                <div class="pf-left-col">


                    {{-- =================================================
                         PERSONAL INFORMATION
                    ================================================== --}}

                    <section
                        class="pf-info-card"
                        id="personalInformation"
                    >

                        <div class="pf-card-title">

                            <span>
                                <i class="bi bi-person"></i>
                            </span>

                            <div>
                                <h1>
                                    الملف الشخصي
                                </h1>

                                <p>
                                    إدارة معلوماتك الشخصية
                                </p>
                            </div>

                        </div>


                        <form
                            class="pf-info-form"
                            id="profileForm"
                            enctype="multipart/form-data"
                            novalidate
                        >

                            <div class="pf-form-grid">


                                <div class="pf-field">

                                    <label for="profileName">
                                        الاسم الكامل
                                    </label>

                                    <input
                                        type="text"
                                        id="profileName"
                                        name="name"
                                        placeholder="الاسم الكامل"
                                        required
                                    >

                                    <small
                                        class="text-danger"
                                        id="profileNameError"
                                    ></small>

                                </div>


                                <div class="pf-field">

                                    <label for="profileEmail">
                                        البريد الإلكتروني
                                    </label>

                                    <input
                                        type="email"
                                        id="profileEmail"
                                        readonly
                                    >

                                </div>


                                <div class="pf-field">

                                    <label for="profilePhone">
                                        رقم الجوال
                                    </label>

                                    <input
                                        type="text"
                                        id="profilePhone"
                                        name="phone"
                                        placeholder="رقم الجوال"
                                    >

                                    <small
                                        class="text-danger"
                                        id="profilePhoneError"
                                    ></small>

                                </div>


                                <div class="pf-field">

                                    <label for="profileBirthDate">
                                        تاريخ الميلاد
                                    </label>

                                    <input
                                        type="date"
                                        id="profileBirthDate"
                                        name="birth_date"
                                    >

                                </div>


                                <div class="pf-field">

                                    <label for="profileGender">
                                        الجنس
                                    </label>

                                    <select
                                        id="profileGender"
                                        name="gender"
                                    >
                                        <option value="">
                                            اختر الجنس
                                        </option>

                                        <option value="male">
                                            ذكر
                                        </option>

                                        <option value="female">
                                            أنثى
                                        </option>
                                    </select>

                                </div>


                                <div class="pf-field">

                                    <label for="profileCity">
                                        المحافظة
                                    </label>

                                    <input
                                        type="text"
                                        id="profileCity"
                                        name="city"
                                        placeholder="المحافظة"
                                    >

                                    <small
                                        class="text-danger"
                                        id="profileCityError"
                                    ></small>

                                </div>


                                <div class="pf-field full">

                                    <label for="profileAddress">
                                        العنوان
                                    </label>

                                    <input
                                        type="text"
                                        id="profileAddress"
                                        name="address"
                                        placeholder="أدخل العنوان"
                                    >

                                </div>

                            </div>


                            <button
                                type="submit"
                                class="pf-save-btn"
                                id="saveProfileButton"
                            >

                                <i class="bi bi-save"></i>

                                <span id="saveProfileText">
                                    حفظ التغييرات
                                </span>

                                <span
                                    class="spinner-border spinner-border-sm d-none"
                                    id="saveProfileSpinner"
                                ></span>

                            </button>

                        </form>

                    </section>



                    {{-- =================================================
                         CHILDREN
                    ================================================== --}}

                    <section
                        class="pf-children-section"
                        id="children"
                    >


                        {{-- العنوان يمين والزر يسار --}}
                        <div class="pf-section-head">

                            <h2>
                                الأطفال المسجلين
                            </h2>

                            <button
                                type="button"
                                class="pf-add-child"
                                id="openAddChildButton"
                            >
                                <i class="bi bi-plus-lg"></i>
                                إضافة طفل جديد
                            </button>

                        </div>


                        {{-- Child form --}}
                        <form
                            class="pf-add-child-form"
                            id="childForm"
                            novalidate
                        >

                            <input
                                type="hidden"
                                id="childId"
                            >


                            <label>

                                <span>
                                    اسم الطفل
                                </span>

                                <input
                                    type="text"
                                    id="childName"
                                    required
                                >

                            </label>


                            <label>

                                <span>
                                    تاريخ الميلاد
                                </span>

                                <input
                                    type="date"
                                    id="childBirthDate"
                                >

                            </label>


                            <label>

                                <span>
                                    الجنس
                                </span>

                                <select id="childGender">

                                    <option value="">
                                        اختر
                                    </option>

                                    <option value="male">
                                        ذكر
                                    </option>

                                    <option value="female">
                                        أنثى
                                    </option>

                                </select>

                            </label>


                            <label class="pf-child-notes-field">

                                <span>
                                    ملاحظات
                                </span>

                                <input
                                    type="text"
                                    id="childNotes"
                                    placeholder="اختياري"
                                >

                            </label>


                            <div class="pf-child-form-actions">

                                <button
                                    type="submit"
                                    id="saveChildButton"
                                >
                                    حفظ
                                </button>

                                <button
                                    type="button"
                                    class="pf-child-cancel"
                                    id="cancelChildButton"
                                >
                                    إلغاء
                                </button>

                            </div>

                        </form>


                        <div
                            class="text-center py-3 d-none"
                            id="childrenLoading"
                        >
                            <span
                                class="spinner-border spinner-border-sm"
                            ></span>

                            جاري تحميل الأطفال...
                        </div>


                        <div
                            class="pf-children-grid"
                            id="childrenContainer"
                        ></div>


                        <div
                            class="pf-children-empty d-none"
                            id="childrenEmptyState"
                        >

                            <i class="bi bi-people"></i>

                            <p>
                                لا يوجد أطفال مسجلون بعد.
                            </p>

                        </div>

                    </section>



                    {{-- =================================================
                         PASSWORD
                    ================================================== --}}

                    <section
                        class="pf-password-card"
                        id="password"
                    >

                        <h2>
                            تغيير كلمة المرور
                        </h2>


                        <form
                            id="changePasswordForm"
                            novalidate
                        >

                            <div class="pf-password-grid">


                                <div class="pf-pass-field">

                                    <label for="currentPassword">
                                        كلمة المرور الحالية
                                    </label>

                                    <div>

                                        <input
                                            type="password"
                                            id="currentPassword"
                                            placeholder="أدخل كلمة المرور الحالية"
                                            required
                                        >

                                        <i class="bi bi-eye"></i>

                                    </div>

                                </div>


                                <div class="pf-pass-field">

                                    <label for="newPassword">
                                        كلمة المرور الجديدة
                                    </label>

                                    <div>

                                        <input
                                            type="password"
                                            id="newPassword"
                                            placeholder="أدخل كلمة المرور الجديدة"
                                            required
                                        >

                                        <i class="bi bi-eye"></i>

                                    </div>

                                </div>


                                <div class="pf-pass-field">

                                    <label for="newPasswordConfirmation">
                                        تأكيد كلمة المرور الجديدة
                                    </label>

                                    <div>

                                        <input
                                            type="password"
                                            id="newPasswordConfirmation"
                                            placeholder="أعد إدخال كلمة المرور"
                                            required
                                        >

                                        <i class="bi bi-eye"></i>

                                    </div>

                                </div>

                            </div>


                            <button
                                type="submit"
                                class="pf-password-btn"
                                id="changePasswordButton"
                            >
                                <i class="bi bi-lock"></i>

                                <span id="changePasswordText">
                                    تغيير كلمة المرور
                                </span>
                            </button>

                        </form>

                    </section>

                </div>

            </div>

        </section>

    </main>

</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>

</body>
</html>