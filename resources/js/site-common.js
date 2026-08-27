document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       Mobile Nav Toggle
    ========================================================= */

    const menuToggle =
        document.querySelector('.menu-toggle');

    const siteNav =
        document.querySelector('.site-nav');

    let overlay =
        document.querySelector('.sidebar-overlay');


    if (!overlay) {

        overlay =
            document.createElement('div');

        overlay.className =
            'sidebar-overlay';

        document.body.appendChild(overlay);
    }


    function openNav() {

        if (!siteNav) {
            return;
        }

        siteNav.classList.add('show');
        overlay.classList.add('show');
    }


    function closeNav() {

        if (!siteNav) {
            return;
        }

        siteNav.classList.remove('show');
        overlay.classList.remove('show');
    }


    if (menuToggle && siteNav) {

        menuToggle.addEventListener(
            'click',
            function () {

                if (
                    siteNav.classList.contains('show')
                ) {

                    closeNav();

                } else {

                    openNav();
                }
            }
        );
    }


    overlay.addEventListener(
        'click',
        closeNav
    );


    document
        .querySelectorAll('.site-nav a')
        .forEach(function (link) {

            link.addEventListener(
                'click',
                function () {

                    if (
                        window.innerWidth < 992
                    ) {

                        closeNav();
                    }
                }
            );
        });


    window.addEventListener(
        'resize',
        function () {

            if (
                window.innerWidth >= 992
            ) {

                closeNav();
            }
        }
    );


    /* =========================================================
       Toast Utility
    ========================================================= */

    function getToastContainer() {

        let container =
            document.querySelector(
                '.toast-container'
            );


        if (!container) {

            container =
                document.createElement('div');

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
            'bi-info-circle-fill'
    };


    window.showToast =
        function (message, type) {

            type =
                type || 'info';


            const container =
                getToastContainer();


            const toast =
                document.createElement('div');


            toast.className =
                'app-toast ' + type;


            toast.innerHTML = `

                <i class="bi ${
                    TOAST_ICONS[type] ||
                    TOAST_ICONS.info
                }"></i>

                <span>
                    ${escapeHtml(message)}
                </span>
            `;


            container.appendChild(
                toast
            );


            setTimeout(
                function () {

                    toast.classList.add(
                        'hide'
                    );


                    setTimeout(
                        function () {

                            toast.remove();

                        },
                        250
                    );

                },
                3500
            );
        };


    /* =========================================================
       Network Status
    ========================================================= */

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
       Public Header Authentication
    ========================================================= */

    const authArea =
        document.querySelector('.site-auth');


    /*
     * إذا الصفحة ما فيها Header عام
     * ما نكمل جزء الحساب.
     */
    if (!authArea) {
        return;
    }


    /* =========================================================
       Get Token
    ========================================================= */

    const token =
        localStorage.getItem(
            'farha_token'
        ) ||
        sessionStorage.getItem(
            'farha_token'
        );


    /* =========================================================
       Get User
    ========================================================= */

    const storedUser =
        localStorage.getItem(
            'farha_user'
        ) ||
        sessionStorage.getItem(
            'farha_user'
        );


    let user = null;


    try {

        if (storedUser) {

            user =
                JSON.parse(
                    storedUser
                );
        }

    } catch (error) {

        console.error(
            'Invalid farha_user:',
            error
        );
    }


    /* =========================================================
       Guest
    ========================================================= */

    if (
        !token ||
        !user
    ) {

        /*
         * لا نعمل أي شيء.
         *
         * تبقى الأزرار الأصلية:
         *
         * تسجيل دخول
         * إنشاء حساب
         */

        return;
    }


    /* =========================================================
       User Info
    ========================================================= */

    const firstName =
        user.name
            ? user.name
                .trim()
                .split(' ')[0]
            : 'حسابي';


    const firstLetter =
        firstName
            ? firstName.charAt(0)
            : 'ح';


    /* =========================================================
       Create Menu According To Role
    ========================================================= */

    let menuLinks = '';


    /* =========================================================
       Parent
       لا يوجد Dashboard لولي الأمر
    ========================================================= */

    if (
        user.role === 'parent'
    ) {

        menuLinks = `

            <a href="/parent/profile">

                <i class="bi bi-person-circle"></i>

                <span>
                    ملفي الشخصي
                </span>

            </a>


            <a href="/parent/my-events">

                <i class="bi bi-calendar-check"></i>

                <span>
                    فعالياتي
                </span>

            </a>

        `;
    }


    /* =========================================================
       Organizer
    ========================================================= */

    else if (
        user.role === 'organizer'
    ) {

        menuLinks = `

            <a href="/organizer/dashboard">

                <i class="bi bi-speedometer2"></i>

                <span>
                    لوحة التحكم
                </span>

            </a>


            <a href="/organizer/events">

                <i class="bi bi-calendar-event"></i>

                <span>
                    فعالياتي
                </span>

            </a>


            <a href="/organizer/events/create">

                <i class="bi bi-plus-circle"></i>

                <span>
                    إضافة فعالية
                </span>

            </a>


            <a href="/organizer/settings">

                <i class="bi bi-gear"></i>

                <span>
                    الإعدادات
                </span>

            </a>

        `;
    }


    /* =========================================================
       Admin
    ========================================================= */

    else if (
        user.role === 'admin'
    ) {

        menuLinks = `

            <a href="/admin/dashboard">

                <i class="bi bi-speedometer2"></i>

                <span>
                    لوحة التحكم
                </span>

            </a>

        `;
    }


    /* =========================================================
       Unknown Role
    ========================================================= */

    else {

        /*
         * لو حصل خطأ بالدور لأي سبب
         * نخلي فقط تسجيل الخروج.
         */

        menuLinks = '';
    }


    /* =========================================================
       Replace Login / Register Buttons
    ========================================================= */

    authArea.innerHTML = `

        <div class="site-user-menu">

            <button
                type="button"
                class="site-user-button"
                id="siteUserButton"
                aria-expanded="false"
                aria-label="فتح قائمة الحساب"
            >

                <span class="site-user-avatar">

                    ${escapeHtml(firstLetter)}

                </span>


                <span class="site-user-name">

                    مرحباً،
                    ${escapeHtml(firstName)}

                </span>


                <i class="bi bi-chevron-down"></i>

            </button>


            <div
                class="site-user-dropdown"
                id="siteUserDropdown"
            >

                ${menuLinks}


                ${
                    menuLinks
                        ? '<hr>'
                        : ''
                }


                <button
                    type="button"
                    class="site-user-logout"
                    id="siteLogoutButton"
                >

                    <i class="bi bi-box-arrow-right"></i>

                    <span>
                        تسجيل خروج
                    </span>

                </button>

            </div>

        </div>
    `;


    /* =========================================================
       Dropdown Elements
    ========================================================= */

    const userButton =
        document.getElementById(
            'siteUserButton'
        );


    const dropdown =
        document.getElementById(
            'siteUserDropdown'
        );


    /* =========================================================
       Open / Close User Dropdown
    ========================================================= */

    userButton?.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                dropdown?.classList.contains(
                    'show'
                );


            if (isOpen) {

                closeUserDropdown();

            } else {

                openUserDropdown();
            }
        }
    );


    function openUserDropdown() {

        if (
            !dropdown ||
            !userButton
        ) {
            return;
        }


        dropdown.classList.add(
            'show'
        );


        userButton.setAttribute(
            'aria-expanded',
            'true'
        );
    }


    function closeUserDropdown() {

        if (
            !dropdown ||
            !userButton
        ) {
            return;
        }


        dropdown.classList.remove(
            'show'
        );


        userButton.setAttribute(
            'aria-expanded',
            'false'
        );
    }


    /* =========================================================
       Close Dropdown When Click Outside
    ========================================================= */

    document.addEventListener(
        'click',
        function (event) {

            const menu =
                event.target.closest(
                    '.site-user-menu'
                );


            if (!menu) {

                closeUserDropdown();
            }
        }
    );


    /* =========================================================
       Close Dropdown With Escape
    ========================================================= */

    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key === 'Escape'
            ) {

                closeUserDropdown();
            }
        }
    );


    /* =========================================================
       Logout
    ========================================================= */

    const logoutButton =
        document.getElementById(
            'siteLogoutButton'
        );


    logoutButton?.addEventListener(
        'click',
        async function () {

            logoutButton.disabled =
                true;


            try {

                const response =
                    await fetch(
                        '/api/logout',
                        {
                            method:
                                'POST',

                            headers: {

                                Accept:
                                    'application/json',

                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                /*
                 * حتى لو رجع Token expired
                 * رح نسجل خروج محليًا تحت.
                 */

                if (!response.ok) {

                    console.warn(
                        'Logout API returned:',
                        response.status
                    );
                }

            } catch (error) {

                console.error(
                    'Logout request failed:',
                    error
                );

            } finally {

                clearAuthentication();


                /*
                 * نرجع للصفحة الرئيسية العامة.
                 */
                window.location.href =
                    '/home';
            }
        }
    );


    /* =========================================================
       Clear Auth Data
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

});