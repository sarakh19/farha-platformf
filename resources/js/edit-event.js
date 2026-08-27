import './dashboard-common.js';

document.addEventListener('DOMContentLoaded', function () {
    const page = document.getElementById('editEventPage');
    const form = document.getElementById('editEventForm');

    if (!page || !form) {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | روابط الصفحة
    |--------------------------------------------------------------------------
    */

    const eventId = page.dataset.eventId;
    const showBaseUrl = page.dataset.showBaseUrl;
    const updateBaseUrl = page.dataset.updateBaseUrl;
    const deleteBaseUrl = page.dataset.deleteBaseUrl;
    const categoriesUrl = page.dataset.categoriesUrl;
    const eventsPageUrl = page.dataset.eventsPageUrl;
    const loginUrl = page.dataset.loginUrl;
    const logoutUrl = page.dataset.logoutUrl;

    /*
    |--------------------------------------------------------------------------
    | قراءة التوكن والمستخدم
    |--------------------------------------------------------------------------
    */

    const token =
        window.localStorage.getItem('farha_token') ||
        window.sessionStorage.getItem('farha_token');

    const storedUser =
        window.localStorage.getItem('farha_user') ||
        window.sessionStorage.getItem('farha_user');

    let currentUser = null;
    let currentEvent = null;

    try {
        currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error('Invalid stored user data:', error);
    }

    /*
    |--------------------------------------------------------------------------
    | حماية الصفحة
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

    if (currentUser.role !== 'organizer') {
        window.showToast?.(
            'ليس لديك صلاحية لتعديل الفعاليات.',
            'error'
        );

        window.setTimeout(function () {
            window.location.href = '/home';
        }, 900);

        return;
    }

    if (!eventId) {
        showPageError('لم يتم تحديد رقم الفعالية.');
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | عناصر الصفحة
    |--------------------------------------------------------------------------
    */

    const loadingElement =
        document.getElementById('editEventLoading');

    const contentElement =
        document.getElementById('editEventContent');

    const errorElement =
        document.getElementById('editEventError');

    const errorMessage =
        document.getElementById('editEventErrorMessage');

    const organizerName =
        document.getElementById('organizerName');

    const welcomeOrganizerName =
        document.getElementById('welcomeOrganizerName');

    const organizerAvatar =
        document.getElementById('organizerAvatar');

    const previewTitle =
        document.getElementById('previewTitle');

    const previewImage =
        document.getElementById('previewImg');

    const previewStatusBadge =
        document.getElementById('previewStatusBadge');

    const infoCapacity =
        document.getElementById('infoCapacity');

    const infoCreatedDate =
        document.getElementById('infoCreatedDate');

    const infoReviewStatus =
        document.getElementById('infoReviewStatus');

    const rejectionReasonBox =
        document.getElementById('rejectionReasonBox');

    const rejectionReasonText =
        document.getElementById('rejectionReasonText');

    const currentImage =
        document.getElementById('currentImage');

    /*
    |--------------------------------------------------------------------------
    | حقول الفورم
    |--------------------------------------------------------------------------
    */

    const fields = {
        title: document.getElementById('titleInput'),
        category_id: document.getElementById('categoryInput'),
        event_type: document.getElementById('eventTypeInput'),
        age_group: document.getElementById('ageGroupInput'),
        description: document.getElementById('descriptionInput'),
        event_date: document.getElementById('eventDateInput'),
        start_time: document.getElementById('startTimeInput'),
        end_time: document.getElementById('endTimeInput'),
        location: document.getElementById('locationInput'),
        address: document.getElementById('addressInput'),
        capacity: document.getElementById('capacityInput'),
        status: document.getElementById('statusInput'),
        requirements: document.getElementById('requirementsInput'),
        image: document.getElementById('editEventImageInput'),
    };

    /*
    |--------------------------------------------------------------------------
    | عرض بيانات المنظم
    |--------------------------------------------------------------------------
    */

    function displayOrganizerData() {
        const name =
            currentUser.name || 'منظم الفعاليات';

        if (organizerName) {
            organizerName.textContent = name;
        }

        if (welcomeOrganizerName) {
            welcomeOrganizerName.textContent = name;
        }

        if (organizerAvatar) {
            const initials = name
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(function (word) {
                    return word.charAt(0);
                })
                .join('');

            organizerAvatar.textContent =
                initials || 'م';
        }
    }

    displayOrganizerData();

    /*
    |--------------------------------------------------------------------------
    | دوال مساعدة
    |--------------------------------------------------------------------------
    */

    function getImageUrl(imagePath) {
        if (!imagePath) {
            return '/images/default-event.png';
        }

        if (
            imagePath.startsWith('http://') ||
            imagePath.startsWith('https://') ||
            imagePath.startsWith('/')
        ) {
            return imagePath;
        }

        return `/storage/${imagePath}`;
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'غير محدد';
        }

        const date = new Date(`${dateValue}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return new Intl.DateTimeFormat('ar', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    }

    function getStatusInfo(status) {
        const statuses = {
            approved: {
                text: 'منشورة',
                badgeClass: 'published',
                reviewText: 'مقبولة',
                reviewClass: 'green-text',
            },

            pending: {
                text: 'قيد المراجعة',
                badgeClass: 'review',
                reviewText: 'قيد المراجعة',
                reviewClass: 'orange-text',
            },

            draft: {
                text: 'مسودة',
                badgeClass: 'draft',
                reviewText: 'مسودة',
                reviewClass: 'blue-text',
            },

            rejected: {
                text: 'مرفوضة',
                badgeClass: 'rejected',
                reviewText: 'مرفوضة',
                reviewClass: 'red-text',
            },
        };

        return statuses[status] || {
            text: 'غير محددة',
            badgeClass: 'review',
            reviewText: 'غير محددة',
            reviewClass: '',
        };
    }

    function showPageError(message) {
        loadingElement?.classList.add('d-none');
        contentElement?.classList.add('d-none');
        errorElement?.classList.remove('d-none');

        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    function showPageContent() {
        loadingElement?.classList.add('d-none');
        errorElement?.classList.add('d-none');
        contentElement?.classList.remove('d-none');
    }

    /*
    |--------------------------------------------------------------------------
    | تحميل الفئات
    |--------------------------------------------------------------------------
    */

    async function loadCategories() {
        const categorySelect = fields.category_id;

        if (!categorySelect || !categoriesUrl) {
            return;
        }

        try {
            const response = await fetch(categoriesUrl, {
                headers: {
                    Accept: 'application/json',
                },
            });

            const data = await response
                .json()
                .catch(function () {
                    return [];
                });

            const categories = Array.isArray(data)
                ? data
                : Array.isArray(data.data)
                    ? data.data
                    : [];

            categorySelect.innerHTML =
                '<option value="">اختر الفئة</option>';

            categories.forEach(function (category) {
                const option =
                    document.createElement('option');

                option.value = category.id;
                option.textContent = category.name;

                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error(
                'Failed to load categories:',
                error
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | تعبئة الحقول
    |--------------------------------------------------------------------------
    */

    function fillForm(event) {
        if (!event) {
            return;
        }

        fields.title.value =
            event.title || '';

        fields.category_id.value =
            String(event.category_id || '');

        fields.event_type.value =
            event.event_type || '';

        fields.age_group.value =
            event.age_group || '';

        fields.description.value =
            event.description || '';

        fields.event_date.value =
            event.event_date || '';

        fields.start_time.value =
            event.start_time
                ? String(event.start_time).slice(0, 5)
                : '';

        fields.end_time.value =
            event.end_time
                ? String(event.end_time).slice(0, 5)
                : '';

        fields.location.value =
            event.location || '';

        fields.address.value =
            event.address || '';

        fields.capacity.value =
            event.capacity || '';

        fields.requirements.value =
            event.requirements || '';

        /*
         * المنظم لا يستطيع اختيار approved أو rejected.
         * إذا كانت الفعالية بهذه الحالة، نجعل القيمة pending عند التعديل.
         */
        fields.status.value =
            ['draft', 'pending'].includes(event.status)
                ? event.status
                : 'pending';
    }

    /*
    |--------------------------------------------------------------------------
    | تعبئة المعاينة الجانبية
    |--------------------------------------------------------------------------
    */

    function fillPreview(event) {
        const status =
            getStatusInfo(event.status);

        const imageUrl =
            getImageUrl(event.image);

        if (previewTitle) {
            previewTitle.textContent =
                event.title || 'فعالية';
        }

        if (previewImage) {
            previewImage.src = imageUrl;
            previewImage.alt =
                event.title || 'صورة الفعالية';
        }

        if (currentImage) {
            currentImage.src = imageUrl;
            currentImage.alt =
                event.title || 'صورة الفعالية';
        }

        if (previewStatusBadge) {
            previewStatusBadge.className =
                `row-status ${status.badgeClass}`;

            previewStatusBadge.textContent =
                status.text;
        }

        if (infoCapacity) {
            const registrationsCount =
                typeof event.registrations_count === 'number'
                    ? event.registrations_count
                    : Array.isArray(event.registrations)
                        ? event.registrations.length
                        : 0;

            infoCapacity.textContent =
                `${registrationsCount} / ${event.capacity || 0}`;
        }

        if (infoCreatedDate) {
            infoCreatedDate.textContent =
                formatDate(
                    String(event.created_at || '').slice(0, 10)
                );
        }

        if (infoReviewStatus) {
            infoReviewStatus.className =
                status.reviewClass;

            infoReviewStatus.textContent =
                status.reviewText;
        }

        /*
         * حالياً Event model الذي أرسلته لا يحتوي عمود سبب الرفض.
         * لذلك نخفي الصندوق ما لم يرجع الـAPI قيمة rejection_reason.
         */
        if (
            event.status === 'rejected' &&
            event.rejection_reason
        ) {
            rejectionReasonText.textContent =
                event.rejection_reason;

            rejectionReasonBox.classList.remove('d-none');
        } else {
            rejectionReasonBox?.classList.add('d-none');
        }

        document.title =
            `تعديل: ${event.title || 'فعالية'} - فرحة`;
    }

    /*
    |--------------------------------------------------------------------------
    | جلب الفعالية
    |--------------------------------------------------------------------------
    */

    async function loadEvent() {
        const showUrl =
            `${showBaseUrl}/${eventId}`;

        try {
            await loadCategories();

            const response = await fetch(showUrl, {
                method: 'GET',

                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response
                .json()
                .catch(function () {
                    return {};
                });

            if (response.status === 401) {
                window.showToast?.(
                    'انتهت جلسة تسجيل الدخول.',
                    'warning'
                );

                window.setTimeout(function () {
                    window.location.href =
                        loginUrl || '/login';
                }, 900);

                return;
            }

            if (response.status === 404) {
                showPageError(
                    'الفعالية المطلوبة غير موجودة.'
                );

                return;
            }

            if (!response.ok) {
                showPageError(
                    data.message ||
                    'تعذر تحميل بيانات الفعالية.'
                );

                return;
            }

            currentEvent = data.event || data;

            /*
             * نتحقق أن الفعالية تخص المنظم الحالي.
             */
            if (
                currentEvent.organizer_id &&
                Number(currentEvent.organizer_id) !==
                Number(currentUser.id)
            ) {
                showPageError(
                    'ليس لديك صلاحية لتعديل هذه الفعالية.'
                );

                return;
            }

            fillForm(currentEvent);
            fillPreview(currentEvent);
            showPageContent();
        } catch (error) {
            console.error(
                'Failed to load event:',
                error
            );

            showPageError(
                'تعذر الاتصال بالخادم.'
            );
        }
    }

       loadEvent();

    /*
    |--------------------------------------------------------------------------
    | عناصر الحفظ ورسائل الأخطاء
    |--------------------------------------------------------------------------
    */

    const saveEditButton =
        document.getElementById('saveEditButton');

    const saveEditText =
        saveEditButton?.querySelector('.save-edit-text');

    const saveEditSpinner =
        document.getElementById('saveEditSpinner');

    const errorElements = {
        title: document.getElementById('titleError'),
        category_id: document.getElementById('categoryError'),
        event_type: document.getElementById('eventTypeError'),
        age_group: document.getElementById('ageGroupError'),
        description: document.getElementById('descriptionError'),
        event_date: document.getElementById('eventDateError'),
        start_time: document.getElementById('startTimeError'),
        end_time: document.getElementById('endTimeError'),
        location: document.getElementById('locationError'),
        address: document.getElementById('addressError'),
        capacity: document.getElementById('capacityError'),
        status: document.getElementById('statusError'),
        requirements: document.getElementById('requirementsError'),
        image: document.getElementById('imageError'),
    };

    /*
    |--------------------------------------------------------------------------
    | مسح خطأ حقل واحد
    |--------------------------------------------------------------------------
    */

    function clearFieldError(fieldName) {
        const input = fields[fieldName];
        const errorElement = errorElements[fieldName];

        input
            ?.closest('.edit-group')
            ?.classList.remove('is-invalid');

        if (fieldName === 'image') {
            document
                .getElementById('currentImageBox')
                ?.classList.remove('is-invalid');
        }

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /*
    |--------------------------------------------------------------------------
    | مسح جميع الأخطاء
    |--------------------------------------------------------------------------
    */

    function clearAllErrors() {
        Object.keys(errorElements).forEach(function (fieldName) {
            clearFieldError(fieldName);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | عرض خطأ تحت الحقل
    |--------------------------------------------------------------------------
    */

    function showFieldError(fieldName, message) {
        const input = fields[fieldName];
        const errorElement = errorElements[fieldName];

        input
            ?.closest('.edit-group')
            ?.classList.add('is-invalid');

        if (fieldName === 'image') {
            document
                .getElementById('currentImageBox')
                ?.classList.add('is-invalid');
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | إزالة الخطأ عند تعديل الحقل
    |--------------------------------------------------------------------------
    */

    Object.entries(fields).forEach(function ([fieldName, input]) {
        if (!input) {
            return;
        }

        input.addEventListener('input', function () {
            clearFieldError(fieldName);
        });

        input.addEventListener('change', function () {
            clearFieldError(fieldName);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | التحقق من البيانات في الواجهة
    |--------------------------------------------------------------------------
    */

    function validateForm() {
        clearAllErrors();

        let isValid = true;

        const title =
            fields.title?.value.trim() || '';

        const categoryId =
            fields.category_id?.value || '';

        const eventType =
            fields.event_type?.value || '';

        const ageGroup =
            fields.age_group?.value || '';

        const description =
            fields.description?.value.trim() || '';

        const eventDate =
            fields.event_date?.value || '';

        const startTime =
            fields.start_time?.value || '';

        const endTime =
            fields.end_time?.value || '';

        const location =
            fields.location?.value.trim() || '';

        const capacity =
            fields.capacity?.value || '';

        if (!title) {
            showFieldError(
                'title',
                'يرجى إدخال اسم الفعالية.'
            );

            isValid = false;
        }

        if (!categoryId) {
            showFieldError(
                'category_id',
                'يرجى اختيار فئة الفعالية.'
            );

            isValid = false;
        }

        if (!eventType) {
            showFieldError(
                'event_type',
                'يرجى اختيار نوع الفعالية.'
            );

            isValid = false;
        }

        if (!ageGroup) {
            showFieldError(
                'age_group',
                'يرجى اختيار العمر المناسب.'
            );

            isValid = false;
        }

        if (!description) {
            showFieldError(
                'description',
                'يرجى إدخال وصف الفعالية.'
            );

            isValid = false;
        }

        if (!eventDate) {
            showFieldError(
                'event_date',
                'يرجى اختيار تاريخ الفعالية.'
            );

            isValid = false;
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

                isValid = false;
            }
        }

        if (!startTime) {
            showFieldError(
                'start_time',
                'يرجى اختيار وقت البداية.'
            );

            isValid = false;
        }

        if (!endTime) {
            showFieldError(
                'end_time',
                'يرجى اختيار وقت النهاية.'
            );

            isValid = false;
        } else if (
            startTime &&
            endTime <= startTime
        ) {
            showFieldError(
                'end_time',
                'وقت النهاية يجب أن يكون بعد وقت البداية.'
            );

            isValid = false;
        }

        if (!location) {
            showFieldError(
                'location',
                'يرجى إدخال مكان الفعالية.'
            );

            isValid = false;
        }

        if (!capacity) {
            showFieldError(
                'capacity',
                'يرجى إدخال عدد المشاركين.'
            );

            isValid = false;
        } else if (
            Number.parseInt(capacity, 10) < 1
        ) {
            showFieldError(
                'capacity',
                'عدد المشاركين يجب أن يكون واحدًا على الأقل.'
            );

            isValid = false;
        }

        return isValid;
    }

    /*
    |--------------------------------------------------------------------------
    | تشغيل وإيقاف حالة التحميل
    |--------------------------------------------------------------------------
    */

    function setSaving(isSaving) {
        if (!saveEditButton) {
            return;
        }

        saveEditButton.disabled = isSaving;

        if (saveEditText) {
            saveEditText.textContent = isSaving
                ? 'جاري حفظ التعديلات...'
                : 'حفظ التعديلات';
        }

        saveEditSpinner?.classList.toggle(
            'd-none',
            !isSaving
        );
    }

    /*
    |--------------------------------------------------------------------------
    | تحديث المعاينة بعد نجاح الحفظ
    |--------------------------------------------------------------------------
    */

    function updatePreviewAfterSave(event) {
        currentEvent = event;

        fillForm(event);
        fillPreview(event);
    }

    /*
    |--------------------------------------------------------------------------
    | إرسال التعديلات إلى Laravel
    |--------------------------------------------------------------------------
    */

    async function updateEvent() {
        if (!validateForm()) {
            window.showToast?.(
                'يرجى مراجعة بيانات الفعالية وتصحيح الأخطاء.',
                'warning'
            );

            return;
        }

        if (!updateBaseUrl || !eventId) {
            window.showToast?.(
                'تعذر تحديد رابط تحديث الفعالية.',
                'error'
            );

            return;
        }

        const updateUrl =
            `${updateBaseUrl}/${eventId}`;

        /*
         * نستخدم FormData بسبب إمكانية رفع صورة.
         *
         * نرسل الطلب POST ونضع _method=PUT؛
         * لأن رفع الملفات مع PUT مباشرة قد لا يُقرأ بشكل صحيح.
         */
        const formData = new FormData(form);

        formData.set('_method', 'PUT');

        setSaving(true);

        try {
            const response = await fetch(updateUrl, {
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
             * التوكن غير صحيح أو الجلسة انتهت.
             */
            if (response.status === 401) {
                clearAuthentication();

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
             * الفعالية ليست للمنظم الحالي.
             */
            if (response.status === 403) {
                window.showToast?.(
                    data.message ||
                        'ليس لديك صلاحية لتعديل هذه الفعالية.',
                    'error'
                );

                return;
            }

            /*
             * الفعالية غير موجودة.
             */
            if (response.status === 404) {
                showPageError(
                    'الفعالية المطلوبة غير موجودة.'
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
                            errorElements[fieldName] &&
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
                    data.message ||
                        'يرجى مراجعة بيانات الفعالية.',
                    'warning'
                );

                return;
            }

            /*
             * أي خطأ آخر.
             */
            if (!response.ok) {
                console.error(
                    'Update event failed:',
                    data
                );

                window.showToast?.(
                    data.message ||
                        'تعذر تحديث الفعالية، حاول مرة أخرى.',
                    'error'
                );

                return;
            }

            /*
             * نجاح التحديث.
             */
            const updatedEvent =
                data.event || data;

            updatePreviewAfterSave(updatedEvent);

            window.showToast?.(
                data.message ||
                    'تم تحديث الفعالية بنجاح.',
                'success'
            );

            window.setTimeout(function () {
                window.location.href =
                    eventsPageUrl ||
                    '/organizer/events';
            }, 1000);
        } catch (error) {
            console.error(
                'Update event request failed:',
                error
            );

            window.showToast?.(
                'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.',
                'error'
            );
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | حدث إرسال نموذج التعديل
    |--------------------------------------------------------------------------
    */

    form.addEventListener(
        'submit',
        async function (event) {
            event.preventDefault();

            await updateEvent();
        }
    );

        /*
    |--------------------------------------------------------------------------
    | مسح بيانات تسجيل الدخول
    |--------------------------------------------------------------------------
    */

    function clearAuthentication() {
        window.localStorage.removeItem('farha_token');
        window.localStorage.removeItem('farha_user');

        window.sessionStorage.removeItem('farha_token');
        window.sessionStorage.removeItem('farha_user');
    }

    /*
    |--------------------------------------------------------------------------
    | معاينة الصورة الجديدة قبل الحفظ
    |--------------------------------------------------------------------------
    */

    const imageInput =
        fields.image;

    const currentImageBox =
        document.getElementById('currentImageBox');

    if (imageInput && currentImageBox) {
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

            const maximumSize =
                2 * 1024 * 1024;

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

            const reader =
                new FileReader();

            reader.onload = function (event) {
                const imageUrl =
                    event.target?.result;

                if (currentImage && imageUrl) {
                    currentImage.src = imageUrl;
                }

                if (previewImage && imageUrl) {
                    previewImage.src = imageUrl;
                }
            };

            reader.readAsDataURL(file);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | تحديث عنوان المعاينة أثناء الكتابة
    |--------------------------------------------------------------------------
    */

    fields.title?.addEventListener(
        'input',
        function () {
            if (previewTitle) {
                previewTitle.textContent =
                    fields.title.value.trim() ||
                    'عنوان الفعالية';
            }
        }
    );

    /*
    |--------------------------------------------------------------------------
    | عناصر حذف الفعالية
    |--------------------------------------------------------------------------
    */

    const deleteEventButton =
        document.getElementById('deleteEventButton');

    const deleteModalElement =
        document.getElementById('deleteEventModal');

    const deleteModalEventTitle =
        document.getElementById('deleteModalEventTitle');

    const confirmDeleteButton =
        document.getElementById('confirmDeleteButton');

    const deleteConfirmText =
        confirmDeleteButton?.querySelector(
            '.delete-confirm-text'
        );

    const deleteSpinner =
        document.getElementById('deleteSpinner');

    const deleteModal =
        deleteModalElement && window.bootstrap
            ? new window.bootstrap.Modal(
                deleteModalElement
            )
            : null;

    /*
    |--------------------------------------------------------------------------
    | فتح نافذة تأكيد الحذف
    |--------------------------------------------------------------------------
    */

    deleteEventButton?.addEventListener(
        'click',
        function () {
            if (deleteModalEventTitle) {
                deleteModalEventTitle.textContent =
                    currentEvent?.title ||
                    'هذه الفعالية';
            }

            if (deleteModal) {
                deleteModal.show();
                return;
            }

            const confirmed =
                window.confirm(
                    'هل أنت متأكد من حذف هذه الفعالية؟'
                );

            if (confirmed) {
                deleteEvent();
            }
        }
    );

    /*
    |--------------------------------------------------------------------------
    | حالة زر الحذف
    |--------------------------------------------------------------------------
    */

    function setDeleting(isDeleting) {
        if (confirmDeleteButton) {
            confirmDeleteButton.disabled =
                isDeleting;
        }

        if (deleteEventButton) {
            deleteEventButton.disabled =
                isDeleting;
        }

        if (deleteConfirmText) {
            deleteConfirmText.textContent =
                isDeleting
                    ? 'جاري الحذف...'
                    : 'حذف';
        }

        deleteSpinner?.classList.toggle(
            'd-none',
            !isDeleting
        );
    }

    /*
    |--------------------------------------------------------------------------
    | حذف الفعالية من Laravel
    |--------------------------------------------------------------------------
    */

    async function deleteEvent() {
        if (!deleteBaseUrl || !eventId) {
            window.showToast?.(
                'تعذر تحديد رابط حذف الفعالية.',
                'error'
            );

            return;
        }

        const deleteUrl =
            `${deleteBaseUrl}/${eventId}`;

        setDeleting(true);

        try {
            const response = await fetch(
                deleteUrl,
                {
                    method: 'DELETE',

                    headers: {
                        Accept: 'application/json',
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response
                .json()
                .catch(function () {
                    return {};
                });

            if (response.status === 401) {
                clearAuthentication();

                window.showToast?.(
                    'انتهت جلسة تسجيل الدخول.',
                    'warning'
                );

                window.setTimeout(function () {
                    window.location.href =
                        loginUrl || '/login';
                }, 900);

                return;
            }

            if (response.status === 403) {
                window.showToast?.(
                    data.message ||
                    'ليس لديك صلاحية لحذف هذه الفعالية.',
                    'error'
                );

                return;
            }

            if (response.status === 404) {
                window.showToast?.(
                    'الفعالية المطلوبة غير موجودة.',
                    'error'
                );

                return;
            }

            if (!response.ok) {
                console.error(
                    'Delete event failed:',
                    data
                );

                window.showToast?.(
                    data.message ||
                    'تعذر حذف الفعالية.',
                    'error'
                );

                return;
            }

            deleteModal?.hide();

            window.showToast?.(
                data.message ||
                'تم حذف الفعالية بنجاح.',
                'success'
            );

            window.setTimeout(function () {
                window.location.href =
                    eventsPageUrl ||
                    '/organizer/events';
            }, 900);
        } catch (error) {
            console.error(
                'Delete event request failed:',
                error
            );

            window.showToast?.(
                'تعذر الاتصال بالخادم.',
                'error'
            );
        } finally {
            setDeleting(false);
        }
    }

    confirmDeleteButton?.addEventListener(
        'click',
        async function () {
            await deleteEvent();
        }
    );

    /*
    |--------------------------------------------------------------------------
    | تسجيل الخروج
    |--------------------------------------------------------------------------
    */

    const logoutButton =
        document.getElementById('logoutButton');

    logoutButton?.addEventListener(
        'click',
        async function () {
            logoutButton.disabled = true;

            try {
                if (logoutUrl) {
                    await fetch(logoutUrl, {
                        method: 'POST',

                        headers: {
                            Accept: 'application/json',
                            Authorization:
                                `Bearer ${token}`,
                        },
                    });
                }
            } catch (error) {
                console.error(
                    'Logout request failed:',
                    error
                );
            } finally {
                clearAuthentication();

                window.showToast?.(
                    'تم تسجيل الخروج بنجاح.',
                    'success'
                );

                window.setTimeout(function () {
                    window.location.href =
                        loginUrl || '/login';
                }, 700);
            }
        }
    );

    /*
    |--------------------------------------------------------------------------
    | منع الصورة المكسورة
    |--------------------------------------------------------------------------
    */

    [currentImage, previewImage].forEach(
        function (image) {
            image?.addEventListener(
                'error',
                function () {
                    image.src =
                        '/images/default-event.png';
                }
            );
        }
    );
    });
