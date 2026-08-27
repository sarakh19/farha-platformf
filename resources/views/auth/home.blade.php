<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>فرحة - الرئيسية</title>

    {{-- Bootstrap RTL --}}
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css"
        rel="stylesheet"
    >

    {{-- Bootstrap Icons --}}
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        rel="stylesheet"
    >

    {{-- ملفات الصفحة عن طريق Vite --}}
    @vite([
        'resources/css/site-common.css',
        'resources/css/home.css',
        'resources/js/home.js',
    ])
</head>

<body class="farha-home-final">

    {{-- =========================
         Header
    ========================== --}}
    <header class="site-header">
        <div class="wrap site-header-row">

            <a href="{{ url('/home') }}" class="site-logo">
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
                <a href="{{ url('/home') }}" class="active">
                    الرئيسية
                </a>

                <a href="{{ url('/events') }}">
                    الفعاليات
                </a>

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a href="{{ url('/organizers') }}">
                    للمنظمين
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>
            </nav>

            <div class="site-auth">
                <a href="{{ url('/login') }}" class="btn-login">
                    <i class="bi bi-box-arrow-in-left"></i>
                    تسجيل دخول
                </a>

                <a href="{{ url('/register') }}" class="btn-register">
                    <i class="bi bi-person-plus-fill"></i>
                    إنشاء حساب
                </a>
            </div>

        </div>
    </header>

    {{-- =========================
         Main
    ========================== --}}
    <main class="hp-main">

        {{-- Hero --}}
        <section class="hp-hero">
            <div class="wrap hp-hero-row">

                <div class="hp-hero-image">
                    <img
                        src="{{ asset('images.1/hero-kids.png') }}"
                        alt="أطفال يستمتعون بفعالية فرحة"
                    >
                </div>

                <div class="hp-hero-text">
                    <h1>
                        اكتشف وشارك
                        <br>
                        في فعاليات ممتعة وآمنة
                    </h1>

                    <p>
                        لأن كل لحظة مع طفلك تستحق فرحة
                    </p>

                    <div class="hp-hero-actions">
                        <a
                            href="{{ url('/events') }}"
                            class="hp-primary-btn"
                        >
                            استعرض الفعاليات
                        </a>

                        <a
                            href="{{ url('/about') }}"
                            class="hp-outline-btn"
                        >
                            اعرف أكثر
                        </a>
                    </div>
                </div>

            </div>
        </section>

        {{-- Quote --}}
        <section class="wrap hp-quote" id="quoteBox">
            <span class="hp-quote-icon">”</span>

            <div class="hp-quote-content">
                <h3 id="quoteText">
                    كل لحظة لعب هي فرصة جديدة للتعلم والنمو.
                </h3>

                <p>
                    رسالة فرحة
                    <i class="bi bi-stars"></i>
                </p>
            </div>
        </section>

        {{-- Search --}}
        <section class="wrap hp-search">

            <div class="hp-search-field hp-search-main">
                <span>
                    <i class="bi bi-search"></i>
                </span>

                <input
                    id="homeSearchInput"
                    type="text"
                    placeholder="ابحث عن فعالية"
                >
            </div>

            <div class="hp-search-field">
                <span>
                    <i class="bi bi-grid-fill"></i>
                </span>

                <select id="homeCategoryFilter">
                    <option value="">جميع الفئات</option>
                    <option value="تعليمية">تعليمية</option>
                    <option value="رياضية">رياضية</option>
                    <option value="فنية">فنية</option>
                    <option value="ترفيهية">ترفيهية</option>
                </select>
            </div>

            <div class="hp-search-field">
                <span>
                    <i class="bi bi-geo-alt-fill"></i>
                </span>

                <select id="homeLocationFilter">
                    <option value="">جميع المناطق</option>
                    <option value="غزة">غزة</option>
                    <option value="خان يونس">خان يونس</option>
                    <option value="رفح">رفح</option>
                </select>
            </div>

            <div class="hp-search-field">
                <span>
                    <i class="bi bi-people-fill"></i>
                </span>

                <select id="homeAgeFilter">
                    <option value="">الفئة العمرية</option>
                    <option value="3-8">3 - 8 سنوات</option>
                    <option value="8-12">8 - 12 سنة</option>
                    <option value="12-15">12 - 15 سنة</option>
                </select>
            </div>

            <button
                type="button"
                class="hp-search-btn"
                id="homeSearchButton"
            >
                بحث
            </button>

        </section>

        {{-- Categories --}}
        <section class="wrap hp-section">

            <div class="hp-section-head">
                <h2>كل الفئات</h2>

                <a href="{{ url('/events') }}">
                    عرض الكل
                </a>
            </div>

            <div class="hp-categories">

                <a
                    href="{{ url('/events') }}"
                    class="hp-category active"
                >
                    <span>
                        <i class="bi bi-grid-fill"></i>
                    </span>
                    <strong>جميع الفئات</strong>
                </a>

                <a
                    href="{{ url('/events') }}?category=edu"
                    class="hp-category"
                >
                    <span>🎓</span>
                    <strong>تعليمية</strong>
                </a>

                <a
                    href="{{ url('/events') }}?category=sport"
                    class="hp-category"
                >
                    <span>⚽</span>
                    <strong>رياضية</strong>
                </a>

                <a
                    href="{{ url('/events') }}?category=art"
                    class="hp-category"
                >
                    <span>🎨</span>
                    <strong>فنية</strong>
                </a>

                <a
                    href="{{ url('/events') }}?category=fun"
                    class="hp-category"
                >
                    <span>🎈</span>
                    <strong>ترفيهية</strong>
                </a>

                <a
                    href="{{ url('/events') }}?category=support"
                    class="hp-category"
                >
                    <span>💜</span>
                    <strong>دعم نفسي</strong>
                </a>

            </div>
        </section>

        {{-- Events --}}
        <section class="wrap hp-section">

            <div class="hp-section-head">
                <h2>الفعاليات القادمة</h2>

                <a href="{{ url('/events') }}">
                    عرض المزيد
                </a>
            </div>

            {{--
                هذا الـID سنستخدمه لاحقًا داخل home.js
                لجلب الفعاليات من قاعدة البيانات.
            --}}
            <div
                class="hp-events-grid"
                id="homeEventsContainer"
                data-events-url="{{ url('/api/events') }}"
            >

                {{-- فعالية مؤقتة رقم 1 --}}
                <article class="hp-event-card">

                    <a
                        href="{{ url('/event-details') }}?id=1"
                        class="hp-event-img"
                    >
                        <img
                            src="{{ asset('images.1/Image (1).png') }}"
                            alt="مسرح الدمى"
                        >

                        <span class="orange">
                            ترفيهية
                        </span>
                    </a>

                    <div class="hp-event-body">
                        <h3>مسرح الدمى للأطفال</h3>

                        <ul>
                            <li>📍 مسرح غزة</li>
                            <li>📅 السبت 24 مايو 2025</li>
                            <li>🕘 6:00 مساءً</li>
                        </ul>

                        <a href="{{ url('/event-details') }}?id=1">
                            عرض التفاصيل
                        </a>
                    </div>

                </article>

                {{-- فعالية مؤقتة رقم 2 --}}
                <article class="hp-event-card">

                    <a
                        href="{{ url('/event-details') }}?id=2"
                        class="hp-event-img"
                    >
                        <img
                            src="{{ asset('images.1/Image.png') }}"
                            alt="تجارب علمية"
                        >

                        <span class="blue">
                            تعليمية
                        </span>
                    </a>

                    <div class="hp-event-body">
                        <h3>تجارب علمية مبسطة</h3>

                        <ul>
                            <li>📍 مركز الإبداع</li>
                            <li>📅 28 مايو 2025</li>
                            <li>🕘 11:00 صباحاً</li>
                        </ul>

                        <a href="{{ url('/event-details') }}?id=2">
                            عرض التفاصيل
                        </a>
                    </div>

                </article>

                {{-- فعالية مؤقتة رقم 3 --}}
                <article class="hp-event-card">

                    <a
                        href="{{ url('/event-details') }}?id=3"
                        class="hp-event-img"
                    >
                        <img
                            src="{{ asset('images.1/Image (2).png') }}"
                            alt="نشاط رياضي"
                        >

                        <span class="green">
                            رياضية
                        </span>
                    </a>

                    <div class="hp-event-body">
                        <h3>نشاطات حركية</h3>

                        <ul>
                            <li>📍 ملعب المدرسة</li>
                            <li>📅 28 مايو 2025</li>
                            <li>🕘 5:00 مساءً</li>
                        </ul>

                        <a href="{{ url('/event-details') }}?id=3">
                            عرض التفاصيل
                        </a>
                    </div>

                </article>

                {{-- فعالية مؤقتة رقم 4 --}}
                <article class="hp-event-card">

                    <a
                        href="{{ url('/event-details') }}?id=4"
                        class="hp-event-img"
                    >
                        <img
                            src="{{ asset('images.1/Image.png') }}"
                            alt="ورشة رسم"
                        >

                        <span class="pink">
                            فنية
                        </span>
                    </a>

                    <div class="hp-event-body">
                        <h3>ورشة الرسم للأطفال</h3>

                        <ul>
                            <li>📍 خان يونس</li>
                            <li>📅 25 مايو 2025</li>
                            <li>🕘 4:00 مساءً</li>
                        </ul>

                        <a href="{{ url('/event-details') }}?id=4">
                            عرض التفاصيل
                        </a>
                    </div>

                </article>

            </div>
        </section>

        {{-- Benefits --}}
        <section class="wrap hp-benefits">

            <div class="hp-benefit">
                <span>
                    <i class="bi bi-shield-check"></i>
                </span>

                <div>
                    <h3>آمن وموثوق</h3>
                    <p>جميع الفعاليات مناسبة للأطفال.</p>
                </div>
            </div>

            <div class="hp-benefit">
                <span>
                    <i class="bi bi-bell-fill"></i>
                </span>

                <div>
                    <h3>إشعارات فورية</h3>
                    <p>احصل على تنبيهات لأحدث الفعاليات.</p>
                </div>
            </div>

            <div class="hp-benefit">
                <span>
                    <i class="bi bi-stars"></i>
                </span>

                <div>
                    <h3>فعاليات متنوعة</h3>
                    <p>تعليمية، رياضية، فنية وترفيهية.</p>
                </div>
            </div>

            <div class="hp-benefit">
                <span>
                    <i class="bi bi-people-fill"></i>
                </span>

                <div>
                    <h3>مناسبة للأطفال</h3>
                    <p>اختيار فعاليات حسب العمر المناسب.</p>
                </div>
            </div>

        </section>

    </main>

    {{-- =========================
         Footer
    ========================== --}}
    <footer class="site-footer">

        <div class="wrap site-footer-grid">

            <div class="site-footer-brand">
                <img
                    src="{{ asset('images.1/logo.png') }}"
                    alt="فرحة"
                >

                <p>
                    منصة فرحة تجمع الفعاليات المخصصة للأطفال
                    وأولياء الأمور في مكان واحد، لتجربة ممتعة
                    وآمنة وموثوقة.
                </p>

                <div class="site-social">
                    <a href="#" aria-label="Facebook">
                        <i class="bi bi-facebook"></i>
                    </a>

                    <a href="#" aria-label="YouTube">
                        <i class="bi bi-youtube"></i>
                    </a>

                    <a href="#" aria-label="X">
                        <i class="bi bi-twitter-x"></i>
                    </a>

                    <a href="#" aria-label="Instagram">
                        <i class="bi bi-instagram"></i>
                    </a>
                </div>
            </div>

            <div class="site-footer-col">
                <h4>روابط سريعة</h4>

                <a href="{{ url('/home') }}">الرئيسية</a>
                <a href="{{ url('/events') }}">الفعاليات</a>
                <a href="{{ url('/about') }}">عن فرحة</a>
                <a href="{{ url('/organizers') }}">المنظمون</a>
                <a href="{{ url('/contact') }}">تواصل معنا</a>
            </div>

            <div class="site-footer-col">
                <h4>الفئات</h4>

                <a href="{{ url('/events') }}?category=sport">
                    رياضية
                </a>

                <a href="{{ url('/events') }}?category=art">
                    فنية
                </a>

                <a href="{{ url('/events') }}?category=edu">
                    تعليمية
                </a>

                <a href="{{ url('/events') }}?category=fun">
                    ترفيهية
                </a>

                <a href="{{ url('/events') }}">
                    جميع الفئات
                </a>
            </div>

            <div class="site-footer-col">
                <h4>معلومات</h4>

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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>