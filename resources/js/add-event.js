import './dashboard-common.js';
import './messages.js';

document.addEventListener('DOMContentLoaded', function () {
    const page = document.getElementById('addEventPage');
    const form = document.getElementById('addEventForm');

    if (!page || !form) {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | روابط الصفحة القادمة من Blade
    |--------------------------------------------------------------------------
    */

    const storeUrl = page.dataset.storeUrl;
    const eventsPageUrl = page.dataset.eventsPageUrl;
    const loginUrl = page.dataset.loginUrl;

    /*
    |--------------------------------------------------------------------------
    | قراءة المستخدم والتوكن
    |--------------------------------------------------------------------------
    | عند تسجيل الدخول أو إنشاء الحساب، خزّنا:
    | farha_token
    | farha_user
    |
    | قد يكونان في localStorage أو sessionStorage.
    */

    const token =
        window.localStorage.getItem('farha_token') ||
        window.sessionStorage.getItem('farha_token');

    const storedUser =
        window.localStorage.getItem('farha_user') ||
        window.sessionStorage.getItem('farha_user');

    let currentUser = null;

    try {
        currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error('Invalid stored user data:', error);
    }

    /*
    |--------------------------------------------------------------------------
    | حماية الصفحة من المستخدم غير المسجل
    |--------------------------------------------------------------------------
    */

    if (!token || !currentUser) {
        window.showToast?.(
            'يرجى تسجيل الدخول أولًا للوصول إلى هذه الصفحة.',
            'warning'
        );

        window.setTimeout(function () {
            window.location.href = loginUrl || '/login';
        }, 900);

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | التأكد أن المستخدم منظم
    |--------------------------------------------------------------------------
    */

    if (currentUser.role !== 'organizer') {
        window.showToast?.(
            'ليس لديك صلاحية لإضافة فعالية.',
            'error'
        );

        window.setTimeout(function () {
            window.location.href = '/home';
        }, 900);

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | عرض اسم المنظم في الصفحة
    |--------------------------------------------------------------------------
    */

    const organizerName =
        document.getElementById('organizerName');

    const welcomeOrganizerName =
        document.getElementById('welcomeOrganizerName');

    const organizerAvatar =
        document.getElementById('organizerAvatar');

    if (organizerName) {
        organizerName.textContent =
            currentUser.name || 'منظم الفعاليات';
    }

    if (welcomeOrganizerName) {
        welcomeOrganizerName.textContent =
            currentUser.name || 'بك';
    }

    if (organizerAvatar) {
        const words =
            (currentUser.name || 'منظم')
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        const initials = words
            .slice(0, 2)
            .map(function (word) {
                return word.charAt(0);
            })
            .join('');

        organizerAvatar.textContent = initials || 'م';
    }

    /*
    |--------------------------------------------------------------------------
    | عناصر الفورم
    |--------------------------------------------------------------------------
    */

    const fields = {
        title: {
            input: document.getElementById('titleInput'),
            error: document.getElementById('titleError'),
        },

        category_id: {
            input: document.getElementById('categoryInput'),
            error: document.getElementById('categoryError'),
        },

        event_type: {
            input: document.getElementById('eventTypeInput'),
            error: document.getElementById('eventTypeError'),
        },

        description: {
            input: document.getElementById('descriptionInput'),
            error: document.getElementById('descriptionError'),
        },

        event_date: {
            input: document.getElementById('eventDateInput'),
            error: document.getElementById('eventDateError'),
        },

        start_time: {
            input: document.getElementById('startTimeInput'),
            error: document.getElementById('startTimeError'),
        },

        end_time: {
            input: document.getElementById('endTimeInput'),
            error: document.getElementById('endTimeError'),
        },

        location: {
            input: document.getElementById('locationInput'),
            error: document.getElementById('locationError'),
        },

        address: {
            input: document.getElementById('addressInput'),
            error: document.getElementById('addressError'),
        },

        age_group: {
            input: document.getElementById('ageGroupInput'),
            error: document.getElementById('ageGroupError'),
        },

        capacity: {
            input: document.getElementById('capacityInput'),
            error: document.getElementById('capacityError'),
        },

        requirements: {
            input: document.getElementById('requirementsInput'),
            error: document.getElementById('requirementsError'),
        },

        image: {
            input: document.getElementById('eventImageInput'),
            error: document.getElementById('imageError'),
        },
    };

    const imageInput = fields.image.input;
    const previewBox =
        document.getElementById('imagePreviewBox');

    const submitButton =
        document.getElementById('submitEventButton');

    const saveDraftButton =
        document.getElementById('saveDraftButton');

    const submitText =
        submitButton?.querySelector('.submit-event-text');

    const submitSpinner =
        document.getElementById('submitEventSpinner');

    /*
    |--------------------------------------------------------------------------
    | وظائف عرض ومسح الأخطاء
    |--------------------------------------------------------------------------
    */

    function clearFieldError(fieldName) {
        const field = fields[fieldName];

        if (!field) {
            return;
        }

        field.input
            ?.closest('.form-group')
            ?.classList.remove('is-invalid');

        if (fieldName === 'image') {
            previewBox?.classList.remove('is-invalid');
        }

        if (field.error) {
            field.error.textContent = '';
        }
    }

    function clearAllErrors() {
        Object.keys(fields).forEach(function (fieldName) {
            clearFieldError(fieldName);
        });
    }

    function showFieldError(fieldName, message) {
        const field = fields[fieldName];

        if (!field) {
            return;
        }

        field.input
            ?.closest('.form-group')
            ?.classList.add('is-invalid');

        if (fieldName === 'image') {
            previewBox?.classList.add('is-invalid');
        }

        if (field.error) {
            field.error.textContent = message;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | إزالة الخطأ عند تعديل الحقل
    |--------------------------------------------------------------------------
    */

    Object.keys(fields).forEach(function (fieldName) {
        const input = fields[fieldName].input;

        input?.addEventListener('input', function () {
            clearFieldError(fieldName);
        });

        input?.addEventListener('change', function () {
            clearFieldError(fieldName);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | معاينة الصورة والتحقق منها
    |--------------------------------------------------------------------------
    */

    if (imageInput && previewBox) {
        imageInput.addEventListener('change', function () {
            clearFieldError('image');

            const file =
                imageInput.files &&
                imageInput.files[0];

            if (!file) {
                return;
            }

            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp',
            ];

            if (!allowedTypes.includes(file.type)) {
                imageInput.value = '';

                showFieldError(
                    'image',
                    'صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP.'
                );

                window.showToast?.(
                    'صيغة الصورة غير مدعومة.',
                    'error'
                );

                return;
            }

            const maximumSize = 2 * 1024 * 1024;

            if (file.size > maximumSize) {
                imageInput.value = '';

                showFieldError(
                    'image',
                    'حجم الصورة يجب ألا يتجاوز 2MB.'
                );

                window.showToast?.(
                    'حجم الصورة أكبر من المسموح.',
                    'error'
                );

                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const imageUrl = event.target?.result;

                previewBox.innerHTML = '';

                const image = document.createElement('img');

                image.src = imageUrl;
                image.alt = 'معاينة صورة الفعالية';
                image.style.width = '100%';
                image.style.height = '100%';
                image.style.objectFit = 'cover';
                image.style.borderRadius = '14px';

                previewBox.appendChild(image);
            };

            reader.readAsDataURL(file);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | التحقق من بيانات الفورم في الواجهة
    |--------------------------------------------------------------------------
    */

    function validateForm() {
        clearAllErrors();

        let formIsValid = true;

        const title =
            fields.title.input?.value.trim() || '';

        const categoryId =
            fields.category_id.input?.value || '';

        const eventType =
            fields.event_type.input?.value || '';

        const description =
            fields.description.input?.value.trim() || '';

        const eventDate =
            fields.event_date.input?.value || '';

        const startTime =
            fields.start_time.input?.value || '';

        const endTime =
            fields.end_time.input?.value || '';

        const location =
            fields.location.input?.value.trim() || '';

        const ageGroup =
            fields.age_group.input?.value || '';

        const capacity =
            fields.capacity.input?.value || '';

        if (!title) {
            showFieldError(
                'title',
                'يرجى إدخال اسم الفعالية.'
            );

            formIsValid = false;
        }

        if (!categoryId) {
            showFieldError(
                'category_id',
                'يرجى اختيار فئة الفعالية.'
            );

            formIsValid = false;
        }

        if (!eventType) {
            showFieldError(
                'event_type',
                'يرجى اختيار نوع الفعالية.'
            );

            formIsValid = false;
        }

        if (!description) {
            showFieldError(
                'description',
                'يرجى إدخال وصف الفعالية.'
            );

            formIsValid = false;
        }

        if (!eventDate) {
            showFieldError(
                'event_date',
                'يرجى اختيار تاريخ الفعالية.'
            );

            formIsValid = false;
        } else {
            const selectedDate =
                new Date(`${eventDate}T00:00:00`);

            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showFieldError(
                    'event_date',
                    'يجب أن يكون تاريخ الفعالية اليوم أو بعده.'
                );

                formIsValid = false;
            }
        }

        if (!startTime) {
            showFieldError(
                'start_time',
                'يرجى اختيار وقت البداية.'
            );

            formIsValid = false;
        }

        if (!endTime) {
            showFieldError(
                'end_time',
                'يرجى اختيار وقت النهاية.'
            );

            formIsValid = false;
        } else if (
            startTime &&
            endTime <= startTime
        ) {
            showFieldError(
                'end_time',
                'وقت النهاية يجب أن يكون بعد وقت البداية.'
            );

            formIsValid = false;
        }

        if (!location) {
            showFieldError(
                'location',
                'يرجى إدخال مكان الفعالية.'
            );

            formIsValid = false;
        }

        if (!ageGroup) {
            showFieldError(
                'age_group',
                'يرجى اختيار العمر المناسب.'
            );

            formIsValid = false;
        }

        if (!capacity) {
            showFieldError(
                'capacity',
                'يرجى إدخال عدد المشاركين.'
            );

            formIsValid = false;
        } else if (
            Number.parseInt(capacity, 10) < 1
        ) {
            showFieldError(
                'capacity',
                'عدد المشاركين يجب أن يكون واحدًا على الأقل.'
            );

            formIsValid = false;
        }

        return formIsValid;
    }

    /*
    |--------------------------------------------------------------------------
    | تغيير حالة أزرار الإرسال
    |--------------------------------------------------------------------------
    */

    function setLoading(isLoading, status) {
        if (submitButton) {
            submitButton.disabled = isLoading;
        }

        if (saveDraftButton) {
            saveDraftButton.disabled = isLoading;
        }

        if (submitText) {
            submitText.textContent = isLoading
                ? status === 'draft'
                    ? 'جاري حفظ المسودة...'
                    : 'جاري إرسال الفعالية...'
                : 'إضافة الفعالية';
        }

        submitSpinner?.classList.toggle(
            'd-none',
            !isLoading
        );
    }

    /*
    |--------------------------------------------------------------------------
    | إرسال الفعالية إلى Laravel
    |--------------------------------------------------------------------------
    */

    async function submitEvent(status) {
        if (!validateForm()) {
            window.showToast?.(
                'يرجى تعبئة جميع بيانات الفعالية المطلوبة.',
                'warning'
            );

            return;
        }

        if (!storeUrl) {
            console.error(
                'data-store-url is missing.'
            );

            window.showToast?.(
                'تعذر تحديد رابط حفظ الفعالية.',
                'error'
            );

            return;
        }

        /*
         * نستخدم FormData بدل JSON لأن الطلب قد يحتوي صورة.
         */
        const formData = new FormData(form);

        formData.set('status', status);

        setLoading(true, status);

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',

                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },

                body: formData,
            });

            const data = await response
                .json()
                .catch(function () {
                    return {};
                });

            /*
             * انتهت الجلسة أو التوكن غير صحيح.
             */
            if (response.status === 401) {
                window.localStorage.removeItem('farha_token');
                window.localStorage.removeItem('farha_user');

                window.sessionStorage.removeItem('farha_token');
                window.sessionStorage.removeItem('farha_user');

                window.showToast?.(
                    'انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.',
                    'warning'
                );

                window.setTimeout(function () {
                    window.location.href =
                        loginUrl || '/login';
                }, 900);

                return;
            }

            /*
             * المستخدم ليس منظمًا.
             */
            if (response.status === 403) {
                window.showToast?.(
                    data.message ||
                        'ليس لديك صلاحية لإضافة فعالية.',
                    'error'
                );

                return;
            }

            /*
             * أخطاء Laravel Validation.
             */
            if (
                response.status === 422 &&
                data.errors
            ) {
                Object.entries(data.errors).forEach(
                    function ([fieldName, messages]) {
                        if (
                            fields[fieldName] &&
                            Array.isArray(messages) &&
                            messages.length > 0
                        ) {
                            showFieldError(
                                fieldName,
                                messages[0]
                            );
                        }
                    }
                );

                window.showToast?.(
                    'يرجى مراجعة بيانات الفعالية وتصحيح الأخطاء.',
                    'warning'
                );

                return;
            }

            /*
             * خطأ آخر من الخادم.
             */
            if (!response.ok) {
                console.error(
                    'Add event failed:',
                    data
                );

                window.showToast?.(
                    data.message ||
                        'تعذر إضافة الفعالية، حاول مرة أخرى.',
                    'error'
                );

                return;
            }

            /*
             * نجح الحفظ.
             */
            window.showToast?.(
                data.message ||
                    (
                        status === 'draft'
                            ? 'تم حفظ الفعالية كمسودة بنجاح.'
                            : 'تم إرسال الفعالية للمراجعة بنجاح.'
                    ),
                'success'
            );

            form.reset();

            previewBox.innerHTML = `
                <i class="bi bi-image"></i>
                <p>معاينة الصورة</p>
            `;

            window.setTimeout(function () {
                window.location.href =
                    eventsPageUrl ||
                    '/organizer/events';
            }, 1000);
        } catch (error) {
            console.error(
                'Add event request failed:',
                error
            );

            window.showToast?.(
                'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.',
                'error'
            );
        } finally {
            setLoading(false, status);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | إرسال الفعالية للمراجعة
    |--------------------------------------------------------------------------
    */

    form.addEventListener(
        'submit',
        async function (event) {
            event.preventDefault();

            await submitEvent('pending');
        }
    );

    /*
    |--------------------------------------------------------------------------
    | حفظ الفعالية كمسودة
    |--------------------------------------------------------------------------
    */

    saveDraftButton?.addEventListener(
        'click',
        async function () {
            await submitEvent('draft');
        }
    );
});