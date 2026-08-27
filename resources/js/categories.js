import './dashboard-common.js';


document.addEventListener(
    'DOMContentLoaded',
    function () {

        const page =
            document.getElementById(
                'adminCategoriesPage'
            );


        if (!page) {
            return;
        }


        /* =========================================================
           URLs
        ========================================================= */

        const categoriesUrl =
            page.dataset.categoriesUrl;


        const categoryApiBaseUrl =
            page.dataset.categoryApiBaseUrl;


        const meUrl =
            page.dataset.meUrl;


        const loginUrl =
            page.dataset.loginUrl;


        const logoutUrl =
            page.dataset.logoutUrl;


        /* =========================================================
           Authentication
        ========================================================= */

        const token =
            localStorage.getItem(
                'farha_token'
            )
            ||
            sessionStorage.getItem(
                'farha_token'
            );


        const storedUser =
            localStorage.getItem(
                'farha_user'
            )
            ||
            sessionStorage.getItem(
                'farha_user'
            );


        let currentUser =
            null;


        try {

            currentUser =
                storedUser
                    ?
                    JSON.parse(
                        storedUser
                    )
                    :
                    null;

        } catch (error) {

            console.error(
                'Invalid stored user:',
                error
            );
        }


        if (!token) {

            window.location.href =
                loginUrl
                ||
                '/login';

            return;
        }


        if (
            currentUser
            &&
            currentUser.role !==
            'admin'
        ) {

            window.location.href =
                '/home';

            return;
        }


        /* =========================================================
           Elements
        ========================================================= */

        const adminName =
            document.getElementById(
                'adminName'
            );


        const adminAvatar =
            document.getElementById(
                'adminAvatar'
            );


        const adminAvatarFallback =
            document.getElementById(
                'adminAvatarFallback'
            );


        const sidebarLogoImage =
            document.getElementById(
                'sidebarLogoImage'
            );


        const sidebarLogoFallback =
            document.getElementById(
                'sidebarLogoFallback'
            );


        const searchInput =
            document.getElementById(
                'categorySearch'
            );


        const resetCategorySearch =
            document.getElementById(
                'resetCategorySearch'
            );


        const categoriesContainer =
            document.getElementById(
                'categoriesContainer'
            );


        const categoriesLoading =
            document.getElementById(
                'categoriesLoading'
            );


        const categoriesEmptyState =
            document.getElementById(
                'categoriesEmptyState'
            );


        const categoriesErrorState =
            document.getElementById(
                'categoriesErrorState'
            );


        const categoriesErrorMessage =
            document.getElementById(
                'categoriesErrorMessage'
            );


        const retryCategoriesButton =
            document.getElementById(
                'retryCategoriesButton'
            );


        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


        const totalCategoriesCount =
            document.getElementById(
                'totalCategoriesCount'
            );


        const totalCategoryEventsCount =
            document.getElementById(
                'totalCategoryEventsCount'
            );


        /* =========================================================
           Add / Edit Modal
        ========================================================= */

        const categoryModalElement =
            document.getElementById(
                'categoryModal'
            );


        const categoryModalLabel =
            document.getElementById(
                'categoryModalLabel'
            );


        const openAddCategory =
            document.getElementById(
                'openAddCategory'
            );


        const categoryForm =
            document.getElementById(
                'categoryForm'
            );


        const categoryIdInput =
            document.getElementById(
                'categoryId'
            );


        const categoryNameInput =
            document.getElementById(
                'categoryName'
            );


        const categoryDescInput =
            document.getElementById(
                'categoryDesc'
            );


        const categoryNameError =
            document.getElementById(
                'categoryNameError'
            );


        const categoryDescError =
            document.getElementById(
                'categoryDescError'
            );


        const saveCategoryBtn =
            document.getElementById(
                'saveCategoryBtn'
            );


        const saveCategoryText =
            saveCategoryBtn
                ?.querySelector(
                    '.save-category-text'
                );


        const saveCategorySpinner =
            document.getElementById(
                'saveCategorySpinner'
            );


        const categoryModal =
            categoryModalElement
            &&
            window.bootstrap
                ?
                new window.bootstrap.Modal(
                    categoryModalElement
                )
                :
                null;


        /* =========================================================
           Delete Modal
        ========================================================= */

        const deleteCategoryModalElement =
            document.getElementById(
                'deleteCategoryModal'
            );


        const deleteCategoryName =
            document.getElementById(
                'deleteCategoryName'
            );


        const confirmDeleteCategoryButton =
            document.getElementById(
                'confirmDeleteCategoryButton'
            );


        const deleteCategoryText =
            confirmDeleteCategoryButton
                ?.querySelector(
                    '.delete-category-text'
                );


        const deleteCategorySpinner =
            document.getElementById(
                'deleteCategorySpinner'
            );


        const deleteCategoryModal =
            deleteCategoryModalElement
            &&
            window.bootstrap
                ?
                new window.bootstrap.Modal(
                    deleteCategoryModalElement
                )
                :
                null;


        /* =========================================================
           Pagination
        ========================================================= */

        const categoriesPagination =
            document.getElementById(
                'categoriesPagination'
            );


        const previousCategoryPage =
            document.getElementById(
                'previousCategoryPage'
            );


        const nextCategoryPage =
            document.getElementById(
                'nextCategoryPage'
            );


        const categoryPaginationPages =
            document.getElementById(
                'categoryPaginationPages'
            );


        /* =========================================================
           State
        ========================================================= */

        let allCategories =
            [];


        let filteredCategories =
            [];


        let currentPage =
            1;


        const perPage =
            8;


        let selectedCategory =
            null;


        /* =========================================================
           Helpers
        ========================================================= */

        function clearAuthentication() {

            localStorage.removeItem(
                'farha_token'
            );


            localStorage.removeItem(
                'farha_user'
            );


            sessionStorage.removeItem(
                'farha_token'
            );


            sessionStorage.removeItem(
                'farha_user'
            );
        }


        function escapeHtml(
            value
        ) {

            return String(
                value ?? ''
            )
                .replaceAll(
                    '&',
                    '&amp;'
                )
                .replaceAll(
                    '<',
                    '&lt;'
                )
                .replaceAll(
                    '>',
                    '&gt;'
                )
                .replaceAll(
                    '"',
                    '&quot;'
                )
                .replaceAll(
                    "'",
                    '&#039;'
                );
        }


        function getHeaders(
            extra = {}
        ) {

            return {

                'Accept':
                    'application/json',

                'Authorization':
                    `Bearer ${token}`,

                ...extra,

            };
        }


        function showToast(
            message,
            type = 'info'
        ) {

            if (
                typeof window.showToast ===
                'function'
            ) {

                window.showToast(
                    message,
                    type
                );

            } else {

                alert(message);
            }
        }


        /* =========================================================
           Images
        ========================================================= */

        function getImageUrl(
            imagePath
        ) {

            if (!imagePath) {
                return null;
            }


            let path =
                String(
                    imagePath
                )
                    .trim()
                    .replaceAll(
                        '\\',
                        '/'
                    );


            if (
                path.startsWith(
                    'http://'
                )
                ||
                path.startsWith(
                    'https://'
                )
            ) {

                return path;
            }


            if (
                path.startsWith(
                    '/storage/'
                )
            ) {

                return path;
            }


            if (
                path.startsWith(
                    'storage/'
                )
            ) {

                return `/${path}`;
            }


            if (
                path.startsWith(
                    'public/'
                )
            ) {

                path =
                    path.substring(
                        7
                    );
            }


            path =
                path.replace(
                    /^\/+/,
                    ''
                );


            return `/storage/${path}`;
        }


        /* =========================================================
           Admin Info From DB
        ========================================================= */

        async function loadAdminInfo() {

            if (!meUrl) {

                renderAdmin(
                    currentUser
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        meUrl,
                        {

                            method:
                                'GET',

                            headers:
                                getHeaders(),

                        }
                    );


                if (!response.ok) {

                    renderAdmin(
                        currentUser
                    );

                    return;
                }


                const data =
                    await response.json();


                const admin =
                    data.user
                    ||
                    data.data
                    ||
                    data;


                renderAdmin(
                    admin
                );


            } catch (error) {

                console.error(
                    'Admin info error:',
                    error
                );


                renderAdmin(
                    currentUser
                );
            }
        }


        function renderAdmin(
            admin
        ) {

            const user =
                admin
                ||
                currentUser
                ||
                {};


            if (
                adminName
            ) {

                adminName.textContent =
                    user.name
                    ||
                    'مدير النظام';
            }


            const imageUrl =
                getImageUrl(
                    user.profile_image
                );


            if (
                adminAvatar
                &&
                imageUrl
            ) {

                adminAvatar.src =
                    imageUrl;


                adminAvatar
                    .classList
                    .remove(
                        'd-none'
                    );


                adminAvatarFallback
                    ?.classList
                    .add(
                        'd-none'
                    );


            } else {

                adminAvatar
                    ?.classList
                    .add(
                        'd-none'
                    );


                adminAvatarFallback
                    ?.classList
                    .remove(
                        'd-none'
                    );
            }
        }


        adminAvatar
            ?.addEventListener(
                'error',
                function () {

                    this.classList.add(
                        'd-none'
                    );


                    adminAvatarFallback
                        ?.classList
                        .remove(
                            'd-none'
                        );
                }
            );


        sidebarLogoImage
            ?.addEventListener(
                'error',
                function () {

                    this.classList.add(
                        'd-none'
                    );


                    sidebarLogoFallback
                        ?.classList
                        .remove(
                            'd-none'
                        );
                }
            );


        /* =========================================================
           Loading / Error
        ========================================================= */

        function showLoading() {

            categoriesLoading
                ?.classList
                .remove(
                    'd-none'
                );


            categoriesErrorState
                ?.classList
                .add(
                    'd-none'
                );
        }


        function hideLoading() {

            categoriesLoading
                ?.classList
                .add(
                    'd-none'
                );
        }


        function showError(
            message
        ) {

            categoriesErrorState
                ?.classList
                .remove(
                    'd-none'
                );


            if (
                categoriesErrorMessage
            ) {

                categoriesErrorMessage.textContent =
                    message;
            }
        }


        /* =========================================================
           Category Count
        ========================================================= */

        function getEventsCount(
            category
        ) {

            if (
                category.events_count
                !==
                undefined
                &&
                category.events_count
                !==
                null
            ) {

                return Number(
                    category.events_count
                )
                ||
                0;
            }


            if (
                Array.isArray(
                    category.events
                )
            ) {

                return category
                    .events
                    .length;
            }


            return 0;
        }


        function updateSummary() {

            const totalCategories =
                allCategories.length;


            const totalEvents =
                allCategories.reduce(
                    function (
                        total,
                        category
                    ) {

                        return total
                            +
                            getEventsCount(
                                category
                            );
                    },
                    0
                );


            if (
                totalCategoriesCount
            ) {

                totalCategoriesCount.textContent =
                    totalCategories;
            }


            if (
                totalCategoryEventsCount
            ) {

                totalCategoryEventsCount.textContent =
                    totalEvents;
            }
        }


        /* =========================================================
           Load Categories
        ========================================================= */

        async function loadCategories() {

            showLoading();


            try {

                const response =
                    await fetch(
                        categoriesUrl,
                        {

                            method:
                                'GET',

                            headers:
                                getHeaders(),

                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (
                    response.status ===
                    401
                ) {

                    clearAuthentication();


                    window.location.href =
                        loginUrl
                        ||
                        '/login';


                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message
                        ||
                        'تعذر تحميل التصنيفات.'
                    );
                }


                if (
                    Array.isArray(
                        data
                    )
                ) {

                    allCategories =
                        data;


                } else if (
                    Array.isArray(
                        data.categories
                    )
                ) {

                    allCategories =
                        data.categories;


                } else if (
                    Array.isArray(
                        data.data
                    )
                ) {

                    allCategories =
                        data.data;


                } else if (
                    data.categories
                    &&
                    Array.isArray(
                        data.categories.data
                    )
                ) {

                    allCategories =
                        data.categories.data;


                } else {

                    allCategories =
                        [];
                }


                updateSummary();


                applyFilters();


            } catch (error) {

                console.error(
                    error
                );


                allCategories =
                    [];


                updateSummary();


                renderCategories(
                    []
                );


                showError(
                    error.message
                    ||
                    'حدث خطأ أثناء تحميل التصنيفات.'
                );


            } finally {

                hideLoading();
            }
        }


        /* =========================================================
           Row
        ========================================================= */

        function createCategoryRow(
            category,
            index
        ) {

            const row =
                document.createElement(
                    'article'
                );


            row.className =
                'category-row';


            row.dataset.id =
                category.id;


            const eventsCount =
                getEventsCount(
                    category
                );


            row.innerHTML = `

                <span class="cat-index">

                    ${index + 1}

                </span>


                <div class="cat-name-wrap">

                    <div class="cat-icon">

                        <i class="bi bi-tag-fill"></i>

                    </div>


                    <strong class="cat-name">

                        ${escapeHtml(
                            category.name
                            ||
                            'بدون اسم'
                        )}

                    </strong>

                </div>


                <span class="cat-desc">

                    ${escapeHtml(
                        category.description
                        ||
                        'لا يوجد وصف لهذا التصنيف'
                    )}

                </span>


                <span class="cat-count">

                    <i class="bi bi-calendar-event"></i>

                    ${eventsCount}

                </span>


                <div class="category-actions">


                    <button
                        type="button"
                        class="edit-category-btn"
                        data-category-id="${category.id}"
                        title="تعديل التصنيف"
                    >

                        <i class="bi bi-pencil-square"></i>

                    </button>


                    <button
                        type="button"
                        class="delete-category-btn"
                        data-category-id="${category.id}"
                        title="حذف التصنيف"
                    >

                        <i class="bi bi-trash3"></i>

                    </button>


                </div>
            `;


            return row;
        }


        /* =========================================================
           Render
        ========================================================= */

        function renderCategories(
            categories
        ) {

            if (
                !categoriesContainer
            ) {

                return;
            }


            categoriesContainer.innerHTML =
                '';


            categoriesEmptyState
                ?.classList
                .add(
                    'd-none'
                );


            if (
                !categories.length
            ) {

                categoriesEmptyState
                    ?.classList
                    .remove(
                        'd-none'
                    );


                categoriesPagination
                    ?.classList
                    .add(
                        'd-none'
                    );


                return;
            }


            const totalPages =
                Math.ceil(
                    categories.length
                    /
                    perPage
                );


            if (
                currentPage >
                totalPages
            ) {

                currentPage =
                    totalPages;
            }


            if (
                currentPage < 1
            ) {

                currentPage =
                    1;
            }


            const start =
                (
                    currentPage
                    -
                    1
                )
                *
                perPage;


            const end =
                start
                +
                perPage;


            const pageItems =
                categories.slice(
                    start,
                    end
                );


            pageItems.forEach(
                function (
                    category,
                    pageIndex
                ) {

                    categoriesContainer
                        .appendChild(
                            createCategoryRow(
                                category,
                                start
                                +
                                pageIndex
                            )
                        );
                }
            );


            renderPagination(
                categories.length
            );
        }


        /* =========================================================
           Search
        ========================================================= */

        function applyFilters() {

            const query =
                (
                    searchInput?.value
                    ||
                    ''
                )
                    .trim()
                    .toLowerCase();


            resetCategorySearch
                ?.classList
                .toggle(
                    'd-none',
                    !query
                );


            filteredCategories =
                allCategories.filter(
                    function (
                        category
                    ) {

                        const name =
                            String(
                                category.name
                                ||
                                ''
                            )
                                .toLowerCase();


                        const description =
                            String(
                                category.description
                                ||
                                ''
                            )
                                .toLowerCase();


                        return (
                            !query
                            ||
                            name.includes(
                                query
                            )
                            ||
                            description.includes(
                                query
                            )
                        );
                    }
                );


            currentPage =
                1;


            renderCategories(
                filteredCategories
            );
        }


        searchInput
            ?.addEventListener(
                'input',
                applyFilters
            );


        resetCategorySearch
            ?.addEventListener(
                'click',
                function () {

                    if (
                        searchInput
                    ) {

                        searchInput.value =
                            '';


                        searchInput.focus();
                    }


                    applyFilters();
                }
            );


        /* =========================================================
           Pagination
        ========================================================= */

        function renderPagination(
            totalItems
        ) {

            if (
                !categoriesPagination
                ||
                !categoryPaginationPages
                ||
                !previousCategoryPage
                ||
                !nextCategoryPage
            ) {

                return;
            }


            const totalPages =
                Math.ceil(
                    totalItems
                    /
                    perPage
                );


            if (
                totalPages <=
                1
            ) {

                categoriesPagination
                    .classList
                    .add(
                        'd-none'
                    );


                return;
            }


            categoriesPagination
                .classList
                .remove(
                    'd-none'
                );


            previousCategoryPage.disabled =
                currentPage <=
                1;


            nextCategoryPage.disabled =
                currentPage >=
                totalPages;


            categoryPaginationPages.innerHTML =
                '';


            for (
                let pageNumber = 1;
                pageNumber <= totalPages;
                pageNumber += 1
            ) {

                const button =
                    document.createElement(
                        'button'
                    );


                button.type =
                    'button';


                button.textContent =
                    pageNumber;


                if (
                    pageNumber ===
                    currentPage
                ) {

                    button
                        .classList
                        .add(
                            'active'
                        );
                }


                button.addEventListener(
                    'click',
                    function () {

                        currentPage =
                            pageNumber;


                        renderCategories(
                            filteredCategories
                        );
                    }
                );


                categoryPaginationPages
                    .appendChild(
                        button
                    );
            }
        }


        previousCategoryPage
            ?.addEventListener(
                'click',
                function () {

                    if (
                        currentPage <=
                        1
                    ) {

                        return;
                    }


                    currentPage -=
                        1;


                    renderCategories(
                        filteredCategories
                    );
                }
            );


        nextCategoryPage
            ?.addEventListener(
                'click',
                function () {

                    const totalPages =
                        Math.ceil(
                            filteredCategories.length
                            /
                            perPage
                        );


                    if (
                        currentPage >=
                        totalPages
                    ) {

                        return;
                    }


                    currentPage +=
                        1;


                    renderCategories(
                        filteredCategories
                    );
                }
            );


        /* =========================================================
           Form
        ========================================================= */

        function clearFormErrors() {

            if (
                categoryNameError
            ) {

                categoryNameError.textContent =
                    '';
            }


            if (
                categoryDescError
            ) {

                categoryDescError.textContent =
                    '';
            }
        }


        function resetCategoryForm() {

            if (
                categoryIdInput
            ) {

                categoryIdInput.value =
                    '';
            }


            if (
                categoryNameInput
            ) {

                categoryNameInput.value =
                    '';
            }


            if (
                categoryDescInput
            ) {

                categoryDescInput.value =
                    '';
            }


            clearFormErrors();


            selectedCategory =
                null;
        }


        openAddCategory
            ?.addEventListener(
                'click',
                function () {

                    resetCategoryForm();


                    if (
                        categoryModalLabel
                    ) {

                        categoryModalLabel.textContent =
                            'إضافة تصنيف جديد';
                    }
                }
            );


        /* =========================================================
           Row Actions
        ========================================================= */

        categoriesContainer
            ?.addEventListener(
                'click',
                function (
                    event
                ) {

                    const editButton =
                        event.target.closest(
                            '.edit-category-btn'
                        );


                    if (
                        editButton
                    ) {

                        const id =
                            editButton.dataset
                                .categoryId;


                        selectedCategory =
                            allCategories.find(
                                category =>
                                    String(
                                        category.id
                                    )
                                    ===
                                    String(id)
                            );


                        if (
                            !selectedCategory
                        ) {

                            return;
                        }


                        categoryIdInput.value =
                            selectedCategory.id;


                        categoryNameInput.value =
                            selectedCategory.name
                            ||
                            '';


                        categoryDescInput.value =
                            selectedCategory.description
                            ||
                            '';


                        clearFormErrors();


                        categoryModalLabel.textContent =
                            'تعديل التصنيف';


                        categoryModal
                            ?.show();


                        return;
                    }


                    const deleteButton =
                        event.target.closest(
                            '.delete-category-btn'
                        );


                    if (
                        deleteButton
                    ) {

                        const id =
                            deleteButton.dataset
                                .categoryId;


                        selectedCategory =
                            allCategories.find(
                                category =>
                                    String(
                                        category.id
                                    )
                                    ===
                                    String(id)
                            );


                        if (
                            !selectedCategory
                        ) {

                            return;
                        }


                        if (
                            deleteCategoryName
                        ) {

                            deleteCategoryName.textContent =
                                selectedCategory.name;
                        }


                        deleteCategoryModal
                            ?.show();
                    }
                }
            );


        /* =========================================================
           Validation
        ========================================================= */

        function showValidationErrors(
            errors
        ) {

            if (!errors) {
                return;
            }


            if (
                errors.name
                &&
                categoryNameError
            ) {

                categoryNameError.textContent =
                    errors.name[0];
            }


            if (
                errors.description
                &&
                categoryDescError
            ) {

                categoryDescError.textContent =
                    errors.description[0];
            }
        }


        function setSaving(
            value
        ) {

            if (
                saveCategoryBtn
            ) {

                saveCategoryBtn.disabled =
                    value;
            }


            if (
                saveCategoryText
            ) {

                saveCategoryText.textContent =
                    value
                        ?
                        'جاري الحفظ...'
                        :
                        'حفظ';
            }


            saveCategorySpinner
                ?.classList
                .toggle(
                    'd-none',
                    !value
                );
        }


        /* =========================================================
           Save
        ========================================================= */

        async function saveCategory() {

            clearFormErrors();


            const name =
                categoryNameInput
                    ?.value
                    .trim()
                ||
                '';


            const description =
                categoryDescInput
                    ?.value
                    .trim()
                ||
                '';


            if (!name) {

                categoryNameError.textContent =
                    'يرجى إدخال اسم التصنيف.';


                categoryNameInput
                    ?.focus();


                return;
            }


            const editingId =
                categoryIdInput
                    ?.value
                ||
                '';


            const isEditing =
                Boolean(
                    editingId
                );


            const url =
                isEditing
                    ?
                    `${categoryApiBaseUrl}/${editingId}`
                    :
                    categoryApiBaseUrl;


            const method =
                isEditing
                    ?
                    'PUT'
                    :
                    'POST';


            setSaving(
                true
            );


            try {

                const response =
                    await fetch(
                        url,
                        {

                            method,

                            headers:
                                getHeaders({

                                    'Content-Type':
                                        'application/json',

                                }),

                            body:
                                JSON.stringify({

                                    name,

                                    description:
                                        description
                                        ||
                                        null,

                                }),

                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (
                    response.status ===
                    401
                ) {

                    clearAuthentication();


                    window.location.href =
                        loginUrl
                        ||
                        '/login';


                    return;
                }


                if (
                    response.status ===
                    422
                ) {

                    showValidationErrors(
                        data.errors
                    );


                    showToast(
                        data.message
                        ||
                        'يرجى مراجعة البيانات.',
                        'warning'
                    );


                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message
                        ||
                        'تعذر حفظ التصنيف.'
                    );
                }


                const savedCategory =
                    data.category
                    ||
                    data;


                if (
                    isEditing
                ) {

                    const index =
                        allCategories
                            .findIndex(
                                category =>
                                    String(
                                        category.id
                                    )
                                    ===
                                    String(
                                        editingId
                                    )
                            );


                    if (
                        index !==
                        -1
                    ) {

                        allCategories[
                            index
                        ] = {

                            ...allCategories[
                                index
                            ],

                            ...savedCategory,

                        };
                    }


                    showToast(
                        data.message
                        ||
                        'تم تحديث التصنيف بنجاح.',
                        'success'
                    );


                } else {

                    allCategories.unshift(
                        savedCategory
                    );


                    showToast(
                        data.message
                        ||
                        'تم إضافة التصنيف بنجاح.',
                        'success'
                    );
                }


                categoryModal
                    ?.hide();


                resetCategoryForm();


                updateSummary();


                applyFilters();


            } catch (error) {

                console.error(
                    error
                );


                showToast(
                    error.message
                    ||
                    'تعذر حفظ التصنيف.',
                    'error'
                );


            } finally {

                setSaving(
                    false
                );
            }
        }


        saveCategoryBtn
            ?.addEventListener(
                'click',
                saveCategory
            );


        categoryForm
            ?.addEventListener(
                'submit',
                function (
                    event
                ) {

                    event.preventDefault();


                    saveCategory();
                }
            );


        /* =========================================================
           Delete
        ========================================================= */

        function setDeleting(
            value
        ) {

            if (
                confirmDeleteCategoryButton
            ) {

                confirmDeleteCategoryButton.disabled =
                    value;
            }


            if (
                deleteCategoryText
            ) {

                deleteCategoryText.textContent =
                    value
                        ?
                        'جاري الحذف...'
                        :
                        'حذف التصنيف';
            }


            deleteCategorySpinner
                ?.classList
                .toggle(
                    'd-none',
                    !value
                );
        }


        async function deleteCategory() {

            if (
                !selectedCategory
            ) {

                return;
            }


            const url =
                `${categoryApiBaseUrl}/${selectedCategory.id}`;


            setDeleting(
                true
            );


            try {

                const response =
                    await fetch(
                        url,
                        {

                            method:
                                'DELETE',

                            headers:
                                getHeaders(),

                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (
                    response.status ===
                    401
                ) {

                    clearAuthentication();


                    window.location.href =
                        loginUrl
                        ||
                        '/login';


                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message
                        ||
                        'تعذر حذف التصنيف.'
                    );
                }


                allCategories =
                    allCategories.filter(
                        category =>
                            String(
                                category.id
                            )
                            !==
                            String(
                                selectedCategory.id
                            )
                    );


                deleteCategoryModal
                    ?.hide();


                showToast(
                    data.message
                    ||
                    'تم حذف التصنيف بنجاح.',
                    'success'
                );


                selectedCategory =
                    null;


                updateSummary();


                applyFilters();


            } catch (error) {

                console.error(
                    error
                );


                showToast(
                    error.message
                    ||
                    'تعذر حذف التصنيف.',
                    'error'
                );


            } finally {

                setDeleting(
                    false
                );
            }
        }


        confirmDeleteCategoryButton
            ?.addEventListener(
                'click',
                deleteCategory
            );


        /* =========================================================
           Retry
        ========================================================= */

        retryCategoriesButton
            ?.addEventListener(
                'click',
                function () {

                    categoriesErrorState
                        ?.classList
                        .add(
                            'd-none'
                        );


                    loadCategories();
                }
            );


        /* =========================================================
           Logout
        ========================================================= */

        logoutButton
            ?.addEventListener(
                'click',
                async function () {

                    logoutButton.disabled =
                        true;


                    try {

                        await fetch(
                            logoutUrl,
                            {

                                method:
                                    'POST',

                                headers:
                                    getHeaders(),

                            }
                        );


                    } catch (error) {

                        console.error(
                            error
                        );


                    } finally {

                        clearAuthentication();


                        window.location.href =
                            loginUrl
                            ||
                            '/login';
                    }
                }
            );


        /* =========================================================
           Start
        ========================================================= */

        loadAdminInfo();

        loadCategories();

    }
);