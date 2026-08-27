import './dashboard-common.js';


document.addEventListener(
    'DOMContentLoaded',
    function () {

        const page =
            document.getElementById(
                'reviewEventsPage'
            );


        if (!page) {
            return;
        }


        /* =========================================================
           Elements
        ========================================================= */

        const searchInput =
            document.getElementById(
                'reviewSearch'
            );


        const dateInput =
            document.getElementById(
                'reviewDate'
            );


        const statusSelect =
            document.getElementById(
                'statusSelect'
            );


        const placeSelect =
            document.getElementById(
                'placeSelect'
            );


        const categorySelect =
            document.getElementById(
                'categorySelect'
            );


        const tabs =
            document.querySelectorAll(
                '.review-tabs button'
            );


        const container =
            document.getElementById(
                'reviewEventsContainer'
            );


        const loading =
            document.getElementById(
                'reviewLoading'
            );


        const emptyState =
            document.getElementById(
                'reviewEmptyState'
            );


        const totalEventsCount =
            document.getElementById(
                'totalEventsCount'
            );


        const pendingEventsCount =
            document.getElementById(
                'pendingEventsCount'
            );


        const approvedEventsCount =
            document.getElementById(
                'approvedEventsCount'
            );


        const rejectedEventsCount =
            document.getElementById(
                'rejectedEventsCount'
            );


        const allTab =
            document.getElementById(
                'allTab'
            );


        const pendingTab =
            document.getElementById(
                'pendingTab'
            );


        const approvedTab =
            document.getElementById(
                'approvedTab'
            );


        const rejectedTab =
            document.getElementById(
                'rejectedTab'
            );


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


        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


        /* =========================================================
           URLs
        ========================================================= */

        const eventsUrl =
            page.dataset.eventsUrl;


        const approveBaseUrl =
            page.dataset.approveBaseUrl;


        const rejectBaseUrl =
            page.dataset.rejectBaseUrl;


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


        let currentUser =
            null;


        try {

            const savedUser =
                localStorage.getItem(
                    'farha_user'
                )
                ||
                sessionStorage.getItem(
                    'farha_user'
                );


            currentUser =
                savedUser
                    ? JSON.parse(savedUser)
                    : null;


        } catch (error) {

            console.error(
                'User data error:',
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


        let allEvents =
            [];


        /* =========================================================
           Toast
        ========================================================= */

        function toast(
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

                return;
            }


            alert(message);
        }


        /* =========================================================
           Escape HTML
        ========================================================= */

        function escapeHtml(value) {

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


        /* =========================================================
           Headers
        ========================================================= */

        function getHeaders() {

            return {

                'Accept':
                    'application/json',

                'Authorization':
                    `Bearer ${token}`,

            };
        }


        /* =========================================================
           Clear Auth
        ========================================================= */

        function clearAuth() {

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


        /* =========================================================
           API Response
        ========================================================= */

        async function handleResponse(
            response
        ) {

            let data =
                {};


            try {

                data =
                    await response.json();

            } catch (error) {

                data =
                    {};
            }


            if (
                response.status ===
                401
            ) {

                clearAuth();


                window.location.href =
                    loginUrl
                    ||
                    '/login';


                throw new Error(
                    'انتهت جلسة تسجيل الدخول.'
                );
            }


            if (
                response.status ===
                403
            ) {

                throw new Error(
                    data.message
                    ||
                    'ليس لديك صلاحية لتنفيذ هذه العملية.'
                );
            }


            if (!response.ok) {

                const firstError =
                    data.errors
                        ?
                        Object.values(
                            data.errors
                        )
                            .flat()
                            .find(
                                Boolean
                            )
                        :
                        null;


                throw new Error(
                    firstError
                    ||
                    data.message
                    ||
                    'حدث خطأ أثناء تنفيذ العملية.'
                );
            }


            return data;
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
           First Letter
        ========================================================= */

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


            if (adminName) {

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
           Event Helpers
        ========================================================= */

        function getOrganizerName(
            event
        ) {

            return (
                event.organizer?.name
                ||
                event.organizer_name
                ||
                'غير محدد'
            );
        }


        function getOrganizerEmail(
            event
        ) {

            return (
                event.organizer?.email
                ||
                event.organizer_email
                ||
                ''
            );
        }


        function getOrganizerImage(
            event
        ) {

            return getImageUrl(
                event.organizer
                    ?.profile_image
            );
        }


        function getCategoryName(
            event
        ) {

            return (
                event.category?.name
                ||
                event.category_name
                ||
                'غير مصنف'
            );
        }


        /* =========================================================
           Dates
        ========================================================= */

        function normalizeDate(
            dateValue
        ) {

            if (!dateValue) {
                return '';
            }


            return String(
                dateValue
            )
                .slice(
                    0,
                    10
                );
        }


        function formatDate(
            dateValue
        ) {

            const normalized =
                normalizeDate(
                    dateValue
                );


            if (!normalized) {

                return 'غير محدد';
            }


            const date =
                new Date(
                    `${normalized}T00:00:00`
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return normalized;
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
           Status
        ========================================================= */

        function getStatusInfo(
            status
        ) {

            switch (status) {

                case 'approved':

                    return {

                        text:
                            'مقبولة',

                        className:
                            'accepted',

                    };


                case 'rejected':

                    return {

                        text:
                            'مرفوضة',

                        className:
                            'rejected',

                    };


                case 'draft':

                    return {

                        text:
                            'مسودة',

                        className:
                            'draft',

                    };


                case 'pending':

                default:

                    return {

                        text:
                            'قيد المراجعة',

                        className:
                            'waiting',

                    };
            }
        }


        /* =========================================================
           Category Colors
        ========================================================= */

        function getCategoryClass(
            categoryName,
            index
        ) {

            const name =
                String(
                    categoryName
                    ||
                    ''
                );


            if (
                name.includes(
                    'رياض'
                )
            ) {

                return 'orange';
            }


            if (
                name.includes(
                    'فن'
                )
            ) {

                return 'purple';
            }


            if (
                name.includes(
                    'تعليم'
                )
            ) {

                return 'blue';
            }


            if (
                name.includes(
                    'نفسي'
                )
            ) {

                return 'green';
            }


            if (
                name.includes(
                    'ترفيه'
                )
            ) {

                return 'pink';
            }


            const classes =
                [
                    'green',
                    'purple',
                    'blue',
                    'orange',
                    'pink',
                ];


            return classes[
                index
                %
                classes.length
            ];
        }


        /* =========================================================
           Load Events
        ========================================================= */

        async function loadEvents() {

            showLoading(
                true
            );


            try {

                const response =
                    await fetch(
                        eventsUrl,
                        {

                            method:
                                'GET',

                            headers:
                                getHeaders(),

                        }
                    );


                const data =
                    await handleResponse(
                        response
                    );


                renderAdmin(
                    data.admin
                );


                allEvents =
                    Array.isArray(
                        data.events
                    )
                        ?
                        data.events
                        :
                        [];


                prepareFilters();


                updateStatistics();


                applyFilters();


            } catch (error) {

                console.error(
                    error
                );


                allEvents =
                    [];


                updateStatistics();


                renderEvents(
                    []
                );


                toast(
                    error.message
                    ||
                    'تعذر تحميل الفعاليات.',
                    'error'
                );


            } finally {

                showLoading(
                    false
                );
            }
        }


        /* =========================================================
           Loading
        ========================================================= */

        function showLoading(
            show
        ) {

            if (!loading) {
                return;
            }


            loading
                .classList
                .toggle(
                    'd-none',
                    !show
                );
        }


        /* =========================================================
           Create Event Row
        ========================================================= */

        function createEventRow(
            event,
            index
        ) {

            const organizerName =
                getOrganizerName(
                    event
                );


            const organizerEmail =
                getOrganizerEmail(
                    event
                );


            const organizerImage =
                getOrganizerImage(
                    event
                );


            const organizerInitial =
                getFirstLetter(
                    organizerName
                );


            const categoryName =
                getCategoryName(
                    event
                );


            const categoryClass =
                getCategoryClass(
                    categoryName,
                    index
                );


            const status =
                getStatusInfo(
                    event.status
                );


            const eventImage =
                getImageUrl(
                    event.image
                );


            const actionButtons =
                event.status ===
                'pending'
                    ?
                    `
                        <button
                            type="button"
                            class="accept-btn"
                            data-event-id="${event.id}"
                        >

                            <i class="bi bi-check-lg"></i>

                            قبول

                        </button>


                        <button
                            type="button"
                            class="reject-btn"
                            data-event-id="${event.id}"
                            data-event-title="${escapeHtml(
                                event.title
                                ||
                                ''
                            )}"
                        >

                            <i class="bi bi-x-lg"></i>

                            رفض

                        </button>
                    `
                    :
                    `
                        <span
                            class="review-action-done"
                        >

                            <i class="bi bi-check2-circle"></i>

                            تمت المراجعة

                        </span>
                    `;


            return `

                <article
                    class="review-row"
                    data-event-id="${event.id}"
                    data-status="${escapeHtml(
                        event.status
                        ||
                        'pending'
                    )}"
                >


                    <!-- Event -->


                    <div
                        class="review-event-main"
                    >


                        <div
                            class="review-event-image"
                        >

                            ${
                                eventImage
                                    ?
                                    `
                                        <img
                                            src="${escapeHtml(
                                                eventImage
                                            )}"
                                            alt="${escapeHtml(
                                                event.title
                                                ||
                                                'فعالية'
                                            )}"
                                        >


                                        <span
                                            class="
                                                review-event-fallback
                                                d-none
                                            "
                                        >

                                            <i
                                                class="bi bi-calendar3"
                                            ></i>

                                        </span>
                                    `
                                    :
                                    `
                                        <span
                                            class="review-event-fallback"
                                        >

                                            <i
                                                class="bi bi-calendar3"
                                            ></i>

                                        </span>
                                    `
                            }

                        </div>


                        <div
                            class="review-event-text"
                        >

                            <strong>

                                ${escapeHtml(
                                    event.title
                                    ||
                                    'فعالية'
                                )}

                            </strong>


                            <small>

                                ${escapeHtml(
                                    event.event_type
                                    ||
                                    ''
                                )}

                            </small>

                        </div>


                    </div>


                    <!-- Organizer -->


                    <div
                        class="organizer-cell"
                    >


                        <div
                            class="organizer-avatar"
                        >

                            ${
                                organizerImage
                                    ?
                                    `
                                        <img
                                            src="${escapeHtml(
                                                organizerImage
                                            )}"
                                            alt="${escapeHtml(
                                                organizerName
                                            )}"
                                        >


                                        <span
                                            class="
                                                organizer-avatar-fallback
                                                d-none
                                            "
                                        >

                                            ${escapeHtml(
                                                organizerInitial
                                            )}

                                        </span>
                                    `
                                    :
                                    `
                                        <span
                                            class="organizer-avatar-fallback"
                                        >

                                            ${escapeHtml(
                                                organizerInitial
                                            )}

                                        </span>
                                    `
                            }

                        </div>


                        <div
                            class="organizer-info"
                        >

                            <strong>

                                ${escapeHtml(
                                    organizerName
                                )}

                            </strong>


                            <small>

                                ${escapeHtml(
                                    organizerEmail
                                )}

                            </small>

                        </div>


                    </div>


                    <!-- Date / Place -->


                    <div
                        class="review-date-place"
                    >

                        <span>

                            <i
                                class="bi bi-calendar3"
                            ></i>

                            ${escapeHtml(
                                formatDate(
                                    event.event_date
                                )
                            )}

                        </span>


                        <small>

                            <i
                                class="bi bi-geo-alt"
                            ></i>

                            ${escapeHtml(
                                event.location
                                ||
                                'غير محدد'
                            )}

                        </small>

                    </div>


                    <!-- Category -->


                    <div>

                        <span
                            class="
                                category-badge
                                ${categoryClass}
                            "
                        >

                            ${escapeHtml(
                                categoryName
                            )}

                        </span>

                    </div>


                    <!-- Created -->


                    <div
                        class="added-date"
                    >

                        <span>

                            ${escapeHtml(
                                formatDate(
                                    event.created_at
                                )
                            )}

                        </span>

                    </div>


                    <!-- Status -->


                    <div>

                        <span
                            class="
                                review-status
                                ${status.className}
                            "
                        >

                            ${status.text}

                        </span>

                    </div>


                    <!-- Actions -->


                    <div
                        class="review-actions"
                    >

                        ${actionButtons}

                    </div>


                </article>
            `;
        }


        /* =========================================================
           Render Events
        ========================================================= */

        function renderEvents(
            events
        ) {

            if (!container) {
                return;
            }


            if (!events.length) {

                container.innerHTML =
                    '';


                emptyState
                    ?.classList
                    .remove(
                        'd-none'
                    );


                return;
            }


            emptyState
                ?.classList
                .add(
                    'd-none'
                );


            container.innerHTML =
                events
                    .map(
                        function (
                            event,
                            index
                        ) {

                            return createEventRow(
                                event,
                                index
                            );
                        }
                    )
                    .join('');


            /* =====================================================
               Event Image Fallback
            ===================================================== */

            container
                .querySelectorAll(
                    '.review-event-image img'
                )
                .forEach(
                    image => {

                        image.addEventListener(
                            'error',
                            function () {

                                this.classList.add(
                                    'd-none'
                                );


                                this
                                    .nextElementSibling
                                    ?.classList
                                    .remove(
                                        'd-none'
                                    );
                            }
                        );
                    }
                );


            /* =====================================================
               Organizer Image Fallback
            ===================================================== */

            container
                .querySelectorAll(
                    '.organizer-avatar img'
                )
                .forEach(
                    image => {

                        image.addEventListener(
                            'error',
                            function () {

                                this.classList.add(
                                    'd-none'
                                );


                                this
                                    .nextElementSibling
                                    ?.classList
                                    .remove(
                                        'd-none'
                                    );
                            }
                        );
                    }
                );
        }


        /* =========================================================
           Filters Options
        ========================================================= */

        function prepareFilters() {

            if (placeSelect) {

                const places =
                    [
                        ...new Set(
                            allEvents
                                .map(
                                    event =>
                                        event.location
                                )
                                .filter(
                                    Boolean
                                )
                        )
                    ]
                        .sort();


                placeSelect.innerHTML =
                    '<option value="all">كل الأماكن</option>';


                places.forEach(
                    place => {

                        const option =
                            document.createElement(
                                'option'
                            );


                        option.value =
                            place;


                        option.textContent =
                            place;


                        placeSelect
                            .appendChild(
                                option
                            );
                    }
                );
            }


            if (categorySelect) {

                const categories =
                    [
                        ...new Set(
                            allEvents
                                .map(
                                    event =>
                                        getCategoryName(
                                            event
                                        )
                                )
                                .filter(
                                    Boolean
                                )
                        )
                    ]
                        .sort();


                categorySelect.innerHTML =
                    '<option value="all">كل الفئات</option>';


                categories.forEach(
                    category => {

                        const option =
                            document.createElement(
                                'option'
                            );


                        option.value =
                            category;


                        option.textContent =
                            category;


                        categorySelect
                            .appendChild(
                                option
                            );
                    }
                );
            }
        }


        /* =========================================================
           Statistics
        ========================================================= */

        function updateStatistics() {

            const total =
                allEvents.length;


            const pending =
                allEvents
                    .filter(
                        event =>
                            event.status ===
                            'pending'
                    )
                    .length;


            const approved =
                allEvents
                    .filter(
                        event =>
                            event.status ===
                            'approved'
                    )
                    .length;


            const rejected =
                allEvents
                    .filter(
                        event =>
                            event.status ===
                            'rejected'
                    )
                    .length;


            if (
                totalEventsCount
            ) {

                totalEventsCount.textContent =
                    total;
            }


            if (
                pendingEventsCount
            ) {

                pendingEventsCount.textContent =
                    pending;
            }


            if (
                approvedEventsCount
            ) {

                approvedEventsCount.textContent =
                    approved;
            }


            if (
                rejectedEventsCount
            ) {

                rejectedEventsCount.textContent =
                    rejected;
            }


            if (allTab) {

                allTab.textContent =
                    `الكل (${total})`;
            }


            if (pendingTab) {

                pendingTab.textContent =
                    `قيد المراجعة (${pending})`;
            }


            if (approvedTab) {

                approvedTab.textContent =
                    `مقبولة (${approved})`;
            }


            if (rejectedTab) {

                rejectedTab.textContent =
                    `مرفوضة (${rejected})`;
            }
        }


        /* =========================================================
           Apply Filters
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


            const selectedDate =
                dateInput?.value
                ||
                '';


            const selectedPlace =
                placeSelect?.value
                ||
                'all';


            const selectedCategory =
                categorySelect?.value
                ||
                'all';


            const activeTab =
                document.querySelector(
                    '.review-tabs button.active'
                );


            const selectedStatus =
                activeTab?.dataset.filter
                ||
                'all';


            const filtered =
                allEvents
                    .filter(
                        function (
                            event
                        ) {

                            const title =
                                String(
                                    event.title
                                    ||
                                    ''
                                )
                                    .toLowerCase();


                            const organizer =
                                getOrganizerName(
                                    event
                                )
                                    .toLowerCase();


                            const location =
                                event.location
                                ||
                                '';


                            const category =
                                getCategoryName(
                                    event
                                );


                            const eventDate =
                                normalizeDate(
                                    event.event_date
                                );


                            const matchesSearch =
                                !query
                                ||
                                title.includes(
                                    query
                                )
                                ||
                                organizer.includes(
                                    query
                                );


                            const matchesDate =
                                !selectedDate
                                ||
                                eventDate ===
                                selectedDate;


                            const matchesStatus =
                                selectedStatus ===
                                'all'
                                ||
                                event.status ===
                                selectedStatus;


                            const matchesPlace =
                                selectedPlace ===
                                'all'
                                ||
                                location ===
                                selectedPlace;


                            const matchesCategory =
                                selectedCategory ===
                                'all'
                                ||
                                category ===
                                selectedCategory;


                            return (
                                matchesSearch
                                &&
                                matchesDate
                                &&
                                matchesStatus
                                &&
                                matchesPlace
                                &&
                                matchesCategory
                            );
                        }
                    );


            renderEvents(
                filtered
            );
        }


        /* =========================================================
           Tabs
        ========================================================= */

        tabs.forEach(
            function (
                tab
            ) {

                tab.addEventListener(
                    'click',
                    function () {

                        tabs.forEach(
                            item => {

                                item
                                    .classList
                                    .remove(
                                        'active'
                                    );
                            }
                        );


                        tab
                            .classList
                            .add(
                                'active'
                            );


                        if (
                            statusSelect
                        ) {

                            statusSelect.value =
                                tab.dataset.filter
                                ||
                                'all';
                        }


                        applyFilters();
                    }
                );
            }
        );


        /* =========================================================
           Status Select
        ========================================================= */

        statusSelect
            ?.addEventListener(
                'change',
                function () {

                    tabs.forEach(
                        function (
                            tab
                        ) {

                            tab
                                .classList
                                .toggle(
                                    'active',
                                    tab.dataset.filter
                                    ===
                                    statusSelect.value
                                );
                        }
                    );


                    applyFilters();
                }
            );


        searchInput
            ?.addEventListener(
                'input',
                applyFilters
            );


        dateInput
            ?.addEventListener(
                'change',
                applyFilters
            );


        placeSelect
            ?.addEventListener(
                'change',
                applyFilters
            );


        categorySelect
            ?.addEventListener(
                'change',
                applyFilters
            );


        /* =========================================================
           Approve
        ========================================================= */

        async function approveEvent(
            eventId,
            button
        ) {

            if (
                !confirm(
                    'هل أنت متأكد من قبول ونشر هذه الفعالية؟'
                )
            ) {

                return;
            }


            const originalHtml =
                button.innerHTML;


            button.disabled =
                true;


            button.innerHTML = `

                <span
                    class="spinner-border spinner-border-sm"
                ></span>

                جاري القبول...
            `;


            try {

                const response =
                    await fetch(
                        `${approveBaseUrl}/${eventId}/approve`,
                        {

                            method:
                                'PATCH',

                            headers:
                                getHeaders(),

                        }
                    );


                const data =
                    await handleResponse(
                        response
                    );


                const foundEvent =
                    allEvents.find(
                        item =>
                            String(
                                item.id
                            )
                            ===
                            String(
                                eventId
                            )
                    );


                if (foundEvent) {

                    foundEvent.status =
                        'approved';
                }


                updateStatistics();


                applyFilters();


                toast(
                    data.message
                    ||
                    'تم قبول الفعالية ونشرها بنجاح.',
                    'success'
                );


            } catch (error) {

                console.error(
                    error
                );


                button.disabled =
                    false;


                button.innerHTML =
                    originalHtml;


                toast(
                    error.message
                    ||
                    'تعذر قبول الفعالية.',
                    'error'
                );
            }
        }


        /* =========================================================
           Reject Modal
        ========================================================= */

        const rejectModalElement =
            document.getElementById(
                'rejectEventModal'
            );


        const rejectEventTitle =
            document.getElementById(
                'rejectEventTitle'
            );


        const rejectionReasonInput =
            document.getElementById(
                'rejectionReasonInput'
            );


        const rejectionReasonError =
            document.getElementById(
                'rejectionReasonError'
            );


        const confirmRejectButton =
            document.getElementById(
                'confirmRejectButton'
            );


        const rejectSpinner =
            document.getElementById(
                'rejectSpinner'
            );


        let rejectModal =
            null;


        let eventToReject =
            null;


        if (
            rejectModalElement
            &&
            typeof bootstrap !==
            'undefined'
        ) {

            rejectModal =
                new bootstrap.Modal(
                    rejectModalElement
                );
        }


        function openRejectModal(
            eventId,
            title
        ) {

            eventToReject =
                eventId;


            if (
                rejectEventTitle
            ) {

                rejectEventTitle.textContent =
                    title
                    ||
                    'هذه الفعالية';
            }


            if (
                rejectionReasonInput
            ) {

                rejectionReasonInput.value =
                    '';
            }


            if (
                rejectionReasonError
            ) {

                rejectionReasonError.textContent =
                    '';
            }


            rejectModal
                ?.show();
        }


        /* =========================================================
           Reject Event
        ========================================================= */

        async function rejectEvent() {

            if (
                !eventToReject
            ) {

                return;
            }


            const reason =
                rejectionReasonInput
                    ?.value
                    .trim()
                ||
                '';


            if (!reason) {

                if (
                    rejectionReasonError
                ) {

                    rejectionReasonError.textContent =
                        'يرجى كتابة سبب رفض الفعالية.';
                }


                rejectionReasonInput
                    ?.focus();


                return;
            }


            if (
                rejectionReasonError
            ) {

                rejectionReasonError.textContent =
                    '';
            }


            if (
                confirmRejectButton
            ) {

                confirmRejectButton.disabled =
                    true;
            }


            rejectSpinner
                ?.classList
                .remove(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        `${rejectBaseUrl}/${eventToReject}/reject`,
                        {

                            method:
                                'PATCH',

                            headers: {

                                ...getHeaders(),

                                'Content-Type':
                                    'application/json',

                            },

                            body:
                                JSON.stringify(
                                    {

                                        rejection_reason:
                                            reason,

                                    }
                                ),

                        }
                    );


                const data =
                    await handleResponse(
                        response
                    );


                const foundEvent =
                    allEvents.find(
                        item =>
                            String(
                                item.id
                            )
                            ===
                            String(
                                eventToReject
                            )
                    );


                if (
                    foundEvent
                ) {

                    foundEvent.status =
                        'rejected';
                }


                rejectModal
                    ?.hide();


                updateStatistics();


                applyFilters();


                toast(
                    data.message
                    ||
                    'تم رفض الفعالية بنجاح.',
                    'success'
                );


                eventToReject =
                    null;


            } catch (error) {

                console.error(
                    error
                );


                if (
                    rejectionReasonError
                ) {

                    rejectionReasonError.textContent =
                        error.message
                        ||
                        'تعذر رفض الفعالية.';
                }


            } finally {

                if (
                    confirmRejectButton
                ) {

                    confirmRejectButton.disabled =
                        false;
                }


                rejectSpinner
                    ?.classList
                    .add(
                        'd-none'
                    );
            }
        }


        confirmRejectButton
            ?.addEventListener(
                'click',
                rejectEvent
            );


        /* =========================================================
           Row Actions
        ========================================================= */

        container
            ?.addEventListener(
                'click',
                function (
                    event
                ) {

                    const acceptButton =
                        event.target
                            .closest(
                                '.accept-btn'
                            );


                    if (
                        acceptButton
                    ) {

                        approveEvent(
                            acceptButton
                                .dataset
                                .eventId,

                            acceptButton
                        );


                        return;
                    }


                    const rejectButton =
                        event.target
                            .closest(
                                '.reject-btn'
                            );


                    if (
                        rejectButton
                    ) {

                        openRejectModal(
                            rejectButton
                                .dataset
                                .eventId,

                            rejectButton
                                .dataset
                                .eventTitle
                        );
                    }
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

                        clearAuth();


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

        loadEvents();

    }
);