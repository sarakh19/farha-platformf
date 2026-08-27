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
        إدارة التصنيفات - فرحة
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
        'resources/css/categories.css',
        'resources/js/categories.js'
    ])

</head>


<body>


<div
    class="app"
    id="adminCategoriesPage"

    data-categories-url="{{ url('/api/categories') }}"

    data-category-api-base-url="{{ url('/api/categories') }}"

    data-me-url="{{ url('/api/me') }}"

    data-home-url="{{ url('/home') }}"

    data-dashboard-page-url="{{ url('/admin/dashboard') }}"

    data-events-page-url="{{ url('/admin/events') }}"

    data-users-page-url="{{ url('/admin/users') }}"

    data-categories-page-url="{{ url('/admin/categories') }}"

    data-registrations-page-url="{{ url('/admin/registrations') }}"

    data-login-url="{{ url('/login') }}"

    data-logout-url="{{ url('/api/logout') }}"
>


    {{-- =====================================================
         SIDEBAR
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
                class="menu-link"
            >

                <i class="bi bi-calendar-event"></i>

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
                class="menu-link active"
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
         CONTENT
    ====================================================== --}}

    <main class="content categories-content">


        <button
            type="button"
            class="menu-toggle d-lg-none"
            aria-label="فتح القائمة"
        >

            <i class="bi bi-list"></i>

        </button>


        {{-- =================================================
             TOPBAR
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


                <span>
                    ›
                </span>


                <a href="{{ url('/admin/dashboard') }}">

                    لوحة التحكم

                </a>


                <span>
                    ›
                </span>


                <a
                    href="{{ url('/admin/categories') }}"
                    class="active"
                >

                    التصنيفات

                </a>


            </div>


        </header>


        {{-- =================================================
             PAGE HEADER
        ================================================== --}}

        <section class="categories-head">


            <div class="categories-title-wrap">


                <div class="title-icon">

                    <i class="bi bi-tags-fill"></i>

                </div>


                <div>


                    <h1>
                        إدارة التصنيفات
                    </h1>


                    <p>
                        إضافة وتعديل وحذف تصنيفات الفعاليات
                    </p>


                </div>


            </div>


            <button
                type="button"
                class="primary-action"
                id="openAddCategory"
                data-bs-toggle="modal"
                data-bs-target="#categoryModal"
            >

                <i class="bi bi-plus-circle-fill"></i>

                إضافة تصنيف جديد

            </button>


        </section>


        {{-- =================================================
             QUICK SUMMARY
        ================================================== --}}

        <section class="categories-summary">


            <div class="category-summary-card">


                <div class="summary-icon categories-icon">

                    <i class="bi bi-tags-fill"></i>

                </div>


                <div>

                    <span>
                        إجمالي التصنيفات
                    </span>

                    <strong id="totalCategoriesCount">
                        0
                    </strong>

                </div>


            </div>


            <div class="category-summary-card">


                <div class="summary-icon events-icon">

                    <i class="bi bi-calendar-event-fill"></i>

                </div>


                <div>

                    <span>
                        الفعاليات المصنفة
                    </span>

                    <strong id="totalCategoryEventsCount">
                        0
                    </strong>

                </div>


            </div>


        </section>


        {{-- =================================================
             SEARCH
        ================================================== --}}

        <section class="categories-filter-box">


            <div class="categories-search">


                <i class="bi bi-search"></i>


                <input
                    type="text"
                    id="categorySearch"
                    placeholder="ابحث عن تصنيف أو وصف..."
                    autocomplete="off"
                >


                <button
                    type="button"
                    class="category-search-reset d-none"
                    id="resetCategorySearch"
                    aria-label="مسح البحث"
                >

                    <i class="bi bi-x-lg"></i>

                </button>


            </div>


        </section>


        {{-- =================================================
             LOADING
        ================================================== --}}

        <section
            class="categories-loading"
            id="categoriesLoading"
        >


            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>


            <span>
                جاري تحميل التصنيفات...
            </span>


        </section>


        {{-- =================================================
             TABLE
        ================================================== --}}

        <section class="categories-table">


            <div class="categories-table-head">


                <span>
                    #
                </span>


                <span>
                    الاسم
                </span>


                <span>
                    الوصف
                </span>


                <span>
                    عدد الفعاليات
                </span>


                <span>
                    الإجراءات
                </span>


            </div>


            <div id="categoriesContainer"></div>


        </section>


        {{-- =================================================
             EMPTY STATE
        ================================================== --}}

        <section
            class="categories-empty d-none"
            id="categoriesEmptyState"
        >


            <div class="categories-empty-icon">

                <i class="bi bi-tags"></i>

            </div>


            <h3>
                لا توجد تصنيفات
            </h3>


            <p>
                لا توجد تصنيفات مطابقة لعملية البحث الحالية.
            </p>


        </section>


        {{-- =================================================
             ERROR
        ================================================== --}}

        <section
            class="categories-error d-none"
            id="categoriesErrorState"
        >


            <i class="bi bi-exclamation-circle"></i>


            <h3>
                تعذر تحميل التصنيفات
            </h3>


            <p id="categoriesErrorMessage">

                حدث خطأ أثناء تحميل التصنيفات.

            </p>


            <button
                type="button"
                id="retryCategoriesButton"
            >

                إعادة المحاولة

            </button>


        </section>


        {{-- =================================================
             PAGINATION
        ================================================== --}}

        <section
            class="events-pagination d-none"
            id="categoriesPagination"
        >


            <button
                type="button"
                id="previousCategoryPage"
                disabled
            >

                <i class="bi bi-chevron-right"></i>

                السابق

            </button>


            <div
                id="categoryPaginationPages"
                class="pagination-pages"
            ></div>


            <button
                type="button"
                id="nextCategoryPage"
                disabled
            >

                التالي

                <i class="bi bi-chevron-left"></i>

            </button>


        </section>


    </main>


</div>


{{-- =========================================================
     ADD / EDIT MODAL
========================================================= --}}

<div
    class="modal fade"
    id="categoryModal"
    tabindex="-1"
    aria-labelledby="categoryModalLabel"
    aria-hidden="true"
>


    <div class="modal-dialog modal-dialog-centered">


        <div class="modal-content category-modal-content">


            <div class="modal-header">


                <div class="category-modal-title-wrap">


                    <div class="category-modal-icon">

                        <i class="bi bi-tag-fill"></i>

                    </div>


                    <h5
                        class="modal-title"
                        id="categoryModalLabel"
                    >

                        إضافة تصنيف جديد

                    </h5>


                </div>


                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="إغلاق"
                ></button>


            </div>


            <div class="modal-body">


                <form
                    id="categoryForm"
                    novalidate
                >

                    @csrf


                    <input
                        type="hidden"
                        id="categoryId"
                    >


                    <div class="cat-field">


                        <label for="categoryName">

                            اسم التصنيف *

                        </label>


                        <input
                            type="text"
                            id="categoryName"
                            name="name"
                            placeholder="مثال: رياضية"
                            maxlength="255"
                            required
                        >


                        <small
                            class="category-field-error"
                            id="categoryNameError"
                            aria-live="polite"
                        ></small>


                    </div>


                    <div class="cat-field">


                        <label for="categoryDesc">

                            الوصف

                        </label>


                        <textarea
                            id="categoryDesc"
                            name="description"
                            placeholder="اكتب وصفًا مختصرًا للتصنيف..."
                        ></textarea>


                        <small
                            class="category-field-error"
                            id="categoryDescError"
                            aria-live="polite"
                        ></small>


                    </div>


                </form>


            </div>


            <div class="modal-footer">


                <button
                    type="button"
                    class="btn-cancel"
                    data-bs-dismiss="modal"
                >

                    إلغاء

                </button>


                <button
                    type="button"
                    class="btn-save"
                    id="saveCategoryBtn"
                >


                    <span class="save-category-text">

                        حفظ

                    </span>


                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="saveCategorySpinner"
                        aria-hidden="true"
                    ></span>


                </button>


            </div>


        </div>


    </div>


</div>


{{-- =========================================================
     DELETE MODAL
========================================================= --}}

<div
    class="modal fade"
    id="deleteCategoryModal"
    tabindex="-1"
    aria-labelledby="deleteCategoryModalLabel"
    aria-hidden="true"
>


    <div class="modal-dialog modal-dialog-centered">


        <div class="modal-content category-modal-content">


            <div class="modal-header">


                <div class="category-modal-title-wrap">


                    <div class="category-modal-icon delete">

                        <i class="bi bi-trash-fill"></i>

                    </div>


                    <h5
                        class="modal-title"
                        id="deleteCategoryModalLabel"
                    >

                        حذف التصنيف

                    </h5>


                </div>


                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="إغلاق"
                ></button>


            </div>


            <div class="modal-body">


                <p>
                    هل أنت متأكد من حذف التصنيف:
                </p>


                <strong id="deleteCategoryName">

                    التصنيف

                </strong>


                <p class="delete-warning">

                    <i class="bi bi-exclamation-triangle-fill"></i>

                    لا يمكن حذف التصنيف إذا كان مرتبطًا بفعاليات.

                </p>


            </div>


            <div class="modal-footer">


                <button
                    type="button"
                    class="btn-cancel"
                    data-bs-dismiss="modal"
                >

                    إلغاء

                </button>


                <button
                    type="button"
                    class="btn-delete-category"
                    id="confirmDeleteCategoryButton"
                >


                    <span class="delete-category-text">

                        حذف التصنيف

                    </span>


                    <span
                        class="spinner-border spinner-border-sm d-none"
                        id="deleteCategorySpinner"
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