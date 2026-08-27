import './site-common.js';
import './messages.js';
document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       About Stats Counter
    ========================================================= */

    const statsSection =
        document.getElementById('aboutStats');

    if (!statsSection) {
        return;
    }

    const counters =
        statsSection.querySelectorAll(
            '[data-count-to]'
        );

    const DURATION = 1200;

    let hasAnimated = false;


    /* =========================================================
       Animate Single Counter
    ========================================================= */

    function animateCounter(element) {

        const target =
            parseInt(
                element.dataset.countTo,
                10
            ) || 0;

        const suffix =
            element.dataset.suffix || '';

        const startTime =
            performance.now();


        function tick(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / DURATION,
                    1
                );

            /*
             * Smooth easing
             */
            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const currentValue =
                Math.round(
                    target * eased
                );

            element.textContent =
                currentValue + suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    tick
                );

            } else {

                element.textContent =
                    target + suffix;
            }
        }


        requestAnimationFrame(
            tick
        );
    }


    /* =========================================================
       Start when section appears
    ========================================================= */

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting &&
                            !hasAnimated
                        ) {

                            hasAnimated =
                                true;

                            counters.forEach(
                                animateCounter
                            );

                            observer.disconnect();
                        }
                    }
                );
            },
            {
                threshold: 0.3
            }
        );


    observer.observe(
        statsSection
    );

});