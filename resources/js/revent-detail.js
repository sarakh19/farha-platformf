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
       URLS / EVENT ID
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


    const myEventsUrl =
        page.dataset.myEventsUrl ||
        '/parent/my-events';


    const notificationsUrl =
        page.dataset.notificationsUrl ||
        '/parent/notifications';


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


    function getStoredUser() {

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
        getStoredUser();


    function authHeaders(extra = {}) {

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


        authStorage.setItem(
            'farha_user',
            JSON.stringify(user)
        );


        currentUser =
            user;
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


    /* Event */

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


    /* Gallery */

    const mainImage =
        document.getElementById(
            'eventMainImg'
        );


    const thumbsWrapper =
        document.getElementById(
            'evdThumbs'
        );


    /* Lists */

    const termsList =
        document.getElementById(
            'evdTerms'
        );


    const featuresList =
        document.getElementById(
            'evdFeatures'
        );


    /* Organizer */

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


    const organizerEventsButton =
        document.getElementById(
            'evdOrganizerEvents'
        );


    /* Registration */

    const registerButton =
        document.getElementById(
            'evdRegisterBtn'
        );


    /* Children Modal */

    const modalElement =
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


    /* Header */

    const notificationButton =
        document.getElementById(
            'eventNotificationButton'
        );


    const authArea =
        document.getElementById(
            'eventAuthArea'
        );


    /* Share */

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

            return;
        }


        alert(message);
    }


    function escapeHtml(value) {

        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }


    function getImageUrl(path) {

        if (!path) {

            return '/images.1/Imag1.png';
        }


        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('/')
        ) {

            return path;
        }


        return `/storage/${path}`;
    }


    function formatDate(value) {

        if (!value) {

            return 'غير محدد';
        }


        const date =
            new Date(
                `${String(value).slice(0, 10)}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;
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


        const parts =
            String(value)
                .slice(0, 5)
                .split(':');


        let hour =
            Number(parts[0]);


        const minute =
            parts[1] ||
            '00';


        const period =
            hour >= 12
                ? 'م'
                : 'ص';


        hour =
            hour % 12;


        if (
            hour === 0
        ) {

            hour = 12;
        }


        return `${hour}:${minute} ${period}`;
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


        if (
            errorMessage
        ) {

            errorMessage.textContent =
                message;
        }
    }


    /* =========================================================
       LOAD CURRENT USER
    ========================================================= */

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
                        headers:
                            authHeaders(),
                    }
                );


            if (
                response.status === 401
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
                    .catch(
                        () => ({})
                    );


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
                'Load current user error:',
                error
            );


            if (
                currentUser
            ) {

                renderLoggedHeader();

            } else {

                renderGuestHeader();
            }
        }
    }


    /* =========================================================
       HEADER
    ========================================================= */

    function renderGuestHeader() {

        notificationButton
            ?.classList
            .add('d-none');


        if (
            !authArea
        ) {
            return;
        }


        authArea.innerHTML = `

            <a
                href="${loginUrl}"
                class="icon-btn"
                aria-label="تسجيل الدخول"
            >
                <i class="bi bi-person"></i>
            </a>
        `;
    }


    function renderLoggedHeader() {

        if (
            !currentUser
        ) {

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


        if (
            !authArea
        ) {
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

        } else if (
            currentUser.role ===
            'organizer'
        ) {

            accountUrl =
                '/organizer/profile';

        } else if (
            currentUser.role ===
            'admin'
        ) {

            accountUrl =
                '/admin/dashboard';
        }


        authArea.innerHTML = `

            <a
                href="${accountUrl}"
                class="icon-btn"
                aria-label="حسابي"
                title="${escapeHtml(
                    currentUser.name ||
                    'حسابي'
                )}"
            >
                <i class="bi bi-person"></i>
            </a>
        `;
    }


    /* =========================================================
       EVENT STATUS
    ========================================================= */

    function getEventStatus(
        event,
        seatsLeft
    ) {

        const rawStatus =
            String(
                event.status ||
                ''
            ).toLowerCase();


        if (
            rawStatus === 'rejected'
        ) {

            return {
                label:
                    'غير متاحة',

                closed:
                    true,
            };
        }


        if (
            rawStatus === 'draft' ||
            rawStatus === 'pending'
        ) {

            return {
                label:
                    'غير متاحة للتسجيل',

                closed:
                    true,
            };
        }


        if (
            rawStatus === 'finished'
        ) {

            return {
                label:
                    'انتهت الفعالية',

                closed:
                    true,
            };
        }


        if (
            event.registration_open !== undefined &&
            !toBoolean(
                event.registration_open
            )
        ) {

            return {
                label:
                    'التسجيل مغلق',

                closed:
                    true,
            };
        }


        if (
            event.registration_closed !== undefined &&
            toBoolean(
                event.registration_closed
            )
        ) {

            return {
                label:
                    'التسجيل مغلق',

                closed:
                    true,
            };
        }


        if (
            seatsLeft !== null &&
            seatsLeft <= 0
        ) {

            return {
                label:
                    'اكتملت المقاعد',

                closed:
                    true,
            };
        }


        const dateValue =
            event.event_date ||
            event.date;


        if (
            dateValue
        ) {

            const eventDate =
                new Date(
                    `${String(dateValue).slice(0, 10)}T${
                        event.end_time ||
                        event.start_time ||
                        '23:59'
                    }`
                );


            if (
                !Number.isNaN(
                    eventDate.getTime()
                ) &&
                eventDate <
                new Date()
            ) {

                return {
                    label:
                        'انتهت الفعالية',

                    closed:
                        true,
                };
            }
        }


        return {
            label:
                'متاحة للتسجيل',

            closed:
                false,
        };
    }


    /* =========================================================
       GALLERY
    ========================================================= */

    function renderGallery(event) {

        let images =
            event.images ||
            [];


        if (
            typeof images ===
            'string'
        ) {

            try {

                images =
                    JSON.parse(images);

            } catch (error) {

                images = [];
            }
        }


        if (
            !Array.isArray(images)
        ) {

            images = [];
        }


        const primaryImage =
            event.image ||
            event.image_path ||
            event.cover_image;


        if (
            primaryImage &&
            !images.length
        ) {

            images.push(
                primaryImage
            );
        }


        const normalizedImages =
            images
                .map(
                    function (image) {

                        if (
                            typeof image ===
                            'object'
                        ) {

                            return (
                                image.path ||
                                image.image ||
                                image.url
                            );
                        }


                        return image;
                    }
                )
                .filter(Boolean);


        if (
            !normalizedImages.length
        ) {

            normalizedImages.push(
                '/images.1/Imag1.png'
            );
        }


        const firstImage =
            getImageUrl(
                normalizedImages[0]
            );


        if (
            mainImage
        ) {

            mainImage.src =
                firstImage;


            mainImage.alt =
                event.title ||
                'صورة الفعالية';
        }


        if (
            !thumbsWrapper
        ) {
            return;
        }


        thumbsWrapper.innerHTML =
            '';


        normalizedImages
            .slice(0, 4)
            .forEach(
                function (
                    image,
                    index
                ) {

                    const imageUrl =
                        getImageUrl(
                            image
                        );


                    const button =
                        document.createElement(
                            'button'
                        );


                    button.type =
                        'button';


                    button.dataset.img =
                        imageUrl;


                    if (
                        index === 0
                    ) {

                        button.classList.add(
                            'active'
                        );
                    }


                    const imageElement =
                        document.createElement(
                            'img'
                        );


                    imageElement.src =
                        imageUrl;


                    imageElement.alt =
                        event.title ||
                        'صورة الفعالية';


                    button.appendChild(
                        imageElement
                    );


                    button.addEventListener(
                        'click',
                        function () {

                            if (
                                mainImage
                            ) {

                                mainImage.src =
                                    imageUrl;
                            }


                            thumbsWrapper
                                .querySelectorAll(
                                    'button'
                                )
                                .forEach(
                                    function (
                                        item
                                    ) {

                                        item.classList
                                            .remove(
                                                'active'
                                            );
                                    }
                                );


                            button.classList.add(
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
       LIST RENDER
    ========================================================= */

    function normalizeList(value) {

        if (
            Array.isArray(value)
        ) {

            return value;
        }


        if (
            typeof value ===
            'string'
        ) {

            try {

                const parsed =
                    JSON.parse(value);


                if (
                    Array.isArray(parsed)
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
        values,
        emptyMessage
    ) {

        if (!element) {
            return;
        }


        element.innerHTML =
            '';


        const list =
            normalizeList(
                values
            );


        if (
            !list.length
        ) {

            const li =
                document.createElement(
                    'li'
                );


            li.textContent =
                emptyMessage;


            element.appendChild(
                li
            );


            return;
        }


        list.forEach(
            function (item) {

                const li =
                    document.createElement(
                        'li'
                    );


                li.textContent =
                    typeof item ===
                    'object'
                        ? (
                            item.text ||
                            item.title ||
                            item.name ||
                            ''
                        )
                        : item;


                element.appendChild(
                    li
                );
            }
        );
    }


    /* =========================================================
       REGISTER BUTTON STATE
    ========================================================= */

    function updateRegisterButton() {

        if (
            !registerButton
        ) {
            return;
        }


        if (
            alreadyRegistered
        ) {

            registerButton.disabled =
                true;


            registerButton.textContent =
                'تم التسجيل ✓';


            registerButton.style.opacity =
                '0.75';


            return;
        }


        if (
            registrationClosed
        ) {

            registerButton.disabled =
                true;


            registerButton.textContent =
                currentSeatsLeft !== null &&
                currentSeatsLeft <= 0
                    ? 'اكتملت المقاعد'
                    : 'التسجيل غير متاح';


            registerButton.style.opacity =
                '0.75';


            return;
        }


        registerButton.disabled =
            false;


        registerButton.textContent =
            'سجل الآن';


        registerButton.style.opacity =
            '1';
    }


    /* =========================================================
       RENDER EVENT
    ========================================================= */

    function renderEvent(event) {

        currentEvent =
            event;


        if (
            titleElement
        ) {

            titleElement.textContent =
                event.title ||
                'فعالية';
        }


        if (
            descriptionElement
        ) {

            descriptionElement.textContent =
                event.short_description ||
                event.description ||
                '';
        }


        if (
            aboutElement
        ) {

            aboutElement.textContent =
                event.about ||
                event.description ||
                'لا توجد تفاصيل إضافية لهذه الفعالية.';
        }


        if (
            dateElement
        ) {

            dateElement.textContent =
                formatDate(
                    event.event_date ||
                    event.date
                );
        }


        const startTime =
            formatTime(
                event.start_time
            );


        const endTime =
            formatTime(
                event.end_time
            );


        if (
            timeElement
        ) {

            timeElement.textContent =
                startTime && endTime
                    ? `${startTime} - ${endTime}`
                    : (
                        startTime ||
                        'غير محدد'
                    );
        }


        if (
            locationElement
        ) {

            const location =
                event.location ||
                event.place ||
                '';


            const address =
                event.address ||
                '';


            locationElement.textContent =
                location && address
                    ? `${location} - ${address}`
                    : (
                        location ||
                        address ||
                        'غير محدد'
                    );
        }


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
                    `${event.min_age} - ${event.max_age} سنة`;

            } else {

                ageElement.textContent =
                    'غير محدد';
            }
        }


        const capacity =
            event.capacity != null
                ? Number(
                    event.capacity
                )
                : null;


        const registrationsCount =
            Number(
                event.registrations_count ??
                event.registration_count ??
                event.registered_count ??
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
                    registrationsCount,
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
                    currentSeatsLeft >
                    0
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
                status.label;
        }


        alreadyRegistered =
            toBoolean(
                event.is_registered
            ) ||
            toBoolean(
                event.already_registered
            );


        updateRegisterButton();


        renderGallery(
            event
        );


        renderList(
            termsList,
            event.terms ||
            event.conditions,
            'لا توجد شروط مضافة لهذه الفعالية.'
        );


        renderList(
            featuresList,
            event.features,
            'لا توجد مميزات مضافة لهذه الفعالية.'
        );


        renderOrganizer(
            event
        );


        updateShareLinks();


        document.title =
            `${event.title || 'تفاصيل الفعالية'} - فرحة`;


        showContent();
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
            organizer.logo ||
            organizer.profile_image ||
            organizer.image;


        if (
            organizerLogo &&
            organizerImage
        ) {

            organizerLogo.innerHTML = `

                <img
                    src="${escapeHtml(
                        getImageUrl(
                            organizerImage
                        )
                    )}"
                    alt="${escapeHtml(
                        organizer.name ||
                        'المنظم'
                    )}"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        border-radius:inherit;
                    "
                >
            `;
        }


        const organizerId =
            organizer.id ||
            event.organizer_id;


        if (
            organizerEventsButton &&
            organizerId
        ) {

            organizerEventsButton.href =
                `/events?organizer_id=${organizerId}`;
        }
    }


    /* =========================================================
       LOAD EVENT
    ========================================================= */

    async function loadEvent() {

        if (
            !eventId ||
            eventId ===
            'undefined'
        ) {

            showError(
                'رقم الفعالية غير موجود.'
            );

            return;
        }


        showLoading();


        try {

            const response =
                await fetch(
                    `${eventApiBase}/${eventId}`,
                    {
                        method: 'GET',

                        headers:
                            authHeaders(),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            if (
                response.status === 404
            ) {

                throw new Error(
                    'الفعالية غير موجودة.'
                );
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل تفاصيل الفعالية.'
                );
            }


            const event =
                data.event ||
                data.data ||
                data;


            if (
                !event ||
                !event.id
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
                'Load event error:',
                error
            );


            showError(
                error.message ||
                'تعذر تحميل تفاصيل الفعالية.'
            );
        }
    }


    /* =========================================================
       CHILDREN
    ========================================================= */

    async function loadChildren() {

        if (
            !childrenList
        ) {
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

                        headers:
                            authHeaders(),
                    }
                );


            const data =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


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
                        document.createElement(
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
                                            <small
                                                class="d-block mt-1 text-muted"
                                            >
                                                تاريخ الميلاد:
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


                    button.addEventListener(
                        'click',
                        function () {

                            registerChild(
                                child.id,
                                button
                            );
                        }
                    );


                    childrenList.appendChild(
                        button
                    );
                }
            );


        } catch (error) {

            console.error(
                'Load children error:',
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

        if (
            !childId
        ) {

            showToast(
                'لم يتم تحديد الطفل.',
                'warning'
            );

            return;
        }


        button.disabled =
            true;


        const originalText =
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
                            authHeaders({
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
                response.status === 401
            ) {

                clearAuthentication();


                window.location.href =
                    loginUrl;


                return;
            }


            if (
                response.status === 403
            ) {

                throw new Error(
                    data.message ||
                    'ليس لديك صلاحية للتسجيل في هذه الفعالية.'
                );
            }


            if (
                response.status === 422
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
                    'تعذر التسجيل في الفعالية.'
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
                currentSeatsLeft !== null &&
                currentSeatsLeft > 0
            ) {

                currentSeatsLeft--;
            }


            if (
                modalElement &&
                window.bootstrap
            ) {

                const modal =
                    bootstrap.Modal.getInstance(
                        modalElement
                    );


                modal?.hide();
            }


            showToast(
                data.message ||
                'تم التسجيل في الفعالية بنجاح.',
                'success'
            );


            updateRegisterButton();


            /*
             * إعادة تحميل الفعالية
             * لتحديث عدد المقاعد من الـBackend.
             */
            setTimeout(
                function () {

                    loadEvent();
                },
                500
            );


        } catch (error) {

            console.error(
                'Registration error:',
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
                originalText;
        }
    }


    /* =========================================================
       REGISTER BUTTON
    ========================================================= */

    registerButton
        ?.addEventListener(
            'click',
            async function (
                event
            ) {

                event.preventDefault();


                if (
                    alreadyRegistered
                ) {

                    showToast(
                        'أنت مسجل في هذه الفعالية بالفعل.',
                        'info'
                    );


                    return;
                }


                if (
                    registrationClosed
                ) {

                    if (
                        currentSeatsLeft !== null &&
                        currentSeatsLeft <= 0
                    ) {

                        showToast(
                            'لا توجد مقاعد متاحة حالياً.',
                            'warning'
                        );

                    } else {

                        showToast(
                            'التسجيل في هذه الفعالية مغلق حالياً.',
                            'warning'
                        );
                    }


                    return;
                }


                /*
                 * Guest
                 */
                if (!token) {

                    sessionStorage.setItem(
                        'farha_redirect_after_login',
                        window.location.href
                    );


                    showToast(
                        'يرجى تسجيل الدخول أولاً.',
                        'warning'
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                loginUrl;
                        },
                        700
                    );


                    return;
                }


                /*
                 * عند وجود Token لكن user غير محمل
                 */
                if (
                    !currentUser
                ) {

                    await loadCurrentUser();
                }


                if (
                    !currentUser
                ) {

                    window.location.href =
                        loginUrl;

                    return;
                }


                /*
                 * Registration is Parent-only
                 */
                if (
                    currentUser.role !==
                    'parent'
                ) {

                    showToast(
                        'التسجيل في الفعاليات متاح لأولياء الأمور فقط.',
                        'warning'
                    );


                    return;
                }


                if (
                    !modalElement
                ) {

                    showToast(
                        'تعذر فتح نافذة اختيار الطفل.',
                        'error'
                    );


                    return;
                }


                const modal =
                    new bootstrap.Modal(
                        modalElement
                    );


                modal.show();


                await loadChildren();
            }
        );


    /* =========================================================
       SHARE
    ========================================================= */

    function updateShareLinks() {

        const rawUrl =
            window.location.href;


        const encodedUrl =
            encodeURIComponent(
                rawUrl
            );


        const encodedTitle =
            encodeURIComponent(
                currentEvent?.title ||
                'فعالية على منصة فرحة'
            );


        if (
            shareWhatsApp
        ) {

            shareWhatsApp.href =
                `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        }


        if (
            shareX
        ) {

            shareX.href =
                `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        }


        if (
            shareFacebook
        ) {

            shareFacebook.href =
                `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        }
    }


    copyLinkButton
        ?.addEventListener(
            'click',
            async function (
                event
            ) {

                event.preventDefault();


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

                    console.error(
                        'Copy link error:',
                        error
                    );


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
            function () {

                loadEvent();
            }
        );


    /* =========================================================
       START
    ========================================================= */

    loadCurrentUser();

    loadEvent();

});