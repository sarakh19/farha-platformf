import './site-common.js';
import './messages.js';

document.addEventListener('DOMContentLoaded', function () {

    const page = document.getElementById('eventsPage');

    if (!page) {
        return;
    }

    /* =========================================================
       URLs
    ========================================================= */

    const eventsApi = page.dataset.eventsApi;
    const categoriesApi = page.dataset.categoriesApi;
    const eventDetailsBase = page.dataset.eventDetailsBase;


    /* =========================================================
       Elements
    ========================================================= */

    const searchInput =
        document.getElementById('eventsSearch');

    const categorySelect =
        document.getElementById('eventsCategoryFilter');

    const locationSelect =
        document.getElementById('eventsLocationFilter');

    const ageSelect =
        document.getElementById('eventsAgeFilter');

    const dateSelect =
        document.getElementById('eventsDateFilter');

    const filterButton =
        document.getElementById('applyEventsFilters');

    const resetButton =
        document.getElementById('resetEventsFilters');

    const openCheckbox =
        document.getElementById('openRegistrationFilter');

    const seatsCheckbox =
        document.getElementById('availableSeatsFilter');

    const sortSelect =
        document.getElementById('eventsSort');

    const categoryList =
        document.getElementById('eventsCategoryList');

    const resultCount =
        document.getElementById('eventsResultCount');

    const eventsGrid =
        document.getElementById('eventsGrid');

    const loading =
        document.getElementById('eventsLoading');

    const errorBox =
        document.getElementById('eventsError');

    const errorMessage =
        document.getElementById('eventsErrorMessage');

    const retryButton =
        document.getElementById('retryEventsButton');

    const emptyState =
        document.getElementById('eventsEmpty');

    const pagination =
        document.getElementById('eventsPagination');

    const gridViewButton =
        document.getElementById('gridViewButton');

    const listViewButton =
        document.getElementById('listViewButton');


    /* =========================================================
       State
    ========================================================= */

    let allEvents = [];
    let filteredEvents = [];
    let categories = [];

    let activeCategoryId = '';

    /*
     * هذا مهم جدًا:
     * إذا جئنا من صفحة المنظمين:
     * /events?organizer_id=5
     * نخزن ID المنظم هنا.
     */
    let activeOrganizerId = '';

    let currentPage = 1;

    const perPage = 6;


    /* =========================================================
       Helpers
    ========================================================= */

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

        const date =
            new Date(
                value + 'T00:00:00'
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
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );
    }


    function formatTime(value) {

        if (!value) {
            return 'غير محدد';
        }

        const parts =
            String(value).split(':');

        let hour =
            Number(parts[0]);

        const minute =
            parts[1] || '00';

        const period =
            hour >= 12
                ? 'م'
                : 'ص';

        hour =
            hour % 12;

        if (hour === 0) {
            hour = 12;
        }

        return `${hour}:${minute} ${period}`;
    }


    function getEventImage(event) {

        if (!event?.image) {
            return '/images.1/Imag1.png';
        }

        if (
            event.image.startsWith('http://') ||
            event.image.startsWith('https://') ||
            event.image.startsWith('/')
        ) {
            return event.image;
        }

        return `/storage/${event.image}`;
    }


    function getCategoryColor(index) {

        const colors = [
            'orange',
            'blue',
            'green',
            'pink',
            'purple'
        ];

        return colors[
            index % colors.length
        ];
    }


    function getEventDateTime(event) {

        if (!event.event_date) {
            return null;
        }

        const dateTime =
            new Date(
                `${event.event_date}T${event.start_time || '00:00'}`
            );

        if (
            Number.isNaN(
                dateTime.getTime()
            )
        ) {
            return null;
        }

        return dateTime;
    }


    function hasAvailableSeats(event) {

        const capacity =
            Number(event.capacity) || 0;

        const registrationCount =
            Number(
                event.registrations_count ??
                event.registration_count ??
                event.registered_count ??
                0
            );

        if (capacity <= 0) {
            return false;
        }

        return registrationCount < capacity;
    }


    function registrationStillOpen(event) {

        const dateTime =
            getEventDateTime(event);

        if (!dateTime) {
            return false;
        }

        return dateTime > new Date();
    }


    /* =========================================================
       Query String
    ========================================================= */

    function loadFiltersFromUrl() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const search =
            params.get('search');

        const categoryId =
            params.get('category_id');

        const location =
            params.get('location');

        const ageGroup =
            params.get('age_group');

        /*
         * NEW
         * المنظم القادم من صفحة "للمنظمين"
         */
        const organizerId =
            params.get('organizer_id');


        if (
            search &&
            searchInput
        ) {
            searchInput.value =
                search;
        }


        if (categoryId) {
            activeCategoryId =
                categoryId;
        }


        if (
            location &&
            locationSelect
        ) {
            locationSelect.value =
                location;
        }


        if (
            ageGroup &&
            ageSelect
        ) {
            ageSelect.value =
                ageGroup;
        }


        if (organizerId) {
            activeOrganizerId =
                organizerId;
        }
    }


    function updateUrl() {

        const params =
            new URLSearchParams();


        const search =
            searchInput
                ?.value
                .trim();


        if (search) {
            params.set(
                'search',
                search
            );
        }


        const categoryId =
            categorySelect?.value ||
            activeCategoryId;


        if (categoryId) {
            params.set(
                'category_id',
                categoryId
            );
        }


        if (locationSelect?.value) {
            params.set(
                'location',
                locationSelect.value
            );
        }


        if (ageSelect?.value) {
            params.set(
                'age_group',
                ageSelect.value
            );
        }


        /*
         * NEW
         * مهم حتى لا يختفي organizer_id
         * عند استخدام البحث أو الفلاتر.
         */
        if (activeOrganizerId) {
            params.set(
                'organizer_id',
                activeOrganizerId
            );
        }


        const query =
            params.toString();


        const url =
            query
                ? `${window.location.pathname}?${query}`
                : window.location.pathname;


        window.history.replaceState(
            {},
            '',
            url
        );
    }


    /* =========================================================
       Loading
    ========================================================= */

    function showLoading() {

        loading
            ?.classList
            .remove('d-none');

        errorBox
            ?.classList
            .add('d-none');

        emptyState
            ?.classList
            .add('d-none');
    }


    function hideLoading() {

        loading
            ?.classList
            .add('d-none');
    }


    function showError(message) {

        loading
            ?.classList
            .add('d-none');

        errorBox
            ?.classList
            .remove('d-none');

        if (errorMessage) {

            errorMessage.textContent =
                message ||
                'تعذر تحميل الفعاليات.';
        }
    }


    /* =========================================================
       Categories
    ========================================================= */

    async function loadCategories() {

        try {

            const response =
                await fetch(
                    categoriesApi,
                    {
                        method: 'GET',

                        headers: {
                            Accept:
                                'application/json'
                        }
                    }
                );


            const data =
                await response
                    .json()
                    .catch(function () {
                        return {};
                    });


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل التصنيفات.'
                );
            }


            categories =
                Array.isArray(data)
                    ? data
                    : (
                        data.categories ||
                        data.data ||
                        []
                    );


            renderCategories();

        } catch (error) {

            console.error(
                'Categories error:',
                error
            );
        }
    }


    function renderCategories() {

        /* =========================
           Category select
        ========================== */

        if (categorySelect) {

            categorySelect.innerHTML =
                '<option value="">جميع الفئات</option>';


            categories.forEach(
                function (category) {

                    const option =
                        document.createElement(
                            'option'
                        );

                    option.value =
                        category.id;

                    option.textContent =
                        category.name;

                    categorySelect
                        .appendChild(
                            option
                        );
                }
            );
        }


        /* =========================
           Sidebar categories
        ========================== */

        if (categoryList) {

            categoryList.innerHTML = `
                <li>
                    <a
                        href="#"
                        data-category=""
                        class="${!activeCategoryId ? 'active' : ''}"
                    >
                        <span>
                            جميع الفعاليات
                        </span>

                        <b id="allEventsCount">
                            ${allEvents.length}
                        </b>
                    </a>
                </li>
            `;


            categories.forEach(
                function (category) {

                    const count =
                        allEvents.filter(
                            function (event) {

                                return String(
                                    event.category_id
                                ) === String(
                                    category.id
                                );
                            }
                        ).length;


                    const li =
                        document.createElement(
                            'li'
                        );


                    const link =
                        document.createElement(
                            'a'
                        );


                    link.href = '#';

                    link.dataset.category =
                        category.id;


                    if (
                        String(activeCategoryId) ===
                        String(category.id)
                    ) {
                        link.classList.add(
                            'active'
                        );
                    }


                    link.innerHTML = `
                        <span>
                            ${escapeHtml(category.name)}
                        </span>

                        <b>
                            ${count}
                        </b>
                    `;


                    li.appendChild(
                        link
                    );

                    categoryList
                        .appendChild(
                            li
                        );
                }
            );


            wireCategoryLinks();
        }


        if (
            activeCategoryId &&
            categorySelect
        ) {

            categorySelect.value =
                activeCategoryId;
        }
    }


    function wireCategoryLinks() {

        categoryList
            ?.querySelectorAll(
                'a[data-category]'
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        'click',
                        function (event) {

                            event.preventDefault();


                            activeCategoryId =
                                link.dataset.category || '';


                            if (categorySelect) {

                                categorySelect.value =
                                    activeCategoryId;
                            }


                            categoryList
                                .querySelectorAll('a')
                                .forEach(
                                    function (item) {

                                        item.classList.remove(
                                            'active'
                                        );
                                    }
                                );


                            link.classList.add(
                                'active'
                            );


                            currentPage = 1;


                            applyFilters();
                        }
                    );
                }
            );
    }


    /* =========================================================
       Build API URL
    ========================================================= */

    function buildEventsApiUrl() {

        const params =
            new URLSearchParams();


        /*
         * إذا دخلنا من صفحة منظم معين،
         * خلي Laravel نفسه يرجع فعاليات هذا المنظم.
         */
        if (activeOrganizerId) {

            params.set(
                'organizer_id',
                activeOrganizerId
            );
        }


        const query =
            params.toString();


        return query
            ? `${eventsApi}?${query}`
            : eventsApi;
    }


    /* =========================================================
       Load Events
    ========================================================= */

    async function loadEvents() {

        showLoading();


        try {

            const apiUrl =
                buildEventsApiUrl();


            const response =
                await fetch(
                    apiUrl,
                    {
                        method: 'GET',

                        headers: {
                            Accept:
                                'application/json'
                        }
                    }
                );


            const data =
                await response
                    .json()
                    .catch(function () {
                        return {};
                    });


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل الفعاليات.'
                );
            }


            allEvents =
                Array.isArray(data)
                    ? data
                    : (
                        data.events ||
                        data.data ||
                        []
                    );


            renderCategories();

            applyFilters();

        } catch (error) {

            console.error(
                'Events error:',
                error
            );


            showError(
                error.message ||
                'تعذر تحميل الفعاليات.'
            );

        } finally {

            hideLoading();
        }
    }


    /* =========================================================
       Date Filter
    ========================================================= */

    function matchesDateFilter(event) {

        const filter =
            dateSelect?.value || '';


        if (!filter) {
            return true;
        }


        if (!event.event_date) {
            return false;
        }


        const eventDate =
            new Date(
                event.event_date +
                'T00:00:00'
            );


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        /* Today */

        if (filter === 'today') {

            return (
                eventDate.getTime() ===
                today.getTime()
            );
        }


        /* Next 7 days */

        if (filter === 'week') {

            const end =
                new Date(today);


            end.setDate(
                end.getDate() + 7
            );


            return (
                eventDate >= today &&
                eventDate <= end
            );
        }


        /* Current month */

        if (filter === 'month') {

            return (
                eventDate.getFullYear() ===
                    today.getFullYear() &&

                eventDate.getMonth() ===
                    today.getMonth()
            );
        }


        return true;
    }


    /* =========================================================
       Filters
    ========================================================= */

    function applyFilters() {

        const query =
            (searchInput?.value || '')
                .trim()
                .toLowerCase();


        const categoryId =
            categorySelect?.value ||
            activeCategoryId ||
            '';


        const location =
            locationSelect?.value || '';


        const age =
            ageSelect?.value || '';


        filteredEvents =
            allEvents.filter(
                function (event) {

                    const title =
                        String(
                            event.title || ''
                        ).toLowerCase();


                    const eventLocation =
                        String(
                            event.location || ''
                        ).toLowerCase();


                    const eventAddress =
                        String(
                            event.address || ''
                        ).toLowerCase();


                    /* Search */

                    const matchesSearch =
                        !query ||
                        title.includes(query) ||
                        eventLocation.includes(query) ||
                        eventAddress.includes(query);


                    /* Category */

                    const matchesCategory =
                        !categoryId ||
                        String(
                            event.category_id
                        ) ===
                        String(
                            categoryId
                        );


                    /* Location */

                    const matchesLocation =
                        !location ||
                        eventLocation.includes(
                            location.toLowerCase()
                        ) ||
                        eventAddress.includes(
                            location.toLowerCase()
                        );


                    /* Age */

                    const matchesAge =
                        !age ||
                        event.age_group === age;


                    /*
                     * Organizer
                     *
                     * هذا فلتر إضافي احتياطي.
                     * حتى لو Backend رجع جميع الفعاليات،
                     * لن نعرض إلا فعاليات المنظم المطلوب.
                     */
                    const matchesOrganizer =
                        !activeOrganizerId ||
                        String(
                            event.organizer_id
                        ) ===
                        String(
                            activeOrganizerId
                        );


                    /* Date */

                    const matchesDate =
                        matchesDateFilter(
                            event
                        );


                    /* Registration open */

                    const matchesOpen =
                        !openCheckbox?.checked ||
                        registrationStillOpen(
                            event
                        );


                    /* Seats */

                    const matchesSeats =
                        !seatsCheckbox?.checked ||
                        hasAvailableSeats(
                            event
                        );


                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesLocation &&
                        matchesAge &&
                        matchesOrganizer &&
                        matchesDate &&
                        matchesOpen &&
                        matchesSeats
                    );
                }
            );


        sortEvents();

        updateUrl();

        renderCurrentPage();
    }


    /* =========================================================
       Sort
    ========================================================= */

    function sortEvents() {

        const sort =
            sortSelect?.value ||
            'nearest';


        filteredEvents.sort(
            function (a, b) {


                /* Latest */

                if (
                    sort ===
                    'latest'
                ) {

                    const aCreated =
                        a.created_at
                            ? new Date(a.created_at)
                            : null;

                    const bCreated =
                        b.created_at
                            ? new Date(b.created_at)
                            : null;


                    if (
                        aCreated &&
                        bCreated
                    ) {
                        return (
                            bCreated -
                            aCreated
                        );
                    }


                    return (
                        Number(b.id) -
                        Number(a.id)
                    );
                }


                /* Title */

                if (
                    sort ===
                    'title'
                ) {

                    return String(
                        a.title || ''
                    ).localeCompare(
                        String(
                            b.title || ''
                        ),
                        'ar'
                    );
                }


                /* Nearest */

                const aDate =
                    getEventDateTime(a);

                const bDate =
                    getEventDateTime(b);


                if (
                    !aDate &&
                    !bDate
                ) {
                    return 0;
                }


                if (!aDate) {
                    return 1;
                }


                if (!bDate) {
                    return -1;
                }


                return (
                    aDate -
                    bDate
                );
            }
        );
    }


    /* =========================================================
       Render Current Page
    ========================================================= */

    function renderCurrentPage() {

        if (!eventsGrid) {
            return;
        }


        eventsGrid.innerHTML =
            '';


        const total =
            filteredEvents.length;


        /* No results */

        if (!total) {

            emptyState
                ?.classList
                .remove('d-none');


            if (pagination) {
                pagination.innerHTML = '';
            }


            if (resultCount) {

                resultCount.textContent =
                    `عرض 0 من ${allEvents.length} فعالية`;
            }


            return;
        }


        emptyState
            ?.classList
            .add('d-none');


        const totalPages =
            Math.ceil(
                total /
                perPage
            );


        if (
            currentPage >
            totalPages
        ) {

            currentPage =
                totalPages;
        }


        const start =
            (currentPage - 1) *
            perPage;


        const end =
            Math.min(
                start + perPage,
                total
            );


        const pageEvents =
            filteredEvents.slice(
                start,
                end
            );


        pageEvents.forEach(
            function (
                event,
                index
            ) {

                eventsGrid
                    .appendChild(
                        buildEventCard(
                            event,
                            index
                        )
                    );
            }
        );


        if (resultCount) {

            resultCount.textContent =
                `عرض ${start + 1} - ${end} من ${total} فعالية`;
        }


        renderPagination(
            totalPages
        );
    }


    /* =========================================================
       Build Event Card
    ========================================================= */

    function buildEventCard(
        event,
        index
    ) {

        const categoryName =
            event.category?.name ||
            'فعالية';


        const detailsUrl =
            `${eventDetailsBase}/${event.id}`;


        const card =
            document.createElement(
                'article'
            );


        card.className =
            'event-card';


        card.innerHTML = `

            <a
                href="${detailsUrl}"
                class="card-image"
            >

                <img
                    src="${escapeHtml(
                        getEventImage(event)
                    )}"
                    alt="${escapeHtml(
                        event.title || 'فعالية'
                    )}"
                    onerror="this.src='/images.1/Imag1.png'"
                >

                <span
                    class="tag ${getCategoryColor(index)}"
                >
                    ${escapeHtml(
                        categoryName
                    )}
                </span>

            </a>


            <div class="card-body">

                <h3>
                    ${escapeHtml(
                        event.title ||
                        'فعالية'
                    )}
                </h3>


                <ul>

                    <li>
                        📍
                        ${escapeHtml(
                            event.location ||
                            event.address ||
                            'غير محدد'
                        )}
                    </li>


                    <li>
                        📅
                        ${escapeHtml(
                            formatDate(
                                event.event_date
                            )
                        )}
                    </li>


                    <li>
                        🕘
                        ${escapeHtml(
                            formatTime(
                                event.start_time
                            )
                        )}

                        ${
                            event.end_time
                                ?
                                ' - ' +
                                escapeHtml(
                                    formatTime(
                                        event.end_time
                                    )
                                )
                                :
                                ''
                        }
                    </li>


                    <li>
                        👤
                        ${escapeHtml(
                            event.age_group ||
                            'غير محدد'
                        )}
                    </li>

                </ul>


                <a href="${detailsUrl}">
                    عرض التفاصيل
                </a>

            </div>
        `;


        return card;
    }


    /* =========================================================
       Pagination
    ========================================================= */

    function renderPagination(
        totalPages
    ) {

        if (!pagination) {
            return;
        }


        pagination.innerHTML =
            '';


        if (
            totalPages <= 1
        ) {
            return;
        }


        /* Previous */

        const previous =
            document.createElement(
                'a'
            );


        previous.href =
            '#';


        previous.textContent =
            'السابق';


        if (
            currentPage === 1
        ) {

            previous.classList.add(
                'disabled'
            );
        }


        previous.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                if (
                    currentPage > 1
                ) {

                    currentPage--;


                    renderCurrentPage();

                    scrollToEvents();
                }
            }
        );


        pagination.appendChild(
            previous
        );


        /* Numbers */

        for (
            let pageNumber = 1;
            pageNumber <= totalPages;
            pageNumber++
        ) {

            const button =
                document.createElement(
                    'a'
                );


            button.href =
                '#';


            button.textContent =
                pageNumber;


            if (
                pageNumber ===
                currentPage
            ) {

                button.classList.add(
                    'active'
                );
            }


            button.addEventListener(
                'click',
                function (event) {

                    event.preventDefault();


                    currentPage =
                        pageNumber;


                    renderCurrentPage();

                    scrollToEvents();
                }
            );


            pagination.appendChild(
                button
            );
        }


        /* Next */

        const next =
            document.createElement(
                'a'
            );


        next.href =
            '#';


        next.textContent =
            'التالي';


        if (
            currentPage ===
            totalPages
        ) {

            next.classList.add(
                'disabled'
            );
        }


        next.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;


                    renderCurrentPage();

                    scrollToEvents();
                }
            }
        );


        pagination.appendChild(
            next
        );
    }


    function scrollToEvents() {

        document
            .querySelector(
                '.events-area'
            )
            ?.scrollIntoView({
                behavior:
                    'smooth',

                block:
                    'start'
            });
    }


    /* =========================================================
       Reset
    ========================================================= */

    function resetFilters() {

        if (searchInput) {
            searchInput.value =
                '';
        }


        if (categorySelect) {
            categorySelect.value =
                '';
        }


        if (locationSelect) {
            locationSelect.value =
                '';
        }


        if (ageSelect) {
            ageSelect.value =
                '';
        }


        if (dateSelect) {
            dateSelect.value =
                '';
        }


        if (openCheckbox) {
            openCheckbox.checked =
                false;
        }


        if (seatsCheckbox) {
            seatsCheckbox.checked =
                false;
        }


        activeCategoryId =
            '';


        /*
         * ملاحظة مهمة:
         *
         * لا نصفر activeOrganizerId هنا.
         *
         * لأن لو دخلنا:
         * /events?organizer_id=5
         *
         * وضغطنا إعادة تعيين،
         * نريد إزالة فلاتر البحث فقط،
         * وليس الخروج من فعاليات المنظم رقم 5.
         */


        currentPage =
            1;


        categoryList
            ?.querySelectorAll('a')
            .forEach(
                function (link) {

                    link.classList.remove(
                        'active'
                    );
                }
            );


        categoryList
            ?.querySelector(
                'a[data-category=""]'
            )
            ?.classList
            .add('active');


        applyFilters();
    }


    /* =========================================================
       Grid / List View
    ========================================================= */

    gridViewButton
        ?.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                gridViewButton
                    .classList
                    .add('active');


                listViewButton
                    ?.classList
                    .remove('active');


                eventsGrid
                    ?.classList
                    .remove('list-view');
            }
        );


    listViewButton
        ?.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                listViewButton
                    .classList
                    .add('active');


                gridViewButton
                    ?.classList
                    .remove('active');


                eventsGrid
                    ?.classList
                    .add('list-view');
            }
        );


    /* =========================================================
       Filter Events
    ========================================================= */

    filterButton
        ?.addEventListener(
            'click',
            function () {

                currentPage =
                    1;


                applyFilters();
            }
        );


    searchInput
        ?.addEventListener(
            'input',
            function () {

                currentPage =
                    1;


                applyFilters();
            }
        );


    categorySelect
        ?.addEventListener(
            'change',
            function () {

                activeCategoryId =
                    categorySelect.value;


                currentPage =
                    1;


                renderCategories();

                applyFilters();
            }
        );


    [
        locationSelect,
        ageSelect,
        dateSelect,
        openCheckbox,
        seatsCheckbox
    ].forEach(
        function (element) {

            element
                ?.addEventListener(
                    'change',
                    function () {

                        currentPage =
                            1;


                        applyFilters();
                    }
                );
        }
    );


    sortSelect
        ?.addEventListener(
            'change',
            function () {

                currentPage =
                    1;


                applyFilters();
            }
        );


    resetButton
        ?.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                resetFilters();
            }
        );


    retryButton
        ?.addEventListener(
            'click',
            function () {

                loadEvents();
            }
        );


    /* =========================================================
       Start
    ========================================================= */

    /*
     * أول شيء نقرأ:
     *
     * search
     * category_id
     * location
     * age_group
     * organizer_id
     */

    loadFiltersFromUrl();


    /*
     * بعدها نحمل التصنيفات والفعاليات.
     */

    Promise
        .all([
            loadCategories(),
            loadEvents()
        ])
        .then(
            function () {

                /*
                 * لو category_id جاء من Home،
                 * نظهره داخل select.
                 */

                if (
                    activeCategoryId &&
                    categorySelect
                ) {

                    categorySelect.value =
                        activeCategoryId;
                }


                applyFilters();
            }
        );

});