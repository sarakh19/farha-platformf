<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>عن فرحة</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css"
        rel="stylesheet"
    >

    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    >

    @vite([
        'resources/css/site-common.css',
           'resources/css/site-common.js',
        'resources/css/about.css',
        'resources/js/about.js'
    ])

</head>

<body class="about-page">

    <!-- Header -->
    <header class="site-header">

        <div class="wrap site-header-row">

            <a
                href="{{ url('/') }}"
                class="site-logo"
            >
                <img
                    src="{{ asset('images.1/logo2.png') }}"
                    alt="فرحة"
                >
            </a>


            <button
                type="button"
                class="menu-toggle"
                aria-label="فتح القائمة"
            >
                <i class="bi bi-list"></i>
            </button>


            <nav class="site-nav">

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>

                <a
                    href="{{ url('/about') }}"
                    class="active"
                >
                    عن فرحة
                </a>

                <a href="{{ url('/organizers') }}">
                    للمنظمين
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>

                <a href="{{ url('/faq') }}">
                    الأسئلة الشائعة
                </a>

            </nav>


            <div class="site-auth">

                <a
                    href="{{ url('/login') }}"
                    class="btn-login"
                >
                    <i class="bi bi-box-arrow-in-left"></i>
                    تسجيل دخول
                </a>

                <a
                    href="{{ url('/register') }}"
                    class="btn-register"
                >
                    <i class="bi bi-person-plus-fill"></i>
                    إنشاء حساب
                </a>

            </div>

        </div>

    </header>


    <!-- Hero -->
    <section class="about-hero-ready">

        <img
            src="{{ asset('images.1/g1.png') }}"
            alt="عن فرحة"
        >

    </section>


    <!-- Main -->
    <main class="about-main">

        <div class="wrap">

            <!-- Breadcrumb -->
            <div class="site-breadcrumb">

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <span>‹</span>

                <span class="current">
                    عن فرحة
                </span>

            </div>


            <!-- Title -->
            <section class="section-heading">

                <h2>
                    رؤيتنا ورسالتنا
                </h2>

                <span class="heading-line"></span>

            </section>


            <!-- Vision / Mission / Values -->
            <section class="about-cards">

                <div class="about-card values">

                    <div class="card-icon mint">
                        <i class="bi bi-gem"></i>
                    </div>

                    <div class="card-content">

                        <h3>
                            قيمنا
                        </h3>

                        <ul>
                            <li>الأمان أولاً</li>
                            <li>الجودة والتميز</li>
                            <li>الابتكار والتطوير</li>
                            <li>الشراكة المجتمعية</li>
                        </ul>

                    </div>

                </div>


                <div class="about-card vision">

                    <div class="card-icon purple">
                        <i class="bi bi-eye-fill"></i>
                    </div>

                    <div class="card-content">

                        <h3>
                            رؤيتنا
                        </h3>

                        <p>
                            أن نكون المنصة الأولى في العالم العربي لاكتشاف وتنظيم
                            الأنشطة التي تصنع الفرحة وتبني جيلاً مبدعاً وسعيداً.
                        </p>

                    </div>

                </div>


                <div class="about-card mission">

                    <div class="card-icon yellow">
                        <i class="bi bi-bullseye"></i>
                    </div>

                    <div class="card-content">

                        <h3>
                            رسالتنا
                        </h3>

                        <p>
                            توفير منصة موثوقة تربط بين الأهالي والمنظمين لتقديم فعاليات
                            متنوعة تناسب احتياجات الأطفال وتدعم نموهم الشامل في بيئة آمنة وملهمة.
                        </p>

                    </div>

                </div>

            </section>


            <!-- Stats -->
            <section
                class="about-stats"
                id="aboutStats"
            >

                <div class="stat-box">

                    <div class="stat-icon">
                        <i class="bi bi-shield-check"></i>
                    </div>

                    <div class="stat-text">

                        <strong
                            data-count-to="100"
                            data-suffix="%"
                        >
                            0%
                        </strong>

                        <span>
                            بيئة آمنة
                        </span>

                    </div>

                </div>


                <div class="stat-box">

                    <div class="stat-icon">
                        <i class="bi bi-star-fill"></i>
                    </div>

                    <div class="stat-text">

                        <strong
                            data-count-to="98"
                            data-suffix="%"
                        >
                            0%
                        </strong>

                        <span>
                            رضا المستخدمين
                        </span>

                    </div>

                </div>


                <div class="stat-box">

                    <div class="stat-icon">
                        <i class="bi bi-people-fill"></i>
                    </div>

                    <div class="stat-text">

                        <strong
                            data-count-to="10"
                            data-suffix="K+"
                        >
                            0K+
                        </strong>

                        <span>
                            عائلة مسجلة
                        </span>

                    </div>

                </div>


                <div class="stat-box">

                    <div class="stat-icon">
                        <i class="bi bi-emoji-smile-fill"></i>
                    </div>

                    <div class="stat-text">

                        <strong
                            data-count-to="250"
                            data-suffix="+"
                        >
                            0+
                        </strong>

                        <span>
                            جهة منظمة
                        </span>

                    </div>

                </div>


                <div class="stat-box">

                    <div class="stat-icon">
                        <i class="bi bi-calendar-check-fill"></i>
                    </div>

                    <div class="stat-text">

                        <strong
                            data-count-to="1500"
                            data-suffix="+"
                        >
                            0+
                        </strong>

                        <span>
                            فعالية متاحة
                        </span>

                    </div>

                </div>

            </section>


            <!-- Story -->
            <section class="story-box">

                <div class="story-image">

                    <img
                        src="{{ asset('images.1/g2.png') }}"
                        alt="قصتنا"
                    >

                </div>


                <div class="story-content">

                    <h2>
                        قصتنا
                        <span>♡</span>
                    </h2>

                    <p>
                        بدأت فكرة فرحة من إيماننا بأن كل طفل يستحق فرصة لاكتشاف موهبته
                        والاستمتاع بتجارب مفيدة وآمنة. جمعنا بين التكنولوجيا والاهتمام الحقيقي
                        باحتياجات الأطفال والأهالي لنقدم منصة سهلة الاستخدام تساعدكم على
                        الوصول لأفضل الأنشطة والفعاليات في مجتمعكم.
                    </p>

                </div>

            </section>

        </div>

    </main>


    <!-- Footer -->
    <footer class="site-footer">

        <div class="wrap site-footer-grid">

            <div class="site-footer-brand">

                <img
                    src="{{ asset('images.1/logo.png') }}"
                    alt="فرحة"
                >

                <p>
                    منصة فرحة تجمع الفعاليات المخصصة للأطفال وأولياء الأمور في مكان واحد، لتجربة ممتعة وآمنة وموثوقة.
                </p>


                <div class="site-social">

                    <a href="#">
                        <i class="bi bi-facebook"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-youtube"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-twitter-x"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-instagram"></i>
                    </a>

                </div>

            </div>


            <div class="site-footer-col">

                <h4>
                    روابط سريعة
                </h4>

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a href="{{ url('/organizers') }}">
                    المنظمون
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>

            </div>
<div class="site-footer-col">

    <h4>
        الفئات
    </h4>

    <a href="{{ url('/events?category_id=1') }}">
        تعليمية وثقافية
    </a>

    <a href="{{ url('/events?category_id=2') }}">
        فنية وترفيهية
    </a>

    <a href="{{ url('/events?category_id=3') }}">
        صحة وتوعية
    </a>

    <a href="{{ url('/events?category_id=4') }}">
        حماية ودعم نفسي
    </a>

    <a href="{{ url('/events') }}">
        جميع الفئات
    </a>

</div>

        


            <div class="site-footer-col">

                <h4>
                    معلومات
                </h4>

                <a href="{{ url('/about') }}">
                    من نحن
                </a>

                <a href="{{ url('/faq') }}">
                    الأسئلة الشائعة
                </a>

            </div>

        </div>


        <p class="site-footer-copy">
            جميع الحقوق محفوظة © 2026 منصة فرحة
        </p>

    </footer>


    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
    ></script>

</body>

</html>