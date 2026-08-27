import './dashboard-common.js';


document.addEventListener(
    'DOMContentLoaded',
    function () {

        const page =
            document.getElementById(
                'adminDashboardPage'
            );


        if (!page) {
            return;
        }


        /* =========================================================
           URLs
        ========================================================= */

        const dashboardUrl =
            page.dataset.dashboardUrl;


        const eventsPageUrl =
            page.dataset.eventsPageUrl;


        const registrationsPageUrl =
            page.dataset.registrationsPageUrl;


        const logoutUrl =
            page.dataset.logoutUrl;


        const loginUrl =
            page.dataset.loginUrl;


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


        let dashboardData =
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

        const loadingElement =
            document.getElementById(
                'adminDashboardLoading'
            );


        const contentElement =
            document.getElementById(
                'adminDashboardContent'
            );


        const errorElement =
            document.getElementById(
                'adminDashboardError'
            );


        const errorMessage =
            document.getElementById(
                'adminDashboardErrorMessage'
            );


        const retryButton =
            document.getElementById(
                'retryDashboardButton'
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


        const dashboardDate =
            document.getElementById(
                'dashboardDate'
            );


        const totalUsers =
            document.getElementById(
                'totalUsers'
            );


        const totalEvents =
            document.getElementById(
                'totalEvents'
            );


        const pendingEvents =
            document.getElementById(
                'pendingEvents'
            );


        const approvedEvents =
            document.getElementById(
                'approvedEvents'
            );


        const categoryEventsTotal =
            document.getElementById(
                'categoryEventsTotal'
            );


        const categoryDonutChart =
            document.getElementById(
                'categoryDonutChart'
            );


        const categoryChartLegend =
            document.getElementById(
                'categoryChartLegend'
            );


        const latestEventsContainer =
            document.getElementById(
                'latestEventsContainer'
            );


        const latestEventsEmpty =
            document.getElementById(
                'latestEventsEmpty'
            );


        const latestRegistrationsContainer =
            document.getElementById(
                'latestRegistrationsContainer'
            );


        const latestRegistrationsEmpty =
            document.getElementById(
                'latestRegistrationsEmpty'
            );


        const registrationsPeriodSelect =
            document.getElementById(
                'registrationsPeriodSelect'
            );


        const registrationsChartLine =
            document.getElementById(
                'registrationsChartLine'
            );


        const registrationsChartDays =
            document.getElementById(
                'registrationsChartDays'
            );


        const registrationsChartEmpty =
            document.getElementById(
                'registrationsChartEmpty'
            );


        const registrationsChartMarker =
            document.getElementById(
                'registrationsChartMarker'
            );


        const registrationsChartPoint =
            document.getElementById(
                'registrationsChartPoint'
            );


        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


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


        function formatNumber(value) {

            const number =
                Number(value);


            if (
                !Number.isFinite(number)
            ) {

                return '0';
            }


            return new Intl.NumberFormat(
                'ar'
            ).format(number);
        }


        function formatDate(
            dateValue
        ) {

            if (!dateValue) {

                return 'غير محدد';
            }


            const normalized =
                String(dateValue)
                    .slice(
                        0,
                        10
                    );


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
            ).format(date);
        }


        /* =========================================================
           Image Path
        ========================================================= */

        function getImageUrl(
            imagePath
        ) {

            if (!imagePath) {

                return null;
            }


            let path =
                String(imagePath)
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
                        'public/'.length
                    );
            }


            path =
                path.replace(
                    /^\/+/,
                    ''
                );


            return `/storage/${path}`;
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


            return statuses[status]
                ||
                {
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
                    categoryName
                    ||
                    ''
                );


            if (
                name.includes('رياض')
            ) {

                return 'type-green';
            }


            if (
                name.includes('فن')
            ) {

                return 'type-purple';
            }


            if (
                name.includes('ترفيه')
            ) {

                return 'type-orange';
            }


            return 'type-blue';
        }


        function getRelativeTime(
            dateValue
        ) {

            if (!dateValue) {

                return '';
            }


            const date =
                new Date(
                    dateValue
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return '';
            }


            const diff =
                Date.now()
                -
                date.getTime();


            const minutes =
                Math.floor(
                    diff / 60000
                );


            if (
                minutes < 1
            ) {

                return 'الآن';
            }


            if (
                minutes < 60
            ) {

                return `منذ ${minutes} دقيقة`;
            }


            const hours =
                Math.floor(
                    minutes / 60
                );


            if (
                hours < 24
            ) {

                return `منذ ${hours} ساعة`;
            }


            const days =
                Math.floor(
                    hours / 24
                );


            return `منذ ${days} يوم`;
        }


        /* =========================================================
           States
        ========================================================= */

        function showLoading() {

            loadingElement
                ?.classList
                .remove(
                    'd-none'
                );


            contentElement
                ?.classList
                .add(
                    'd-none'
                );


            errorElement
                ?.classList
                .add(
                    'd-none'
                );
        }


        function showContent() {

            loadingElement
                ?.classList
                .add(
                    'd-none'
                );


            errorElement
                ?.classList
                .add(
                    'd-none'
                );


            contentElement
                ?.classList
                .remove(
                    'd-none'
                );
        }


        function showError(
            message
        ) {

            loadingElement
                ?.classList
                .add(
                    'd-none'
                );


            contentElement
                ?.classList
                .add(
                    'd-none'
                );


            errorElement
                ?.classList
                .remove(
                    'd-none'
                );


            if (errorMessage) {

                errorMessage.textContent =
                    message;
            }
        }


        /* =========================================================
           Admin Info
        ========================================================= */

        function renderAdmin(
            data
        ) {

            const admin =
                data.admin
                ||
                currentUser
                ||
                {};


            if (adminName) {

                adminName.textContent =
                    admin.name
                    ||
                    'مدير النظام';
            }


            const imageUrl =
                getImageUrl(
                    admin.profile_image
                );


            if (
                adminAvatar
                &&
                imageUrl
            ) {

                adminAvatar.src =
                    imageUrl;


                adminAvatar.classList.remove(
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


            if (dashboardDate) {

                dashboardDate.textContent =
                    new Intl.DateTimeFormat(
                        'ar',
                        {
                            year:
                                'numeric',

                            month:
                                'long',

                            day:
                                'numeric',
                        }
                    ).format(
                        new Date()
                    );
            }
        }


        adminAvatar?.addEventListener(
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


        /* =========================================================
           Statistics
        ========================================================= */

        function renderStatistics(
            data
        ) {

            const statistics =
                data.statistics
                ||
                {};


            if (totalUsers) {

                totalUsers.textContent =
                    formatNumber(
                        statistics
                            .users_count
                        ??
                        0
                    );
            }


            if (totalEvents) {

                totalEvents.textContent =
                    formatNumber(
                        statistics
                            .events_count
                        ??
                        0
                    );
            }


            if (pendingEvents) {

                pendingEvents.textContent =
                    formatNumber(
                        statistics
                            .pending_events_count
                        ??
                        0
                    );
            }


            if (approvedEvents) {

                approvedEvents.textContent =
                    formatNumber(
                        statistics
                            .approved_events_count
                        ??
                        0
                    );
            }
        }


        /* =========================================================
           Categories
        ========================================================= */

        function renderCategoryStatistics(
            data
        ) {

            if (!categoryChartLegend) {

                return;
            }


            const categories =
                Array.isArray(
                    data.events_by_category
                )
                    ?
                    data.events_by_category
                    :
                    [];


            categoryChartLegend.innerHTML =
                '';


            if (
                categories.length === 0
            ) {

                categoryChartLegend.innerHTML = `

                    <li class="dashboard-placeholder-row">

                        لا توجد بيانات للتصنيفات.

                    </li>
                `;


                if (
                    categoryEventsTotal
                ) {

                    categoryEventsTotal.textContent =
                        '0';
                }


                if (
                    categoryDonutChart
                ) {

                    categoryDonutChart.style.background =
                        '#eeeeee';
                }


                return;
            }


            const total =
                categories.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum
                        +
                        Number(
                            item.count
                            ??
                            0
                        ),
                    0
                );


            if (
                categoryEventsTotal
            ) {

                categoryEventsTotal.textContent =
                    formatNumber(
                        total
                    );
            }


            const colors = [

                'var(--blue)',
                'var(--green)',
                'var(--primary)',
                'var(--orange)',
                '#ef6aa8',

            ];


            const classes = [

                'blue',
                'green',
                'purple',
                'orange',
                'pink',

            ];


            let position =
                0;


            const gradientParts =
                categories.map(
                    (
                        category,
                        index
                    ) => {

                        const count =
                            Number(
                                category.count
                                ??
                                0
                            );


                        const percentage =
                            total > 0
                                ?
                                (
                                    count
                                    /
                                    total
                                )
                                *
                                100
                                :
                                0;


                        const start =
                            position;


                        const end =
                            start
                            +
                            percentage;


                        position =
                            end;


                        return `${
                            colors[
                                index
                                %
                                colors.length
                            ]
                        } ${start}% ${end}%`;
                    }
                );


            if (
                categoryDonutChart
            ) {

                categoryDonutChart.style.background =
                    `conic-gradient(${gradientParts.join(',')})`;
            }


            categories.forEach(
                (
                    category,
                    index
                ) => {

                    const count =
                        Number(
                            category.count
                            ??
                            0
                        );


                    const percentage =
                        total > 0
                            ?
                            (
                                (
                                    count
                                    /
                                    total
                                )
                                *
                                100
                            ).toFixed(1)
                            :
                            '0.0';


                    const item =
                        document.createElement(
                            'li'
                        );


                    item.innerHTML = `

                        <span class="legend-name">

                            <i
                                class="dot ${
                                    classes[
                                        index
                                        %
                                        classes.length
                                    ]
                                }"
                            ></i>

                            ${escapeHtml(
                                category.name
                                ||
                                'غير مصنفة'
                            )}

                        </span>


                        <strong>

                            ${formatNumber(
                                count
                            )}

                            (${percentage}%)

                        </strong>
                    `;


                    categoryChartLegend
                        .appendChild(
                            item
                        );
                }
            );
        }


        /* =========================================================
           Latest Events
        ========================================================= */

        function renderLatestEvents(
            data
        ) {

            if (
                !latestEventsContainer
            ) {

                return;
            }


            const events =
                Array.isArray(
                    data.latest_events
                )
                    ?
                    data.latest_events
                    :
                    [];


            latestEventsContainer.innerHTML =
                '';


            if (
                events.length === 0
            ) {

                latestEventsEmpty
                    ?.classList
                    .remove(
                        'd-none'
                    );


                return;
            }


            latestEventsEmpty
                ?.classList
                .add(
                    'd-none'
                );


            events.forEach(
                event => {

                    const status =
                        getStatusInformation(
                            event.status
                        );


                    const categoryName =
                        event.category?.name
                        ||
                        'غير مصنفة';


                    const imageUrl =
                        getImageUrl(
                            event.image
                        );


                    const eventUrl =
                        `${
                            eventsPageUrl
                            ||
                            '/admin/events'
                        }?event=${event.id}`;


                    const element =
                        document.createElement(
                            'a'
                        );


                    element.href =
                        eventUrl;


                    element.className =
                        'admin-event-mini';


                    element.innerHTML = `

                        <div
                            class="admin-event-image-box"
                        >

                            ${
                                imageUrl
                                    ?
                                    `
                                    <img
                                        src="${escapeHtml(
                                            imageUrl
                                        )}"
                                        alt="${escapeHtml(
                                            event.title
                                            ||
                                            'فعالية'
                                        )}"
                                    >
                                    `
                                    :
                                    ''
                            }


                            <span
                                class="
                                    admin-event-image-fallback
                                    ${
                                        imageUrl
                                            ?
                                            'd-none'
                                            :
                                            ''
                                    }
                                "
                            >

                                <i
                                    class="bi bi-calendar-event"
                                ></i>

                            </span>

                        </div>


                        <div>

                            <strong>

                                ${escapeHtml(
                                    event.title
                                    ||
                                    'فعالية'
                                )}

                            </strong>


                            <small
                                class="${
                                    getCategoryClass(
                                        categoryName
                                    )
                                }"
                            >

                                ${escapeHtml(
                                    categoryName
                                )}

                            </small>

                        </div>


                        <span class="mini-location">

                            ${escapeHtml(
                                event.location
                                ||
                                event.address
                                ||
                                'غير محدد'
                            )}

                        </span>


                        <span class="mini-date">

                            ${escapeHtml(
                                formatDate(
                                    event.event_date
                                )
                            )}

                        </span>


                        <span
                            class="
                                row-status
                                ${status.className}
                            "
                        >

                            ${status.text}

                        </span>
                    `;


                    const image =
                        element.querySelector(
                            '.admin-event-image-box img'
                        );


                    const fallback =
                        element.querySelector(
                            '.admin-event-image-fallback'
                        );


                    image?.addEventListener(
                        'error',
                        function () {

                            this.remove();


                            fallback
                                ?.classList
                                .remove(
                                    'd-none'
                                );
                        }
                    );


                    latestEventsContainer
                        .appendChild(
                            element
                        );
                }
            );
        }


        /* =========================================================
           Registrations
        ========================================================= */

        function renderLatestRegistrations(
            data
        ) {

            if (
                !latestRegistrationsContainer
            ) {

                return;
            }


            const registrations =
                Array.isArray(
                    data.latest_registrations
                )
                    ?
                    data.latest_registrations
                    :
                    [];


            latestRegistrationsContainer.innerHTML =
                '';


            if (
                registrations.length === 0
            ) {

                latestRegistrationsEmpty
                    ?.classList
                    .remove(
                        'd-none'
                    );


                return;
            }


            latestRegistrationsEmpty
                ?.classList
                .add(
                    'd-none'
                );


            registrations.forEach(
                registration => {

                    const parent =
                        registration.parent
                        ||
                        {};


                    const child =
                        registration.child
                        ||
                        {};


                    const event =
                        registration.event
                        ||
                        {};


                    const parentName =
                        parent.name
                        ||
                        'ولي أمر';


                    const parentImage =
                        getImageUrl(
                            parent.profile_image
                        );


                    const element =
                        document.createElement(
                            'a'
                        );


                    element.href =
                        registrationsPageUrl
                        ||
                        '/admin/registrations';


                    element.className =
                        'registration-row';


                    element.innerHTML = `

                        <div
                            class="registration-avatar-box"
                        >

                            ${
                                parentImage
                                    ?
                                    `
                                    <img
                                        src="${escapeHtml(
                                            parentImage
                                        )}"
                                        alt="${escapeHtml(
                                            parentName
                                        )}"
                                    >
                                    `
                                    :
                                    ''
                            }


                            <span
                                class="
                                    registration-avatar-fallback
                                    ${
                                        parentImage
                                            ?
                                            'd-none'
                                            :
                                            ''
                                    }
                                "
                            >

                                <i
                                    class="bi bi-person-fill"
                                ></i>

                            </span>

                        </div>


                        <div>

                            <strong>

                                ${escapeHtml(
                                    parentName
                                )}

                            </strong>


                            <small>

                                ${escapeHtml(
                                    child.name
                                    ||
                                    'طفل'
                                )}

                                -

                                ${escapeHtml(
                                    event.title
                                    ||
                                    'فعالية'
                                )}

                            </small>

                        </div>


                        <span>

                            ${escapeHtml(
                                getRelativeTime(
                                    registration.created_at
                                )
                            )}

                        </span>
                    `;


                    const image =
                        element.querySelector(
                            '.registration-avatar-box img'
                        );


                    const fallback =
                        element.querySelector(
                            '.registration-avatar-fallback'
                        );


                    image?.addEventListener(
                        'error',
                        function () {

                            this.remove();


                            fallback
                                ?.classList
                                .remove(
                                    'd-none'
                                );
                        }
                    );


                    latestRegistrationsContainer
                        .appendChild(
                            element
                        );
                }
            );
        }


        /* =========================================================
           Chart
        ========================================================= */

        function renderRegistrationsChart(
            data
        ) {

            if (
                !registrationsChartLine
                ||
                !registrationsChartDays
            ) {

                return;
            }


            let chartData =
                Array.isArray(
                    data.registrations_chart
                )
                    ?
                    data.registrations_chart
                    :
                    [];


            const period =
                Number(
                    registrationsPeriodSelect
                        ?.value
                    ||
                    7
                );


            chartData =
                chartData.slice(
                    -period
                );


            registrationsChartDays.innerHTML =
                '';


            const hasData =
                chartData.some(
                    item =>
                        Number(
                            item.count
                        )
                        >
                        0
                );


            if (
                chartData.length === 0
                ||
                !hasData
            ) {

                registrationsChartLine
                    .setAttribute(
                        'd',
                        ''
                    );


                registrationsChartEmpty
                    ?.classList
                    .remove(
                        'd-none'
                    );


                registrationsChartMarker
                    ?.classList
                    .add(
                        'd-none'
                    );


                registrationsChartPoint
                    ?.classList
                    .add(
                        'd-none'
                    );


                registrationsChartDays.innerHTML =
                    '<span>لا توجد تسجيلات</span>';


                return;
            }


            registrationsChartEmpty
                ?.classList
                .add(
                    'd-none'
                );


            const maxCount =
                Math.max(
                    ...chartData.map(
                        item =>
                            Number(
                                item.count
                            )
                    ),
                    1
                );


            const startX =
                30;


            const endX =
                600;


            const topY =
                40;


            const bottomY =
                205;


            const width =
                endX
                -
                startX;


            const height =
                bottomY
                -
                topY;


            const points =
                chartData.map(
                    (
                        item,
                        index
                    ) => {

                        const x =
                            chartData.length === 1
                                ?
                                startX
                                +
                                width / 2
                                :
                                startX
                                +
                                (
                                    index
                                    /
                                    (
                                        chartData.length
                                        -
                                        1
                                    )
                                )
                                *
                                width;


                        const y =
                            bottomY
                            -
                            (
                                Number(
                                    item.count
                                )
                                /
                                maxCount
                            )
                            *
                            height;


                        return {
                            x,
                            y,
                            date:
                                item.date,
                            count:
                                Number(
                                    item.count
                                ),
                        };
                    }
                );


            const path =
                points
                    .map(
                        (
                            point,
                            index
                        ) => {

                            const command =
                                index === 0
                                    ?
                                    'M'
                                    :
                                    'L';


                            return `${command}${point.x.toFixed(
                                2
                            )} ${point.y.toFixed(
                                2
                            )}`;
                        }
                    )
                    .join(
                        ' '
                    );


            registrationsChartLine
                .setAttribute(
                    'd',
                    path
                );


            const visiblePoints =
                period > 7
                    ?
                    points.filter(
                        (
                            point,
                            index
                        ) =>
                            index % 5 === 0
                            ||
                            index ===
                            points.length - 1
                    )
                    :
                    points;


            visiblePoints.forEach(
                point => {

                    const span =
                        document.createElement(
                            'span'
                        );


                    span.textContent =
                        formatDate(
                            point.date
                        );


                    registrationsChartDays
                        .appendChild(
                            span
                        );
                }
            );


            const highest =
                points.reduce(
                    (
                        best,
                        point
                    ) =>
                        point.count
                        >
                        best.count
                            ?
                            point
                            :
                            best,
                    points[0]
                );


            registrationsChartMarker
                ?.setAttribute(
                    'x1',
                    highest.x
                );


            registrationsChartMarker
                ?.setAttribute(
                    'x2',
                    highest.x
                );


            registrationsChartMarker
                ?.setAttribute(
                    'y1',
                    highest.y
                );


            registrationsChartMarker
                ?.classList
                .remove(
                    'd-none'
                );


            registrationsChartPoint
                ?.setAttribute(
                    'cx',
                    highest.x
                );


            registrationsChartPoint
                ?.setAttribute(
                    'cy',
                    highest.y
                );


            registrationsChartPoint
                ?.classList
                .remove(
                    'd-none'
                );
        }


        registrationsPeriodSelect
            ?.addEventListener(
                'change',
                function () {

                    if (
                        dashboardData
                    ) {

                        renderRegistrationsChart(
                            dashboardData
                        );
                    }
                }
            );


        /* =========================================================
           Render
        ========================================================= */

        function renderDashboard(
            data
        ) {

            dashboardData =
                data;


            renderAdmin(
                data
            );


            renderStatistics(
                data
            );


            renderCategoryStatistics(
                data
            );


            renderLatestEvents(
                data
            );


            renderLatestRegistrations(
                data
            );


            renderRegistrationsChart(
                data
            );


            showContent();
        }


        /* =========================================================
           Load Dashboard
        ========================================================= */

        async function loadDashboard() {

            if (!dashboardUrl) {

                showError(
                    'رابط لوحة التحكم غير موجود.'
                );

                return;
            }


            showLoading();


            try {

                const response =
                    await fetch(
                        dashboardUrl,
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
                            () => ({})
                        );


                if (
                    response.status === 401
                ) {

                    clearAuthentication();


                    window.location.href =
                        loginUrl
                        ||
                        '/login';

                    return;
                }


                if (
                    response.status === 403
                ) {

                    showError(
                        data.message
                        ||
                        'ليس لديك صلاحية لفتح لوحة الإدارة.'
                    );

                    return;
                }


                if (
                    !response.ok
                ) {

                    console.error(
                        'Dashboard error:',
                        data
                    );


                    showError(
                        data.message
                        ||
                        'تعذر تحميل بيانات لوحة التحكم.'
                    );

                    return;
                }


                const normalized =
                    data.dashboard
                    ||
                    data.data
                    ||
                    data;


                renderDashboard(
                    normalized
                );


            } catch (error) {

                console.error(
                    error
                );


                showError(
                    'تعذر الاتصال بالخادم.'
                );
            }
        }


        retryButton
            ?.addEventListener(
                'click',
                loadDashboard
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

        loadDashboard();

    }
);