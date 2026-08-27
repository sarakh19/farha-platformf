import './dashboard-common.js';

document.addEventListener(
    'DOMContentLoaded',
    function () {


        /* =========================================================
           PAGE
        ========================================================= */

        const page =
            document.getElementById(
                'organizerDashboard'
            );


        if (!page) {
            return;
        }



        /* =========================================================
           URLS
        ========================================================= */

        const dashboardUrl =
            page.dataset.dashboardUrl ||
            '/api/organizer/dashboard';


        const eventsUrl =
            page.dataset.eventsUrl ||
            '/api/organizer/events';


        const registrationRequestsUrl =
            page.dataset.registrationRequestsUrl ||
            '/api/organizer/registration-requests';


        const approveRegistrationUrl =
            page.dataset.approveRegistrationUrl ||
            '/api/organizer/registrations';


        const rejectRegistrationUrl =
            page.dataset.rejectRegistrationUrl ||
            '/api/organizer/registrations';


        const logoutUrl =
            page.dataset.logoutUrl ||
            '/api/logout';


        const loginUrl =
            page.dataset.loginUrl ||
            '/login';



        /* =========================================================
           AUTH
        ========================================================= */

        const localToken =
            localStorage.getItem(
                'farha_token'
            );


        const sessionToken =
            sessionStorage.getItem(
                'farha_token'
            );


        const token =
            localToken ||
            sessionToken;



        function getHeaders(extra = {}) {

            const headers = {

                Accept:
                    'application/json',

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



        function getStoredUser() {

            const raw =
                localStorage.getItem(
                    'farha_user'
                ) ||
                sessionStorage.getItem(
                    'farha_user'
                );


            if (!raw) {
                return null;
            }


            try {

                return JSON.parse(
                    raw
                );

            } catch (error) {

                console.error(
                    'Invalid stored user:',
                    error
                );

                return null;
            }
        }



        /* =========================================================
           ELEMENTS
        ========================================================= */

        const organizerName =
            document.getElementById(
                'organizerName'
            );


        const organizerAvatar =
            document.getElementById(
                'organizerAvatar'
            );


        const welcomeOrganizerName =
            document.getElementById(
                'welcomeOrganizerName'
            );


        const totalEvents =
            document.getElementById(
                'totalEvents'
            );


        const upcomingEvents =
            document.getElementById(
                'upcomingEvents'
            );


        const totalRegistrations =
            document.getElementById(
                'totalRegistrations'
            );


        const finishedEvents =
            document.getElementById(
                'finishedEvents'
            );


        const recentEventsContainer =
            document.getElementById(
                'recentEventsContainer'
            );


        const noRecentEvents =
            document.getElementById(
                'noRecentEvents'
            );


        const requestsContainer =
            document.getElementById(
                'registrationRequestsContainer'
            );


        const requestsLoading =
            document.getElementById(
                'registrationRequestsLoading'
            );


        const noRequests =
            document.getElementById(
                'noRegistrationRequests'
            );


        const requestsCount =
            document.getElementById(
                'pendingRequestsCount'
            );


        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


        const menuToggle =
            document.getElementById(
                'dashboardMenuToggle'
            );


        const sidebar =
            document.querySelector(
                '.sidebar'
            );


        const sidebarOverlay =
            document.getElementById(
                'dashboardSidebarOverlay'
            );



        /* =========================================================
           HELPERS
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

                return;
            }


            alert(message);
        }



        function formatDate(value) {

            if (!value) {

                return 'غير محدد';
            }


            const clean =
                String(value)
                    .slice(
                        0,
                        10
                    );


            const date =
                new Date(
                    `${clean}T00:00:00`
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return clean;
            }


            return date
                .toLocaleDateString(
                    'ar',
                    {
                        year:
                            'numeric',

                        month:
                            'long',

                        day:
                            'numeric',
                    }
                );
        }



        function getInitial(name) {

            if (!name) {

                return 'م';
            }


            return String(name)
                .trim()
                .charAt(0);
        }



        function getEventImage(event) {

            const image =
                event.image ||
                event.image_path ||
                event.cover_image ||
                event.photo;


            if (!image) {

                return '/images.1/Image.png';
            }


            const value =
                String(image)
                    .trim();


            if (
                value.startsWith(
                    'http://'
                ) ||
                value.startsWith(
                    'https://'
                )
            ) {

                return value;
            }


            if (
                value.startsWith(
                    '/storage/'
                ) ||
                value.startsWith(
                    '/images/'
                ) ||
                value.startsWith(
                    '/images.1/'
                )
            ) {

                return value;
            }


            if (
                value.startsWith(
                    'storage/'
                )
            ) {

                return `/${value}`;
            }


            return `/storage/${value}`;
        }



        /* =========================================================
           SHOW STORED ORGANIZER IMMEDIATELY
        ========================================================= */

        const storedUser =
            getStoredUser();


        if (storedUser) {

            const name =
                storedUser.name ||
                storedUser.full_name ||
                'المنظم';


            if (
                organizerName
            ) {

                organizerName.textContent =
                    name;
            }


            if (
                welcomeOrganizerName
            ) {

                welcomeOrganizerName.textContent =
                    name;
            }


            if (
                organizerAvatar
            ) {

                organizerAvatar.textContent =
                    getInitial(
                        name
                    );
            }
        }



        /* =========================================================
           LOAD DASHBOARD USER
        ========================================================= */

        async function loadDashboard() {

            if (!token) {

                window.location.href =
                    loginUrl;

                return;
            }


            try {

                const response =
                    await fetch(
                        dashboardUrl,
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
                        loginUrl;

                    return;
                }


                if (!response.ok) {

                    console.error(
                        'Dashboard API:',
                        data
                    );

                    return;
                }


                const organizer =
                    data.organizer ||
                    data.user ||
                    data.data?.organizer ||
                    data.data?.user ||
                    null;


                if (!organizer) {

                    return;
                }


                const name =
                    organizer.name ||
                    organizer.full_name ||
                    'المنظم';


                if (
                    organizerName
                ) {

                    organizerName.textContent =
                        name;
                }


                if (
                    welcomeOrganizerName
                ) {

                    welcomeOrganizerName.textContent =
                        name;
                }


                if (
                    organizerAvatar
                ) {

                    organizerAvatar.textContent =
                        getInitial(
                            name
                        );
                }


            } catch (error) {

                console.error(
                    'Organizer dashboard error:',
                    error
                );
            }
        }



        /* =========================================================
           LOAD EVENTS + REAL STATISTICS
        ========================================================= */

        async function loadEvents() {

            if (
                !recentEventsContainer
            ) {

                return;
            }


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
                    await response
                        .json()
                        .catch(
                            () => []
                        );


                if (
                    response.status ===
                    401
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


                let events =
                    Array.isArray(data)
                        ? data
                        : (
                            data.events ||
                            data.data ||
                            []
                        );


                if (
                    !Array.isArray(
                        events
                    )
                ) {

                    events = [];
                }



                /* =================================================
                   REAL STATISTICS
                ================================================= */

                const now =
                    new Date();


                const upcoming =
                    events.filter(
                        function (
                            event
                        ) {

                            if (
                                !event.event_date
                            ) {

                                return false;
                            }


                            const date =
                                String(
                                    event.event_date
                                ).slice(
                                    0,
                                    10
                                );


                            const endTime =
                                event.end_time ||
                                '23:59:59';


                            const eventDate =
                                new Date(
                                    `${date}T${endTime}`
                                );


                            if (
                                Number.isNaN(
                                    eventDate.getTime()
                                )
                            ) {

                                return false;
                            }


                            return eventDate >=
                                now;
                        }
                    );



                const finished =
                    events.filter(
                        function (
                            event
                        ) {

                            if (
                                !event.event_date
                            ) {

                                return false;
                            }


                            const date =
                                String(
                                    event.event_date
                                ).slice(
                                    0,
                                    10
                                );


                            const endTime =
                                event.end_time ||
                                '23:59:59';


                            const eventDate =
                                new Date(
                                    `${date}T${endTime}`
                                );


                            if (
                                Number.isNaN(
                                    eventDate.getTime()
                                )
                            ) {

                                return false;
                            }


                            return eventDate <
                                now;
                        }
                    );



                const registrationsTotal =
                    events.reduce(
                        function (
                            total,
                            event
                        ) {

                            const count =
                                event.registrations_count ??
                                event.registration_count ??
                                (
                                    Array.isArray(
                                        event.registrations
                                    )
                                        ? event.registrations.length
                                        : 0
                                );


                            return total +
                                Number(
                                    count ||
                                    0
                                );
                        },
                        0
                    );



                if (
                    totalEvents
                ) {

                    totalEvents.textContent =
                        events.length;
                }


                if (
                    upcomingEvents
                ) {

                    upcomingEvents.textContent =
                        upcoming.length;
                }


                if (
                    finishedEvents
                ) {

                    finishedEvents.textContent =
                        finished.length;
                }


                if (
                    totalRegistrations
                ) {

                    totalRegistrations.textContent =
                        registrationsTotal;
                }



                /* =================================================
                   RECENT EVENTS
                ================================================= */

                recentEventsContainer.innerHTML =
                    '';


                if (
                    events.length ===
                    0
                ) {

                    recentEventsContainer
                        .classList
                        .add(
                            'd-none'
                        );


                    noRecentEvents
                        ?.classList
                        .remove(
                            'd-none'
                        );


                    return;
                }


                recentEventsContainer
                    .classList
                    .remove(
                        'd-none'
                    );


                noRecentEvents
                    ?.classList
                    .add(
                        'd-none'
                    );


                /*
                 * أحدث 5 فقط للعرض.
                 * الإحصائيات حسبناها قبل هذا.
                 */

                const recentEvents =
                    [...events]
                        .sort(
                            function (
                                a,
                                b
                            ) {

                                return (
                                    Number(
                                        b.id ||
                                        0
                                    ) -
                                    Number(
                                        a.id ||
                                        0
                                    )
                                );
                            }
                        )
                        .slice(
                            0,
                            5
                        );



                recentEvents.forEach(
                    function (
                        event
                    ) {

                        const row =
                            document.createElement(
                                'div'
                            );


                        row.className =
                            'event-row';



                        const status =
                            String(
                                event.status ||
                                ''
                            )
                                .toLowerCase();



                        let statusText =
                            event.status ||
                            'غير محدد';


                        let statusClass =
                            'review';



                        if (
                            status ===
                            'approved'
                        ) {

                            statusText =
                                'منشورة';

                            statusClass =
                                'published';
                        }


                        if (
                            status ===
                            'pending'
                        ) {

                            statusText =
                                'قيد المراجعة';

                            statusClass =
                                'review';
                        }


                        if (
                            finished.includes(
                                event
                            )
                        ) {

                            statusText =
                                'منتهية';

                            statusClass =
                                'finished';
                        }



                        const registrationCount =
                            event.registrations_count ??
                            event.registration_count ??
                            (
                                Array.isArray(
                                    event.registrations
                                )
                                    ? event.registrations.length
                                    : 0
                            );



                        const image =
                            getEventImage(
                                event
                            );



                        row.innerHTML = `

                            <button
                                type="button"
                                class="row-menu"
                            >

                                <i
                                    class="bi bi-three-dots"
                                ></i>

                            </button>


                            <span
                                class="row-status ${escapeHtml(
                                    statusClass
                                )}"
                            >

                                ${escapeHtml(
                                    statusText
                                )}

                            </span>


                            <div
                                class="row-registrations"
                            >

                                <strong>
                                    ${escapeHtml(
                                        registrationCount
                                    )}
                                </strong>

                                <small>
                                    تسجيل
                                </small>

                            </div>


                            <div
                                class="row-date"
                            >

                                <span>
                                    ${escapeHtml(
                                        formatDate(
                                            event.event_date
                                        )
                                    )}
                                </span>

                            </div>


                            <div
                                class="row-location"
                            >

                                <span>
                                    ${escapeHtml(
                                        event.location ||
                                        'غير محدد'
                                    )}
                                </span>

                            </div>


                            <a
                                href="/events/${escapeHtml(
                                    event.id
                                )}"
                                class="row-title"
                            >

                                <img
                                    src="${escapeHtml(
                                        image
                                    )}"

                                    alt="${escapeHtml(
                                        event.title ||
                                        'فعالية'
                                    )}"

                                    onerror="
                                        this.onerror=null;
                                        this.src='/images.1/Image.png';
                                    "
                                >


                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            event.title ||
                                            'فعالية'
                                        )}
                                    </strong>

                                    <small>
                                        عرض التفاصيل
                                    </small>

                                </div>

                            </a>

                        `;


                        recentEventsContainer
                            .appendChild(
                                row
                            );
                    }
                );


            } catch (error) {

                console.error(
                    'Organizer events error:',
                    error
                );


                recentEventsContainer.innerHTML =
                    `

                    <div
                        class="dashboard-loading"
                    >

                        تعذر تحميل الفعاليات.

                    </div>

                `;
            }
        }



        /* =========================================================
           LOAD REGISTRATION REQUESTS
        ========================================================= */

        async function loadRegistrationRequests() {

            if (
                !requestsContainer
            ) {

                return;
            }


            requestsLoading
                ?.classList
                .remove(
                    'd-none'
                );


            requestsContainer
                .classList
                .add(
                    'd-none'
                );


            noRequests
                ?.classList
                .add(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        registrationRequestsUrl,
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
                        loginUrl;

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر تحميل طلبات التسجيل.'
                    );
                }


                let requests =
                    Array.isArray(data)
                        ? data
                        : (
                            data.registrations ||
                            data.requests ||
                            data.data ||
                            []
                        );


                if (
                    !Array.isArray(
                        requests
                    )
                ) {

                    requests = [];
                }


                requests =
                    requests.filter(
                        function (
                            registration
                        ) {

                            return String(
                                registration.status ||
                                ''
                            )
                                .toLowerCase()
                                .trim() ===
                                'pending';
                        }
                    );


                renderRequests(
                    requests
                );


            } catch (error) {

                console.error(
                    'Registration requests error:',
                    error
                );


                requestsLoading
                    ?.classList
                    .add(
                        'd-none'
                    );


                requestsContainer
                    .classList
                    .add(
                        'd-none'
                    );


                noRequests
                    ?.classList
                    .remove(
                        'd-none'
                    );


                if (
                    requestsCount
                ) {

                    requestsCount.textContent =
                        '0 طلب';
                }
            }
        }



        /* =========================================================
           RENDER REQUESTS
        ========================================================= */

        function renderRequests(
            requests
        ) {

            requestsLoading
                ?.classList
                .add(
                    'd-none'
                );


            requestsContainer.innerHTML =
                '';


            if (
                requestsCount
            ) {

                requestsCount.textContent =
                    `${requests.length} طلب`;
            }



            if (
                requests.length ===
                0
            ) {

                requestsContainer
                    .classList
                    .add(
                        'd-none'
                    );


                noRequests
                    ?.classList
                    .remove(
                        'd-none'
                    );


                return;
            }



            noRequests
                ?.classList
                .add(
                    'd-none'
                );


            requestsContainer
                .classList
                .remove(
                    'd-none'
                );



            requests.forEach(
                function (
                    registration
                ) {

                    const parent =
                        registration.parent ||
                        {};


                    const child =
                        registration.child ||
                        {};


                    const event =
                        registration.event ||
                        {};


                    const card =
                        document.createElement(
                            'article'
                        );


                    card.className =
                        'registration-request-card';



                    card.innerHTML = `

                        <div
                            class="request-parent"
                        >

                            <div
                                class="request-parent-avatar"
                            >

                                ${escapeHtml(
                                    getInitial(
                                        parent.name
                                    )
                                )}

                            </div>


                            <div>

                                <strong>
                                    ${escapeHtml(
                                        parent.name ||
                                        'ولي الأمر'
                                    )}
                                </strong>

                                <small>
                                    ولي الأمر
                                </small>

                            </div>

                        </div>



                        <div
                            class="request-child"
                        >

                            <strong>
                                ${escapeHtml(
                                    child.name ||
                                    'غير محدد'
                                )}
                            </strong>

                            <small>
                                الطفل
                            </small>

                        </div>



                        <div
                            class="request-event"
                        >

                            <strong>
                                ${escapeHtml(
                                    event.title ||
                                    'فعالية'
                                )}
                            </strong>

                            <small>
                                ${escapeHtml(
                                    formatDate(
                                        event.event_date
                                    )
                                )}
                            </small>

                        </div>



                        <div
                            class="request-actions"
                        >

                            <button
                                type="button"

                                class="request-approve-btn"

                                data-registration-id="${escapeHtml(
                                    registration.id
                                )}"
                            >

                                <i
                                    class="bi bi-check-lg"
                                ></i>

                                قبول

                            </button>


                            <button
                                type="button"

                                class="request-reject-btn"

                                data-registration-id="${escapeHtml(
                                    registration.id
                                )}"
                            >

                                <i
                                    class="bi bi-x-lg"
                                ></i>

                                رفض

                            </button>

                        </div>

                    `;


                    requestsContainer
                        .appendChild(
                            card
                        );
                }
            );


            bindRequestButtons();
        }



        /* =========================================================
           BUTTON EVENTS
        ========================================================= */

        function bindRequestButtons() {


            document
                .querySelectorAll(
                    '.request-approve-btn'
                )
                .forEach(
                    function (
                        button
                    ) {

                        button.addEventListener(
                            'click',
                            function () {

                                approveRegistration(
                                    button.dataset.registrationId,
                                    button
                                );
                            }
                        );
                    }
                );



            document
                .querySelectorAll(
                    '.request-reject-btn'
                )
                .forEach(
                    function (
                        button
                    ) {

                        button.addEventListener(
                            'click',
                            function () {

                                rejectRegistration(
                                    button.dataset.registrationId,
                                    button
                                );
                            }
                        );
                    }
                );
        }



        /* =========================================================
           APPROVE
        ========================================================= */

        async function approveRegistration(
            id,
            button
        ) {

            if (!id) {
                return;
            }


            if (
                !window.confirm(
                    'هل تريد قبول طلب التسجيل؟'
                )
            ) {

                return;
            }


            button.disabled =
                true;


            try {

                const response =
                    await fetch(
                        `${approveRegistrationUrl}/${id}/approve`,
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


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر قبول الطلب.'
                    );
                }


                showToast(
                    data.message ||
                    'تم قبول طلب التسجيل.',
                    'success'
                );


                await Promise.all([
                    loadRegistrationRequests(),
                    loadEvents(),
                ]);


            } catch (error) {

                showToast(
                    error.message ||
                    'حدث خطأ أثناء قبول الطلب.',
                    'error'
                );


            } finally {

                button.disabled =
                    false;
            }
        }



        /* =========================================================
           REJECT
        ========================================================= */

        async function rejectRegistration(
            id,
            button
        ) {

            if (!id) {
                return;
            }


            if (
                !window.confirm(
                    'هل تريد رفض طلب التسجيل؟'
                )
            ) {

                return;
            }


            button.disabled =
                true;


            try {

                const response =
                    await fetch(
                        `${rejectRegistrationUrl}/${id}/reject`,
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


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر رفض الطلب.'
                    );
                }


                showToast(
                    data.message ||
                    'تم رفض طلب التسجيل.',
                    'success'
                );


                await Promise.all([
                    loadRegistrationRequests(),
                    loadEvents(),
                ]);


            } catch (error) {

                showToast(
                    error.message ||
                    'حدث خطأ أثناء رفض الطلب.',
                    'error'
                );


            } finally {

                button.disabled =
                    false;
            }
        }



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
                            loginUrl;
                    }
                }
            );



        /* =========================================================
           MOBILE SIDEBAR
        ========================================================= */

        menuToggle
            ?.addEventListener(
                'click',
                function () {

                    sidebar
                        ?.classList
                        .add(
                            'show'
                        );


                    sidebarOverlay
                        ?.classList
                        .add(
                            'show'
                        );
                }
            );


        sidebarOverlay
            ?.addEventListener(
                'click',
                function () {

                    sidebar
                        ?.classList
                        .remove(
                            'show'
                        );


                    sidebarOverlay
                        ?.classList
                        .remove(
                            'show'
                        );
                }
            );



        /* =========================================================
           START
        ========================================================= */

        async function start() {

            if (!token) {

                window.location.href =
                    loginUrl;

                return;
            }


            await Promise.all([
                loadDashboard(),
                loadEvents(),
                loadRegistrationRequests(),
            ]);
        }


        start();


    }
);