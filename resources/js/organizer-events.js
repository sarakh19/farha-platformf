import './dashboard-common.js';

document.addEventListener(
    'DOMContentLoaded',
    function () {


        /* =========================================================
           PAGE
        ========================================================= */

        const page =
            document.getElementById(
                'organizerEventsPage'
            );


        if (!page) {
            return;
        }



        /* =========================================================
           URLS
        ========================================================= */

        const eventsUrl =
            page.dataset.eventsUrl;


        const deleteBaseUrl =
            page.dataset.deleteBaseUrl;


        const editBaseUrl =
            page.dataset.editBaseUrl;


        const loginUrl =
            page.dataset.loginUrl;


        const logoutUrl =
            page.dataset.logoutUrl;



        /* =========================================================
           AUTH
        ========================================================= */

        const token =
            window.localStorage.getItem(
                'farha_token'
            ) ||
            window.sessionStorage.getItem(
                'farha_token'
            );


        const storedUser =
            window.localStorage.getItem(
                'farha_user'
            ) ||
            window.sessionStorage.getItem(
                'farha_user'
            );


        let currentUser =
            null;


        try {

            currentUser =
                storedUser
                    ? JSON.parse(
                        storedUser
                    )
                    : null;

        } catch (error) {

            console.error(
                'Invalid stored user data:',
                error
            );
        }



        /* =========================================================
           AUTH CHECK
        ========================================================= */

        if (
            !token ||
            !currentUser
        ) {

            window.showToast?.(
                'يرجى تسجيل الدخول أولًا للوصول إلى هذه الصفحة.',
                'warning'
            );


            window.setTimeout(
                function () {

                    window.location.href =
                        loginUrl ||
                        '/login';

                },
                900
            );


            return;
        }



        if (
            currentUser.role !==
            'organizer'
        ) {

            window.showToast?.(
                'ليس لديك صلاحية للوصول إلى صفحة فعاليات المنظم.',
                'error'
            );


            window.setTimeout(
                function () {

                    window.location.href =
                        '/home';

                },
                900
            );


            return;
        }



        /* =========================================================
           ORGANIZER
        ========================================================= */

        const organizerName =
            document.getElementById(
                'organizerName'
            );


        const welcomeOrganizerName =
            document.getElementById(
                'welcomeOrganizerName'
            );


        const organizerAvatar =
            document.getElementById(
                'organizerAvatar'
            );



        function displayOrganizerData() {

            const name =
                currentUser.name ||
                currentUser.full_name ||
                'منظم الفعاليات';


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

                const words =
                    name
                        .trim()
                        .split(
                            /\s+/
                        )
                        .filter(
                            Boolean
                        );


                const initials =
                    words
                        .slice(
                            0,
                            2
                        )
                        .map(
                            function (
                                word
                            ) {

                                return word.charAt(
                                    0
                                );
                            }
                        )
                        .join(
                            ''
                        );


                organizerAvatar.textContent =
                    initials ||
                    'م';
            }
        }


        displayOrganizerData();



        /* =========================================================
           ELEMENTS
        ========================================================= */

        const searchInput =
            document.getElementById(
                'eventSearch'
            );


        const filterTabs =
            document.querySelectorAll(
                '.filter-tab'
            );


        const eventsContainer =
            document.getElementById(
                'organizerEventsContainer'
            );


        const loadingElement =
            document.getElementById(
                'eventsLoading'
            );


        const emptyState =
            document.getElementById(
                'eventsEmptyState'
            );


        const noSearchResults =
            document.getElementById(
                'noSearchResults'
            );



        /* =========================================================
           SUMMARY
        ========================================================= */

        const totalEventsCount =
            document.getElementById(
                'totalEventsCount'
            );


        const approvedEventsCount =
            document.getElementById(
                'approvedEventsCount'
            );


        const pendingEventsCount =
            document.getElementById(
                'pendingEventsCount'
            );


        const rejectedEventsCount =
            document.getElementById(
                'rejectedEventsCount'
            );



        /* =========================================================
           PAGINATION
        ========================================================= */

        const paginationElement =
            document.getElementById(
                'eventsPagination'
            );


        const paginationPages =
            document.getElementById(
                'paginationPages'
            );


        const previousPageButton =
            document.getElementById(
                'previousPageButton'
            );


        const nextPageButton =
            document.getElementById(
                'nextPageButton'
            );



        /* =========================================================
           DELETE MODAL
        ========================================================= */

        const deleteModalElement =
            document.getElementById(
                'deleteEventModal'
            );


        const deleteEventTitle =
            document.getElementById(
                'deleteEventTitle'
            );


        const confirmDeleteButton =
            document.getElementById(
                'confirmDeleteEventButton'
            );


        const deleteButtonText =
            confirmDeleteButton
                ?.querySelector(
                    '.delete-button-text'
                );


        const deleteSpinner =
            document.getElementById(
                'deleteEventSpinner'
            );


        const deleteModal =
            deleteModalElement &&
            window.bootstrap

                ? new window.bootstrap.Modal(
                    deleteModalElement
                )

                : null;



        /* =========================================================
           SIDEBAR
        ========================================================= */

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
           LOGOUT
        ========================================================= */

        const logoutButton =
            document.getElementById(
                'logoutButton'
            );



        /* =========================================================
           STATE
        ========================================================= */

        let allEvents =
            [];


        let filteredEvents =
            [];


        let activeFilter =
            'all';


        let eventToDelete =
            null;


        let currentPage =
            1;


        const eventsPerPage =
            5;



        /* =========================================================
           HELPERS
        ========================================================= */

        function escapeHtml(
            value
        ) {

            return String(
                value ??
                ''
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



        function formatDate(
            dateValue
        ) {

            if (
                !dateValue
            ) {

                return 'غير محدد';
            }


            const clean =
                String(
                    dateValue
                ).slice(
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


            return new Intl
                .DateTimeFormat(
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
            timeValue
        ) {

            if (
                !timeValue
            ) {

                return 'غير محدد';
            }


            const parts =
                String(
                    timeValue
                ).split(
                    ':'
                );


            if (
                parts.length <
                2
            ) {

                return timeValue;
            }


            const date =
                new Date();


            date.setHours(
                Number(
                    parts[0]
                ),

                Number(
                    parts[1]
                ),

                0,
                0
            );


            return new Intl
                .DateTimeFormat(
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



        function getStatusInformation(
            status
        ) {

            const statuses = {

                approved: {
                    text:
                        'منشورة',

                    className:
                        'published',
                },


                pending: {
                    text:
                        'قيد المراجعة',

                    className:
                        'review',
                },


                draft: {
                    text:
                        'مسودة',

                    className:
                        'draft',
                },


                rejected: {
                    text:
                        'مرفوضة',

                    className:
                        'rejected',
                },

            };


            return statuses[
                status
            ] || {

                text:
                    'غير محددة',

                className:
                    'review',
            };
        }



        function getCategoryClass(
            categoryName
        ) {

            const name =
                String(
                    categoryName ||
                    ''
                ).trim();


            if (
                name.includes(
                    'رياض'
                )
            ) {

                return 'type-green';
            }


            if (
                name.includes(
                    'فن'
                )
            ) {

                return 'type-purple';
            }


            if (
                name.includes(
                    'ترفيه'
                )
            ) {

                return 'type-blue';
            }


            if (
                name.includes(
                    'تعليم'
                )
            ) {

                return 'type-blue';
            }


            return 'type-purple';
        }



        /* =========================================================
           EVENT IMAGE
        ========================================================= */

        function getImageUrl(
            imagePath
        ) {

            if (
                !imagePath
            ) {

                return '/images.1/Image.png';
            }


            const value =
                String(
                    imagePath
                ).trim();


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
                ) ||
                value.startsWith(
                    'images/'
                ) ||
                value.startsWith(
                    'images.1/'
                )
            ) {

                return `/${value}`;
            }


            return `/storage/${value}`;
        }



        function getRegistrationCount(
            event
        ) {

            if (
                typeof
                    event.registrations_count ===
                'number'
            ) {

                return event.registrations_count;
            }


            if (
                Array.isArray(
                    event.registrations
                )
            ) {

                return event
                    .registrations
                    .length;
            }


            return 0;
        }



        /* =========================================================
           SUMMARY UPDATE
        ========================================================= */

        function updateSummaryCards() {

            const total =
                allEvents.length;


            const approved =
                allEvents.filter(
                    function (
                        event
                    ) {

                        return event.status ===
                            'approved';
                    }
                ).length;


            const pending =
                allEvents.filter(
                    function (
                        event
                    ) {

                        return event.status ===
                            'pending';
                    }
                ).length;


            const rejected =
                allEvents.filter(
                    function (
                        event
                    ) {

                        return event.status ===
                            'rejected';
                    }
                ).length;


            if (
                totalEventsCount
            ) {

                totalEventsCount.textContent =
                    total;
            }


            if (
                approvedEventsCount
            ) {

                approvedEventsCount.textContent =
                    approved;
            }


            if (
                pendingEventsCount
            ) {

                pendingEventsCount.textContent =
                    pending;
            }


            if (
                rejectedEventsCount
            ) {

                rejectedEventsCount.textContent =
                    rejected;
            }
        }



        /* =========================================================
           CREATE EVENT ROW
        ========================================================= */

        function createEventElement(
            event
        ) {

            const status =
                getStatusInformation(
                    event.status
                );


            const categoryName =
                event.category?.name ||
                event.category_name ||
                'غير مصنفة';


            const categoryClass =
                getCategoryClass(
                    categoryName
                );


            const registrationsCount =
                getRegistrationCount(
                    event
                );


            const capacity =
                Number(
                    event.capacity
                ) ||
                0;


            const editUrl =
                `${editBaseUrl}/${event.id}/edit`;


            const image =
                event.image ||
                event.image_path ||
                event.cover_image ||
                event.photo;


            const imageUrl =
                getImageUrl(
                    image
                );


            const eventElement =
                document.createElement(
                    'article'
                );


            eventElement.className =
                'organizer-event-item';


            eventElement.dataset.eventId =
                String(
                    event.id
                );


            eventElement.dataset.status =
                event.status ||
                '';


            eventElement.dataset.title =
                event.title ||
                '';


            eventElement.dataset.location =
                event.location ||
                '';



            eventElement.innerHTML = `

                <div class="event-actions">


                    <a
                        href="${escapeHtml(
                            editUrl
                        )}"

                        class="edit-row-btn"
                    >
                        تعديل
                    </a>


                    <div
                        class="
                            dropdown
                            row-menu-dropdown
                        "
                    >

                        <button
                            type="button"

                            class="row-menu"

                            data-bs-toggle="dropdown"

                            aria-expanded="false"
                        >

                            <i
                                class="
                                    bi
                                    bi-three-dots-vertical
                                "
                            ></i>

                        </button>


                        <ul class="dropdown-menu">

                            <li>

                                <button
                                    type="button"

                                    class="
                                        dropdown-item
                                        text-danger
                                        delete-event-row-btn
                                    "

                                    data-event-id="${escapeHtml(
                                        event.id
                                    )}"

                                    data-event-title="${escapeHtml(
                                        event.title
                                    )}"
                                >

                                    <i
                                        class="
                                            bi
                                            bi-trash3
                                        "
                                    ></i>

                                    حذف الفعالية

                                </button>

                            </li>

                        </ul>

                    </div>

                </div>



                <span
                    class="
                        row-status
                        ${escapeHtml(
                            status.className
                        )}
                    "
                >

                    ${escapeHtml(
                        status.text
                    )}

                </span>



                <div
                    class="item-capacity"
                >

                    <strong>
                        ${escapeHtml(
                            registrationsCount
                        )}
                        /
                        ${escapeHtml(
                            capacity
                        )}
                    </strong>

                    <small>
                        مسجلين
                    </small>

                </div>



                <div
                    class="item-date"
                >

                    <span>

                        ${escapeHtml(
                            formatDate(
                                event.event_date
                            )
                        )}

                    </span>

                    <small>

                        ${escapeHtml(
                            formatTime(
                                event.start_time
                            )
                        )}

                    </small>

                </div>



                <div
                    class="item-place"
                >

                    <span>

                        ${escapeHtml(
                            event.address ||
                            event.location ||
                            'غير محدد'
                        )}

                    </span>

                    <small>

                        ${escapeHtml(
                            event.location ||
                            ''
                        )}

                    </small>

                </div>



                <a
                    href="${escapeHtml(
                        editUrl
                    )}"

                    class="item-main"
                >

                    <img
                        src="${escapeHtml(
                            imageUrl
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

                        <small
                            class="${escapeHtml(
                                categoryClass
                            )}"
                        >

                            ${escapeHtml(
                                categoryName
                            )}

                        </small>

                    </div>

                </a>

            `;


            return eventElement;
        }



        /* =========================================================
           FILTER
        ========================================================= */

        function applyFilters() {

            const query =
                searchInput
                    ?.value
                    .trim()
                    .toLowerCase() ||
                '';


            filteredEvents =
                allEvents.filter(
                    function (
                        event
                    ) {

                        const title =
                            String(
                                event.title ||
                                ''
                            ).toLowerCase();


                        const location =
                            String(
                                event.location ||
                                ''
                            ).toLowerCase();


                        const address =
                            String(
                                event.address ||
                                ''
                            ).toLowerCase();


                        const category =
                            String(
                                event.category?.name ||
                                event.category_name ||
                                ''
                            ).toLowerCase();


                        const matchesSearch =
                            !query ||
                            title.includes(
                                query
                            ) ||
                            location.includes(
                                query
                            ) ||
                            address.includes(
                                query
                            ) ||
                            category.includes(
                                query
                            );


                        const matchesStatus =
                            activeFilter ===
                                'all' ||
                            event.status ===
                                activeFilter;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );
                    }
                );


            currentPage =
                1;


            renderEvents();
        }



        /* =========================================================
           RENDER
        ========================================================= */

        function renderEvents() {

            if (
                !eventsContainer
            ) {

                return;
            }


            eventsContainer.innerHTML =
                '';


            emptyState
                ?.classList
                .add(
                    'd-none'
                );


            noSearchResults
                ?.classList
                .add(
                    'd-none'
                );


            if (
                allEvents.length ===
                0
            ) {

                emptyState
                    ?.classList
                    .remove(
                        'd-none'
                    );


                paginationElement
                    ?.classList
                    .add(
                        'd-none'
                    );


                return;
            }


            if (
                filteredEvents.length ===
                0
            ) {

                noSearchResults
                    ?.classList
                    .remove(
                        'd-none'
                    );


                paginationElement
                    ?.classList
                    .add(
                        'd-none'
                    );


                return;
            }


            const startIndex =
                (
                    currentPage -
                    1
                ) *
                eventsPerPage;


            const endIndex =
                startIndex +
                eventsPerPage;


            const pageEvents =
                filteredEvents.slice(
                    startIndex,
                    endIndex
                );


            pageEvents.forEach(
                function (
                    event
                ) {

                    eventsContainer
                        .appendChild(
                            createEventElement(
                                event
                            )
                        );
                }
            );


            renderPagination();
        }



        /* =========================================================
           PAGINATION
        ========================================================= */

        function renderPagination() {

            if (
                !paginationElement ||
                !paginationPages ||
                !previousPageButton ||
                !nextPageButton
            ) {

                return;
            }


            const totalPages =
                Math.ceil(
                    filteredEvents.length /
                    eventsPerPage
                );


            if (
                totalPages <=
                1
            ) {

                paginationElement
                    .classList
                    .add(
                        'd-none'
                    );


                return;
            }


            paginationElement
                .classList
                .remove(
                    'd-none'
                );


            paginationPages.innerHTML =
                '';


            previousPageButton.disabled =
                currentPage ===
                1;


            nextPageButton.disabled =
                currentPage ===
                totalPages;


            for (
                let pageNumber = 1;
                pageNumber <= totalPages;
                pageNumber += 1
            ) {

                const button =
                    document
                        .createElement(
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


                button
                    .addEventListener(
                        'click',
                        function () {

                            currentPage =
                                pageNumber;


                            renderEvents();
                        }
                    );


                paginationPages
                    .appendChild(
                        button
                    );
            }
        }



        previousPageButton
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


                    renderEvents();
                }
            );



        nextPageButton
            ?.addEventListener(
                'click',
                function () {

                    const totalPages =
                        Math.ceil(
                            filteredEvents.length /
                            eventsPerPage
                        );


                    if (
                        currentPage >=
                        totalPages
                    ) {

                        return;
                    }


                    currentPage +=
                        1;


                    renderEvents();
                }
            );



        /* =========================================================
           LOAD EVENTS
        ========================================================= */

        async function loadEvents() {

            loadingElement
                ?.classList
                .remove(
                    'd-none'
                );


            emptyState
                ?.classList
                .add(
                    'd-none'
                );


            noSearchResults
                ?.classList
                .add(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        eventsUrl,
                        {

                            method:
                                'GET',

                            headers: {

                                Accept:
                                    'application/json',

                                Authorization:
                                    `Bearer ${token}`,

                            },

                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            function () {

                                return {};
                            }
                        );


                if (
                    response.status ===
                    401
                ) {

                    clearAuthentication();


                    window.location.href =
                        loginUrl ||
                        '/login';


                    return;
                }


                if (
                    !response.ok
                ) {

                    window.showToast?.(
                        data.message ||
                        'تعذر تحميل الفعاليات.',
                        'error'
                    );


                    return;
                }


                if (
                    Array.isArray(
                        data
                    )
                ) {

                    allEvents =
                        data;

                } else if (
                    Array.isArray(
                        data.events
                    )
                ) {

                    allEvents =
                        data.events;

                } else if (
                    Array.isArray(
                        data.data
                    )
                ) {

                    allEvents =
                        data.data;

                } else {

                    allEvents =
                        [];
                }


                filteredEvents =
                    [
                        ...allEvents
                    ];


                updateSummaryCards();

                renderEvents();


            } catch (error) {

                console.error(
                    'Organizer events request failed:',
                    error
                );


                window.showToast?.(
                    'تعذر الاتصال بالخادم.',
                    'error'
                );


            } finally {

                loadingElement
                    ?.classList
                    .add(
                        'd-none'
                    );
            }
        }



        /* =========================================================
           SEARCH / FILTER EVENTS
        ========================================================= */

        searchInput
            ?.addEventListener(
                'input',
                applyFilters
            );



        filterTabs.forEach(
            function (
                tab
            ) {

                tab.addEventListener(
                    'click',
                    function () {

                        filterTabs.forEach(
                            function (
                                otherTab
                            ) {

                                otherTab
                                    .classList
                                    .remove(
                                        'active'
                                    );
                            }
                        );


                        tab.classList.add(
                            'active'
                        );


                        activeFilter =
                            tab.dataset.filter ||
                            'all';


                        applyFilters();
                    }
                );
            }
        );



        /* =========================================================
           DELETE OPEN
        ========================================================= */

        eventsContainer
            ?.addEventListener(
                'click',
                function (
                    event
                ) {

                    const deleteButton =
                        event.target.closest(
                            '.delete-event-row-btn'
                        );


                    if (
                        !deleteButton
                    ) {

                        return;
                    }


                    eventToDelete = {

                        id:
                            deleteButton
                                .dataset
                                .eventId,

                        title:
                            deleteButton
                                .dataset
                                .eventTitle ||
                            'هذه الفعالية',

                    };


                    if (
                        deleteEventTitle
                    ) {

                        deleteEventTitle
                            .textContent =
                            eventToDelete
                                .title;
                    }


                    deleteModal
                        ?.show();
                }
            );



        /* =========================================================
           DELETE EVENT
        ========================================================= */

        async function deleteSelectedEvent() {

            if (
                !eventToDelete?.id
            ) {

                return;
            }


            const deleteUrl =
                `${deleteBaseUrl}/${eventToDelete.id}`;


            if (
                confirmDeleteButton
            ) {

                confirmDeleteButton.disabled =
                    true;
            }


            if (
                deleteButtonText
            ) {

                deleteButtonText.textContent =
                    'جاري الحذف...';
            }


            deleteSpinner
                ?.classList
                .remove(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        deleteUrl,
                        {

                            method:
                                'DELETE',

                            headers: {

                                Accept:
                                    'application/json',

                                Authorization:
                                    `Bearer ${token}`,

                            },

                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            function () {

                                return {};
                            }
                        );


                if (
                    !response.ok
                ) {

                    window.showToast?.(
                        data.message ||
                        'تعذر حذف الفعالية.',
                        'error'
                    );


                    return;
                }


                allEvents =
                    allEvents.filter(
                        function (
                            event
                        ) {

                            return String(
                                event.id
                            ) !==
                            String(
                                eventToDelete.id
                            );
                        }
                    );


                deleteModal
                    ?.hide();


                eventToDelete =
                    null;


                updateSummaryCards();

                applyFilters();


                window.showToast?.(
                    'تم حذف الفعالية بنجاح.',
                    'success'
                );


            } finally {

                if (
                    confirmDeleteButton
                ) {

                    confirmDeleteButton.disabled =
                        false;
                }


                if (
                    deleteButtonText
                ) {

                    deleteButtonText.textContent =
                        'حذف';
                }


                deleteSpinner
                    ?.classList
                    .add(
                        'd-none'
                    );
            }
        }



        confirmDeleteButton
            ?.addEventListener(
                'click',
                deleteSelectedEvent
            );



        /* =========================================================
           CLEAR AUTH
        ========================================================= */

        function clearAuthentication() {

            window.localStorage.removeItem(
                'farha_token'
            );

            window.localStorage.removeItem(
                'farha_user'
            );


            window.sessionStorage.removeItem(
                'farha_token'
            );

            window.sessionStorage.removeItem(
                'farha_user'
            );
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

                        if (
                            logoutUrl
                        ) {

                            await fetch(
                                logoutUrl,
                                {

                                    method:
                                        'POST',

                                    headers: {

                                        Accept:
                                            'application/json',

                                        Authorization:
                                            `Bearer ${token}`,

                                    },

                                }
                            );
                        }

                    } catch (error) {

                        console.error(
                            'Logout error:',
                            error
                        );

                    } finally {

                        clearAuthentication();


                        window.location.href =
                            loginUrl ||
                            '/login';
                    }
                }
            );



        /* =========================================================
           START
        ========================================================= */

        loadEvents();


    }
);