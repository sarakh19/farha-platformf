import './dashboard-common.js';

document.addEventListener('DOMContentLoaded', function () {

    const page =
        document.getElementById('organizerReportsPage');

    if (!page) {
        return;
    }


    /* =========================================================
       URLs
    ========================================================= */

    const reportUrl =
        page.dataset.reportUrl ||
        '/api/organizer/reports';

    const logoutUrl =
        page.dataset.logoutUrl ||
        '/api/logout';

    const loginUrl =
        page.dataset.loginUrl ||
        '/login';


    /* =========================================================
       Authentication
    ========================================================= */

    const token =
        localStorage.getItem('farha_token') ||
        sessionStorage.getItem('farha_token');


    const storedUserRaw =
        localStorage.getItem('farha_user') ||
        sessionStorage.getItem('farha_user');


    let currentUser = null;


    try {

        currentUser =
            storedUserRaw
                ? JSON.parse(storedUserRaw)
                : null;

    } catch (error) {

        console.error(
            'Invalid stored user:',
            error
        );
    }


    function clearAuthentication() {

        localStorage.removeItem('farha_token');
        localStorage.removeItem('farha_user');

        sessionStorage.removeItem('farha_token');
        sessionStorage.removeItem('farha_user');
    }


    function getHeaders() {

        const headers = {
            Accept: 'application/json',
        };


        if (token) {

            headers.Authorization =
                `Bearer ${token}`;
        }


        return headers;
    }


    /* =========================================================
       Check login
    ========================================================= */

    if (!token) {

        window.location.href =
            loginUrl;

        return;
    }


    /* =========================================================
       Elements
    ========================================================= */

    const reportPeriod =
        document.getElementById(
            'reportPeriod'
        );


    const retryReportsButton =
        document.getElementById(
            'retryReportsButton'
        );


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


    const reportTotalEvents =
        document.getElementById(
            'reportTotalEvents'
        );


    const reportTotalRegistrations =
        document.getElementById(
            'reportTotalRegistrations'
        );


    const reportConfirmedRegistrations =
        document.getElementById(
            'reportConfirmedRegistrations'
        );


    const reportAcceptanceRate =
        document.getElementById(
            'reportAcceptanceRate'
        );


    const reportRegistrationsBreakdown =
        document.getElementById(
            'reportRegistrationsBreakdown'
        );


    const reportCategoriesList =
        document.getElementById(
            'reportCategoriesList'
        );


    const reportTopEventsList =
        document.getElementById(
            'reportTopEventsList'
        );


    const loadingState =
        document.getElementById(
            'reportLoadingState'
        );


    const errorState =
        document.getElementById(
            'reportErrorState'
        );


    const errorMessage =
        document.getElementById(
            'reportErrorMessage'
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
       Organizer Data
    ========================================================= */

    function getInitial(name) {

        if (!name) {
            return 'م';
        }


        return String(name)
            .trim()
            .charAt(0)
            .toUpperCase();
    }


    function setOrganizerInfo(
        organizer
    ) {

        const user =
            organizer ||
            currentUser ||
            {};


        const name =
            user.name ||
            user.full_name ||
            'المنظم';


        if (organizerName) {

            organizerName.textContent =
                name;
        }


        if (welcomeOrganizerName) {

            welcomeOrganizerName.textContent =
                name;
        }


        if (organizerAvatar) {

            organizerAvatar.textContent =
                getInitial(name);
        }
    }


    setOrganizerInfo(
        currentUser
    );


    /* =========================================================
       UI State
    ========================================================= */

    function showLoading() {

        loadingState
            ?.classList
            .remove('d-none');


        errorState
            ?.classList
            .add('d-none');
    }


    function hideLoading() {

        loadingState
            ?.classList
            .add('d-none');
    }


    function showError(
        message =
            'تعذر تحميل التقارير.'
    ) {

        if (errorMessage) {

            errorMessage.textContent =
                message;
        }


        errorState
            ?.classList
            .remove('d-none');
    }


    function hideError() {

        errorState
            ?.classList
            .add('d-none');
    }


    /* =========================================================
       Helpers
    ========================================================= */

    function escapeHtml(value) {

        return String(
            value ?? ''
        )
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }


    function formatDate(
        dateValue
    ) {

        if (!dateValue) {
            return '—';
        }


        const clean =
            String(dateValue)
                .slice(0, 10);


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
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
            );
    }


    /* =========================================================
       Summary
    ========================================================= */

    function renderSummary(
        summary
    ) {

        if (reportTotalEvents) {

            reportTotalEvents.textContent =
                summary.total_events ??
                0;
        }


        if (
            reportTotalRegistrations
        ) {

            reportTotalRegistrations.textContent =
                summary.total_registrations ??
                0;
        }


        if (
            reportConfirmedRegistrations
        ) {

            reportConfirmedRegistrations.textContent =
                summary.confirmed_registrations ??
                0;
        }


        if (
            reportAcceptanceRate
        ) {

            reportAcceptanceRate.textContent =
                `${
                    summary.acceptance_rate ??
                    0
                }%`;
        }
    }


    /* =========================================================
       Registrations Breakdown
    ========================================================= */

    function renderBreakdown(
        summary
    ) {

        if (
            !reportRegistrationsBreakdown
        ) {

            return;
        }


        const rejectedAndCancelled =
            Number(
                summary.rejected_registrations ??
                0
            ) +
            Number(
                summary.cancelled_registrations ??
                0
            );


        reportRegistrationsBreakdown.innerHTML = `

            <div class="breakdown-item total">

                <div class="breakdown-item-info">

                    <div class="breakdown-item-icon">
                        <i class="bi bi-journal-text"></i>
                    </div>

                    <div class="breakdown-item-text">

                        <strong>
                            إجمالي الطلبات
                        </strong>

                        <small>
                            كل طلبات التسجيل
                        </small>

                    </div>

                </div>

                <div class="breakdown-item-value">
                    ${
                        summary.total_registrations ??
                        0
                    }
                </div>

            </div>


            <div class="breakdown-item confirmed">

                <div class="breakdown-item-info">

                    <div class="breakdown-item-icon">
                        <i class="bi bi-check2-circle"></i>
                    </div>

                    <div class="breakdown-item-text">

                        <strong>
                            الطلبات المقبولة
                        </strong>

                        <small>
                            تمت الموافقة عليها
                        </small>

                    </div>

                </div>

                <div class="breakdown-item-value">
                    ${
                        summary.confirmed_registrations ??
                        0
                    }
                </div>

            </div>


            <div class="breakdown-item pending">

                <div class="breakdown-item-info">

                    <div class="breakdown-item-icon">
                        <i class="bi bi-hourglass-split"></i>
                    </div>

                    <div class="breakdown-item-text">

                        <strong>
                            قيد المراجعة
                        </strong>

                        <small>
                            طلبات بانتظار القرار
                        </small>

                    </div>

                </div>

                <div class="breakdown-item-value">
                    ${
                        summary.pending_registrations ??
                        0
                    }
                </div>

            </div>


            <div class="breakdown-item rejected">

                <div class="breakdown-item-info">

                    <div class="breakdown-item-icon">
                        <i class="bi bi-x-circle"></i>
                    </div>

                    <div class="breakdown-item-text">

                        <strong>
                            مرفوضة / ملغية
                        </strong>

                        <small>
                            طلبات غير فعالة
                        </small>

                    </div>

                </div>

                <div class="breakdown-item-value">
                    ${rejectedAndCancelled}
                </div>

            </div>

        `;
    }


    /* =========================================================
       Categories
    ========================================================= */

    function renderCategories(
        categories
    ) {

        if (
            !reportCategoriesList
        ) {

            return;
        }


        if (
            !Array.isArray(categories) ||
            categories.length === 0
        ) {

            reportCategoriesList.innerHTML = `

                <div class="report-empty-box">
                    لا توجد بيانات فئات خلال هذه الفترة.
                </div>

            `;

            return;
        }


        const maxCount =
            Math.max(
                ...categories.map(
                    item =>
                        Number(
                            item.count ||
                            0
                        )
                ),
                1
            );


        reportCategoriesList.innerHTML =
            categories
                .map(
                    function (item) {

                        const count =
                            Number(
                                item.count ||
                                0
                            );


                        const width =
                            Math.max(
                                (
                                    count /
                                    maxCount
                                ) *
                                100,
                                8
                            );


                        return `

                            <div class="category-report-item">

                                <div class="category-report-head">

                                    <strong>
                                        ${escapeHtml(
                                            item.name ||
                                            'بدون فئة'
                                        )}
                                    </strong>

                                    <span>
                                        ${count}
                                    </span>

                                </div>

                                <div class="category-progress">

                                    <div
                                        class="category-progress-bar"
                                        style="width: ${width}%"
                                    ></div>

                                </div>

                            </div>

                        `;
                    }
                )
                .join('');
    }


    /* =========================================================
       Top Events
    ========================================================= */

    function renderTopEvents(
        events
    ) {

        if (
            !reportTopEventsList
        ) {

            return;
        }


        if (
            !Array.isArray(events) ||
            events.length === 0
        ) {

            reportTopEventsList.innerHTML = `

                <div class="report-empty-box">
                    لا توجد بيانات كافية لعرض الفعاليات الأعلى تسجيلاً.
                </div>

            `;

            return;
        }


        reportTopEventsList.innerHTML =
            events
                .map(
                    function (event) {

                        return `

                            <div class="top-event-item">

                                <div class="top-event-main">

                                    <strong>
                                        ${escapeHtml(
                                            event.title ||
                                            'فعالية'
                                        )}
                                    </strong>

                                    <small>
                                        ${escapeHtml(
                                            event.category_name ||
                                            'بدون فئة'
                                        )}
                                    </small>

                                </div>


                                <div class="top-event-meta">

                                    <span>
                                        ${escapeHtml(
                                            formatDate(
                                                event.event_date
                                            )
                                        )}
                                    </span>

                                    <small>
                                        تاريخ الفعالية
                                    </small>

                                </div>


                                <div class="top-event-meta">

                                    <span>
                                        ${escapeHtml(
                                            event.location ||
                                            '—'
                                        )}
                                    </span>

                                    <small>
                                        الموقع
                                    </small>

                                </div>


                                <div class="top-event-count">

                                    <strong>
                                        ${
                                            event.registrations_count ??
                                            0
                                        }
                                    </strong>

                                    <small>
                                        تسجيل
                                    </small>

                                </div>

                            </div>

                        `;
                    }
                )
                .join('');
    }


    /* =========================================================
       Load Reports
    ========================================================= */

    async function loadReports() {

        showLoading();
        hideError();


        try {

            const period =
                reportPeriod?.value ||
                '30';


            const separator =
                reportUrl.includes('?')
                    ? '&'
                    : '?';


            const response =
                await fetch(
                    `${reportUrl}${separator}period=${encodeURIComponent(period)}`,
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
                403
            ) {

                throw new Error(
                    'ليس لديك صلاحية للوصول إلى تقارير المنظم.'
                );
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل التقارير.'
                );
            }


            console.log(
                'Organizer reports:',
                data
            );


            setOrganizerInfo(
                data.organizer
            );


            const summary =
                data.summary ||
                {};


            renderSummary(
                summary
            );


            renderBreakdown(
                summary
            );


            renderCategories(
                data.categories ||
                []
            );


            renderTopEvents(
                data.top_events ||
                []
            );


        } catch (error) {

            console.error(
                'Reports error:',
                error
            );


            showError(
                error.message ||
                'تعذر تحميل التقارير.'
            );


        } finally {

            hideLoading();
        }
    }


    /* =========================================================
       Period
    ========================================================= */

    reportPeriod
        ?.addEventListener(
            'change',
            loadReports
        );


    retryReportsButton
        ?.addEventListener(
            'click',
            loadReports
        );


    /* =========================================================
       Sidebar
    ========================================================= */

    menuToggle
        ?.addEventListener(
            'click',
            function () {

                sidebar
                    ?.classList
                    .add('show');


                sidebarOverlay
                    ?.classList
                    .add('show');
            }
        );


    sidebarOverlay
        ?.addEventListener(
            'click',
            function () {

                sidebar
                    ?.classList
                    .remove('show');


                sidebarOverlay
                    ?.classList
                    .remove('show');
            }
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
       START
    ========================================================= */

    loadReports();

});