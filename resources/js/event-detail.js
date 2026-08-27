import './site-common.js';

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       PAGE
    ========================================================= */

    const page =
        document.getElementById('eventDetailPage');

    if (!page) {
        return;
    }


    /* =========================================================
       URLS
    ========================================================= */

    const eventId =
        page.dataset.eventId ||
        window.location.pathname
            .split('/')
            .filter(Boolean)
            .pop();


    const eventApiBase =
        page.dataset.eventApiBase ||
        '/api/events';


    const registerUrl =
        page.dataset.registerUrl ||
        '/api/registrations';


    const childrenUrl =
        page.dataset.childrenUrl ||
        '/api/children';


    const profileUrl =
        page.dataset.profileUrl ||
        '/api/profile';


    const loginUrl =
        page.dataset.loginUrl ||
        '/login';


    const profilePageUrl =
        page.dataset.profilePageUrl ||
        '/parent/profile';


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


        currentUser =
            user;


        authStorage.setItem(
            'farha_user',
            JSON.stringify(user)
        );
    }


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const loading =
        document.getElementById(
            'eventDetailLoading'
        );


    const errorBox =
        document.getElementById(
            'eventDetailError'
        );


    const errorMessage =
        document.getElementById(
            'eventDetailErrorMessage'
        );


    const retryButton =
        document.getElementById(
            'retryEventDetailButton'
        );


    const content =
        document.getElementById(
            'eventDetailContent'
        );


    const breadcrumbTitle =
        document.getElementById(
            'breadcrumbEventTitle'
        );


    const statusElement =
        document.getElementById(
            'evdStatus'
        );


    const titleElement =
        document.getElementById(
            'evdTitle'
        );


    const descriptionElement =
        document.getElementById(
            'evdDescription'
        );


    const dateElement =
        document.getElementById(
            'evdDate'
        );


    const timeElement =
        document.getElementById(
            'evdTime'
        );


    const locationElement =
        document.getElementById(
            'evdLocation'
        );


    const ageElement =
        document.getElementById(
            'evdAge'
        );


    const seatsElement =
        document.getElementById(
            'evdSeats'
        );


    const aboutElement =
        document.getElementById(
            'evdAbout'
        );


    const mainImage =
        document.getElementById(
            'eventMainImg'
        );


    const thumbsWrapper =
        document.getElementById(
            'evdThumbs'
        );


    const termsList =
        document.getElementById(
            'evdTerms'
        );


    const featuresList =
        document.getElementById(
            'evdFeatures'
        );


    const organizerName =
        document.getElementById(
            'evdOrgName'
        );


    const organizerDescription =
        document.getElementById(
            'evdOrgDesc'
        );


    const organizerFollowers =
        document.getElementById(
            'evdOrgFollowers'
        );


    const organizerEventsCount =
        document.getElementById(
            'evdOrgEventsCount'
        );


    const organizerLogo =
        document.getElementById(
            'evdOrgLogo'
        );


    const registerButton =
        document.getElementById(
            'evdRegisterBtn'
        );


    const registrationModalElement =
        document.getElementById(
            'registrationChildModal'
        );


    const childrenLoading =
        document.getElementById(
            'childrenModalLoading'
        );


    const childrenEmpty =
        document.getElementById(
            'childrenModalEmpty'
        );


    const childrenList =
        document.getElementById(
            'childrenSelectionList'
        );


    const notificationButton =
        document.getElementById(
            'eventNotificationButton'
        );


    const authArea =
        document.getElementById(
            'eventAuthArea'
        );


    const shareWhatsApp =
        document.getElementById(
            'shareWhatsApp'
        );


    const shareX =
        document.getElementById(
            'shareX'
        );


    const shareFacebook =
        document.getElementById(
            'shareFacebook'
        );


    const copyLinkButton =
        document.querySelector(
            '[data-copy-link]'
        );


    /* =========================================================
       STATE
    ========================================================= */

    let currentEvent = null;

    let currentSeatsLeft = null;

    let registrationClosed = false;

    let alreadyRegistered = false;


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


    function toBoolean(value) {

        return (
            value === true ||
            value === 1 ||
            value === '1' ||
            value === 'true'
        );
    }


    /* =========================================================
       IMAGE HELPERS
    ========================================================= */

    function getImageUrl(path) {

        if (!path) {
            return '/images.1/Image.png';
        }


        const value =
            String(path).trim();


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
            value.startsWith('images/')
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


    function setImageWithFallback(
        img,
        src,
        alt = ''
    ) {

        if (!img) {
            return;
        }


        img.alt =
            alt || 'صورة الفعالية';


        img.onerror =
            function () {

                const currentSrc =
                    img.getAttribute('src') || '';


                /*
                 * لو فشل /storage/... نجرب المسار من root
                 */
                if (
                    currentSrc.startsWith(
                        '/storage/'
                    )
                ) {

                    const withoutStorage =
                        currentSrc.replace(
                            '/storage/',
                            '/'
                        );


                    img.onerror =
                        function () {

                            this.onerror =
                                null;

                            this.src =
                                '/images.1/Image.png';
                        };


                    img.src =
                        withoutStorage;

                    return;
                }


                img.onerror =
                    null;


                img.src =
                    '/images.1/Image.png';
            };


        img.src =
            src;
    }


    /* =========================================================
       DATE / TIME
    ========================================================= */

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


        return date.toLocaleDateString(
            'ar',
            {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }
        );
    }


    function formatTime(value) {

        if (!value) {
            return '';
        }


        const clean =
            String(value)
                .slice(0, 5);


        const parts =
            clean.split(':');


        let hour =
            Number(parts[0]);


        const minute =
            parts[1] || '00';


        if (
            Number.isNaN(hour)
        ) {

            return clean;
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


    /* =========================================================
       EVENT DATE STATUS
    ========================================================= */

    function getEventEndDateTime(event) {

        const dateValue =
            event.event_date ||
            event.date;


        if (!dateValue) {
            return null;
        }


        const cleanDate =
            String(dateValue)
                .slice(0, 10);


        const timeValue =
            event.end_time ||
            event.start_time ||
            '23:59';


        const cleanTime =
            String(timeValue)
                .slice(0, 5);


        const date =
            new Date(
                `${cleanDate}T${cleanTime}:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;
        }


        return date;
    }


    function isEventExpired(event) {

        const endDate =
            getEventEndDateTime(event);


        if (!endDate) {
            return false;
        }


        return (
            endDate.getTime() <
            Date.now()
        );
    }


    /* =========================================================
       PAGE STATES
    ========================================================= */

    function showLoading() {

        loading
            ?.classList
            .remove('d-none');


        errorBox
            ?.classList
            .add('d-none');


        content
            ?.classList
            .add('d-none');
    }


    function showContent() {

        loading
            ?.classList
            .add('d-none');


        errorBox
            ?.classList
            .add('d-none');


        content
            ?.classList
            .remove('d-none');
    }


    function showError(message) {

        loading
            ?.classList
            .add('d-none');


        content
            ?.classList
            .add('d-none');


        errorBox
            ?.classList
            .remove('d-none');


        if (errorMessage) {

            errorMessage.textContent =
                message;
        }
    }


    /* =========================================================
       HEADER
    ========================================================= */

    function renderGuestHeader() {

        notificationButton
            ?.classList
            .add('d-none');


        if (!authArea) {
            return;
        }


        authArea.innerHTML = `

            <a
                href="${loginUrl}"
                class="icon-btn event-header-icon"
                title="تسجيل الدخول"
                aria-label="تسجيل الدخول"
            >
                <i class="bi bi-person"></i>
            </a>
        `;
    }


    function renderLoggedHeader() {

        if (!currentUser) {

            renderGuestHeader();

            return;
        }


        if (
            currentUser.role ===
            'parent'
        ) {

            notificationButton
                ?.classList
                .remove('d-none');

        } else {

            notificationButton
                ?.classList
                .add('d-none');
        }


        if (!authArea) {
            return;
        }


        let accountUrl =
            '/home';


        if (
            currentUser.role ===
            'parent'
        ) {

            accountUrl =
                profilePageUrl;
        }


        if (
            currentUser.role ===
            'organizer'
        ) {

            accountUrl =
                '/organizer/settings';
        }


        if (
            currentUser.role ===
            'admin'
        ) {

            accountUrl =
                '/admin/dashboard';
        }


        authArea.innerHTML = `

            <a
                href="${accountUrl}"
                class="icon-btn event-header-icon"
                title="${escapeHtml(
                    currentUser.name ||
                    'حسابي'
                )}"
                aria-label="حسابي"
            >
                <i class="bi bi-person"></i>
            </a>
        `;
    }


    async function loadCurrentUser() {

        if (!token) {

            renderGuestHeader();

            return;
        }


        try {

            const response =
                await fetch(
                    profileUrl,
                    {
                        method: 'GET',
                        headers: getHeaders(),
                    }
                );


            if (
                response.status ===
                401
            ) {

                clearAuthentication();

                renderGuestHeader();

                return;
            }


            if (!response.ok) {

                renderLoggedHeader();

                return;
            }


            const data =
                await response
                    .json()
                    .catch(() => ({}));


            const user =
                data.user ||
                data.data ||
                data;


            if (
                user &&
                user.id
            ) {

                saveCurrentUser(
                    user
                );
            }


            renderLoggedHeader();


        } catch (error) {

            console.error(
                'Profile error:',
                error
            );


            if (currentUser) {

                renderLoggedHeader();

            } else {

                renderGuestHeader();
            }
        }
    }


    /* =========================================================
       EVENT STATUS
    ========================================================= */

    function getEventStatus(
        event,
        seatsLeft
    ) {

        const status =
            String(
                event.status || ''
            ).toLowerCase();


        /*
         * أهم تعديل:
         * التاريخ انتهى
         */
        if (
            isEventExpired(event)
        ) {

            return {
                text:
                    'انتهت الفعالية',

                closed:
                    true,

                className:
                    'finished',
            };
        }


        if (
            status === 'rejected'
        ) {

            return {
                text:
                    'غير متاحة',

                closed:
                    true,

                className:
                    'closed',
            };
        }


        if (
            status === 'pending' ||
            status === 'draft'
        ) {

            return {
                text:
                    'قيد المراجعة',

                closed:
                    true,

                className:
                    'pending',
            };
        }


        if (
            status === 'finished' ||
            status === 'completed'
        ) {

            return {
                text:
                    'انتهت الفعالية',

                closed:
                    true,

                className:
                    'finished',
            };
        }


        if (
            event.registration_closed !==
                undefined &&
            toBoolean(
                event.registration_closed
            )
        ) {

            return {
                text:
                    'التسجيل مغلق',

                closed:
                    true,

                className:
                    'closed',
            };
        }


        if (
            event.registration_open !==
                undefined &&
            !toBoolean(
                event.registration_open
            )
        ) {

            return {
                text:
                    'التسجيل مغلق',

                closed:
                    true,

                className:
                    'closed',
            };
        }


        if (
            seatsLeft !== null &&
            seatsLeft <= 0
        ) {

            return {
                text:
                    'اكتملت المقاعد',

                closed:
                    true,

                className:
                    'full',
            };
        }


        return {
            text:
                'متاحة للتسجيل',

            closed:
                false,

            className:
                'available',
        };
    }


    /* =========================================================
       NORMALIZE LIST
    ========================================================= */

    function normalizeList(value) {

        if (
            Array.isArray(value)
        ) {

            return value;
        }


        if (!value) {

            return [];
        }


        if (
            typeof value ===
            'string'
        ) {

            try {

                const parsed =
                    JSON.parse(value);


                if (
                    Array.isArray(
                        parsed
                    )
                ) {

                    return parsed;
                }

            } catch (error) {

                return value
                    .split(/\r?\n/)
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean);
            }
        }


        return [];
    }


    function renderList(
        element,
        value,
        emptyText
    ) {

        if (!element) {
            return;
        }


        element.innerHTML =
            '';


        const list =
            normalizeList(value);


        if (!list.length) {

            const li =
                document
                    .createElement(
                        'li'
                    );


            li.textContent =
                emptyText;


            element
                .appendChild(
                    li
                );


            return;
        }


        list.forEach(
            function (item) {

                const li =
                    document
                        .createElement(
                            'li'
                        );


                if (
                    typeof item ===
                    'object'
                ) {

                    li.textContent =
                        item.text ||
                        item.title ||
                        item.name ||
                        '';

                } else {

                    li.textContent =
                        item;
                }


                element
                    .appendChild(
                        li
                    );
            }
        );
    }


    /* =========================================================
       GALLERY
    ========================================================= */

    function renderGallery(event) {

        let images = [];


        const primaryImage =
            event.image ||
            event.image_path ||
            event.cover_image ||
            event.photo ||
            event.image_url;


        if (primaryImage) {

            images.push(
                primaryImage
            );
        }


        let extraImages =
            event.images ||
            event.gallery ||
            [];


        if (
            typeof extraImages ===
            'string'
        ) {

            try {

                extraImages =
                    JSON.parse(
                        extraImages
                    );

            } catch (error) {

                extraImages =
                    [];
            }
        }


        if (
            Array.isArray(
                extraImages
            )
        ) {

            extraImages.forEach(
                function (item) {

                    if (!item) {
                        return;
                    }


                    if (
                        typeof item ===
                        'object'
                    ) {

                        const value =
                            item.path ||
                            item.image ||
                            item.url ||
                            item.image_path;


                        if (value) {

                            images.push(
                                value
                            );
                        }

                    } else {

                        images.push(
                            item
                        );
                    }
                }
            );
        }


        images =
            [...new Set(images)]
                .filter(Boolean);


        if (
            !images.length
        ) {

            images = [
                '/images.1/Image.png'
            ];
        }


        const mainSrc =
            getImageUrl(
                images[0]
            );


        setImageWithFallback(
            mainImage,
            mainSrc,
            event.title
        );


        if (
            !thumbsWrapper
        ) {

            return;
        }


        thumbsWrapper.innerHTML =
            '';


        if (
            images.length <= 1
        ) {

            return;
        }


        images
            .slice(0, 4)
            .forEach(
                function (
                    image,
                    index
                ) {

                    const src =
                        getImageUrl(
                            image
                        );


                    const button =
                        document
                            .createElement(
                                'button'
                            );


                    button.type =
                        'button';


                    button.dataset.img =
                        src;


                    if (
                        index === 0
                    ) {

                        button
                            .classList
                            .add(
                                'active'
                            );
                    }


                    const img =
                        document
                            .createElement(
                                'img'
                            );


                    setImageWithFallback(
                        img,
                        src,
                        event.title
                    );


                    button
                        .appendChild(
                            img
                        );


                    button
                        .addEventListener(
                            'click',
                            function () {

                                setImageWithFallback(
                                    mainImage,
                                    src,
                                    event.title
                                );


                                thumbsWrapper
                                    .querySelectorAll(
                                        'button'
                                    )
                                    .forEach(
                                        function (
                                            item
                                        ) {

                                            item
                                                .classList
                                                .remove(
                                                    'active'
                                                );
                                        }
                                    );


                                button
                                    .classList
                                    .add(
                                        'active'
                                    );
                            }
                        );


                    thumbsWrapper
                        .appendChild(
                            button
                        );
                }
            );
    }


    /* =========================================================
       ORGANIZER
    ========================================================= */

    function renderOrganizer(event) {

        const organizer =
            event.organizer ||
            {};


        if (
            organizerName
        ) {

            organizerName.textContent =
                organizer.name ||
                event.organizer_name ||
                'غير محدد';
        }


        if (
            organizerDescription
        ) {

            organizerDescription.textContent =
                organizer.description ||
                organizer.bio ||
                event.organizer_description ||
                '';
        }


        if (
            organizerFollowers
        ) {

            organizerFollowers.textContent =
                organizer.followers_count ??
                event.organizer_followers_count ??
                '-';
        }


        if (
            organizerEventsCount
        ) {

            organizerEventsCount.textContent =
                organizer.events_count ??
                event.organizer_events_count ??
                '-';
        }


        const organizerImage =
            organizer.profile_image ||
            organizer.logo ||
            organizer.image;


        if (
            organizerLogo &&
            organizerImage
        ) {

            const image =
                document
                    .createElement(
                        'img'
                    );


            image.style.width =
                '100%';


            image.style.height =
                '100%';


            image.style.objectFit =
                'cover';


            image.style.borderRadius =
                'inherit';


            setImageWithFallback(
                image,
                getImageUrl(
                    organizerImage
                ),
                organizer.name ||
                'المنظم'
            );


            organizerLogo.innerHTML =
                '';


            organizerLogo
                .appendChild(
                    image
                );
        }
    }


    /* =========================================================
       REGISTER BUTTON
    ========================================================= */

    function updateRegisterButton() {

        if (!registerButton) {
            return;
        }


        if (
            currentEvent &&
            isEventExpired(
                currentEvent
            )
        ) {

            registerButton.disabled =
                true;


            registerButton.textContent =
                'انتهت الفعالية';


            return;
        }


        if (
            alreadyRegistered
        ) {

            registerButton.disabled =
                true;


            registerButton.textContent =
                'تم التسجيل ✓';


            return;
        }


        if (
            registrationClosed
        ) {

            registerButton.disabled =
                true;


            if (
                currentSeatsLeft !== null &&
                currentSeatsLeft <= 0
            ) {

                registerButton.textContent =
                    'اكتملت المقاعد';

            } else {

                registerButton.textContent =
                    'التسجيل غير متاح';
            }


            return;
        }


        registerButton.disabled =
            false;


        registerButton.textContent =
            'سجل الآن';
    }


    /* =========================================================
       RENDER EVENT
    ========================================================= */

    function renderEvent(event) {

        currentEvent =
            event;


        /* =========================
           Title
        ========================= */

        if (
            titleElement
        ) {

            titleElement.textContent =
                event.title ||
                'فعالية';
        }


        if (
            breadcrumbTitle
        ) {

            breadcrumbTitle.textContent =
                event.title ||
                'تفاصيل الفعالية';
        }


        /* =========================
           Description
        ========================= */

        if (
            descriptionElement
        ) {

            descriptionElement.textContent =
                event.short_description ||
                event.description ||
                '';
        }


        /* =========================
           About
        ========================= */

        if (
            aboutElement
        ) {

            aboutElement.textContent =
                event.about ||
                event.description ||
                'لا توجد تفاصيل إضافية لهذه الفعالية.';
        }


        /* =========================
           Date
        ========================= */

        if (
            dateElement
        ) {

            dateElement.textContent =
                formatDate(
                    event.event_date ||
                    event.date
                );
        }


        /* =========================
           Time
        ========================= */

        const start =
            formatTime(
                event.start_time ||
                event.event_time
            );


        const end =
            formatTime(
                event.end_time
            );


        if (
            timeElement
        ) {

            if (
                start &&
                end
            ) {

                timeElement.textContent =
                    `${start} - ${end}`;

            } else {

                timeElement.textContent =
                    start ||
                    'غير محدد';
            }
        }


        /* =========================
           Location
        ========================= */

        const location =
            event.location ||
            event.place ||
            '';


        const address =
            event.address ||
            '';


        if (
            locationElement
        ) {

            locationElement.textContent =
                location &&
                address
                    ? `${location} - ${address}`
                    : (
                        location ||
                        address ||
                        'غير محدد'
                    );
        }


        /* =========================
           Age
        ========================= */

        if (
            ageElement
        ) {

            if (
                event.age_group
            ) {

                ageElement.textContent =
                    event.age_group;

            } else if (
                event.min_age != null &&
                event.max_age != null
            ) {

                ageElement.textContent =
                    `${event.min_age} - ${event.max_age}`;

            } else {

                ageElement.textContent =
                    'غير محدد';
            }
        }


        /* =========================
           Capacity / Seats
        ========================= */

        const capacityRaw =
            event.capacity ??
            event.max_capacity ??
            event.seats_total;


        const capacity =
            capacityRaw != null
                ? Number(
                    capacityRaw
                )
                : null;


        const registeredCount =
            Number(
                event.registrations_count ??
                event.registered_count ??
                event.registration_count ??
                event.capacity_current ??
                0
            );


        if (
            event.seats_left != null
        ) {

            currentSeatsLeft =
                Number(
                    event.seats_left
                );

        } else if (
            capacity !== null &&
            !Number.isNaN(
                capacity
            )
        ) {

            currentSeatsLeft =
                Math.max(
                    capacity -
                    registeredCount,
                    0
                );

        } else {

            currentSeatsLeft =
                null;
        }


        if (
            seatsElement
        ) {

            if (
                capacity !== null &&
                !Number.isNaN(
                    capacity
                )
            ) {

                if (
                    currentSeatsLeft > 0
                ) {

                    seatsElement.textContent =
                        `${currentSeatsLeft} مقعد متبقي من أصل ${capacity}`;

                } else {

                    seatsElement.textContent =
                        `لا توجد مقاعد متاحة من أصل ${capacity}`;
                }

            } else {

                seatsElement.textContent =
                    'غير محدد';
            }
        }


        /* =========================
           Status
        ========================= */

        const status =
            getEventStatus(
                event,
                currentSeatsLeft
            );


        registrationClosed =
            status.closed;


        if (
            statusElement
        ) {

            statusElement.textContent =
                status.text;


            statusElement.classList.remove(
                'available',
                'finished',
                'closed',
                'pending',
                'full'
            );


            statusElement.classList.add(
                status.className
            );
        }


        alreadyRegistered =
            toBoolean(
                event.is_registered
            ) ||
            toBoolean(
                event.already_registered
            );


        updateRegisterButton();


        /* =========================
           Gallery
        ========================= */

        renderGallery(
            event
        );


        /* =========================
           Terms
        ========================= */

        renderList(
            termsList,
            event.terms ||
            event.conditions,
            'لا توجد شروط مضافة لهذه الفعالية.'
        );


        /* =========================
           Features
        ========================= */

        renderList(
            featuresList,
            event.features,
            'لا توجد مميزات مضافة لهذه الفعالية.'
        );


        /* =========================
           Organizer
        ========================= */

        renderOrganizer(
            event
        );


        /* =========================
           Share
        ========================= */

        updateShareLinks();


        document.title =
            `${event.title || 'تفاصيل الفعالية'} - فرحة`;


        showContent();
    }


    /* =========================================================
       LOAD EVENT
    ========================================================= */

    async function loadEvent() {

        if (!eventId) {

            showError(
                'رقم الفعالية غير موجود.'
            );

            return;
        }


        showLoading();


        try {

            const url =
                `${eventApiBase}/${eventId}`;


            const response =
                await fetch(
                    url,
                    {
                        method: 'GET',
                        headers: getHeaders(),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            console.log(
                'Event API:',
                response.status,
                data
            );


            if (
                response.status ===
                404
            ) {

                throw new Error(
                    'الفعالية غير موجودة.'
                );
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `تعذر تحميل تفاصيل الفعالية (${response.status}).`
                );
            }


            const event =
                data.event ||
                data.data ||
                data;


            if (
                !event ||
                typeof event !==
                'object'
            ) {

                throw new Error(
                    'بيانات الفعالية غير صحيحة.'
                );
            }


            renderEvent(
                event
            );


        } catch (error) {

            console.error(
                'Event details error:',
                error
            );


            showError(
                error.message ||
                'تعذر تحميل تفاصيل الفعالية.'
            );
        }
    }


    /* =========================================================
       LOAD CHILDREN
    ========================================================= */

    async function loadChildren() {

        if (!childrenList) {
            return;
        }


        childrenList.innerHTML =
            '';


        childrenLoading
            ?.classList
            .remove('d-none');


        childrenEmpty
            ?.classList
            .add('d-none');


        try {

            const response =
                await fetch(
                    childrenUrl,
                    {
                        method: 'GET',
                        headers: getHeaders(),
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
                    'تعذر تحميل الأطفال.'
                );
            }


            const children =
                Array.isArray(data)
                    ? data
                    : (
                        data.children ||
                        data.data ||
                        []
                    );


            if (
                !children.length
            ) {

                childrenEmpty
                    ?.classList
                    .remove('d-none');


                return;
            }


            children.forEach(
                function (child) {

                    const button =
                        document
                            .createElement(
                                'button'
                            );


                    button.type =
                        'button';


                    button.className =
                        'btn btn-outline-primary text-end';


                    button.innerHTML = `

                        <div
                            class="d-flex align-items-center justify-content-between gap-2"
                        >

                            <div>

                                <strong>
                                    ${escapeHtml(
                                        child.name ||
                                        'طفل'
                                    )}
                                </strong>

                                ${
                                    child.birth_date
                                        ? `
                                            <small class="d-block mt-1 text-muted">
                                                ${escapeHtml(
                                                    child.birth_date
                                                )}
                                            </small>
                                        `
                                        : ''
                                }

                            </div>

                            <i class="bi bi-chevron-left"></i>

                        </div>
                    `;


                    button
                        .addEventListener(
                            'click',
                            function () {

                                registerChild(
                                    child.id,
                                    button
                                );
                            }
                        );


                    childrenList
                        .appendChild(
                            button
                        );
                }
            );


        } catch (error) {

            console.error(
                'Children error:',
                error
            );


            showToast(
                error.message ||
                'تعذر تحميل الأطفال.',
                'error'
            );


        } finally {

            childrenLoading
                ?.classList
                .add('d-none');
        }
    }


    /* =========================================================
       REGISTER CHILD
    ========================================================= */

    async function registerChild(
        childId,
        button
    ) {

        button.disabled =
            true;


        const oldContent =
            button.innerHTML;


        button.innerHTML = `

            <span
                class="spinner-border spinner-border-sm"
            ></span>

            جاري التسجيل...
        `;


        try {

            const response =
                await fetch(
                    registerUrl,
                    {
                        method: 'POST',

                        headers:
                            getHeaders({
                                'Content-Type':
                                    'application/json',
                            }),

                        body:
                            JSON.stringify({
                                event_id:
                                    Number(eventId),

                                child_id:
                                    Number(childId),
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
                    loginUrl;


                return;
            }


            if (
                response.status ===
                422
            ) {

                const errors =
                    Object.values(
                        data.errors ||
                        {}
                    )
                    .flat();


                throw new Error(
                    errors[0] ||
                    data.message ||
                    'تعذر التسجيل.'
                );
            }


            if (
                response.status ===
                409
            ) {

                throw new Error(
                    data.message ||
                    'تم التسجيل مسبقًا.'
                );
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر التسجيل في الفعالية.'
                );
            }


            alreadyRegistered =
                true;


            if (
                registrationModalElement &&
                window.bootstrap
            ) {

                const modal =
                    bootstrap.Modal
                        .getInstance(
                            registrationModalElement
                        );


                modal?.hide();
            }


            showToast(
                data.message ||
                'تم التسجيل في الفعالية بنجاح.',
                'success'
            );


            /*
             * أهم تعديل:
             * نعيد تحميل بيانات الفعالية
             * حتى ينقص عدد المقاعد مباشرة.
             */
            await loadEvent();


        } catch (error) {

            console.error(
                'Register error:',
                error
            );


            showToast(
                error.message ||
                'حدث خطأ أثناء التسجيل.',
                'error'
            );


        } finally {

            button.disabled =
                false;


            button.innerHTML =
                oldContent;
        }
    }


    /* =========================================================
       REGISTER BUTTON CLICK
    ========================================================= */

    registerButton
        ?.addEventListener(
            'click',
            async function () {

                if (
                    currentEvent &&
                    isEventExpired(
                        currentEvent
                    )
                ) {

                    showToast(
                        'انتهت هذه الفعالية ولا يمكن التسجيل فيها.',
                        'warning'
                    );

                    return;
                }


                if (
                    alreadyRegistered
                ) {

                    showToast(
                        'تم التسجيل في هذه الفعالية مسبقًا.',
                        'info'
                    );

                    return;
                }


                if (
                    registrationClosed
                ) {

                    showToast(
                        currentSeatsLeft !==
                            null &&
                        currentSeatsLeft <= 0
                            ? 'لا توجد مقاعد متاحة حاليًا.'
                            : 'التسجيل مغلق حاليًا.',
                        'warning'
                    );

                    return;
                }


                if (!token) {

                    sessionStorage.setItem(
                        'farha_redirect_after_login',
                        window.location.href
                    );


                    window.location.href =
                        loginUrl;


                    return;
                }


                if (
                    !currentUser
                ) {

                    await loadCurrentUser();
                }


                if (
                    currentUser?.role !==
                    'parent'
                ) {

                    showToast(
                        'التسجيل متاح لأولياء الأمور فقط.',
                        'warning'
                    );

                    return;
                }


                if (
                    !registrationModalElement
                ) {

                    showToast(
                        'تعذر فتح نافذة اختيار الطفل.',
                        'error'
                    );

                    return;
                }


                const modal =
                    new bootstrap.Modal(
                        registrationModalElement
                    );


                modal.show();


                loadChildren();
            }
        );


    /* =========================================================
       SHARE
    ========================================================= */

    function updateShareLinks() {

        const pageUrl =
            encodeURIComponent(
                window.location.href
            );


        const eventTitle =
            encodeURIComponent(
                currentEvent?.title ||
                'فعالية على منصة فرحة'
            );


        if (
            shareWhatsApp
        ) {

            shareWhatsApp.href =
                `https://wa.me/?text=${eventTitle}%20${pageUrl}`;
        }


        if (
            shareX
        ) {

            shareX.href =
                `https://twitter.com/intent/tweet?text=${eventTitle}&url=${pageUrl}`;
        }


        if (
            shareFacebook
        ) {

            shareFacebook.href =
                `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        }
    }


    copyLinkButton
        ?.addEventListener(
            'click',
            async function () {

                try {

                    await navigator
                        .clipboard
                        .writeText(
                            window.location.href
                        );


                    showToast(
                        'تم نسخ رابط الفعالية.',
                        'success'
                    );


                } catch (error) {

                    showToast(
                        'تعذر نسخ الرابط.',
                        'error'
                    );
                }
            }
        );


    /* =========================================================
       RETRY
    ========================================================= */

    retryButton
        ?.addEventListener(
            'click',
            loadEvent
        );


    /* =========================================================
       START
    ========================================================= */

    loadCurrentUser();

    loadEvent();

});