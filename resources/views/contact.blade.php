<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    <title>تواصل معنا - فرحة</title>

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
        'resources/css/contact.css',
        'resources/js/contact.js'
    ])

    <style>
        /* FAQ fixes */
        .ctp-faq-card {
            direction: rtl;
            text-align: right;
        }

        .ctp-faq-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }

        .ctp-faq-item {
            width: 100%;
            border: 1px solid #e7e9f2;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
        }

        .ctp-faq-item summary {
            width: 100%;
            padding: 16px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            cursor: pointer;
            list-style: none;
            color: #555b76;
            font-size: 15px;
            font-weight: 500;
            text-align: right;
        }

        .ctp-faq-item summary::-webkit-details-marker {
            display: none;
        }

        .ctp-faq-item summary::marker {
            display: none;
            content: "";
        }

        .ctp-faq-question {
            flex: 1;
            text-align: right;
        }

        .ctp-faq-arrow {
            flex-shrink: 0;
            font-size: 17px;
            color: #555b76;
            transition: transform 0.25s ease;
        }

        .ctp-faq-item[open] .ctp-faq-arrow {
            transform: rotate(180deg);
        }

        .ctp-faq-answer {
            padding: 0 18px 17px;
            color: #7c8197;
            line-height: 1.9;
            font-size: 14px;
            text-align: right;
        }

        .ctp-faq-more {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
            padding: 15px;
            border-radius: 12px;
            text-decoration: none;
            text-align: center;
            color: #30375e;
            transition: 0.2s ease;
        }

        .ctp-faq-more:hover {
            background: #f7f8ff;
            color: #4654e1;
        }

        .ctp-faq-more i {
            font-size: 21px;
            color: #5966ea;
        }

        .ctp-faq-more-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .ctp-faq-more-text strong {
            font-size: 15px;
        }

        .ctp-faq-more-text small {
            color: #9195a8;
            font-size: 12px;
        }
    </style>

</head>

<body class="ctp-page">

<div
    id="contactPage"
    data-contact-url="{{ url('/api/contact') }}"
>

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

                <a href="{{ url('/about') }}">
                    عن فرحة
                </a>

                <a href="{{ url('/organizers') }}">
                    للمنظمين
                </a>

                <a
                    href="{{ url('/contact') }}"
                    class="active"
                >
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
    <section class="ctp-hero">

        <div class="wrap ctp-hero-row">

            <div class="ctp-hero-img">

                <img
                    src="{{ asset('images.1/Ima2.png') }}"
                    alt="تواصل معنا"
                >

            </div>


            <div class="ctp-hero-text">

                <div class="ctp-headset">

                    <img
                        src="{{ asset('images.1/con4.png') }}"
                        alt="الدعم"
                    >

                </div>


                <div class="ctp-title-area">

                    <h1>
                        تواصل معنا
                    </h1>

                    <p>
                        نحن هنا لمساعدتك والإجابة على استفساراتك
                        <br>
                        لا تتردد في التواصل معنا في أي وقت!
                    </p>

                    <div class="ctp-wave">
                        〰〰
                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- Main -->
    <main class="ctp-main">

        <div class="wrap">

            <!-- Breadcrumb -->
            <div class="site-breadcrumb">

                <i class="bi bi-house-door-fill"></i>

                <a href="{{ url('/') }}">
                    الرئيسية
                </a>

                <span>‹</span>

                <strong>
                    تواصل معنا
                </strong>

            </div>


            <div class="ctp-layout">

                <!-- Left -->
                <section class="ctp-form-side">

                    <form
                        class="ctp-form-card"
                        id="contactForm"
                        novalidate
                    >

                        <h2>
                            أرسل لنا رسالة
                        </h2>

                        <div class="ctp-title-line"></div>


                        <div class="ctp-form-grid">

                            <label class="ctp-input">

                                <span>
                                    <i class="bi bi-person-fill"></i>
                                </span>

                                <input
                                    type="text"
                                    id="contactName"
                                    name="name"
                                    placeholder="الاسم الكامل"
                                    required
                                >

                            </label>


                            <label class="ctp-input">

                                <span>
                                    <i class="bi bi-envelope-fill"></i>
                                </span>

                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="email"
                                    placeholder="البريد الإلكتروني"
                                    required
                                >

                            </label>

                        </div>


                        <label class="ctp-input">

                            <span>
                                <i class="bi bi-telephone-fill"></i>
                            </span>

                            <input
                                type="text"
                                id="contactPhone"
                                name="phone"
                                placeholder="رقم الجوال"
                            >

                        </label>


                        <label class="ctp-input">

                            <span>
                                <i class="bi bi-chevron-down"></i>
                            </span>

                            <select
                                id="contactSubject"
                                name="subject"
                                required
                            >

                                <option value="">
                                    الموضوع
                                </option>

                                <option value="استفسار عن فعالية">
                                    استفسار عن فعالية
                                </option>

                                <option value="مشكلة في التسجيل">
                                    مشكلة في التسجيل
                                </option>

                                <option value="إلغاء أو تعديل حجز">
                                    إلغاء أو تعديل حجز
                                </option>

                                <option value="اقتراح">
                                    اقتراح
                                </option>

                                <option value="أخرى">
                                    أخرى
                                </option>

                            </select>

                        </label>


                        <label class="ctp-textarea">

                            <span>
                                <i class="bi bi-pencil-fill"></i>
                            </span>

                            <textarea
                                id="contactMessage"
                                name="message"
                                placeholder="رسالتك *"
                                required
                            ></textarea>

                        </label>


                        <button
                            type="submit"
                            class="ctp-send-btn"
                            id="contactSubmitButton"
                        >

                            <span id="contactSubmitText">
                                إرسال الرسالة !
                            </span>

                            <span
                                class="spinner-border spinner-border-sm d-none"
                                id="contactSubmitSpinner"
                            ></span>

                            <i class="bi bi-send-fill"></i>

                        </button>


                        <p class="ctp-privacy">
                            🔒 نحن نحافظ على خصوصية بياناتك ولا نشاركها مع أي جهة أخرى.
                        </p>

                    </form>


                    <div class="ctp-help-card">

                        <img
                            src="{{ asset('images.1/Ima4.png') }}"
                            alt="المساعدة الفورية"
                        >

                        <div class="ctp-help-text">

                            <h3>
                                نحن سعداء بخدمتك!
                            </h3>

                            <p>
                                فريق الدعم لدينا مستعد لمساعدتك في أي وقت تحتاج إليه.
                            </p>

                            <a
                                href="https://wa.me/97059234567"
                                target="_blank"
                                rel="noopener"
                            >
                                المساعدة الفورية
                                <i class="bi bi-whatsapp"></i>
                            </a>

                        </div>

                    </div>

                </section>


                <!-- Right -->
                <section class="ctp-info-side">

                    <div class="ctp-methods-card">

                        <div class="ctp-card-title">

                            <h2>
                                طرق التواصل
                            </h2>

                            <span>
                                <i class="bi bi-chat-dots-fill"></i>
                            </span>

                        </div>


                        <div class="ctp-methods-grid">

                            <!-- Phone -->
                            <a
                                href="tel:+9705956789"
                                class="ctp-method-box"
                            >

                                <img
                                    src="{{ asset('images.1/con3.png') }}"
                                    alt="اتصل بنا"
                                >

                                <h3>
                                    اتصل بنا
                                </h3>

                                <p>
                                    +970 595 6789
                                </p>

                                <small>
                                    من الأحد إلى الخميس
                                </small>

                            </a>


                            <!-- WhatsApp -->
                            <a
                                href="https://wa.me/97059234567"
                                target="_blank"
                                rel="noopener"
                                class="ctp-method-box"
                            >

                                <img
                                    src="{{ asset('images.1/con2.png') }}"
                                    alt="واتساب"
                                >

                                <h3>
                                    واتساب
                                </h3>

                                <p>
                                    +97059234567
                                </p>

                                <small>
                                    متاح من 9 ص - 9 م
                                </small>

                            </a>


                            <!-- Gmail -->
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@farha.com"
                                target="_blank"
                                rel="noopener"
                                class="ctp-method-box"
                            >

                                <img
                                    src="{{ asset('images.1/con1.png') }}"
                                    alt="البريد الإلكتروني"
                                >

                                <h3>
                                    البريد الإلكتروني
                                </h3>

                                <p>
                                    info@farha.com
                                </p>

                                <small>
                                    نرد خلال 24 ساعة
                                </small>

                            </a>

                        </div>

                    </div>


                    <!-- FAQ -->
                    <div class="ctp-faq-card">

                        <div class="ctp-card-title ctp-faq-title">

                            <h2>
                                أسئلة شائعة
                            </h2>

                            <span>
                                ؟
                            </span>

                        </div>


                        <div class="ctp-faq-list">

                            <details class="ctp-faq-item">

                                <summary>

                                    <span class="ctp-faq-question">
                                        كيف يمكنني التسجيل في فعالية؟
                                    </span>

                                    <i class="bi bi-chevron-down ctp-faq-arrow"></i>

                                </summary>

                                <div class="ctp-faq-answer">
                                    افتح صفحة الفعالية واضغط "سجل الآن"، ثم أكمل بياناتك لإتمام التسجيل.
                                </div>

                            </details>


                            <details class="ctp-faq-item">

                                <summary>

                                    <span class="ctp-faq-question">
                                        هل يمكن إلغاء أو تعديل الحجز؟
                                    </span>

                                    <i class="bi bi-chevron-down ctp-faq-arrow"></i>

                                </summary>

                                <div class="ctp-faq-answer">
                                    نعم، يمكنك إدارة حجوزاتك من صفحة "فعالياتي" في حسابك.
                                </div>

                            </details>


                            <details class="ctp-faq-item">

                                <summary>

                                    <span class="ctp-faq-question">
                                        هل الفعاليات مناسبة لجميع الأعمار؟
                                    </span>

                                    <i class="bi bi-chevron-down ctp-faq-arrow"></i>

                                </summary>

                                <div class="ctp-faq-answer">
                                    كل فعالية تحدد فئتها العمرية بوضوح على صفحة التفاصيل الخاصة بها.
                                </div>

                            </details>

                        </div>


                        <a
                            href="{{ url('/faq') }}"
                            class="ctp-faq-more"
                        >

                            <i class="bi bi-question-circle"></i>

                            <div class="ctp-faq-more-text">

                                <strong>
                                    المزيد من الأسئلة
                                </strong>

                                <small>
                                    زيارة صفحة الأسئلة الشائعة
                                </small>

                            </div>

                        </a>

                    </div>

                </section>

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

</div>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
></script>

</body>

</html>