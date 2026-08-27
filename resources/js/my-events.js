import './site-common.js';

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       PAGE
    ========================================================= */

    const page =
        document.getElementById('parentMyEventsPage');

    if (!page) {
        return;
    }


    /* =========================================================
       URLS
    ========================================================= */

    const profileUrl =
        page.dataset.profileUrl ||
        '/api/profile';

    const registrationsUrl =
        page.dataset.registrationsUrl ||
        '/api/parent/registrations';

    const logoutUrl =
        page.dataset.logoutUrl ||
        '/api/logout';

    const loginUrl =
        page.dataset.loginUrl ||
        '/login';

    const homeUrl =
        page.dataset.homeUrl ||
        '/home';

    const eventDetailsBase =
        page.dataset.eventDetailsBase ||
        '/events';


    /* =========================================================
       AUTH
    ========================================================= */

    const localToken =
        localStorage.getItem('farha_token');

    const sessionToken =
        sessionStorage.getItem('farha_token');

    const token =
        localToken ||
        sessionToken;

    const authStorage =
        localToken
            ? localStorage
            : sessionStorage;

    let currentUser = null;


    function readStoredUser() {

        const raw =
            localStorage.getItem('farha_user') ||
            sessionStorage.getItem('farha_user');

        if (!raw) {
            return null;
        }

        try {

            return JSON.parse(raw);

        } catch (error) {

            console.error(
                'Invalid stored user:',
                error
            );

            return null;
        }
    }


    currentUser =
        readStoredUser();


    function getHeaders(extra = {}) {

        const headers = {
            Accept: 'application/json',
            ...extra,
        };

        if (token) {

            headers.Authorization =
                `Bearer ${token}`;
        }

        return headers;
    }


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


    function saveCurrentUser(user) {

        if (!user) {
            return;
        }

        currentUser = user;

        authStorage.setItem(
            'farha_user',
            JSON.stringify(user)
        );
    }


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const topUserName =
        document.getElementById(
            'topUserName'
        );

    const sidebarParentName =
        document.getElementById(
            'sidebarParentName'
        );

    const topProfileImage =
        document.getElementById(
            'topProfileImage'
        );

    const eventsGrid =
        document.getElementById(
            'myEventsContainer'
        );

    const loading =
        document.getElementById(
            'myEventsLoading'
        );

    const empty =
        document.getElementById(
            'myEventsEmpty'
        );

    const errorBox =
        document.getElementById(
            'myEventsError'
        );

    const errorMessage =
        document.getElementById(
            'myEventsErrorMessage'
        );

    const retryButton =
        document.getElementById(
            'retryMyEventsButton'
        );

    const searchInput =
        document.getElementById(
            'myEventsSearch'
        );

    const statusFilter =
        document.getElementById(
            'myEventsStatus'
        );

    const logoutButton =
        document.getElementById(
            'logoutButton'
        );

    const mobileMenuButton =
        document.querySelector(
            '.pf-menu-toggle-mobile'
        );

    const sidebar =
        document.querySelector(
            '.pf-sidebar'
        );


    /* =========================================================
       STATE
    ========================================================= */

    let registrations = [];


    /* =========================================================
       HELPERS
    ========================================================= */

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


    function escapeHtml(value) {

        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }


    function formatDate(value) {

        if (!value) {

            return 'غير محدد';
        }

        const cleanValue =
            String(value)
                .slice(0, 10);

        const date =
            new Date(
                `${cleanValue}T00:00:00`
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return cleanValue;
        }

        return date
            .toLocaleDateString(
                'ar',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
            );
    }


    function formatTime(value) {

        if (!value) {

            return 'غير محدد';
        }

        const parts =
            String(value)
                .slice(0, 5)
                .split(':');

        let hour =
            Number(parts[0]);

        const minute =
            parts[1] ||
            '00';

        if (
            Number.isNaN(hour)
        ) {

            return value;
        }

        const period =
            hour >= 12
                ? 'م'
                : 'ص';

        hour =
            hour % 12 ||
            12;

        return `${hour}:${minute} ${period}`;
    }


    function getImageUrl(path) {

        if (!path) {

            return '/images.1/Image.png';
        }

        const value =
            String(path)
                .trim();

        if (
            value.startsWith('http://') ||
            value.startsWith('https://')
        ) {

            return value;
        }

        if (
            value.startsWith('/storage/') ||
            value.startsWith('/images/') ||
            value.startsWith('/images.1/')
        ) {

            return value;
        }

        if (
            value.startsWith('storage/')
        ) {

            return `/${value}`;
        }

        if (
            value.startsWith('images.1/')
        ) {

            return `/${value}`;
        }

        return `/storage/${value}`;
    }


    function getProfileImage(user) {

        const image =
            user?.profile_image ||
            user?.image ||
            user?.avatar;

        if (!image) {

            return '/images.1/profile.png';
        }

        return getImageUrl(
            image
        );
    }


    /* =========================================================
       REGISTRATION STATUS
    ========================================================= */

    function getRegistrationStatus(
        registration
    ) {

        const raw =
            registration?.status ||
            '';

        const status =
            String(raw)
                .toLowerCase()
                .trim();

        if (
            status === 'approved' ||
            status === 'confirmed' ||
            status === 'registered'
        ) {

            return 'confirmed';
        }

        if (
            status === 'cancelled' ||
            status === 'canceled' ||
            status === 'rejected'
        ) {

            return 'cancelled';
        }

        return 'pending';
    }


    function statusLabel(status) {

        switch (status) {

            case 'confirmed':
                return 'مؤكد';

            case 'cancelled':
                return 'ملغي';

            default:
                return 'قيد الانتظار';
        }
    }


    function statusIcon(status) {

        switch (status) {

            case 'confirmed':
                return 'bi-check-circle-fill';

            case 'cancelled':
                return 'bi-x-circle-fill';

            default:
                return 'bi-clock-fill';
        }
    }


    /* =========================================================
       EVENT HELPERS
    ========================================================= */

    function getEvent(
        registration
    ) {

        return (
            registration?.event ||
            registration?.event_data ||
            {}
        );
    }


    function getChild(
        registration
    ) {

        return (
            registration?.child ||
            {}
        );
    }


    function getOrganizer(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return (
            event?.organizer ||
            {}
        );
    }


    function eventDate(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return (
            event.date ||
            event.event_date ||
            event.start_date ||
            null
        );
    }


    function eventTime(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return (
            event.time ||
            event.start_time ||
            null
        );
    }


    function eventLocation(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return (
            event.location ||
            event.venue ||
            event.address ||
            'غير محدد'
        );
    }


    function eventTitle(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return (
            event.title ||
            event.name ||
            'فعالية'
        );
    }


    function eventImage(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return getImageUrl(
            event.image ||
            event.image_url ||
            event.cover_image
        );
    }


    function eventId(
        registration
    ) {

        const event =
            getEvent(
                registration
            );

        return (
            event.id ||
            registration.event_id ||
            null
        );
    }


    /* =========================================================
       LOADING / ERROR
    ========================================================= */

    function showLoading() {

        loading
            ?.classList
            .remove(
                'd-none'
            );

        errorBox
            ?.classList
            .add(
                'd-none'
            );

        empty
            ?.classList
            .add(
                'd-none'
            );

        eventsGrid
            ?.classList
            .add(
                'd-none'
            );
    }


    function hideLoading() {

        loading
            ?.classList
            .add(
                'd-none'
            );
    }


    function showError(
        message
    ) {

        hideLoading();

        if (
            errorMessage
        ) {

            errorMessage.textContent =
                message ||
                'تعذر تحميل الفعاليات.';
        }

        errorBox
            ?.classList
            .remove(
                'd-none'
            );

        empty
            ?.classList
            .add(
                'd-none'
            );

        eventsGrid
            ?.classList
            .add(
                'd-none'
            );
    }


    function showEmpty() {

        hideLoading();

        errorBox
            ?.classList
            .add(
                'd-none'
            );

        eventsGrid
            ?.classList
            .add(
                'd-none'
            );

        empty
            ?.classList
            .remove(
                'd-none'
            );
    }


    function showGrid() {

        hideLoading();

        errorBox
            ?.classList
            .add(
                'd-none'
            );

        empty
            ?.classList
            .add(
                'd-none'
            );

        eventsGrid
            ?.classList
            .remove(
                'd-none'
            );
    }


    /* =========================================================
       PROFILE
    ========================================================= */

    async function loadProfile() {

        try {

            const response =
                await fetch(
                    profileUrl,
                    {
                        headers:
                            getHeaders(),
                    }
                );

            let data = {};

            try {

                data =
                    await response.json();

            } catch (_) {}

            if (
                response.status === 401
            ) {

                clearAuthentication();

                window.location.href =
                    loginUrl;

                return false;
            }

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل الحساب.'
                );
            }

            const user =
                data.user ||
                data.data ||
                data;

            if (
                !user ||
                user.role !== 'parent'
            ) {

                window.location.href =
                    homeUrl;

                return false;
            }

            saveCurrentUser(
                user
            );

            if (
                topUserName
            ) {

                topUserName.textContent =
                    user.name ||
                    'المستخدم';
            }


            if (
                sidebarParentName
            ) {

                sidebarParentName.textContent =
                    user.name ||
                    'المستخدم';
            }


            if (
                topProfileImage
            ) {

                topProfileImage.src =
                    getProfileImage(
                        user
                    );

                topProfileImage.onerror =
                    function () {

                        this.onerror =
                            null;

                        this.src =
                            '/images.1/profile.png';
                    };
            }

            return true;

        } catch (error) {

            console.error(
                'Parent profile error:',
                error
            );

            showError(
                error.message ||
                'تعذر تحميل الحساب.'
            );

            return false;
        }
    }


    /* =========================================================
       LOAD REGISTRATIONS
    ========================================================= */

    async function loadRegistrations() {

        showLoading();

        try {

            const response =
                await fetch(
                    registrationsUrl,
                    {
                        headers:
                            getHeaders(),
                    }
                );

            let data = {};

            try {

                data =
                    await response.json();

            } catch (_) {}

            if (
                response.status === 401
            ) {

                clearAuthentication();

                window.location.href =
                    loginUrl;

                return;
            }

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل الفعاليات.'
                );
            }

            let list = [];

            if (
                Array.isArray(data)
            ) {

                list =
                    data;

            } else if (
                Array.isArray(
                    data.registrations
                )
            ) {

                list =
                    data.registrations;

            } else if (
                Array.isArray(
                    data.data
                )
            ) {

                list =
                    data.data;

            } else if (
                Array.isArray(
                    data.data?.registrations
                )
            ) {

                list =
                    data.data.registrations;
            }

            registrations =
                list;

            applyFilters();

        } catch (error) {

            console.error(
                'Parent registrations error:',
                error
            );

            showError(
                error.message ||
                'تعذر تحميل الفعاليات.'
            );
        }
    }


    /* =========================================================
       FILTER
    ========================================================= */

    function applyFilters() {

        const search =
            String(
                searchInput?.value ||
                ''
            )
                .trim()
                .toLowerCase();

        const selectedStatus =
            statusFilter?.value ||
            'all';

        const filtered =
            registrations.filter(
                registration => {

                    const event =
                        getEvent(
                            registration
                        );

                    const child =
                        getChild(
                            registration
                        );

                    const organizer =
                        getOrganizer(
                            registration
                        );

                    const text = [
                        event.title,
                        event.name,
                        event.location,
                        event.venue,
                        child.name,
                        organizer.name,
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();

                    const matchesSearch =
                        !search ||
                        text.includes(
                            search
                        );

                    const status =
                        getRegistrationStatus(
                            registration
                        );

                    const matchesStatus =
                        selectedStatus ===
                            'all' ||
                        status ===
                            selectedStatus;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        renderRegistrations(
            filtered
        );
    }


    /* =========================================================
       RENDER
    ========================================================= */

    function renderRegistrations(
        list
    ) {

        if (
            !eventsGrid
        ) {

            return;
        }

        if (
            !list.length
        ) {

            eventsGrid.innerHTML =
                '';

            showEmpty();

            return;
        }

        showGrid();

        eventsGrid.innerHTML =
            list
                .map(
                    registration => {

                        const event =
                            getEvent(
                                registration
                            );

                        const child =
                            getChild(
                                registration
                            );

                        const organizer =
                            getOrganizer(
                                registration
                            );

                        const status =
                            getRegistrationStatus(
                                registration
                            );

                        const id =
                            registration.id;

                        const targetEventId =
                            eventId(
                                registration
                            );

                        const detailsUrl =
                            targetEventId
                                ? `${eventDetailsBase}/${targetEventId}`
                                : '#';

                        const canCancel =
                            status !==
                                'cancelled';

                        return `

                            <article
                                class="parent-event-card"
                                data-registration-id="${escapeHtml(id)}"
                            >

                                <div class="parent-event-image">

                                    <img
                                        src="${escapeHtml(
                                            eventImage(
                                                registration
                                            )
                                        )}"
                                        alt="${escapeHtml(
                                            eventTitle(
                                                registration
                                            )
                                        )}"
                                        loading="lazy"
                                        onerror="
                                            this.onerror=null;
                                            this.src='/images.1/Image.png';
                                        "
                                    >

                                    <span
                                        class="
                                            parent-registration-status
                                            ${escapeHtml(status)}
                                        "
                                    >
                                        <i
                                            class="
                                                bi
                                                ${statusIcon(status)}
                                            "
                                        ></i>

                                        ${statusLabel(status)}
                                    </span>

                                </div>


                                <div class="parent-event-body">

                                    <div
                                        class="parent-event-top"
                                    >

                                        <div>

                                            <h2>
                                                ${escapeHtml(
                                                    eventTitle(
                                                        registration
                                                    )
                                                )}
                                            </h2>

                                            <p
                                                class="parent-event-organizer"
                                            >
                                                ${
                                                    organizer.name
                                                        ? `
                                                            <i class="bi bi-person-badge"></i>

                                                            ${escapeHtml(
                                                                organizer.name
                                                            )}
                                                        `
                                                        : ''
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        class="parent-event-meta"
                                    >

                                        <div>
                                            <i class="bi bi-calendar3"></i>

                                            <span>
                                                ${escapeHtml(
                                                    formatDate(
                                                        eventDate(
                                                            registration
                                                        )
                                                    )
                                                )}
                                            </span>
                                        </div>


                                        <div>
                                            <i class="bi bi-clock"></i>

                                            <span>
                                                ${escapeHtml(
                                                    formatTime(
                                                        eventTime(
                                                            registration
                                                        )
                                                    )
                                                )}
                                            </span>
                                        </div>


                                        <div>
                                            <i class="bi bi-geo-alt"></i>

                                            <span>
                                                ${escapeHtml(
                                                    eventLocation(
                                                        registration
                                                    )
                                                )}
                                            </span>
                                        </div>


                                        ${
                                            child.name
                                                ? `
                                                    <div>
                                                        <i class="bi bi-person-heart"></i>

                                                        <span>
                                                            ${escapeHtml(
                                                                child.name
                                                            )}
                                                        </span>
                                                    </div>
                                                `
                                                : ''
                                        }

                                    </div>


                                    <div
                                        class="parent-event-actions"
                                    >

                                        ${
                                            targetEventId
                                                ? `
                                                    <a
                                                        href="${detailsUrl}"
                                                        class="parent-event-details"
                                                    >
                                                        <i class="bi bi-eye"></i>

                                                        عرض التفاصيل
                                                    </a>
                                                `
                                                : ''
                                        }


                                        ${
                                            canCancel
                                                ? `
                                                    <button
                                                        type="button"
                                                        class="parent-cancel-registration"
                                                        data-registration-id="${escapeHtml(id)}"
                                                    >
                                                        <i class="bi bi-x-circle"></i>

                                                        إلغاء التسجيل
                                                    </button>
                                                `
                                                : ''
                                        }

                                    </div>

                                </div>

                            </article>
                        `;
                    }
                )
                .join('');

        bindCancelButtons();
    }


    /* =========================================================
       CANCEL REGISTRATION
    ========================================================= */

    function bindCancelButtons() {

        document
            .querySelectorAll(
                '.parent-cancel-registration'
            )
            .forEach(
                button => {

                    button.addEventListener(
                        'click',
                        function () {

                            const id =
                                this.dataset
                                    .registrationId;

                            cancelRegistration(
                                id,
                                this
                            );
                        }
                    );
                }
            );
    }


    async function cancelRegistration(
        id,
        button
    ) {

        if (!id) {
            return;
        }

        const confirmed =
            window.confirm(
                'هل أنت متأكد من إلغاء التسجيل في هذه الفعالية؟'
            );

        if (!confirmed) {
            return;
        }

        const original =
            button.innerHTML;

        button.disabled =
            true;

        button.innerHTML = `
            <span
                class="
                    spinner-border
                    spinner-border-sm
                "
            ></span>

            جاري الإلغاء...
        `;

        try {

            const response =
                await fetch(
                    `/api/registrations/${id}/cancel`,
                    {
                        method:
                            'PATCH',

                        headers:
                            getHeaders({
                                'Content-Type':
                                    'application/json',
                            }),
                    }
                );

            let data = {};

            try {

                data =
                    await response.json();

            } catch (_) {}

            if (
                response.status === 401
            ) {

                clearAuthentication();

                window.location.href =
                    loginUrl;

                return;
            }

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر إلغاء التسجيل.'
                );
            }

            const index =
                registrations
                    .findIndex(
                        registration =>
                            String(
                                registration.id
                            ) ===
                            String(id)
                    );

            if (
                index !== -1
            ) {

                registrations[index].status =
                    'cancelled';
            }

            showToast(
                data.message ||
                'تم إلغاء التسجيل بنجاح.',
                'success'
            );

            applyFilters();

        } catch (error) {

            console.error(
                'Cancel registration error:',
                error
            );

            showToast(
                error.message ||
                'تعذر إلغاء التسجيل.',
                'error'
            );

            button.disabled =
                false;

            button.innerHTML =
                original;
        }
    }


    /* =========================================================
       EVENTS
    ========================================================= */

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


    retryButton
        ?.addEventListener(
            'click',
            async function () {

                const valid =
                    await loadProfile();

                if (valid) {

                    loadRegistrations();
                }
            }
        );


    /* =========================================================
       LOGOUT
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
                                getHeaders({
                                    'Content-Type':
                                        'application/json',
                                }),
                        }
                    );

                } catch (error) {

                    console.error(
                        'Logout error:',
                        error
                    );

                } finally {

                    clearAuthentication();

                    window.location.href =
                        loginUrl;
                }
            }
        );


    /* =========================================================
       SIDEBAR
    ========================================================= */

    function openSidebar() {

        sidebar
            ?.classList
            .add(
                'open'
            );
    }


    function closeSidebar() {

        sidebar
            ?.classList
            .remove(
                'open'
            );
    }


    mobileMenuButton
        ?.addEventListener(
            'click',
            function () {

                if (
                    sidebar
                        ?.classList
                        .contains(
                            'open'
                        )
                ) {

                    closeSidebar();

                } else {

                    openSidebar();
                }
            }
        );


    document
        .querySelectorAll(
            '.pf-menu-link'
        )
        .forEach(
            link => {

                link.addEventListener(
                    'click',
                    function () {

                        if (
                            window.innerWidth <=
                            850
                        ) {

                            closeSidebar();
                        }
                    }
                );
            }
        );


    window.addEventListener(
        'resize',
        function () {

            if (
                window.innerWidth >
                850
            ) {

                closeSidebar();
            }
        }
    );


    /* =========================================================
       START
    ========================================================= */

    async function startPage() {

        if (!token) {

            window.location.href =
                loginUrl;

            return;
        }

        if (
            currentUser &&
            currentUser.role !== 'parent'
        ) {

            window.location.href =
                homeUrl;

            return;
        }

        showLoading();

        const valid =
            await loadProfile();

        if (!valid) {
            return;
        }

        await loadRegistrations();
    }


    startPage();

});