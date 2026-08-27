import './dashboard-common.js';


document.addEventListener(
    'DOMContentLoaded',
    function () {

        const page =
            document.getElementById(
                'adminRegistrationsPage'
            );


        if (!page) {
            return;
        }


        /* =========================================================
           URLs
        ========================================================= */

        const registrationsUrl =
            page.dataset.registrationsUrl;


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
                'registrationSearch'
            );


        const statusFilter =
            document.getElementById(
                'statusFilter'
            );


        const resetFiltersButton =
            document.getElementById(
                'resetRegistrationFilters'
            );


        const registrationsContainer =
            document.getElementById(
                'registrationsContainer'
            );


        const registrationsLoading =
            document.getElementById(
                'registrationsLoading'
            );


        const registrationsEmptyState =
            document.getElementById(
                'registrationsEmptyState'
            );


        const registrationsErrorState =
            document.getElementById(
                'registrationsErrorState'
            );


        const registrationsErrorMessage =
            document.getElementById(
                'registrationsErrorMessage'
            );


        const retryRegistrationsButton =
            document.getElementById(
                'retryRegistrationsButton'
            );


        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


        /* =========================================================
           Statistics
        ========================================================= */

        const totalRegistrationsCount =
            document.getElementById(
                'totalRegistrationsCount'
            );


        const confirmedRegistrationsCount =
            document.getElementById(
                'confirmedRegistrationsCount'
            );


        const pendingRegistrationsCount =
            document.getElementById(
                'pendingRegistrationsCount'
            );


        const cancelledRegistrationsCount =
            document.getElementById(
                'cancelledRegistrationsCount'
            );


        /* =========================================================
           Pagination
        ========================================================= */

        const registrationsPagination =
            document.getElementById(
                'registrationsPagination'
            );


        const previousRegistrationPage =
            document.getElementById(
                'previousRegistrationPage'
            );


        const nextRegistrationPage =
            document.getElementById(
                'nextRegistrationPage'
            );


        const registrationPaginationPages =
            document.getElementById(
                'registrationPaginationPages'
            );


        /* =========================================================
           Modal
        ========================================================= */

        const registrationModalElement =
            document.getElementById(
                'registrationModal'
            );


        const registrationModal =
            registrationModalElement
            &&
            window.bootstrap
                ?
                new window.bootstrap.Modal(
                    registrationModalElement
                )
                :
                null;


        const modalChildName =
            document.getElementById(
                'modalChildName'
            );


        const modalChildAge =
            document.getElementById(
                'modalChildAge'
            );


        const modalParentName =
            document.getElementById(
                'modalParentName'
            );


        const modalParentEmail =
            document.getElementById(
                'modalParentEmail'
            );


        const modalParentPhone =
            document.getElementById(
                'modalParentPhone'
            );


        const modalEventTitle =
            document.getElementById(
                'modalEventTitle'
            );


        const modalEventDate =
            document.getElementById(
                'modalEventDate'
            );


        const modalRegistrationDate =
            document.getElementById(
                'modalRegistrationDate'
            );


        const modalRegistrationStatus =
            document.getElementById(
                'modalRegistrationStatus'
            );


        /* =========================================================
           State
        ========================================================= */

        let allRegistrations =
            [];


        let filteredRegistrations =
            [];


        let currentPage =
            1;


        const perPage =
            10;


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
           Admin Info
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


                renderAdmin(
                    data.user
                    ||
                    data.data
                    ||
                    data
                );


            } catch (error) {

                console.error(
                    error
                );


                renderAdmin(
                    currentUser
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
                        'short',

                    day:
                        'numeric',

                }
            )
                .format(
                    date
                );
        }


        /* =========================================================
           Status Normalization
        ========================================================= */

        function normalizeStatus(
            status
        ) {

            const value =
                String(
                    status
                    ||
                    ''
                )
                    .toLowerCase();


            if (
                [
                    'confirmed',
                    'registered',
                    'approved',
                    'accepted',
                ].includes(
                    value
                )
            ) {

                return 'confirmed';
            }


            if (
                value ===
                'pending'
            ) {

                return 'pending';
            }


            if (
                [
                    'cancelled',
                    'canceled',
                    'rejected',
                ].includes(
                    value
                )
            ) {

                return 'cancelled';
            }


            return value;
        }


        function getStatusInfo(
            status
        ) {

            const normalized =
                normalizeStatus(
                    status
                );


            const statuses = {

                confirmed: {

                    text:
                        'مؤكد',

                    className:
                        'confirmed',

                    icon:
                        'bi-check-circle-fill',

                },


                pending: {

                    text:
                        'قيد الانتظار',

                    className:
                        'pending',

                    icon:
                        'bi-hourglass-split',

                },


                cancelled: {

                    text:
                        'ملغى / مرفوض',

                    className:
                        'cancelled',

                    icon:
                        'bi-x-circle-fill',

                },

            };


            return statuses[
                normalized
            ]
            ||
            {

                text:
                    status
                    ||
                    'غير محدد',

                className:
                    'unknown',

                icon:
                    'bi-question-circle',

            };
        }


        /* =========================================================
           Child
        ========================================================= */

        function getChild(
            registration
        ) {

            return (
                registration.child
                ||
                registration.child_data
                ||
                {}
            );
        }


        function getChildName(
            registration
        ) {

            const child =
                getChild(
                    registration
                );


            return (
                child.name
                ||
                registration.child_name
                ||
                'غير محدد'
            );
        }


        function getChildAge(
            registration
        ) {

            const child =
                getChild(
                    registration
                );


            return (
                child.age
                ??
                registration.child_age
                ??
                'غير محدد'
            );
        }


        /* =========================================================
           Parent
        ========================================================= */

        function getParent(
            registration
        ) {

            return (
                registration.parent
                ||
                registration.user
                ||
                {}
            );
        }


        function getParentName(
            registration
        ) {

            const parent =
                getParent(
                    registration
                );


            return (
                parent.name
                ||
                registration.parent_name
                ||
                'غير محدد'
            );
        }


        function getParentEmail(
            registration
        ) {

            const parent =
                getParent(
                    registration
                );


            return (
                parent.email
                ||
                registration.parent_email
                ||
                'غير محدد'
            );
        }


        function getParentPhone(
            registration
        ) {

            const parent =
                getParent(
                    registration
                );


            return (
                parent.phone
                ||
                registration.parent_phone
                ||
                'غير محدد'
            );
        }


        /* =========================================================
           Event
        ========================================================= */

        function getEvent(
            registration
        ) {

            return (
                registration.event
                ||
                {}
            );
        }


        function getEventTitle(
            registration
        ) {

            const event =
                getEvent(
                    registration
                );


            return (
                event.title
                ||
                registration.event_title
                ||
                'غير محدد'
            );
        }


        function getEventDate(
            registration
        ) {

            const event =
                getEvent(
                    registration
                );


            return (
                event.event_date
                ||
                registration.event_date
                ||
                null
            );
        }


        /* =========================================================
           Loading / Error
        ========================================================= */

        function showLoading() {

            registrationsLoading
                ?.classList
                .remove(
                    'd-none'
                );


            registrationsErrorState
                ?.classList
                .add(
                    'd-none'
                );
        }


        function hideLoading() {

            registrationsLoading
                ?.classList
                .add(
                    'd-none'
                );
        }


        function showError(
            message
        ) {

            registrationsErrorState
                ?.classList
                .remove(
                    'd-none'
                );


            if (
                registrationsErrorMessage
            ) {

                registrationsErrorMessage.textContent =
                    message;
            }
        }


        /* =========================================================
           Load Registrations
        ========================================================= */

        async function loadRegistrations() {

            showLoading();


            try {

                const response =
                    await fetch(
                        registrationsUrl,
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
                        'ليس لديك صلاحية لعرض التسجيلات.'
                    );


                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message
                        ||
                        'تعذر تحميل التسجيلات.'
                    );
                }


                if (
                    data.admin
                ) {

                    renderAdmin(
                        data.admin
                    );
                }


                if (
                    Array.isArray(
                        data
                    )
                ) {

                    allRegistrations =
                        data;


                } else if (
                    Array.isArray(
                        data.registrations
                    )
                ) {

                    allRegistrations =
                        data.registrations;


                } else if (
                    Array.isArray(
                        data.data
                    )
                ) {

                    allRegistrations =
                        data.data;


                } else if (
                    data.registrations
                    &&
                    Array.isArray(
                        data.registrations.data
                    )
                ) {

                    allRegistrations =
                        data.registrations.data;


                } else {

                    allRegistrations =
                        [];
                }


                updateStatistics();


                applyFilters();


            } catch (error) {

                console.error(
                    error
                );


                allRegistrations =
                    [];


                updateStatistics();


                renderRegistrations(
                    []
                );


                showError(
                    error.message
                    ||
                    'حدث خطأ أثناء تحميل التسجيلات.'
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
                allRegistrations.length;


            const confirmed =
                allRegistrations.filter(
                    registration =>
                        normalizeStatus(
                            registration.status
                        )
                        ===
                        'confirmed'
                )
                    .length;


            const pending =
                allRegistrations.filter(
                    registration =>
                        normalizeStatus(
                            registration.status
                        )
                        ===
                        'pending'
                )
                    .length;


            const cancelled =
                allRegistrations.filter(
                    registration =>
                        normalizeStatus(
                            registration.status
                        )
                        ===
                        'cancelled'
                )
                    .length;


            if (
                totalRegistrationsCount
            ) {

                totalRegistrationsCount.textContent =
                    total;
            }


            if (
                confirmedRegistrationsCount
            ) {

                confirmedRegistrationsCount.textContent =
                    confirmed;
            }


            if (
                pendingRegistrationsCount
            ) {

                pendingRegistrationsCount.textContent =
                    pending;
            }


            if (
                cancelledRegistrationsCount
            ) {

                cancelledRegistrationsCount.textContent =
                    cancelled;
            }
        }


        /* =========================================================
           Row
        ========================================================= */

        function createRegistrationRow(
            registration,
            index
        ) {

            const status =
                getStatusInfo(
                    registration.status
                );


            const row =
                document.createElement(
                    'article'
                );


            row.className =
                'registration-row';


            row.dataset.registrationId =
                registration.id;


            row.dataset.status =
                normalizeStatus(
                    registration.status
                );


            row.innerHTML = `

                <span class="reg-index">

                    ${index + 1}

                </span>


                <div class="reg-child-wrap">

                    <div class="reg-child-icon">

                        <i class="bi bi-person-heart"></i>

                    </div>


                    <strong class="reg-child">

                        ${escapeHtml(
                            getChildName(
                                registration
                            )
                        )}

                    </strong>

                </div>


                <span class="reg-parent">

                    ${escapeHtml(
                        getParentName(
                            registration
                        )
                    )}

                </span>


                <span class="reg-event">

                    <i class="bi bi-calendar-event"></i>

                    ${escapeHtml(
                        getEventTitle(
                            registration
                        )
                    )}

                </span>


                <span class="reg-date">

                    ${escapeHtml(
                        formatDate(
                            registration.created_at
                        )
                    )}

                </span>


                <span
                    class="
                        reg-status
                        ${status.className}
                    "
                >

                    <i class="bi ${status.icon}"></i>

                    ${status.text}

                </span>


                <div class="registration-actions">


                    <button
                        type="button"
                        class="view-registration-btn"
                        data-registration-id="${registration.id}"
                        title="عرض التفاصيل"
                    >

                        <i class="bi bi-eye"></i>

                    </button>


                </div>
            `;


            return row;
        }


        /* =========================================================
           Render
        ========================================================= */

        function renderRegistrations(
            registrations
        ) {

            if (
                !registrationsContainer
            ) {

                return;
            }


            registrationsContainer.innerHTML =
                '';


            registrationsEmptyState
                ?.classList
                .add(
                    'd-none'
                );


            if (
                !registrations.length
            ) {

                registrationsEmptyState
                    ?.classList
                    .remove(
                        'd-none'
                    );


                registrationsPagination
                    ?.classList
                    .add(
                        'd-none'
                    );


                return;
            }


            const totalPages =
                Math.ceil(
                    registrations.length
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
                registrations.slice(
                    start,
                    end
                );


            pageItems.forEach(
                function (
                    registration,
                    pageIndex
                ) {

                    registrationsContainer
                        .appendChild(
                            createRegistrationRow(
                                registration,
                                start
                                +
                                pageIndex
                            )
                        );
                }
            );


            renderPagination(
                registrations.length
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


            filteredRegistrations =
                allRegistrations.filter(
                    function (
                        registration
                    ) {

                        const child =
                            getChildName(
                                registration
                            )
                                .toLowerCase();


                        const parent =
                            getParentName(
                                registration
                            )
                                .toLowerCase();


                        const event =
                            getEventTitle(
                                registration
                            )
                                .toLowerCase();


                        const email =
                            getParentEmail(
                                registration
                            )
                                .toLowerCase();


                        const normalizedStatus =
                            normalizeStatus(
                                registration.status
                            );


                        const matchesQuery =
                            !query
                            ||
                            child.includes(
                                query
                            )
                            ||
                            parent.includes(
                                query
                            )
                            ||
                            event.includes(
                                query
                            )
                            ||
                            email.includes(
                                query
                            );


                        const matchesStatus =
                            selectedStatus ===
                            'all'
                            ||
                            normalizedStatus ===
                            selectedStatus;


                        return (
                            matchesQuery
                            &&
                            matchesStatus
                        );
                    }
                );


            currentPage =
                1;


            renderRegistrations(
                filteredRegistrations
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
                !registrationsPagination
                ||
                !registrationPaginationPages
                ||
                !previousRegistrationPage
                ||
                !nextRegistrationPage
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

                registrationsPagination
                    .classList
                    .add(
                        'd-none'
                    );


                return;
            }


            registrationsPagination
                .classList
                .remove(
                    'd-none'
                );


            previousRegistrationPage.disabled =
                currentPage <=
                1;


            nextRegistrationPage.disabled =
                currentPage >=
                totalPages;


            registrationPaginationPages.innerHTML =
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


                        renderRegistrations(
                            filteredRegistrations
                        );
                    }
                );


                registrationPaginationPages
                    .appendChild(
                        button
                    );
            }
        }


        previousRegistrationPage
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


                    renderRegistrations(
                        filteredRegistrations
                    );
                }
            );


        nextRegistrationPage
            ?.addEventListener(
                'click',
                function () {

                    const totalPages =
                        Math.ceil(
                            filteredRegistrations.length
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


                    renderRegistrations(
                        filteredRegistrations
                    );
                }
            );


        /* =========================================================
           Details Modal
        ========================================================= */

        registrationsContainer
            ?.addEventListener(
                'click',
                function (
                    event
                ) {

                    const button =
                        event.target.closest(
                            '.view-registration-btn'
                        );


                    if (!button) {
                        return;
                    }


                    const id =
                        button.dataset
                            .registrationId;


                    const registration =
                        allRegistrations.find(
                            item =>
                                String(
                                    item.id
                                )
                                ===
                                String(id)
                        );


                    if (
                        !registration
                    ) {

                        return;
                    }


                    const status =
                        getStatusInfo(
                            registration.status
                        );


                    modalChildName.textContent =
                        getChildName(
                            registration
                        );


                    modalChildAge.textContent =
                        getChildAge(
                            registration
                        );


                    modalParentName.textContent =
                        getParentName(
                            registration
                        );


                    modalParentEmail.textContent =
                        getParentEmail(
                            registration
                        );


                    modalParentPhone.textContent =
                        getParentPhone(
                            registration
                        );


                    modalEventTitle.textContent =
                        getEventTitle(
                            registration
                        );


                    modalEventDate.textContent =
                        formatDate(
                            getEventDate(
                                registration
                            )
                        );


                    modalRegistrationDate.textContent =
                        formatDate(
                            registration.created_at
                        );


                    modalRegistrationStatus.textContent =
                        status.text;


                    modalRegistrationStatus.className =
                        `reg-status ${status.className}`;


                    registrationModal
                        ?.show();
                }
            );


        /* =========================================================
           Retry
        ========================================================= */

        retryRegistrationsButton
            ?.addEventListener(
                'click',
                function () {

                    registrationsErrorState
                        ?.classList
                        .add(
                            'd-none'
                        );


                    loadRegistrations();
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

        loadRegistrations();

    }
);