<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>الأسئلة الشائعة - فرحة</title>

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
        'resources/css/faq.css',
        'resources/js/faq.js'
    ])
</head>

<body class="faq-public-page">

    <!-- Header -->
    <header class="site-header">
        <div class="wrap site-header-row">

            <a href="{{ url('/') }}" class="site-logo">
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

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a href="{{ url('/organizers') }}">
                    للمنظمين
                </a>

                <a href="{{ url('/contact') }}">
                    تواصل معنا
                </a>

                <a href="{{ url('/faq') }}" class="active">
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


    <!-- Main -->
    <main class="faq-public-main">

        <div class="wrap">

            <!-- Breadcrumb -->
            <div class="site-breadcrumb">

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <span>‹</span>

                <strong>
                    الأسئلة الشائعة
                </strong>

            </div>


            <!-- Page Header -->
            <div class="faq-public-head">

                <h1>
                    الأسئلة الشائعة
                </h1>

                <p>
                    إجابات سريعة على أكثر الأسئلة تكراراً حول استخدام منصة فرحة.
                </p>

            </div>


            <!-- WhatsApp -->
            <a
                href="https://wa.me/97059234567"
                target="_blank"
                rel="noopener"
                class="faq-whatsapp-btn"
            >
                <i class="bi bi-whatsapp"></i>

                لم تجد إجابتك؟ تواصل معنا فوراً عبر واتساب
            </a>


            <!-- Search -->
            <div class="faq-search-bar">

                <i class="bi bi-search"></i>

                <input
                    type="text"
                    id="faqSearch"
                    placeholder="ابحث عن سؤال..."
                    autocomplete="off"
                >

            </div>


            <div class="faq-shell">

                <!-- Categories -->
                <aside class="faq-categories">

                    <h2 class="faq-cat-title">
                        الفئات
                    </h2>

                    <button
                        type="button"
                        class="faq-cat-item active"
                        data-cat="all"
                    >
                        <i class="bi bi-grid"></i>
                        الكل
                    </button>


                    <button
                        type="button"
                        class="faq-cat-item"
                        data-cat="account"
                    >
                        <i class="bi bi-person-check"></i>
                        التسجيل والحساب
                    </button>


                    <button
                        type="button"
                        class="faq-cat-item"
                        data-cat="events"
                    >
                        <i class="bi bi-calendar-event"></i>
                        الفعاليات
                    </button>


                    <button
                        type="button"
                        class="faq-cat-item"
                        data-cat="registration"
                    >
                        <i class="bi bi-ticket-perforated"></i>
                        التسجيل في الفعاليات
                    </button>


                    <button
                        type="button"
                        class="faq-cat-item"
                        data-cat="organizers"
                    >
                        <i class="bi bi-person-badge"></i>
                        المنظمون
                    </button>


                    <button
                        type="button"
                        class="faq-cat-item"
                        data-cat="support"
                    >
                        <i class="bi bi-headset"></i>
                        الدعم والمساعدة
                    </button>

                </aside>


                <!-- FAQ List -->
                <div
                    class="faq-list"
                    id="faqList"
                >

                    <!-- 1 -->
                    <div
                        class="faq-item"
                        data-cat="account"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                كيف يمكنني إنشاء حساب جديد؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                اضغط على زر "إنشاء حساب"، ثم أدخل بياناتك واختر نوع الحساب سواء ولي أمر أو منظم فعاليات، وبعدها أكمل عملية التسجيل.
                            </p>
                        </div>

                    </div>


                    <!-- 2 -->
                    <div
                        class="faq-item"
                        data-cat="registration"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                كيف يمكنني التسجيل في فعالية؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                ادخل إلى صفحة الفعاليات، اختر الفعالية المناسبة، ثم افتح تفاصيلها واضغط على زر "سجل الآن" وأكمل بيانات التسجيل المطلوبة.
                            </p>
                        </div>

                    </div>


                    <!-- 3 -->
                    <div
                        class="faq-item"
                        data-cat="organizers"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                كيف يمكنني إضافة فعالية كمنظم؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                بعد تسجيل الدخول بحساب منظم، انتقل إلى لوحة التحكم واضغط على "إضافة فعالية"، ثم أدخل معلومات الفعالية واحفظها.
                            </p>
                        </div>

                    </div>


                    <!-- 4 -->
                    <div
                        class="faq-item"
                        data-cat="registration"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                هل يمكنني إلغاء تسجيلي في فعالية؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                نعم، يمكنك إدارة الفعاليات التي سجلت بها من صفحة "فعالياتي" في حساب ولي الأمر، وفق سياسة الإلغاء الخاصة بالفعالية.
                            </p>
                        </div>

                    </div>


                    <!-- 5 -->
                    <div
                        class="faq-item"
                        data-cat="events"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                كيف أجد فعالية مناسبة لطفلي؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                يمكنك تصفح صفحة الفعاليات واستخدام البحث والفلاتر لاختيار الفئة والمنطقة والفئة العمرية المناسبة لطفلك.
                            </p>
                        </div>

                    </div>


                    <!-- 6 -->
                    <div
                        class="faq-item"
                        data-cat="events"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                أين أجد تفاصيل الفعالية؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                اضغط على "عرض التفاصيل" في بطاقة الفعالية للاطلاع على الموعد والمكان والفئة العمرية وباقي معلومات الفعالية.
                            </p>
                        </div>

                    </div>


                    <!-- 7 -->
                    <div
                        class="faq-item"
                        data-cat="account"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                ما الفرق بين حساب ولي الأمر وحساب المنظم؟
                            </span>
                        </button>

                        <div class="faq-answer">
                            <p>
                                حساب ولي الأمر مخصص لتصفح الفعاليات والتسجيل فيها وإدارة تسجيلات الأطفال، بينما حساب المنظم مخصص لإنشاء الفعاليات وإدارتها ومتابعة التسجيلات والتقارير.
                            </p>
                        </div>

                    </div>


                    <!-- 8 -->
                    <div
                        class="faq-item"
                        data-cat="support"
                    >

                        <button
                            type="button"
                            class="faq-question"
                        >
                            <i class="bi bi-chevron-left"></i>

                            <span>
                                كيف يمكنني التواصل مع الدعم؟
                            </span>
                        </button>

                        <div class="faq-answer">

                            <p>
                                يمكنك التواصل معنا من خلال صفحة "تواصل معنا"، أو عبر واتساب للحصول على المساعدة.
                            </p>

                            <a href="{{ url('/contact') }}">
                                الانتقال إلى تواصل معنا
                            </a>

                        </div>

                    </div>


                    <!-- No results -->
                    <p
                        class="faq-no-results d-none"
                        id="noResults"
                    >
                        لم يتم العثور على نتائج مطابقة لبحثك.
                    </p>

                </div>

            </div>

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