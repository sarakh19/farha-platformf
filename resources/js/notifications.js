import './site-common.js';

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       PAGE
    ========================================================= */

    const page =
        document.getElementById('parentNotificationsPage');

    if (!page) {
        return;
    }


    /* =========================================================
       URLS
    ========================================================= */

    const profileUrl =
        page.dataset.profileUrl ||
        '/api/profile';

    const notificationsUrl =
        page.dataset.notificationsUrl ||
        '/api/notifications';

    const readAllUrl =
        page.dataset.readAllUrl ||
        '/api/notifications/read-all';

    const deleteAllUrl =
        page.dataset.deleteAllUrl ||
        '/api/notifications/delete-all';

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
        localStorage.getItem('farha_token');

    const sessionToken =
        sessionStorage.getItem('farha_token');

    const token =
        localToken ||
        sessionToken;


    if (!token) {

        window.location.href =
            loginUrl;

        return;
    }


    function getHeaders(extra = {}) {

        return {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            ...extra,
        };
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

        if (localToken) {

            localStorage.setItem(
                'farha_user',
                JSON.stringify(user)
            );

        } else {

            sessionStorage.setItem(
                'farha_user',
                JSON.stringify(user)
            );
        }
    }


    /* =========================================================
       ELEMENTS - USER / SIDEBAR
    ========================================================= */

    const topUserName =
        document.getElementById(
            'topUserName'
        );

    const topProfileImage =
        document.getElementById(
            'topProfileImage'
        );

    const sidebarParentName =
        document.getElementById(
            'sidebarParentName'
        );

    const logoutButton =
        document.getElementById(
            'logoutButton'
        );

    const mobileMenuButton =
        document.getElementById(
            'mobileMenuButton'
        ) ||
        document.querySelector(
            '.pf-menu-toggle-mobile'
        );

    const sidebar =
        document.querySelector(
            '.pf-sidebar'
        );

    const sidebarOverlay =
        document.getElementById(
            'sidebarOverlay'
        );


    /* =========================================================
       ELEMENTS - NOTIFICATIONS
    ========================================================= */

    const topNotificationBadge =
        document.getElementById(
            'topNotificationBadge'
        );

    const sidebarNotificationBadge =
        document.getElementById(
            'sidebarNotificationBadge'
        );


    const notificationsLoading =
        document.getElementById(
            'notificationsLoading'
        );

    const notificationsError =
        document.getElementById(
            'notificationsError'
        );

    const notificationsErrorMessage =
        document.getElementById(
            'notificationsErrorMessage'
        );

    const notificationsList =
        document.getElementById(
            'notificationsList'
        );

    const notificationsEmpty =
        document.getElementById(
            'notificationsEmpty'
        );


    const retryNotificationsButton =
        document.getElementById(
            'retryNotificationsButton'
        );

    const markAllReadButton =
        document.getElementById(
            'markAllReadButton'
        );

    const deleteAllNotificationsButton =
        document.getElementById(
            'deleteAllNotificationsButton'
        );


    /* =========================================================
       COUNTERS
    ========================================================= */

    const allNotificationsCount =
        document.getElementById(
            'allNotificationsCount'
        );

    const unreadNotificationsCount =
        document.getElementById(
            'unreadNotificationsCount'
        );

    const eventsNotificationsCount =
        document.getElementById(
            'eventsNotificationsCount'
        );

    const registrationsNotificationsCount =
        document.getElementById(
            'registrationsNotificationsCount'
        );

    const systemNotificationsCount =
        document.getElementById(
            'systemNotificationsCount'
        );


    /* =========================================================
       TABS
    ========================================================= */

    const notificationTabs =
        document.querySelectorAll(
            '.notification-tab'
        );


    /* =========================================================
       STATE
    ========================================================= */

    let notifications = [];

    let currentFilter =
        'all';


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


    function getProfileImage(user) {

        const path =
            user?.profile_image ||
            user?.image ||
            user?.avatar ||
            null;


        if (!path) {

            return '/images.1/Margin.png';
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
            value.startsWith('/')
        ) {

            return value;
        }


        if (
            value.startsWith('storage/')
        ) {

            return `/${value}`;
        }


        return `/storage/${value}`;
    }


    function timeAgo(value) {

        if (!value) {

            return '';
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return '';
        }


        const diff =
            Date.now() -
            date.getTime();


        const seconds =
            Math.floor(
                diff / 1000
            );


        if (
            seconds < 60
        ) {

            return 'منذ لحظات';
        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (
            minutes < 60
        ) {

            if (
                minutes === 1
            ) {

                return 'منذ دقيقة';
            }

            return `منذ ${minutes} دقيقة`;
        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (
            hours < 24
        ) {

            if (
                hours === 1
            ) {

                return 'منذ ساعة';
            }

            return `منذ ${hours} ساعة`;
        }


        const days =
            Math.floor(
                hours / 24
            );


        if (
            days === 1
        ) {

            return 'منذ يوم';
        }


        if (
            days < 7
        ) {

            return `منذ ${days} أيام`;
        }


        return date.toLocaleDateString(
            'ar'
        );
    }


    /* =========================================================
       NOTIFICATION TYPE STYLE
    ========================================================= */

    function getNotificationStyle(type) {

        const styles = {

            events: {
                color: 'orange',
                icon: 'bi-calendar-event',
            },

            registrations: {
                color: 'green',
                icon: 'bi-check-circle-fill',
            },

            system: {
                color: 'purple',
                icon: 'bi-info-circle-fill',
            },
        };


        return (
            styles[type] || {
                color: 'blue',
                icon: 'bi-bell-fill',
            }
        );
    }


    /* =========================================================
       PAGE STATES
    ========================================================= */

    function showLoading() {

        notificationsLoading
            ?.classList
            .remove(
                'd-none'
            );


        notificationsError
            ?.classList
            .add(
                'd-none'
            );


        notificationsList
            ?.classList
            .add(
                'd-none'
            );


        notificationsEmpty
            ?.classList
            .add(
                'd-none'
            );
    }


    function hideLoading() {

        notificationsLoading
            ?.classList
            .add(
                'd-none'
            );
    }


    function showError(message) {

        hideLoading();


        notificationsError
            ?.classList
            .remove(
                'd-none'
            );


        notificationsList
            ?.classList
            .add(
                'd-none'
            );


        notificationsEmpty
            ?.classList
            .add(
                'd-none'
            );


        if (
            notificationsErrorMessage
        ) {

            notificationsErrorMessage
                .textContent =
                message;
        }
    }


    /* =========================================================
       PROFILE
    ========================================================= */

    async function loadCurrentParent() {

        try {

            const response =
                await fetch(
                    profileUrl,
                    {
                        method: 'GET',

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
                    'تعذر تحميل بيانات الحساب.'
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
                    '/home';

                return false;
            }


            /*
             * مهم:
             * كلمة "مرحباً" موجودة أصلاً في الـ Blade.
             * هنا نضع الاسم فقط.
             */

            if (
                topUserName
            ) {

                topUserName.textContent =
                    user.name ||
                    'المستخدم';
            }


            /*
             * دائرة السايدبار:
             * تعرض اسم المستخدم الحقيقي.
             */

            if (
                sidebarParentName
            ) {

                sidebarParentName.textContent =
                    user.name ||
                    'المستخدم';
            }


            /*
             * صورة المستخدم في الهيدر.
             */

            if (
                topProfileImage
            ) {

                topProfileImage.src =
                    getProfileImage(
                        user
                    );


                topProfileImage.alt =
                    user.name ||
                    'المستخدم';


                topProfileImage.onerror =
                    function () {

                        this.onerror =
                            null;

                        this.src =
                            '/images.1/Margin.png';
                    };
            }


            saveCurrentUser(
                user
            );


            return true;


        } catch (error) {

            console.error(
                'Parent profile error:',
                error
            );


            showToast(
                error.message ||
                'تعذر تحميل بيانات الحساب.',
                'error'
            );


            return false;
        }
    }


    /* =========================================================
       CALCULATE COUNTS
    ========================================================= */

    function calculateCounts() {

        return {

            all:
                notifications.length,

            unread:
                notifications
                    .filter(
                        notification =>
                            !Boolean(
                                notification.is_read
                            )
                    )
                    .length,

            events:
                notifications
                    .filter(
                        notification =>
                            notification.type ===
                            'events'
                    )
                    .length,

            registrations:
                notifications
                    .filter(
                        notification =>
                            notification.type ===
                            'registrations'
                    )
                    .length,

            system:
                notifications
                    .filter(
                        notification =>
                            notification.type ===
                            'system'
                    )
                    .length,
        };
    }


    /* =========================================================
       UPDATE COUNTS
    ========================================================= */

    function updateCounts(
        serverCounts = null
    ) {

        const calculated =
            calculateCounts();


        const counts =
            serverCounts || {};


        const values = {

            all:
                Number(
                    counts.all ??
                    calculated.all
                ),

            unread:
                Number(
                    counts.unread ??
                    calculated.unread
                ),

            events:
                Number(
                    counts.events ??
                    calculated.events
                ),

            registrations:
                Number(
                    counts.registrations ??
                    calculated.registrations
                ),

            system:
                Number(
                    counts.system ??
                    calculated.system
                ),
        };


        if (
            allNotificationsCount
        ) {

            allNotificationsCount
                .textContent =
                values.all;
        }


        if (
            unreadNotificationsCount
        ) {

            unreadNotificationsCount
                .textContent =
                values.unread;
        }


        if (
            eventsNotificationsCount
        ) {

            eventsNotificationsCount
                .textContent =
                values.events;
        }


        if (
            registrationsNotificationsCount
        ) {

            registrationsNotificationsCount
                .textContent =
                values.registrations;
        }


        if (
            systemNotificationsCount
        ) {

            systemNotificationsCount
                .textContent =
                values.system;
        }


        /*
         * Badge الجرس.
         */

        [
            topNotificationBadge,
            sidebarNotificationBadge,
        ]
            .forEach(
                function (badge) {

                    if (!badge) {
                        return;
                    }


                    badge.textContent =
                        values.unread;


                    badge.classList.toggle(
                        'd-none',
                        values.unread <= 0
                    );
                }
            );
    }


    /* =========================================================
       FILTER
    ========================================================= */

    function getFilteredNotifications() {

        if (
            currentFilter === 'all'
        ) {

            return notifications;
        }


        if (
            currentFilter === 'unread'
        ) {

            return notifications.filter(
                notification =>
                    !Boolean(
                        notification.is_read
                    )
            );
        }


        return notifications.filter(
            notification =>
                notification.type ===
                currentFilter
        );
    }


    /* =========================================================
       CREATE NOTIFICATION CARD
    ========================================================= */

    function createNotificationCard(
        notification
    ) {

        const style =
            getNotificationStyle(
                notification.type
            );


        const card =
            document.createElement(
                'article'
            );


        card.className =
            'notification-card';


        if (
            !Boolean(
                notification.is_read
            )
        ) {

            card.classList.add(
                'unread'
            );
        }


        card.dataset.notificationId =
            notification.id;


        card.innerHTML = `

            <div class="notification-left">

                <button
                    type="button"
                    class="dismiss-btn"
                    data-action="delete"
                    title="حذف الإشعار"
                    aria-label="حذف الإشعار"
                >
                    <i class="bi bi-x-lg"></i>
                </button>


                ${
                    !Boolean(
                        notification.is_read
                    )

                        ? `
                            <span
                                class="unread-dot"
                                title="غير مقروء"
                            ></span>
                        `

                        : ''
                }


                <small>
                    ${escapeHtml(
                        timeAgo(
                            notification.created_at
                        )
                    )}
                </small>

            </div>



            <div class="notification-text">

                <h3>
                    ${escapeHtml(
                        notification.title ||
                        'إشعار جديد'
                    )}
                </h3>


                <p>
                    ${escapeHtml(
                        notification.message ||
                        ''
                    )}
                </p>


                ${
                    notification.url

                        ? `
                            <a
                                href="${escapeHtml(
                                    notification.url
                                )}"
                                class="notification-open-link"
                                data-action="open"
                            >
                                عرض التفاصيل
                                <i class="bi bi-arrow-left"></i>
                            </a>
                        `

                        : ''
                }

            </div>



            <div
                class="
                    notification-icon
                    ${style.color}
                "
            >

                <i
                    class="
                        bi
                        ${style.icon}
                    "
                ></i>

            </div>
        `;


        return card;
    }


    /* =========================================================
       RENDER
    ========================================================= */

    function renderNotifications() {

        if (
            !notificationsList
        ) {

            return;
        }


        notificationsList.innerHTML =
            '';


        const items =
            getFilteredNotifications();


        if (
            items.length === 0
        ) {

            notificationsList
                .classList
                .add(
                    'd-none'
                );


            notificationsEmpty
                ?.classList
                .remove(
                    'd-none'
                );


            return;
        }


        notificationsEmpty
            ?.classList
            .add(
                'd-none'
            );


        notificationsList
            .classList
            .remove(
                'd-none'
            );


        items.forEach(
            function (notification) {

                notificationsList
                    .appendChild(
                        createNotificationCard(
                            notification
                        )
                    );
            }
        );
    }


    /* =========================================================
       LOAD NOTIFICATIONS
    ========================================================= */

    async function loadNotifications(
        silent = false
    ) {

        if (!silent) {

            showLoading();
        }


        try {

            const response =
                await fetch(
                    notificationsUrl,
                    {
                        method: 'GET',

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
                    'تعذر تحميل الإشعارات.'
                );
            }


            const list =
                data.notifications ||
                data.data ||
                [];


            notifications =
                Array.isArray(list)
                    ? list
                    : [];


            updateCounts(
                data.counts ||
                null
            );


            if (!silent) {

                hideLoading();
            }


            notificationsError
                ?.classList
                .add(
                    'd-none'
                );


            renderNotifications();


        } catch (error) {

            console.error(
                'Notifications load error:',
                error
            );


            if (!silent) {

                showError(
                    error.message ||
                    'تعذر تحميل الإشعارات.'
                );
            }
        }
    }


    /* =========================================================
       MARK ONE AS READ
    ========================================================= */

    async function markNotificationAsRead(id) {

        if (!id) {
            return false;
        }


        const notification =
            notifications.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (
            !notification ||
            Boolean(
                notification.is_read
            )
        ) {

            return true;
        }


        try {

            const response =
                await fetch(
                    `${notificationsUrl}/${id}/read`,
                    {
                        method: 'PATCH',

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
                    'تعذر تحديث الإشعار.'
                );
            }


            notification.is_read =
                true;


            updateCounts();

            renderNotifications();


            return true;


        } catch (error) {

            console.error(
                'Mark notification read error:',
                error
            );


            return false;
        }
    }


    /* =========================================================
       MARK ALL AS READ
    ========================================================= */

    async function markAllAsRead() {

        if (
            !notifications.length
        ) {

            showToast(
                'لا توجد إشعارات.',
                'info'
            );

            return;
        }


        if (
            markAllReadButton
        ) {

            markAllReadButton.disabled =
                true;
        }


        try {

            const response =
                await fetch(
                    readAllUrl,
                    {
                        method: 'PATCH',

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
                    'تعذر تحديث الإشعارات.'
                );
            }


            notifications =
                notifications.map(
                    function (
                        notification
                    ) {

                        return {
                            ...notification,
                            is_read: true,
                        };
                    }
                );


            updateCounts();

            renderNotifications();


            showToast(
                data.message ||
                'تم تحديد جميع الإشعارات كمقروءة.',
                'success'
            );


        } catch (error) {

            console.error(
                'Mark all read error:',
                error
            );


            showToast(
                error.message ||
                'تعذر تحديث الإشعارات.',
                'error'
            );


        } finally {

            if (
                markAllReadButton
            ) {

                markAllReadButton.disabled =
                    false;
            }
        }
    }


    /* =========================================================
       DELETE ONE
    ========================================================= */

    async function deleteNotification(id) {

        if (!id) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${notificationsUrl}/${id}`,
                    {
                        method: 'DELETE',

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
                    'تعذر حذف الإشعار.'
                );
            }


            notifications =
                notifications.filter(
                    item =>
                        String(item.id) !==
                        String(id)
                );


            updateCounts();

            renderNotifications();


            showToast(
                data.message ||
                'تم حذف الإشعار.',
                'success'
            );


        } catch (error) {

            console.error(
                'Delete notification error:',
                error
            );


            showToast(
                error.message ||
                'تعذر حذف الإشعار.',
                'error'
            );
        }
    }


    /* =========================================================
       DELETE ALL
    ========================================================= */

    async function deleteAllNotifications() {

        if (
            notifications.length === 0
        ) {

            showToast(
                'لا توجد إشعارات للحذف.',
                'info'
            );

            return;
        }


        const confirmed =
            window.confirm(
                'هل أنت متأكد من حذف جميع الإشعارات؟'
            );


        if (!confirmed) {
            return;
        }


        if (
            deleteAllNotificationsButton
        ) {

            deleteAllNotificationsButton.disabled =
                true;
        }


        try {

            const response =
                await fetch(
                    deleteAllUrl,
                    {
                        method: 'DELETE',

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
                    'تعذر حذف الإشعارات.'
                );
            }


            notifications = [];


            updateCounts();

            renderNotifications();


            showToast(
                data.message ||
                'تم حذف جميع الإشعارات.',
                'success'
            );


        } catch (error) {

            console.error(
                'Delete all notifications error:',
                error
            );


            showToast(
                error.message ||
                'تعذر حذف الإشعارات.',
                'error'
            );


        } finally {

            if (
                deleteAllNotificationsButton
            ) {

                deleteAllNotificationsButton.disabled =
                    false;
            }
        }
    }


    /* =========================================================
       TABS
    ========================================================= */

    notificationTabs.forEach(
        function (tab) {

            tab.addEventListener(
                'click',
                function () {

                    notificationTabs.forEach(
                        function (
                            otherTab
                        ) {

                            otherTab.classList.remove(
                                'active'
                            );
                        }
                    );


                    tab.classList.add(
                        'active'
                    );


                    currentFilter =
                        tab.dataset.filter ||
                        'all';


                    renderNotifications();
                }
            );
        }
    );


    /* =========================================================
       NOTIFICATION CARD CLICKS
    ========================================================= */

    notificationsList
        ?.addEventListener(
            'click',
            async function (event) {

                const card =
                    event.target.closest(
                        '.notification-card'
                    );


                if (!card) {
                    return;
                }


                const notificationId =
                    card.dataset
                        .notificationId;


                /*
                 * حذف إشعار
                 */

                const deleteButton =
                    event.target.closest(
                        '[data-action="delete"]'
                    );


                if (
                    deleteButton
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    await deleteNotification(
                        notificationId
                    );


                    return;
                }


                /*
                 * رابط عرض التفاصيل
                 */

                const openLink =
                    event.target.closest(
                        '[data-action="open"]'
                    );


                if (
                    openLink
                ) {

                    event.preventDefault();


                    const targetUrl =
                        openLink.getAttribute(
                            'href'
                        );


                    await markNotificationAsRead(
                        notificationId
                    );


                    if (
                        targetUrl &&
                        targetUrl !== '#'
                    ) {

                        window.location.href =
                            targetUrl;
                    }


                    return;
                }


                /*
                 * الضغط على الكارد نفسه
                 */

                await markNotificationAsRead(
                    notificationId
                );
            }
        );


    /* =========================================================
       BUTTONS
    ========================================================= */

    markAllReadButton
        ?.addEventListener(
            'click',
            markAllAsRead
        );


    deleteAllNotificationsButton
        ?.addEventListener(
            'click',
            deleteAllNotifications
        );


    retryNotificationsButton
        ?.addEventListener(
            'click',
            function () {

                loadNotifications(
                    false
                );
            }
        );


    /* =========================================================
       MOBILE SIDEBAR
    ========================================================= */

    function openSidebar() {

        sidebar
            ?.classList
            .add(
                'open'
            );


        sidebarOverlay
            ?.classList
            .add(
                'show'
            );
    }


    function closeSidebar() {

        sidebar
            ?.classList
            .remove(
                'open'
            );


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


    mobileMenuButton
        ?.addEventListener(
            'click',
            function () {

                const isOpen =
                    sidebar
                        ?.classList
                        .contains(
                            'open'
                        ) ||
                    sidebar
                        ?.classList
                        .contains(
                            'show'
                        );


                if (isOpen) {

                    closeSidebar();

                } else {

                    openSidebar();
                }
            }
        );


    sidebarOverlay
        ?.addEventListener(
            'click',
            closeSidebar
        );


    document
        .querySelectorAll(
            '.pf-menu-link'
        )
        .forEach(
            function (link) {

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
                            method: 'POST',

                            headers:
                                getHeaders(),
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
       AUTO REFRESH
       كل 30 ثانية يجلب إشعارات حقيقية جديدة
    ========================================================= */

    const notificationsRefreshInterval =
        window.setInterval(
            function () {

                if (
                    document.visibilityState ===
                    'visible'
                ) {

                    loadNotifications(
                        true
                    );
                }
            },
            30000
        );


    /*
     * إذا خرج المستخدم من التبويب ثم رجع له،
     * نحدث الإشعارات مباشرة.
     */

    document.addEventListener(
        'visibilitychange',
        function () {

            if (
                document.visibilityState ===
                'visible'
            ) {

                loadNotifications(
                    true
                );
            }
        }
    );


    window.addEventListener(
        'beforeunload',
        function () {

            window.clearInterval(
                notificationsRefreshInterval
            );
        }
    );


    /* =========================================================
       START
    ========================================================= */

    async function startPage() {

        const parentLoaded =
            await loadCurrentParent();


        if (!parentLoaded) {

            return;
        }


        await loadNotifications(
            false
        );
    }


    startPage();

});