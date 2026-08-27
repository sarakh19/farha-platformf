
import './site-common.js';
import './messages.js';

document.addEventListener('DOMContentLoaded', function () {

    const searchInput = document.getElementById('faqSearch');
    const faqItems = Array.from(document.querySelectorAll('.faq-item'));
    const categoryButtons = document.querySelectorAll('.faq-cat-item');
    const noResults = document.getElementById('noResults');

    let activeCategory = 'all';


    /* =============================================
       فتح وإغلاق السؤال
    ============================================= */

    faqItems.forEach(function (item) {

        const question = item.querySelector('.faq-question');

        question?.addEventListener('click', function () {

            const wasOpen = item.classList.contains('active');

            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove('active');
            });

            if (!wasOpen) {
                item.classList.add('active');
            }

        });

    });


    /* =============================================
       البحث والتصنيف
    ============================================= */

    function applyFilters() {

        const search =
            (searchInput?.value || '')
                .trim()
                .toLowerCase();

        let visibleCount = 0;


        faqItems.forEach(function (item) {

            const category =
                item.dataset.cat || '';

            const text =
                item.textContent
                    .trim()
                    .toLowerCase();


            const categoryMatch =
                activeCategory === 'all' ||
                category === activeCategory;


            const searchMatch =
                !search ||
                text.includes(search);


            const show =
                categoryMatch &&
                searchMatch;


            item.style.display =
                show ? '' : 'none';


            if (show) {
                visibleCount++;
            }

        });


        if (noResults) {

            noResults.classList.toggle(
                'd-none',
                visibleCount > 0
            );

        }

    }


    /* =============================================
       Search
    ============================================= */

    searchInput?.addEventListener(
        'input',
        applyFilters
    );


    /* =============================================
       Categories
    ============================================= */

    categoryButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            activeCategory =
                button.dataset.cat || 'all';


            categoryButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        'active'
                    );

                }
            );


            button.classList.add('active');


            applyFilters();

        });

    });


    applyFilters();

});