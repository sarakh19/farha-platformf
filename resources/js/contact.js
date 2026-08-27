import './site-common.js';
import './messages.js';

document.addEventListener('DOMContentLoaded', function () {

    const page =
        document.getElementById('contactPage');

    if (!page) {
        return;
    }

    /* =========================================================
       API URL
    ========================================================= */

    const contactUrl =
        page.dataset.contactUrl;


    /* =========================================================
       Elements
    ========================================================= */

    const form =
        document.getElementById('contactForm');

    const nameInput =
        document.getElementById('contactName');

    const emailInput =
        document.getElementById('contactEmail');

    const phoneInput =
        document.getElementById('contactPhone');

    const subjectInput =
        document.getElementById('contactSubject');

    const messageInput =
        document.getElementById('contactMessage');

    const submitButton =
        document.getElementById('contactSubmitButton');

    const submitText =
        document.getElementById('contactSubmitText');

    const submitSpinner =
        document.getElementById('contactSubmitSpinner');


    /* =========================================================
       Toast
    ========================================================= */

    function showToast(message, type = 'info') {

        if (
            typeof window.showToast === 'function'
        ) {
            window.showToast(
                message,
                type
            );

            return;
        }

        alert(message);
    }


    /* =========================================================
       Button Loading
    ========================================================= */

    function setSubmitting(isSubmitting) {

        if (submitButton) {
            submitButton.disabled =
                isSubmitting;
        }

        if (submitText) {
            submitText.textContent =
                isSubmitting
                    ? 'جاري الإرسال...'
                    : 'إرسال الرسالة !';
        }

        submitSpinner?.classList.toggle(
            'd-none',
            !isSubmitting
        );
    }


    /* =========================================================
       Validation
    ========================================================= */

    function validateForm() {

        const name =
            nameInput?.value.trim() || '';

        const email =
            emailInput?.value.trim() || '';

        const subject =
            subjectInput?.value || '';

        const message =
            messageInput?.value.trim() || '';


        if (!name) {

            showToast(
                'يرجى إدخال الاسم الكامل.',
                'warning'
            );

            nameInput?.focus();

            return false;
        }


        if (!email) {

            showToast(
                'يرجى إدخال البريد الإلكتروني.',
                'warning'
            );

            emailInput?.focus();

            return false;
        }


        if (
            emailInput &&
            !emailInput.checkValidity()
        ) {

            showToast(
                'يرجى إدخال بريد إلكتروني صحيح.',
                'warning'
            );

            emailInput.focus();

            return false;
        }


        if (!subject) {

            showToast(
                'يرجى اختيار موضوع الرسالة.',
                'warning'
            );

            subjectInput?.focus();

            return false;
        }


        if (!message) {

            showToast(
                'يرجى كتابة الرسالة.',
                'warning'
            );

            messageInput?.focus();

            return false;
        }


        return true;
    }


    /* =========================================================
       Submit Contact Message
    ========================================================= */

    form?.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();


            if (!validateForm()) {
                return;
            }


            setSubmitting(true);


            const payload = {

                name:
                    nameInput.value.trim(),

                email:
                    emailInput.value.trim(),

                phone:
                    phoneInput?.value.trim() || null,

                subject:
                    subjectInput.value,

                message:
                    messageInput.value.trim()
            };


            try {

                console.log(
                    'Sending contact message:',
                    payload
                );


                const response =
                    await fetch(
                        contactUrl,
                        {
                            method: 'POST',

                            headers: {
                                'Accept':
                                    'application/json',

                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(function () {
                            return {};
                        });


                console.log(
                    'Contact response:',
                    response.status,
                    data
                );


                /* =========================
                   Validation Error
                ========================== */

                if (
                    response.status === 422
                ) {

                    let validationMessage =
                        'يرجى مراجعة البيانات المدخلة.';


                    if (data.errors) {

                        const firstError =
                            Object.values(
                                data.errors
                            )[0];


                        if (
                            Array.isArray(
                                firstError
                            ) &&
                            firstError[0]
                        ) {

                            validationMessage =
                                firstError[0];
                        }
                    }


                    showToast(
                        validationMessage,
                        'warning'
                    );

                    return;
                }


                /* =========================
                   Server Error
                ========================== */

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر إرسال الرسالة.'
                    );
                }


                /* =========================
                   Success
                ========================== */

                showToast(
                    data.message ||
                    'تم إرسال رسالتك بنجاح.',
                    'success'
                );


                form.reset();


            } catch (error) {

                console.error(
                    'Contact message error:',
                    error
                );


                showToast(
                    error.message ||
                    'حدث خطأ أثناء إرسال الرسالة.',
                    'error'
                );


            } finally {

                setSubmitting(false);
            }
        }
    );


    /* =========================================================
       FAQ
    ========================================================= */

    document
        .querySelectorAll('.ctp-faq-item')
        .forEach(function (item) {

            const question =
                item.querySelector('.faq-q');

            question?.addEventListener(
                'click',
                function () {

                    const isOpen =
                        item.classList.contains(
                            'active'
                        );


                    document
                        .querySelectorAll(
                            '.ctp-faq-item.active'
                        )
                        .forEach(
                            function (openItem) {

                                if (
                                    openItem !== item
                                ) {

                                    openItem.classList.remove(
                                        'active'
                                    );
                                }
                            }
                        );


                    item.classList.toggle(
                        'active',
                        !isOpen
                    );
                }
            );
        });

});