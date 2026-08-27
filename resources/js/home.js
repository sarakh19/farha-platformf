import './site-common.js';
import './messages.js';


document.addEventListener('DOMContentLoaded', function () {

    const page =
        document.getElementById('homePage');

    if (!page) {
        return;
    }


    /* =========================================================
       URLs
    ========================================================= */

    const eventsApi =
        page.dataset.eventsApi ||
        '/api/events';


    const categoriesApi =
        page.dataset.categoriesApi ||
        '/api/categories';


    const eventsPage =
        page.dataset.eventsPage ||
        '/events';


    const eventDetailsBase =
        page.dataset.eventDetailsBase ||
        '/events';


    /* =========================================================
       Fancy hourly quote
    ========================================================= */

    const quotes = [
        'كل لحظة لعب هي فرصة جديدة للتعلم والنمو.',
        'الابتسامة اللي عم يرسمها طفلك اليوم، ذكرى بتضل معه للأبد.',
        'أفضل هدية لطفلك هي وقتك واهتمامك.',
        'الفضول هو أول خطوة نحو الإبداع.',
        'طفل سعيد اليوم، إنسان واثق بنفسه غداً.',
        'كل نشاط جديد بيفتح باب موهبة ما كنا نعرف فيها.',
        'العائلة اللي بتلعب مع بعض، بتقوى مع بعض.',
        'دع طفلك يكتشف العالم بعينيه الخاصة.',
        'التعلم باللعب أعمق أثراً من أي درس تقليدي.',
        'كل يوم فرصة لصنع فرحة جديدة مع أطفالنا.'
    ];


    const quoteTextEl =
        document.getElementById('quoteText');


    function quoteIndexForNow() {

        const now =
            new Date();


        const hourKey =
            Math.floor(
                now.getTime() /
                (1000 * 60 * 60)
            );


        return hourKey %
            quotes.length;
    }


    function renderQuote(animate) {

        if (!quoteTextEl) {
            return;
        }


        const nextText =
            quotes[
                quoteIndexForNow()
            ];


        if (
            quoteTextEl.textContent ===
            nextText
        ) {
            return;
        }


        if (animate) {

            quoteTextEl
                .classList
                .add('fading');


            setTimeout(
                function () {

                    quoteTextEl.textContent =
                        nextText;


                    quoteTextEl
                        .classList
                        .remove('fading');

                },
                350
            );

        } else {

            quoteTextEl.textContent =
                nextText;
        }
    }


    renderQuote(false);


    setInterval(
        function () {

            renderQuote(true);

        },
        60 * 1000
    );


    /* =========================================================
       Elements
    ========================================================= */

    const searchInput =
        document.getElementById(
            'homeSearchInput'
        );


    const categorySelect =
        document.getElementById(
            'homeCategorySelect'
        );


    const locationInput =
        document.getElementById(
            'homeLocationInput'
        );


    const ageSelect =
        document.getElementById(
            'homeAgeSelect'
        );


    const searchButton =
        document.getElementById(
            'homeSearchButton'
        );


    const categoriesContainer =
        document.getElementById(
            'homeCategoriesContainer'
        );


    const eventsGrid =
        document.getElementById(
            'homeEventsGrid'
        );


    const loading =
        document.getElementById(
            'homeEventsLoading'
        );


    const empty =
        document.getElementById(
            'homeEventsEmpty'
        );


    const errorBox =
        document.getElementById(
            'homeEventsError'
        );


    const errorMessage =
        document.getElementById(
            'homeEventsErrorMessage'
        );


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


        return date
            .toLocaleDateString(
                'ar',
                {
                    year:
                        'numeric',

                    month:
                        'long',

                    day:
                        'numeric',
                }
            );
    }


    function formatTime(value) {

        if (!value) {
            return 'غير محدد';
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


        if (
            Number.isNaN(hour)
        ) {

            return value;
        }


        const period =
            hour >= 12
                ? 'مساءً'
                : 'صباحاً';


        hour =
            hour % 12;


        if (
            hour === 0
        ) {

            hour = 12;
        }


        return `${hour}:${minute} ${period}`;
    }


    /* =========================================================
       Event Image
    ========================================================= */

    function getEventImage(event) {

        const image =
            event?.image ||
            event?.image_path ||
            event?.cover_image ||
            event?.photo ||
            event?.image_url;


        if (!image) {

            return '/images.1/Image.png';
        }


        const value =
            String(image)
                .trim();


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
            )
        ) {

            return `/${value}`;
        }


        if (
            value.startsWith(
                'images.1/'
            )
        ) {

            return `/${value}`;
        }


        return `/storage/${value}`;
    }


    function categoryClass(index) {

        const classes = [
            'orange',
            'blue',
            'green',
            'pink'
        ];


        return classes[
            index %
            classes.length
        ];
    }


    /* =========================================================
       Category Icon
    ========================================================= */

    function categoryIcon(categoryName) {

        const iconsByName = {
            'رياضية': '⚽',
            'فنية': '🎨',
            'ترفيهية': '🎈',
            'تعليمية': '🎓',
            'صحة الطفل': '❤️',
            'دعم نفسي': '💜'
        };

        return iconsByName[categoryName] || '⭐';
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
                        method:
                            'GET',

                        headers: {
                            Accept:
                                'application/json'
                        }
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


            /*
             * حتى ما تتكرر الخيارات
             * إذا استدعينا loadCategories مرة أخرى.
             */
            if (
                categorySelect
            ) {

                const oldDynamicOptions =
                    categorySelect
                        .querySelectorAll(
                            'option[data-dynamic-category]'
                        );


                oldDynamicOptions
                    .forEach(
                        function (
                            option
                        ) {

                            option.remove();
                        }
                    );
            }


            if (
                categoriesContainer
            ) {

                categoriesContainer
                    .querySelectorAll(
                        '.hp-category[data-dynamic-category]'
                    )
                    .forEach(
                        function (
                            element
                        ) {

                            element.remove();
                        }
                    );
            }


            categories.forEach(
                function (
                    category,
                    index
                ) {

                    /* ==============================
                       Select
                    ============================== */

                    if (
                        categorySelect
                    ) {

                        const option =
                            document
                                .createElement(
                                    'option'
                                );


                        option.value =
                            category.id;


                        option.textContent =
                            category.name;


                        option.dataset
                            .dynamicCategory =
                            'true';


                        categorySelect
                            .appendChild(
                                option
                            );
                    }


                    /* ==============================
                       Category Card
                    ============================== */

                    if (
                        categoriesContainer
                    ) {

                        const link =
                            document
                                .createElement(
                                    'a'
                                );


                        link.className =
                            'hp-category';


                        link.dataset
                            .dynamicCategory =
                            'true';


                        link.href =
                            `${eventsPage}?category_id=${category.id}`;


                        link.innerHTML = `

                            <span>
                                ${categoryIcon(category.name)}
                            </span>

                            <strong>
                                ${escapeHtml(
                                    category.name
                                )}
                            </strong>
                        `;


                        categoriesContainer
                            .appendChild(
                                link
                            );
                    }
                }
            );


        } catch (error) {

            console.error(
                'Categories error:',
                error
            );
        }
    }


    /* =========================================================
       Load Upcoming Events
    ========================================================= */

    async function loadEvents() {

        loading
            ?.classList
            .remove('d-none');


        empty
            ?.classList
            .add('d-none');


        errorBox
            ?.classList
            .add('d-none');


        try {

            const response =
                await fetch(
                    eventsApi,
                    {
                        method:
                            'GET',

                        headers: {
                            Accept:
                                'application/json'
                        }
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


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'تعذر تحميل الفعاليات.'
                );
            }


            const events =
                Array.isArray(data)
                    ? data
                    : (
                        data.events ||
                        data.data ||
                        []
                    );


            const now =
                new Date();


            const upcomingEvents =
                events

                    .filter(
                        function (
                            event
                        ) {

                            if (
                                !event.event_date
                            ) {

                                return false;
                            }


                            const cleanDate =
                                String(
                                    event.event_date
                                ).slice(
                                    0,
                                    10
                                );


                            const eventDate =
                                new Date(
                                    `${cleanDate}T23:59:59`
                                );


                            return (
                                !Number.isNaN(
                                    eventDate
                                        .getTime()
                                ) &&
                                eventDate >=
                                    now
                            );
                        }
                    )

                    .sort(
                        function (
                            a,
                            b
                        ) {

                            const aDate =
                                new Date(
                                    `${
                                        String(
                                            a.event_date
                                        ).slice(
                                            0,
                                            10
                                        )
                                    }T${
                                        a.start_time ||
                                        '00:00'
                                    }`
                                );


                            const bDate =
                                new Date(
                                    `${
                                        String(
                                            b.event_date
                                        ).slice(
                                            0,
                                            10
                                        )
                                    }T${
                                        b.start_time ||
                                        '00:00'
                                    }`
                                );


                            return (
                                aDate -
                                bDate
                            );
                        }
                    )

                    .slice(
                        0,
                        4
                    );


            renderEvents(
                upcomingEvents
            );


        } catch (error) {

            console.error(
                'Home events error:',
                error
            );


            errorBox
                ?.classList
                .remove('d-none');


            if (
                errorMessage
            ) {

                errorMessage.textContent =
                    error.message ||
                    'تعذر تحميل الفعاليات.';
            }


        } finally {

            loading
                ?.classList
                .add('d-none');
        }
    }


    /* =========================================================
       Render Events
    ========================================================= */

    function renderEvents(events) {

        if (
            !eventsGrid
        ) {

            return;
        }


        eventsGrid.innerHTML =
            '';


        if (
            !events.length
        ) {

            empty
                ?.classList
                .remove('d-none');


            return;
        }


        empty
            ?.classList
            .add('d-none');


        events.forEach(
            function (
                event,
                index
            ) {

                const categoryName =
                    event.category?.name ||
                    event.category_name ||
                    'فعالية';


                /*
                 * الرابط المهم:
                 * /events/1
                 * /events/2
                 * ...
                 */
                const detailsUrl =
                    `${eventDetailsBase}/${event.id}`;


                const card =
                    document
                        .createElement(
                            'article'
                        );


                card.className =
                    'hp-event-card';


                card.innerHTML = `

                    <a
                        href="${escapeHtml(
                            detailsUrl
                        )}"
                        class="hp-event-img"
                    >

                        <img
                            src="${escapeHtml(
                                getEventImage(
                                    event
                                )
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


                        <span
                            class="${categoryClass(
                                index
                            )}"
                        >
                            ${escapeHtml(
                                categoryName
                            )}
                        </span>

                    </a>


                    <div class="hp-event-body">

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
                                    event.place ||
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
                            </li>

                        </ul>


                        <a
                            href="${escapeHtml(
                                detailsUrl
                            )}"
                        >
                            عرض التفاصيل
                        </a>

                    </div>
                `;


                eventsGrid
                    .appendChild(
                        card
                    );
            }
        );
    }


    /* =========================================================
       Search
    ========================================================= */

    function goToEventsSearch() {

        const params =
            new URLSearchParams();


        const search =
            searchInput
                ?.value
                .trim();


        if (
            search
        ) {

            params.set(
                'search',
                search
            );
        }


        if (
            categorySelect?.value
        ) {

            params.set(
                'category_id',
                categorySelect.value
            );
        }


        if (
            locationInput
                ?.value
                .trim()
        ) {

            params.set(
                'location',
                locationInput
                    .value
                    .trim()
            );
        }


        if (
            ageSelect?.value
        ) {

            params.set(
                'age_group',
                ageSelect.value
            );
        }


        const query =
            params.toString();


        window.location.href =
            query
                ? `${eventsPage}?${query}`
                : eventsPage;
    }


    /* =========================================================
       Search Button
    ========================================================= */

    searchButton
        ?.addEventListener(
            'click',
            function (
                event
            ) {

                event.preventDefault();

                goToEventsSearch();
            }
        );


    /* =========================================================
       Enter Search
    ========================================================= */

    searchInput
        ?.addEventListener(
            'keydown',
            function (
                event
            ) {

                if (
                    event.key ===
                    'Enter'
                ) {

                    event.preventDefault();

                    goToEventsSearch();
                }
            }
        );


    /* =========================================================
       Start
    ========================================================= */

    loadCategories();

    loadEvents();

});