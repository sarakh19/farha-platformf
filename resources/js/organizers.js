
import './site-common.js';
import './messages.js';
document.addEventListener('DOMContentLoaded', function () {

    const page =
        document.getElementById('organizersPage');

    if (!page) {
        return;
    }

    /* =========================================================
       URLs
    ========================================================= */

    const organizersApi =
        page.dataset.organizersApi;

    const categoriesApi =
        page.dataset.categoriesApi;

    const eventsPage =
        page.dataset.eventsPage;


    /* =========================================================
       Elements
    ========================================================= */

    const searchInput =
        document.getElementById('organizerSearch');

    const cityFilter =
        document.getElementById('organizerCityFilter');

    const categoryFilter =
        document.getElementById('organizerCategoryFilter');

    const resetButton =
        document.getElementById('resetOrganizerFilters');

    const loading =
        document.getElementById('organizersLoading');

    const content =
        document.getElementById('organizersContent');

    const cardsContainer =
        document.getElementById('organizersCards');

    const emptyState =
        document.getElementById('organizersEmpty');

    const errorBox =
        document.getElementById('organizersError');

    const errorMessage =
        document.getElementById('organizersErrorMessage');

    const retryButton =
        document.getElementById('retryOrganizers');

    const nextButton =
        document.getElementById('organizersNext');

    const previousButton =
        document.getElementById('organizersPrevious');


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


    function getAvatar(user) {

        if (!user.profile_image) {
            return '/images.1/4.png';
        }

        if (
            user.profile_image.startsWith('http://') ||
            user.profile_image.startsWith('https://') ||
            user.profile_image.startsWith('/')
        ) {
            return user.profile_image;
        }

        return `/storage/${user.profile_image}`;
    }


    /* =========================================================
       Load Categories
    ========================================================= */

    async function loadCategories() {

        try {

            const response =
                await fetch(
                    categoriesApi,
                    {
                        method: 'GET',

                        headers: {
                            Accept: 'application/json'
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


            const categories =
                Array.isArray(data)
                    ? data
                    : (
                        data.categories ||
                        data.data ||
                        []
                    );


            if (categoryFilter) {

                categoryFilter.innerHTML =
                    '<option value="">جميع الفئات</option>';


                categories.forEach(
                    function (category) {

                        const option =
                            document.createElement('option');

                        option.value =
                            category.id;

                        option.textContent =
                            category.name;

                        categoryFilter.appendChild(
                            option
                        );
                    }
                );
            }

        } catch (error) {

            console.error(
                'Categories error:',
                error
            );
        }
    }


    /* =========================================================
       Load Organizers
    ========================================================= */

    async function loadOrganizers() {

        loading?.classList.remove('d-none');
        content?.classList.add('d-none');
        emptyState?.classList.add('d-none');
        errorBox?.classList.add('d-none');


        const params =
            new URLSearchParams();


        const search =
            searchInput?.value.trim() || '';


        if (search) {

            params.set(
                'search',
                search
            );
        }


        if (cityFilter?.value) {

            params.set(
                'city',
                cityFilter.value
            );
        }


        if (categoryFilter?.value) {

            params.set(
                'category_id',
                categoryFilter.value
            );
        }


        const query =
            params.toString();


        try {

            const response =
                await fetch(
                    organizersApi +
                    (
                        query
                            ? '?' + query
                            : ''
                    ),
                    {
                        method: 'GET',

                        headers: {
                            Accept: 'application/json'
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
                    'تعذر تحميل المنظمين.'
                );
            }


            const organizers =
                Array.isArray(data)
                    ? data
                    : (
                        data.organizers ||
                        data.data ||
                        []
                    );


            renderOrganizers(
                organizers
            );

        } catch (error) {

            console.error(
                'Organizers error:',
                error
            );


            content?.classList.add('d-none');
            emptyState?.classList.add('d-none');
            errorBox?.classList.remove('d-none');


            if (errorMessage) {

                errorMessage.textContent =
                    error.message ||
                    'تعذر تحميل المنظمين.';
            }

        } finally {

            loading?.classList.add('d-none');
        }
    }


    /* =========================================================
       Render Organizers
    ========================================================= */

    function renderOrganizers(organizers) {

        if (!cardsContainer) {
            return;
        }


        cardsContainer.innerHTML = '';


        if (!organizers.length) {

            content?.classList.add('d-none');
            emptyState?.classList.remove('d-none');

            return;
        }


        emptyState?.classList.add('d-none');
        content?.classList.remove('d-none');


        organizers.forEach(
            function (organizer) {

                const card =
                    document.createElement('article');


                card.className =
                    'orgx-card';


                /*
                 * لما المستخدم يضغط "عرض الفعاليات"
                 * نرسل organizer_id إلى صفحة Events.
                 */
                const eventsUrl =
                    `${eventsPage}?organizer_id=${organizer.id}`;


                card.innerHTML = `

                    <div class="orgx-card-icon">

                        <img
                            src="${escapeHtml(
                                getAvatar(organizer)
                            )}"

                            alt="${escapeHtml(
                                organizer.name || 'منظم'
                            )}"

                            onerror="this.src='/images.1/4.png'"
                        >

                    </div>


                    <h3>
                        ${escapeHtml(
                            organizer.name ||
                            'منظم'
                        )}
                    </h3>


                    <span class="orgx-pill edu">
                        منظم فعاليات
                    </span>


                    <div class="orgx-meta">

                        <span>
                            ${escapeHtml(
                                organizer.city ||
                                'غير محدد'
                            )}
                            📍
                        </span>

                        <span>
                            |
                        </span>

                        <span>
                            ${
                                Number(
                                    organizer.approved_events_count
                                ) || 0
                            }
                            فعالية
                        </span>

                    </div>


                    <p>
                        منظم فعاليات مسجل في منصة فرحة.
                    </p>


                    <a href="${eventsUrl}">
                        عرض الفعاليات
                    </a>
                `;


                cardsContainer.appendChild(
                    card
                );
            }
        );
    }


    /* =========================================================
       Search
    ========================================================= */

    let searchTimer = null;


    searchInput?.addEventListener(
        'input',
        function () {

            clearTimeout(
                searchTimer
            );


            searchTimer =
                setTimeout(
                    function () {
                        loadOrganizers();
                    },
                    300
                );
        }
    );


    /* =========================================================
       Filters
    ========================================================= */

    cityFilter?.addEventListener(
        'change',
        loadOrganizers
    );


    categoryFilter?.addEventListener(
        'change',
        loadOrganizers
    );


    /* =========================================================
       Reset
    ========================================================= */

    resetButton?.addEventListener(
        'click',
        function (event) {

            event.preventDefault();


            if (searchInput) {
                searchInput.value = '';
            }


            if (cityFilter) {
                cityFilter.value = '';
            }


            if (categoryFilter) {
                categoryFilter.value = '';
            }


            loadOrganizers();
        }
    );


    /* =========================================================
       Slider
    ========================================================= */

    nextButton?.addEventListener(
        'click',
        function () {

            cardsContainer?.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        }
    );


    previousButton?.addEventListener(
        'click',
        function () {

            cardsContainer?.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        }
    );


    /* =========================================================
       Retry
    ========================================================= */

    retryButton?.addEventListener(
        'click',
        loadOrganizers
    );


    /* =========================================================
       Start
    ========================================================= */

    loadCategories();

    loadOrganizers();

});