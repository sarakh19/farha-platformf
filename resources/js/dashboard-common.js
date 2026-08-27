import './messages.js';

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       Sidebar
    ========================================================= */

    const menuToggle =
        document.querySelector('.menu-toggle');

    const sidebar =
        document.querySelector('.sidebar');

    const overlay =
        document.querySelector('.sidebar-overlay');


    function openSidebar() {

        sidebar?.classList.add('show');
        overlay?.classList.add('show');
    }


    function closeSidebar() {

        sidebar?.classList.remove('show');
        overlay?.classList.remove('show');
    }


    if (
        menuToggle &&
        sidebar &&
        overlay
    ) {

        menuToggle.addEventListener(
            'click',
            function () {

                if (
                    sidebar.classList.contains('show')
                ) {

                    closeSidebar();

                } else {

                    openSidebar();
                }
            }
        );
    }


    overlay?.addEventListener(
        'click',
        closeSidebar
    );


    /* =========================================================
       Active Sidebar Link
    ========================================================= */

    function setActiveSidebarLink() {

        const currentPath =
            window.location.pathname
                .replace(/\/+$/, '');

        const links =
            document.querySelectorAll(
                '.menu-link'
            );

        links.forEach(
            function (link) {

                link.classList.remove(
                    'active'
                );

                const href =
                    link.getAttribute(
                        'href'
                    );

                if (
                    !href ||
                    href === '#'
                ) {
                    return;
                }

                let linkPath = '';

                try {

                    linkPath =
                        new URL(
                            href,
                            window.location.origin
                        )
                            .pathname
                            .replace(/\/+$/, '');

                } catch (error) {

                    return;
                }


                let isActive =
                    currentPath === linkPath;


                if (
                    !isActive &&
                    /^\/organizer\/events\/\d+\/edit$/
                        .test(currentPath) &&
                    linkPath === '/organizer/events'
                ) {

                    isActive = true;
                }


                if (isActive) {

                    link.classList.add(
                        'active'
                    );
                }
            }
        );
    }


    setActiveSidebarLink();


    /* =========================================================
       Active Breadcrumb
       آخر عنصر = الصفحة الحالية
    ========================================================= */

    function setActiveBreadcrumbItem() {

        const breadcrumb =
            document.querySelector(
                '.breadcrumb'
            );

        if (!breadcrumb) {
            return;
        }


        breadcrumb
            .querySelectorAll(
                '.current'
            )
            .forEach(
                function (item) {

                    item.classList.remove(
                        'current'
                    );
                }
            );


        const items =
            Array.from(
                breadcrumb.children
            )
            .filter(
                function (item) {

                    return !item.classList.contains(
                        'breadcrumb-separator'
                    );
                }
            );


        const currentItem =
            items[
                items.length - 1
            ];


        if (currentItem) {

            currentItem.classList.add(
                'current'
            );
        }
    }


    setActiveBreadcrumbItem();


    document
        .querySelectorAll('.menu-link')
        .forEach(
            function (link) {

                link.addEventListener(
                    'click',
                    function () {

                        if (
                            window.innerWidth < 992
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
                window.innerWidth >= 992
            ) {

                closeSidebar();
            }
        }
    );


    /* =========================================================
       Toast
    ========================================================= */

    function getToastContainer() {

        let container =
            document.querySelector(
                '.toast-container'
            );


        if (!container) {

            container =
                document.createElement(
                    'div'
                );

            container.className =
                'toast-container';

            document.body.appendChild(
                container
            );
        }


        return container;
    }


    const TOAST_ICONS = {

        success:
            'bi-check-circle-fill',

        error:
            'bi-x-circle-fill',

        warning:
            'bi-exclamation-triangle-fill',

        info:
            'bi-info-circle-fill',
    };


    window.showToast =
        function (
            message,
            type = 'info'
        ) {

            const container =
                getToastContainer();


            const toast =
                document.createElement(
                    'div'
                );


            toast.className =
                `app-toast ${type}`;


            const iconClass =
                TOAST_ICONS[type]
                ||
                TOAST_ICONS.info;


            toast.innerHTML = `
                <i class="bi ${iconClass}"></i>

                <span>
                    ${message}
                </span>
            `;


            container.appendChild(
                toast
            );


            window.setTimeout(
                function () {

                    toast.classList.add(
                        'hide'
                    );


                    window.setTimeout(
                        function () {

                            toast.remove();

                        },
                        250
                    );

                },
                3500
            );
        };


    window.addEventListener(
        'offline',
        function () {

            window.showToast(
                'لا يوجد اتصال بالإنترنت. يرجى المحاولة مرة أخرى عند توفر الاتصال.',
                'warning'
            );
        }
    );


    window.addEventListener(
        'online',
        function () {

            window.showToast(
                'تم استعادة الاتصال بالإنترنت.',
                'success'
            );
        }
    );


    /* =========================================================
       Organizer Topbar
    ========================================================= */

    function ensureOrganizerNotificationUi() {

        const currentPath =
            window.location.pathname;

        if (
            !currentPath.startsWith(
                '/organizer/'
            )
        ) {
            return;
        }


        const userArea =
            document.querySelector(
                '.user-area'
            );


        if (!userArea) {
            return;
        }


        userArea
            .querySelectorAll(
                'a, button'
            )
            .forEach(
                function (element) {

                    if (
                        element.querySelector(
                            '.bi-envelope'
                        )
                    ) {

                        element.remove();
                    }
                }
            );


        let wrapper =
            userArea.querySelector(
                '.notification-wrapper'
            );


        if (!wrapper) {

            userArea
                .querySelectorAll(
                    '.top-icon.notification, a[href*="/notifications"]'
                )
                .forEach(
                    function (element) {

                        element.remove();
                    }
                );


            wrapper =
                document.createElement(
                    'div'
                );


            wrapper.className =
                'notification-wrapper';


            wrapper.innerHTML = `
                <button
                    type="button"
                    class="notification-button"
                    id="notificationButton"
                    aria-label="الإشعارات"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <i class="bi bi-bell"></i>

                    <span
                        class="notification-badge"
                        id="notificationBadge"
                        style="display:none;"
                    ></span>
                </button>

                <div
                    class="notification-dropdown"
                    id="notificationDropdown"
                >
                    <div class="notification-dropdown-header">

                        <strong>
                            الإشعارات
                        </strong>

                        <button
                            type="button"
                            id="markAllNotificationsRead"
                        >
                            تعليم الكل كمقروء
                        </button>

                    </div>

                    <div
                        class="notification-list"
                        id="notificationList"
                    >
                        <div class="notification-empty">

                            <i class="bi bi-bell"></i>

                            <span>
                                جاري تحميل الإشعارات...
                            </span>

                        </div>
                    </div>
                </div>
            `;


            userArea.appendChild(
                wrapper
            );
        }
    }


    ensureOrganizerNotificationUi();


    /* =========================================================
       Organizer Notifications
    ========================================================= */

    const notificationButton =
        document.getElementById(
            'notificationButton'
        );


    const notificationDropdown =
        document.getElementById(
            'notificationDropdown'
        );


    const notificationBadge =
        document.getElementById(
            'notificationBadge'
        );


    const notificationList =
        document.getElementById(
            'notificationList'
        );


    const markAllNotificationsRead =
        document.getElementById(
            'markAllNotificationsRead'
        );


    /* =========================================================
       Token
    ========================================================= */

    function getFarhaToken() {

        return (
            localStorage.getItem(
                'farha_token'
            )
            ||
            sessionStorage.getItem(
                'farha_token'
            )
        );
    }


    /* =========================================================
       Load Notifications
    ========================================================= */

    async function loadOrganizerNotifications() {

        if (!notificationList) {

            return;
        }


        const token =
            getFarhaToken();


        if (!token) {

            return;
        }


        try {

            const response =
                await fetch(
                    '/api/organizer/notifications',
                    {

                        headers: {

                            'Accept':
                                'application/json',

                            'Authorization':
                                `Bearer ${token}`,
                        },
                    }
                );


            if (!response.ok) {

                console.error(
                    'Failed to load notifications:',
                    response.status
                );

                return;
            }


            const data =
                await response.json();


            renderNotificationBadge(
                data.unread_count ?? 0
            );


            renderNotifications(
                data.notifications ?? []
            );


        } catch (error) {

            console.error(
                'Notification error:',
                error
            );
        }
    }


    /* =========================================================
       Badge
    ========================================================= */

    function renderNotificationBadge(
        count
    ) {

        if (!notificationBadge) {

            return;
        }


        if (count > 0) {

            notificationBadge.textContent =
                count > 99
                    ? '99+'
                    : count;


            notificationBadge.style.display =
                'flex';


        } else {

            notificationBadge.style.display =
                'none';
        }
    }


    /* =========================================================
       Render Notifications
    ========================================================= */

    function renderNotifications(
        notifications
    ) {

        if (!notificationList) {

            return;
        }


        if (!notifications.length) {

            notificationList.innerHTML = `

                <div class="notification-empty">

                    <i class="bi bi-bell-slash"></i>

                    <span>
                        لا توجد إشعارات حتى الآن
                    </span>

                </div>
            `;

            return;
        }


        notificationList.innerHTML =

            notifications
                .map(
                    notification => {

                        const unread =
                            !notification.is_read;


                        const icon =
                            getNotificationIcon(
                                notification.type
                            );


                        return `

                            <div
                                class="
                                    notification-item
                                    ${unread ? 'unread' : ''}
                                "

                                data-id="${notification.id}"

                                data-url="${escapeNotificationHtml(
                                    notification.url ?? ''
                                )}"
                            >

                                <div
                                    class="notification-item-icon"
                                >

                                    <i
                                        class="bi ${icon}"
                                    ></i>

                                </div>


                                <div
                                    class="notification-item-content"
                                >

                                    <div
                                        class="notification-title"
                                    >

                                        <span>

                                            ${escapeNotificationHtml(
                                                notification.title
                                                ?? 'إشعار جديد'
                                            )}

                                        </span>


                                        ${
                                            unread
                                                ?
                                                `
                                                <span
                                                    class="notification-unread-dot"
                                                ></span>
                                                `
                                                :
                                                ''
                                        }

                                    </div>


                                    <div
                                        class="notification-message"
                                    >

                                        ${escapeNotificationHtml(
                                            notification.message
                                            ?? ''
                                        )}

                                    </div>


                                    <div
                                        class="notification-time"
                                    >

                                        ${formatNotificationDate(
                                            notification.created_at
                                        )}

                                    </div>

                                </div>

                            </div>
                        `;
                    }
                )
                .join('');


        document
            .querySelectorAll(
                '.notification-item'
            )
            .forEach(
                item => {

                    item.addEventListener(
                        'click',
                        async function () {

                            const id =
                                this.dataset.id;


                            const url =
                                this.dataset.url;


                            await markNotificationAsRead(
                                id
                            );


                            this.classList.remove(
                                'unread'
                            );


                            const dot =
                                this.querySelector(
                                    '.notification-unread-dot'
                                );


                            dot?.remove();


                            await loadOrganizerNotifications();


                            if (url) {

                                window.location.href =
                                    url;
                            }
                        }
                    );
                }
            );
    }


    /* =========================================================
       Notification Icon
    ========================================================= */

    function getNotificationIcon(
        type
    ) {

        switch (type) {

            case 'registrations':

                return 'bi-person-check-fill';


            case 'events':

                return 'bi-calendar-event-fill';


            case 'system':

                return 'bi-info-circle-fill';


            default:

                return 'bi-bell-fill';
        }
    }


    /* =========================================================
       Mark One As Read
    ========================================================= */

    async function markNotificationAsRead(
        id
    ) {

        const token =
            getFarhaToken();


        if (!token) {

            return;
        }


        try {

            const response =
                await fetch(
                    `/api/organizer/notifications/${id}/read`,
                    {

                        method:
                            'PUT',

                        headers: {

                            'Accept':
                                'application/json',

                            'Authorization':
                                `Bearer ${token}`,
                        },
                    }
                );


            if (!response.ok) {

                console.error(
                    'Failed to mark notification as read:',
                    response.status
                );
            }


        } catch (error) {

            console.error(
                'Mark notification error:',
                error
            );
        }
    }


    /* =========================================================
       Mark All As Read
    ========================================================= */

    async function markEveryNotificationAsRead() {

        const token =
            getFarhaToken();


        if (!token) {

            return;
        }


        try {

            const response =
                await fetch(
                    '/api/organizer/notifications/read-all',
                    {

                        method:
                            'PUT',

                        headers: {

                            'Accept':
                                'application/json',

                            'Authorization':
                                `Bearer ${token}`,
                        },
                    }
                );


            if (!response.ok) {

                console.error(
                    'Failed to mark all notifications as read:',
                    response.status
                );

                return;
            }


            await loadOrganizerNotifications();


        } catch (error) {

            console.error(
                'Mark all notifications error:',
                error
            );
        }
    }


    /* =========================================================
       Escape HTML
    ========================================================= */

    function escapeNotificationHtml(
        value
    ) {

        const div =
            document.createElement(
                'div'
            );


        div.textContent =
            value ?? '';


        return div.innerHTML;
    }


    /* =========================================================
       Notification Date
    ========================================================= */

    function formatNotificationDate(
        date
    ) {

        if (!date) {

            return '';
        }


        const notificationDate =
            new Date(date);


        const now =
            new Date();


        const diff =
            now - notificationDate;


        const minutes =
            Math.floor(
                diff / 60000
            );


        const hours =
            Math.floor(
                minutes / 60
            );


        const days =
            Math.floor(
                hours / 24
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


        if (
            hours < 24
        ) {

            return `منذ ${hours} ساعة`;
        }


        if (
            days < 7
        ) {

            return `منذ ${days} يوم`;
        }


        return notificationDate
            .toLocaleDateString(
                'ar',
                {

                    year:
                        'numeric',

                    month:
                        'short',

                    day:
                        'numeric',
                }
            );
    }


    /* =========================================================
       Open / Close Dropdown
    ========================================================= */

    if (
        notificationButton &&
        notificationDropdown
    ) {

        notificationButton
            .addEventListener(
                'click',
                function (event) {

                    event.stopPropagation();


                    notificationDropdown
                        .classList
                        .toggle(
                            'show'
                        );


                    const isOpen =
                        notificationDropdown
                            .classList
                            .contains(
                                'show'
                            );


                    notificationButton
                        .setAttribute(
                            'aria-expanded',
                            isOpen
                                ? 'true'
                                : 'false'
                        );


                    if (
                        isOpen
                    ) {

                        loadOrganizerNotifications();
                    }
                }
            );


        notificationDropdown
            .addEventListener(
                'click',
                function (event) {

                    event.stopPropagation();
                }
            );


        document.addEventListener(
            'click',
            function () {

                notificationDropdown
                    .classList
                    .remove(
                        'show'
                    );


                notificationButton
                    .setAttribute(
                        'aria-expanded',
                        'false'
                    );
            }
        );
    }


    /* =========================================================
       Mark All Button
    ========================================================= */

    if (
        markAllNotificationsRead
    ) {

        markAllNotificationsRead
            .addEventListener(
                'click',
                async function (event) {

                    event.stopPropagation();


                    await markEveryNotificationAsRead();
                }
            );
    }


    /* =========================================================
       Initial Load
    ========================================================= */

    loadOrganizerNotifications();

});