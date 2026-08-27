import './dashboard-common.js';


document.addEventListener(
    'DOMContentLoaded',
    function () {

        const page =
            document.getElementById(
                'adminUsersPage'
            );


        if (!page) {
            return;
        }


        /* =========================================================
           URLs
        ========================================================= */

        const usersUrl =
            page.dataset.usersUrl;


        const toggleStatusBaseUrl =
            page.dataset.toggleStatusBaseUrl;


        const loginUrl =
            page.dataset.loginUrl;


        const logoutUrl =
            page.dataset.logoutUrl;


        /* =========================================================
           Auth
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
                    ? JSON.parse(storedUser)
                    : null;


        } catch (error) {

            console.error(
                'Invalid stored user:',
                error
            );
        }


        if (
            !token
            ||
            !currentUser
        ) {

            window.location.href =
                loginUrl
                ||
                '/login';

            return;
        }


        if (
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
                'userSearch'
            );


        const statusFilter =
            document.getElementById(
                'statusFilter'
            );


        const roleFilter =
            document.getElementById(
                'roleFilter'
            );


        const resetFiltersButton =
            document.getElementById(
                'resetFiltersButton'
            );


        const usersContainer =
            document.getElementById(
                'usersContainer'
            );


        const usersLoading =
            document.getElementById(
                'usersLoading'
            );


        const usersEmptyState =
            document.getElementById(
                'usersEmptyState'
            );


        const usersErrorState =
            document.getElementById(
                'usersErrorState'
            );


        const usersErrorMessage =
            document.getElementById(
                'usersErrorMessage'
            );


        const retryUsersButton =
            document.getElementById(
                'retryUsersButton'
            );


        const totalUsersCount =
            document.getElementById(
                'totalUsersCount'
            );


        const parentsCount =
            document.getElementById(
                'parentsCount'
            );


        const organizersCount =
            document.getElementById(
                'organizersCount'
            );


        const adminsCount =
            document.getElementById(
                'adminsCount'
            );


        const usersPagination =
            document.getElementById(
                'usersPagination'
            );


        const usersPerPage =
            document.getElementById(
                'usersPerPage'
            );


        const paginationInfo =
            document.getElementById(
                'paginationInfo'
            );


        const previousUsersPage =
            document.getElementById(
                'previousUsersPage'
            );


        const nextUsersPage =
            document.getElementById(
                'nextUsersPage'
            );


        const usersPaginationPages =
            document.getElementById(
                'usersPaginationPages'
            );


        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


        /* =========================================================
           Modal
        ========================================================= */

        const toggleModalElement =
            document.getElementById(
                'toggleUserStatusModal'
            );


        const toggleUserName =
            document.getElementById(
                'toggleUserName'
            );


        const toggleStatusMessage =
            document.getElementById(
                'toggleStatusMessage'
            );


        const confirmToggleStatusButton =
            document.getElementById(
                'confirmToggleStatusButton'
            );


        const toggleStatusText =
            confirmToggleStatusButton
                ?.querySelector(
                    '.toggle-status-text'
                );


        const toggleStatusSpinner =
            document.getElementById(
                'toggleStatusSpinner'
            );


        const toggleModal =
            toggleModalElement
            &&
            window.bootstrap
                ?
                new window.bootstrap.Modal(
                    toggleModalElement
                )
                :
                null;


        /* =========================================================
           State
        ========================================================= */

        let allUsers =
            [];


        let filteredUsers =
            [];


        let dashboardStatistics =
            null;


        let currentPage =
            1;


        let perPage =
            Number(
                usersPerPage?.value
                ||
                10
            );


        let selectedUser =
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


        function getHeaders() {

            return {

                'Accept':
                    'application/json',

                'Authorization':
                    `Bearer ${token}`,

            };
        }


        /* =========================================================
           Image URL
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


        function getFirstLetter(
            name
        ) {

            const value =
                String(
                    name
                    ||
                    ''
                )
                    .trim();


            if (!value) {

                return '؟';
            }


            return value
                .charAt(0)
                .toUpperCase();
        }


        /* =========================================================
           Admin
        ========================================================= */

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
           Role
        ========================================================= */

        function getRoleInfo(
            role
        ) {

            const roles = {

                parent: {

                    text:
                        'ولي أمر',

                    className:
                        'parent',

                },


                organizer: {

                    text:
                        'منظم',

                    className:
                        'organizer',

                },


                admin: {

                    text:
                        'مدير',

                    className:
                        'admin',

                },

            };


            return roles[role]
                ||
                {

                    text:
                        role
                        ||
                        'غير محدد',

                    className:
                        '',

                };
        }


        /* =========================================================
           Dates
        ========================================================= */

        function formatDate(
            value
        ) {

            if (!value) {

                return 'غير محدد';
            }


            const date =
                new Date(
                    value
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return value;
            }


            return new Intl.DateTimeFormat(
                'ar',
                {

                    year:
                        'numeric',

                    month:
                        '2-digit',

                    day:
                        '2-digit',

                }
            )
                .format(
                    date
                );
        }


        function formatTime(
            value
        ) {

            if (!value) {

                return '';
            }


            const date =
                new Date(
                    value
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return '';
            }


            return new Intl.DateTimeFormat(
                'ar',
                {

                    hour:
                        '2-digit',

                    minute:
                        '2-digit',

                    hour12:
                        true,

                }
            )
                .format(
                    date
                );
        }


        /* =========================================================
           States
        ========================================================= */

        function showLoading() {

            usersLoading
                ?.classList
                .remove(
                    'd-none'
                );


            usersErrorState
                ?.classList
                .add(
                    'd-none'
                );
        }


        function hideLoading() {

            usersLoading
                ?.classList
                .add(
                    'd-none'
                );
        }


        function showError(
            message
        ) {

            usersErrorState
                ?.classList
                .remove(
                    'd-none'
                );


            if (
                usersErrorMessage
            ) {

                usersErrorMessage.textContent =
                    message;
            }
        }


        /* =========================================================
           Load Users
        ========================================================= */

        async function loadUsers() {

            showLoading();


            try {

                const response =
                    await fetch(
                        usersUrl,
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


                if (
                    response.status ===
                    403
                ) {

                    showError(
                        data.message
                        ||
                        'ليس لديك صلاحية لعرض المستخدمين.'
                    );


                    return;
                }


                if (
                    !response.ok
                ) {

                    throw new Error(
                        data.message
                        ||
                        'تعذر تحميل المستخدمين.'
                    );
                }


                renderAdmin(
                    data.admin
                );


                dashboardStatistics =
                    data.statistics
                    ||
                    null;


                if (
                    Array.isArray(
                        data
                    )
                ) {

                    allUsers =
                        data;


                } else if (
                    Array.isArray(
                        data.users
                    )
                ) {

                    allUsers =
                        data.users;


                } else if (
                    Array.isArray(
                        data.data
                    )
                ) {

                    allUsers =
                        data.data;


                } else {

                    allUsers =
                        [];
                }


                updateStatistics();


                applyFilters();


            } catch (error) {

                console.error(
                    error
                );


                allUsers =
                    [];


                renderUsers(
                    []
                );


                showError(
                    error.message
                    ||
                    'حدث خطأ أثناء تحميل المستخدمين.'
                );


            } finally {

                hideLoading();
            }
        }


        /* =========================================================
           Statistics
        ========================================================= */

        function updateStatistics() {

            const total =
                dashboardStatistics
                    ?.total
                ??
                allUsers.length;


            const parents =
                dashboardStatistics
                    ?.parents
                ??
                allUsers.filter(
                    user =>
                        user.role ===
                        'parent'
                )
                    .length;


            const organizers =
                dashboardStatistics
                    ?.organizers
                ??
                allUsers.filter(
                    user =>
                        user.role ===
                        'organizer'
                )
                    .length;


            const admins =
                dashboardStatistics
                    ?.admins
                ??
                allUsers.filter(
                    user =>
                        user.role ===
                        'admin'
                )
                    .length;


            if (
                totalUsersCount
            ) {

                totalUsersCount.textContent =
                    total;
            }


            if (
                parentsCount
            ) {

                parentsCount.textContent =
                    parents;
            }


            if (
                organizersCount
            ) {

                organizersCount.textContent =
                    organizers;
            }


            if (
                adminsCount
            ) {

                adminsCount.textContent =
                    admins;
            }
        }


        /* =========================================================
           User Row
        ========================================================= */

        function createUserRow(
            user
        ) {

            const role =
                getRoleInfo(
                    user.role
                );


            const isActive =
                user.is_active === true
                ||
                user.is_active === 1
                ||
                user.is_active === '1';


            const statusText =
                isActive
                    ?
                    'نشط'
                    :
                    'غير مفعل';


            const statusClass =
                isActive
                    ?
                    'active'
                    :
                    'inactive';


            const imageUrl =
                getImageUrl(
                    user.profile_image
                );


            const initial =
                getFirstLetter(
                    user.name
                );


            /*
             * الأدمن لا نعرض له زر تعطيل.
             */

            let actionHtml =
                '';


            if (
                user.role ===
                'admin'
            ) {

                actionHtml = `

                    <span
                        class="admin-protected"
                        title="لا يمكن تعطيل مدير النظام"
                    >

                        <i class="bi bi-shield-lock-fill"></i>

                    </span>
                `;


            } else {

                const toggleText =
                    isActive
                        ?
                        'تعطيل الحساب'
                        :
                        'تفعيل الحساب';


                const toggleIcon =
                    isActive
                        ?
                        'bi-person-x'
                        :
                        'bi-person-check';


                actionHtml = `

                    <div
                        class="dropdown user-menu-dropdown"
                    >


                        <button
                            type="button"
                            class="user-menu"
                            data-bs-toggle="dropdown"
                        >

                            <i class="bi bi-three-dots-vertical"></i>

                        </button>


                        <ul class="dropdown-menu">


                            <li>


                                <button
                                    type="button"
                                    class="
                                        dropdown-item
                                        toggle-user-status-btn
                                    "
                                    data-user-id="${user.id}"
                                >

                                    <i class="bi ${toggleIcon}"></i>

                                    ${toggleText}

                                </button>


                            </li>


                        </ul>


                    </div>
                `;
            }


            const row =
                document.createElement(
                    'article'
                );


            row.className =
                'user-row';


            row.dataset.userId =
                user.id;


            row.innerHTML = `

                <div class="user-main">


                    <div class="user-avatar">


                        ${
                            imageUrl
                                ?
                                `
                                    <img
                                        src="${escapeHtml(
                                            imageUrl
                                        )}"
                                        alt="${escapeHtml(
                                            user.name
                                            ||
                                            ''
                                        )}"
                                    >


                                    <span
                                        class="
                                            user-avatar-fallback
                                            d-none
                                        "
                                    >

                                        ${escapeHtml(
                                            initial
                                        )}

                                    </span>
                                `
                                :
                                `
                                    <span
                                        class="user-avatar-fallback"
                                    >

                                        ${escapeHtml(
                                            initial
                                        )}

                                    </span>
                                `
                        }


                    </div>


                    <div>


                        <strong>

                            ${escapeHtml(
                                user.name
                                ||
                                'مستخدم'
                            )}

                        </strong>


                        <small>

                            #${escapeHtml(
                                user.id
                            )}

                        </small>


                    </div>


                </div>


                <span
                    class="
                        role-badge
                        ${role.className}
                    "
                >

                    ${role.text}

                </span>


                <span class="user-email">

                    ${escapeHtml(
                        user.email
                        ||
                        'غير محدد'
                    )}

                </span>


                <span class="user-phone">

                    ${escapeHtml(
                        user.phone
                        ||
                        'غير محدد'
                    )}

                </span>


                <span
                    class="
                        user-status
                        ${statusClass}
                    "
                >

                    <span class="status-dot"></span>

                    ${statusText}

                </span>


                <div class="user-date">


                    <span>

                        ${escapeHtml(
                            formatDate(
                                user.created_at
                            )
                        )}

                    </span>


                    <small>

                        ${escapeHtml(
                            formatTime(
                                user.created_at
                            )
                        )}

                    </small>


                </div>


                <div class="user-actions">

                    ${actionHtml}

                </div>
            `;


            const image =
                row.querySelector(
                    '.user-avatar img'
                );


            const fallback =
                row.querySelector(
                    '.user-avatar-fallback'
                );


            image?.addEventListener(
                'error',
                function () {

                    this.classList.add(
                        'd-none'
                    );


                    fallback
                        ?.classList
                        .remove(
                            'd-none'
                        );
                }
            );


            return row;
        }


        /* =========================================================
           Render Users
        ========================================================= */

        function renderUsers(
            users
        ) {

            if (
                !usersContainer
            ) {

                return;
            }


            usersContainer.innerHTML =
                '';


            usersEmptyState
                ?.classList
                .add(
                    'd-none'
                );


            if (
                !users.length
            ) {

                usersEmptyState
                    ?.classList
                    .remove(
                        'd-none'
                    );


                usersPagination
                    ?.classList
                    .add(
                        'd-none'
                    );


                return;
            }


            const totalPages =
                Math.ceil(
                    users.length
                    /
                    perPage
                );


            if (
                currentPage
                >
                totalPages
            ) {

                currentPage =
                    totalPages;
            }


            if (
                currentPage
                <
                1
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


            const pageUsers =
                users.slice(
                    start,
                    end
                );


            pageUsers.forEach(
                user => {

                    usersContainer
                        .appendChild(
                            createUserRow(
                                user
                            )
                        );
                }
            );


            renderPagination(
                users.length
            );
        }


        /* =========================================================
           Filters
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


            const selectedStatus =
                statusFilter?.value
                ||
                'all';


            const selectedRole =
                roleFilter?.value
                ||
                'all';


            filteredUsers =
                allUsers.filter(
                    user => {

                        const name =
                            String(
                                user.name
                                ||
                                ''
                            )
                                .toLowerCase();


                        const email =
                            String(
                                user.email
                                ||
                                ''
                            )
                                .toLowerCase();


                        const phone =
                            String(
                                user.phone
                                ||
                                ''
                            )
                                .toLowerCase();


                        const isActive =
                            user.is_active ===
                            true
                            ||
                            user.is_active ===
                            1
                            ||
                            user.is_active ===
                            '1';


                        const status =
                            isActive
                                ?
                                'active'
                                :
                                'inactive';


                        const matchesSearch =
                            !query
                            ||
                            name.includes(
                                query
                            )
                            ||
                            email.includes(
                                query
                            )
                            ||
                            phone.includes(
                                query
                            );


                        const matchesStatus =
                            selectedStatus ===
                            'all'
                            ||
                            status ===
                            selectedStatus;


                        const matchesRole =
                            selectedRole ===
                            'all'
                            ||
                            user.role ===
                            selectedRole;


                        return (
                            matchesSearch
                            &&
                            matchesStatus
                            &&
                            matchesRole
                        );
                    }
                );


            currentPage =
                1;


            renderUsers(
                filteredUsers
            );
        }


        searchInput
            ?.addEventListener(
                'input',
                applyFilters
            );


        statusFilter
            ?.addEventListener(
                'change',
                applyFilters
            );


        roleFilter
            ?.addEventListener(
                'change',
                applyFilters
            );


        resetFiltersButton
            ?.addEventListener(
                'click',
                function () {

                    if (
                        searchInput
                    ) {

                        searchInput.value =
                            '';
                    }


                    if (
                        statusFilter
                    ) {

                        statusFilter.value =
                            'all';
                    }


                    if (
                        roleFilter
                    ) {

                        roleFilter.value =
                            'all';
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
                !usersPagination
                ||
                !usersPaginationPages
                ||
                !paginationInfo
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
                totalItems ===
                0
            ) {

                usersPagination
                    .classList
                    .add(
                        'd-none'
                    );

                return;
            }


            usersPagination
                .classList
                .remove(
                    'd-none'
                );


            const start =
                (
                    (
                        currentPage
                        -
                        1
                    )
                    *
                    perPage
                )
                +
                1;


            const end =
                Math.min(
                    currentPage
                    *
                    perPage,

                    totalItems
                );


            paginationInfo.textContent =
                `${start} - ${end} من ${totalItems} مستخدم`;


            previousUsersPage.disabled =
                currentPage <=
                1;


            nextUsersPage.disabled =
                currentPage >=
                totalPages;


            usersPaginationPages.innerHTML =
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


                        renderUsers(
                            filteredUsers
                        );
                    }
                );


                usersPaginationPages
                    .appendChild(
                        button
                    );
            }
        }


        previousUsersPage
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


                    renderUsers(
                        filteredUsers
                    );
                }
            );


        nextUsersPage
            ?.addEventListener(
                'click',
                function () {

                    const totalPages =
                        Math.ceil(
                            filteredUsers.length
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


                    renderUsers(
                        filteredUsers
                    );
                }
            );


        usersPerPage
            ?.addEventListener(
                'change',
                function () {

                    perPage =
                        Number(
                            usersPerPage.value
                        )
                        ||
                        10;


                    currentPage =
                        1;


                    renderUsers(
                        filteredUsers
                    );
                }
            );


        /* =========================================================
           Open Modal
        ========================================================= */

        usersContainer
            ?.addEventListener(
                'click',
                function (
                    event
                ) {

                    const button =
                        event.target
                            .closest(
                                '.toggle-user-status-btn'
                            );


                    if (
                        !button
                    ) {

                        return;
                    }


                    const userId =
                        button.dataset
                            .userId;


                    selectedUser =
                        allUsers.find(
                            user =>
                                String(
                                    user.id
                                )
                                ===
                                String(
                                    userId
                                )
                        );


                    if (
                        !selectedUser
                    ) {

                        return;
                    }


                    if (
                        selectedUser.role ===
                        'admin'
                    ) {

                        window.showToast?.(
                            'لا يمكن تعطيل مدير النظام.',
                            'warning'
                        );

                        return;
                    }


                    const isActive =
                        selectedUser.is_active ===
                        true
                        ||
                        selectedUser.is_active ===
                        1
                        ||
                        selectedUser.is_active ===
                        '1';


                    if (
                        toggleUserName
                    ) {

                        toggleUserName.textContent =
                            selectedUser.name;
                    }


                    if (
                        toggleStatusMessage
                    ) {

                        toggleStatusMessage.textContent =
                            isActive
                                ?
                                'هل أنت متأكد من تعطيل حساب هذا المستخدم؟'
                                :
                                'هل أنت متأكد من تفعيل حساب هذا المستخدم؟';
                    }


                    if (
                        toggleStatusText
                    ) {

                        toggleStatusText.textContent =
                            isActive
                                ?
                                'تعطيل الحساب'
                                :
                                'تفعيل الحساب';
                    }


                    toggleModal
                        ?.show();
                }
            );


        /* =========================================================
           Toggle Status
        ========================================================= */

        async function toggleSelectedUserStatus() {

            if (
                !selectedUser
            ) {

                return;
            }


            const url =
                `${toggleStatusBaseUrl}/${selectedUser.id}/toggle-status`;


            if (
                confirmToggleStatusButton
            ) {

                confirmToggleStatusButton.disabled =
                    true;
            }


            toggleStatusSpinner
                ?.classList
                .remove(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        url,
                        {

                            method:
                                'PATCH',

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


                if (
                    response.status ===
                    403
                ) {

                    window.showToast?.(
                        data.message
                        ||
                        'ليس لديك صلاحية لتنفيذ هذه العملية.',
                        'error'
                    );


                    return;
                }


                if (
                    !response.ok
                ) {

                    throw new Error(
                        data.message
                        ||
                        'تعذر تغيير حالة المستخدم.'
                    );
                }


                if (
                    data.user
                ) {

                    const index =
                        allUsers.findIndex(
                            user =>
                                String(
                                    user.id
                                )
                                ===
                                String(
                                    selectedUser.id
                                )
                        );


                    if (
                        index !==
                        -1
                    ) {

                        allUsers[
                            index
                        ] =
                            data.user;
                    }


                } else {

                    selectedUser.is_active =
                        !(
                            selectedUser.is_active ===
                            true
                            ||
                            selectedUser.is_active ===
                            1
                            ||
                            selectedUser.is_active ===
                            '1'
                        );
                }


                toggleModal
                    ?.hide();


                /*
                 * نعيد حساب الإحصائيات
                 * من البيانات المحلية بعد التغيير.
                 */

                dashboardStatistics =
                    null;


                updateStatistics();


                applyFilters();


                window.showToast?.(
                    data.message
                    ||
                    'تم تغيير حالة المستخدم بنجاح.',
                    'success'
                );


                selectedUser =
                    null;


            } catch (error) {

                console.error(
                    error
                );


                window.showToast?.(
                    error.message
                    ||
                    'تعذر تغيير حالة المستخدم.',
                    'error'
                );


            } finally {

                if (
                    confirmToggleStatusButton
                ) {

                    confirmToggleStatusButton.disabled =
                        false;
                }


                toggleStatusSpinner
                    ?.classList
                    .add(
                        'd-none'
                    );
            }
        }


        confirmToggleStatusButton
            ?.addEventListener(
                'click',
                toggleSelectedUserStatus
            );


        /* =========================================================
           Retry
        ========================================================= */

        retryUsersButton
            ?.addEventListener(
                'click',
                function () {

                    usersErrorState
                        ?.classList
                        .add(
                            'd-none'
                        );


                    loadUsers();
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

        loadUsers();

    }
);