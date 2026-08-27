import './site-common.js';


document.addEventListener(
    'DOMContentLoaded',
    function () {


        /* =====================================================
           PAGE
        ====================================================== */

        const page =
            document.getElementById(
                'parentProfilePage'
            );


        if (!page) {
            return;
        }



        /* =====================================================
           URLS
        ====================================================== */

        const profileUrl =
            page.dataset.profileUrl ||
            '/api/profile';


        const childrenUrl =
            page.dataset.childrenUrl ||
            '/api/children';


        const passwordUrl =
            page.dataset.passwordUrl ||
            '/api/profile/password';


        const logoutUrl =
            page.dataset.logoutUrl ||
            '/api/logout';


        const loginUrl =
            page.dataset.loginUrl ||
            '/login';



        /* =====================================================
           AUTH
        ====================================================== */

        const localToken =
            localStorage.getItem(
                'farha_token'
            );


        const sessionToken =
            sessionStorage.getItem(
                'farha_token'
            );


        const token =
            localToken ||
            sessionToken;


        const authStorage =
            localToken
                ? localStorage
                : sessionStorage;



        if (!token) {

            window.location.href =
                loginUrl;

            return;
        }



        /* =====================================================
           HELPERS
        ====================================================== */

        function getHeaders(
            extra = {}
        ) {

            return {

                Accept:
                    'application/json',

                Authorization:
                    `Bearer ${token}`,

                ...extra,
            };
        }



        function clearAuthentication() {

            localStorage.removeItem(
                'farha_token'
            );

            localStorage.removeItem(
                'farha_user'
            );


            sessionStorage.removeItem(
                'farha_token'
            );

            sessionStorage.removeItem(
                'farha_user'
            );
        }



        function saveCurrentUser(
            user
        ) {

            if (!user) {
                return;
            }


            authStorage.setItem(
                'farha_user',
                JSON.stringify(
                    user
                )
            );
        }



        function showToast(
            message,
            type = 'info'
        ) {

            if (
                typeof window.showToast ===
                'function'
            ) {

                window.showToast(
                    message,
                    type
                );

                return;
            }


            alert(message);
        }



        function escapeHtml(
            value
        ) {

            return String(
                value ?? ''
            )
                .replaceAll(
                    '&',
                    '&amp;'
                )
                .replaceAll(
                    '<',
                    '&lt;'
                )
                .replaceAll(
                    '>',
                    '&gt;'
                )
                .replaceAll(
                    '"',
                    '&quot;'
                )
                .replaceAll(
                    "'",
                    '&#039;'
                );
        }



        function getProfileImage(
            path
        ) {

            if (!path) {

                return '/images.1/Margin.png';
            }


            const value =
                String(path).trim();


            if (
                value.startsWith(
                    'http://'
                ) ||
                value.startsWith(
                    'https://'
                ) ||
                value.startsWith('/')
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


            return `/storage/${value}`;
        }



        function calculateAge(
            birthDate
        ) {

            if (!birthDate) {
                return null;
            }


            const birth =
                new Date(
                    birthDate
                );


            if (
                Number.isNaN(
                    birth.getTime()
                )
            ) {

                return null;
            }


            const today =
                new Date();


            let age =
                today.getFullYear() -
                birth.getFullYear();


            const monthDifference =
                today.getMonth() -
                birth.getMonth();


            if (
                monthDifference < 0 ||
                (
                    monthDifference === 0 &&
                    today.getDate() <
                    birth.getDate()
                )
            ) {

                age--;
            }


            return age;
        }



        function genderText(
            gender
        ) {

            if (
                gender === 'male'
            ) {

                return 'ذكر';
            }


            if (
                gender === 'female'
            ) {

                return 'أنثى';
            }


            return 'غير محدد';
        }



        /* =====================================================
           ELEMENTS - USER
        ====================================================== */

        const sidebarParentName =
            document.getElementById(
                'sidebarParentName'
            );


        const topUserName =
            document.getElementById(
                'topUserName'
            );


        const topProfileImage =
            document.getElementById(
                'topProfileImage'
            );


        const profileCardName =
            document.getElementById(
                'profileCardName'
            );


        const profileCardImage =
            document.getElementById(
                'profileCardImage'
            );


        const profileActiveStatus =
            document.getElementById(
                'profileActiveStatus'
            );



        /* =====================================================
           PAGE STATES
        ====================================================== */

        const profileLoading =
            document.getElementById(
                'profileLoading'
            );


        const profileError =
            document.getElementById(
                'profileError'
            );


        const profileErrorMessage =
            document.getElementById(
                'profileErrorMessage'
            );


        const retryProfileButton =
            document.getElementById(
                'retryProfileButton'
            );


        const profileContent =
            document.getElementById(
                'profileContent'
            );



        /* =====================================================
           PROFILE FORM
        ====================================================== */

        const profileForm =
            document.getElementById(
                'profileForm'
            );


        const profileName =
            document.getElementById(
                'profileName'
            );


        const profileEmail =
            document.getElementById(
                'profileEmail'
            );


        const profilePhone =
            document.getElementById(
                'profilePhone'
            );


        const profileBirthDate =
            document.getElementById(
                'profileBirthDate'
            );


        const profileGender =
            document.getElementById(
                'profileGender'
            );


        const profileCity =
            document.getElementById(
                'profileCity'
            );


        const profileAddress =
            document.getElementById(
                'profileAddress'
            );


        const profileNameError =
            document.getElementById(
                'profileNameError'
            );


        const profilePhoneError =
            document.getElementById(
                'profilePhoneError'
            );


        const profileCityError =
            document.getElementById(
                'profileCityError'
            );


        const saveProfileButton =
            document.getElementById(
                'saveProfileButton'
            );


        const saveProfileText =
            document.getElementById(
                'saveProfileText'
            );


        const saveProfileSpinner =
            document.getElementById(
                'saveProfileSpinner'
            );



        /* =====================================================
           PROFILE IMAGE
        ====================================================== */

        const profileImageInput =
            document.getElementById(
                'profileImageInput'
            );


        const changeProfileImageButton =
            document.getElementById(
                'changeProfileImageButton'
            );



        /* =====================================================
           CHILDREN
        ====================================================== */

        const openAddChildButton =
            document.getElementById(
                'openAddChildButton'
            );


        const childForm =
            document.getElementById(
                'childForm'
            );


        const childId =
            document.getElementById(
                'childId'
            );


        const childName =
            document.getElementById(
                'childName'
            );


        const childBirthDate =
            document.getElementById(
                'childBirthDate'
            );


        const childGender =
            document.getElementById(
                'childGender'
            );


        const childNotes =
            document.getElementById(
                'childNotes'
            );


        const cancelChildButton =
            document.getElementById(
                'cancelChildButton'
            );


        const childrenContainer =
            document.getElementById(
                'childrenContainer'
            );


        const childrenLoading =
            document.getElementById(
                'childrenLoading'
            );


        const childrenEmptyState =
            document.getElementById(
                'childrenEmptyState'
            );



        /* =====================================================
           PASSWORD
        ====================================================== */

        const changePasswordForm =
            document.getElementById(
                'changePasswordForm'
            );


        const currentPassword =
            document.getElementById(
                'currentPassword'
            );


        const newPassword =
            document.getElementById(
                'newPassword'
            );


        const newPasswordConfirmation =
            document.getElementById(
                'newPasswordConfirmation'
            );


        const changePasswordButton =
            document.getElementById(
                'changePasswordButton'
            );


        const changePasswordText =
            document.getElementById(
                'changePasswordText'
            );



        /* =====================================================
           LOGOUT / MOBILE
        ====================================================== */

        const logoutButton =
            document.getElementById(
                'logoutButton'
            );


        const mobileMenuButton =
            document.getElementById(
                'mobileMenuButton'
            );


        const sidebar =
            document.getElementById(
                'parentSidebar'
            );


        const sidebarOverlay =
            document.getElementById(
                'sidebarOverlay'
            );



        /* =====================================================
           STATE
        ====================================================== */

        let currentUser =
            null;


        let children =
            [];



        /* =====================================================
           RENDER USER
        ====================================================== */

        function renderUser(
            user
        ) {

            currentUser =
                user;


            const name =
                user.name ||
                'المستخدم';


            /*
             * الدائرة:
             * اسم المستخدم فقط.
             */
            if (
                sidebarParentName
            ) {

                sidebarParentName.textContent =
                    name;
            }


            /*
             * الهيدر:
             * كلمة مرحباً موجودة في الـ Blade.
             * هنا نضع الاسم فقط.
             */
            if (
                topUserName
            ) {

                topUserName.textContent =
                    name;
            }


            if (
                profileCardName
            ) {

                profileCardName.textContent =
                    name;
            }


            const image =
                getProfileImage(
                    user.profile_image ||
                    user.image ||
                    user.avatar
                );


            if (
                topProfileImage
            ) {

                topProfileImage.src =
                    image;


                topProfileImage.onerror =
                    function () {

                        this.onerror =
                            null;

                        this.src =
                            '/images.1/Margin.png';
                    };
            }


            if (
                profileCardImage
            ) {

                profileCardImage.src =
                    image;


                profileCardImage.onerror =
                    function () {

                        this.onerror =
                            null;

                        this.src =
                            '/images.1/Margin.png';
                    };
            }



            if (
                profileActiveStatus
            ) {

                const active =
                    user.is_active ===
                        true ||
                    user.is_active ===
                        1 ||
                    user.is_active ===
                        '1';


                profileActiveStatus.innerHTML =
                    active
                        ? `
                            <i class="bi bi-circle-fill"></i>
                            حساب نشط
                        `
                        : `
                            <i class="bi bi-circle-fill"></i>
                            حساب غير نشط
                        `;
            }



            if (
                profileName
            ) {

                profileName.value =
                    name;
            }


            if (
                profileEmail
            ) {

                profileEmail.value =
                    user.email ||
                    '';
            }


            if (
                profilePhone
            ) {

                profilePhone.value =
                    user.phone ||
                    '';
            }


            if (
                profileBirthDate
            ) {

                profileBirthDate.value =
                    user.birth_date
                        ? String(
                            user.birth_date
                        ).slice(
                            0,
                            10
                        )
                        : '';
            }


            if (
                profileGender
            ) {

                profileGender.value =
                    user.gender ||
                    '';
            }


            if (
                profileCity
            ) {

                profileCity.value =
                    user.city ||
                    user.governorate ||
                    '';
            }


            if (
                profileAddress
            ) {

                profileAddress.value =
                    user.address ||
                    '';
            }


            saveCurrentUser(
                user
            );
        }



        /* =====================================================
           LOAD PROFILE
        ====================================================== */

        async function loadProfile() {

            profileLoading
                ?.classList
                .remove(
                    'd-none'
                );


            profileError
                ?.classList
                .add(
                    'd-none'
                );


            profileContent
                ?.classList
                .add(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        profileUrl,
                        {

                            method:
                                'GET',

                            headers:
                                getHeaders(),
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (
                    response.status ===
                    401
                ) {

                    clearAuthentication();

                    window.location.href =
                        loginUrl;

                    return false;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر تحميل الملف الشخصي.'
                    );
                }


                const user =
                    data.user ||
                    data.data ||
                    data;


                if (
                    !user ||
                    user.role !==
                        'parent'
                ) {

                    window.location.href =
                        '/home';

                    return false;
                }


                renderUser(
                    user
                );


                profileLoading
                    ?.classList
                    .add(
                        'd-none'
                    );


                profileContent
                    ?.classList
                    .remove(
                        'd-none'
                    );


                return true;


            } catch (error) {

                console.error(
                    'Profile load error:',
                    error
                );


                profileLoading
                    ?.classList
                    .add(
                        'd-none'
                    );


                profileContent
                    ?.classList
                    .add(
                        'd-none'
                    );


                profileError
                    ?.classList
                    .remove(
                        'd-none'
                    );


                if (
                    profileErrorMessage
                ) {

                    profileErrorMessage.textContent =
                        error.message ||
                        'تعذر تحميل الملف الشخصي.';
                }


                return false;
            }
        }



        /* =====================================================
           UPDATE PROFILE
        ====================================================== */

        function clearProfileErrors() {

            if (
                profileNameError
            ) {
                profileNameError.textContent =
                    '';
            }


            if (
                profilePhoneError
            ) {
                profilePhoneError.textContent =
                    '';
            }


            if (
                profileCityError
            ) {
                profileCityError.textContent =
                    '';
            }
        }



        profileForm
            ?.addEventListener(
                'submit',
                async function (
                    event
                ) {

                    event.preventDefault();


                    clearProfileErrors();


                    saveProfileButton.disabled =
                        true;


                    saveProfileText.textContent =
                        'جاري الحفظ...';


                    saveProfileSpinner
                        ?.classList
                        .remove(
                            'd-none'
                        );


                    const formData =
                        new FormData();


                    formData.append(
                        'name',
                        profileName.value.trim()
                    );


                    formData.append(
                        'phone',
                        profilePhone.value.trim()
                    );


                    formData.append(
                        'city',
                        profileCity.value.trim()
                    );


                    formData.append(
                        'address',
                        profileAddress.value.trim()
                    );


                    if (
                        profileBirthDate.value
                    ) {

                        formData.append(
                            'birth_date',
                            profileBirthDate.value
                        );
                    }


                    if (
                        profileGender.value
                    ) {

                        formData.append(
                            'gender',
                            profileGender.value
                        );
                    }


                    if (
                        profileImageInput
                            ?.files?.[0]
                    ) {

                        formData.append(
                            'profile_image',
                            profileImageInput
                                .files[0]
                        );
                    }


                    /*
                     * Laravel FormData + PUT
                     */
                    formData.append(
                        '_method',
                        'PUT'
                    );


                    try {

                        const response =
                            await fetch(
                                profileUrl,
                                {

                                    method:
                                        'POST',

                                    headers:
                                        getHeaders(),

                                    body:
                                        formData,
                                }
                            );


                        const data =
                            await response
                                .json()
                                .catch(
                                    () => ({})
                                );


                        if (
                            response.status ===
                            422
                        ) {

                            const errors =
                                data.errors ||
                                {};


                            if (
                                errors.name &&
                                profileNameError
                            ) {

                                profileNameError.textContent =
                                    errors.name[0];
                            }


                            if (
                                errors.phone &&
                                profilePhoneError
                            ) {

                                profilePhoneError.textContent =
                                    errors.phone[0];
                            }


                            if (
                                errors.city &&
                                profileCityError
                            ) {

                                profileCityError.textContent =
                                    errors.city[0];
                            }


                            showToast(
                                'راجعي البيانات المدخلة.',
                                'warning'
                            );


                            return;
                        }


                        if (!response.ok) {

                            throw new Error(
                                data.message ||
                                'تعذر حفظ البيانات.'
                            );
                        }


                        const user =
                            data.user ||
                            data.data ||
                            data;


                        renderUser(
                            user
                        );


                        if (
                            profileImageInput
                        ) {

                            profileImageInput.value =
                                '';
                        }


                        showToast(
                            data.message ||
                            'تم حفظ التغييرات بنجاح.',
                            'success'
                        );


                    } catch (error) {

                        console.error(
                            'Profile update error:',
                            error
                        );


                        showToast(
                            error.message ||
                            'تعذر حفظ البيانات.',
                            'error'
                        );


                    } finally {

                        saveProfileButton.disabled =
                            false;


                        saveProfileText.textContent =
                            'حفظ التغييرات';


                        saveProfileSpinner
                            ?.classList
                            .add(
                                'd-none'
                            );
                    }
                }
            );



        /* =====================================================
           PROFILE IMAGE
        ====================================================== */

        changeProfileImageButton
            ?.addEventListener(
                'click',
                function () {

                    profileImageInput
                        ?.click();
                }
            );



        profileImageInput
            ?.addEventListener(
                'change',
                function () {

                    const file =
                        profileImageInput
                            .files?.[0];


                    if (!file) {
                        return;
                    }


                    const allowedTypes = [
                        'image/jpeg',
                        'image/png',
                        'image/webp'
                    ];


                    if (
                        !allowedTypes.includes(
                            file.type
                        )
                    ) {

                        showToast(
                            'الصورة يجب أن تكون JPG أو PNG أو WEBP.',
                            'warning'
                        );


                        profileImageInput.value =
                            '';


                        return;
                    }


                    if (
                        file.size >
                        2 * 1024 * 1024
                    ) {

                        showToast(
                            'حجم الصورة يجب ألا يتجاوز 2MB.',
                            'warning'
                        );


                        profileImageInput.value =
                            '';


                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (
                            event
                        ) {

                            const preview =
                                event.target.result;


                            if (
                                profileCardImage
                            ) {

                                profileCardImage.src =
                                    preview;
                            }


                            if (
                                topProfileImage
                            ) {

                                topProfileImage.src =
                                    preview;
                            }
                        };


                    reader.readAsDataURL(
                        file
                    );
                }
            );



        /* =====================================================
           CHILD FORM
        ====================================================== */

        function resetChildForm() {

            if (
                childId
            ) {
                childId.value =
                    '';
            }


            if (
                childName
            ) {
                childName.value =
                    '';
            }


            if (
                childBirthDate
            ) {
                childBirthDate.value =
                    '';
            }


            if (
                childGender
            ) {
                childGender.value =
                    '';
            }


            if (
                childNotes
            ) {
                childNotes.value =
                    '';
            }


            childForm
                ?.classList
                .remove(
                    'show'
                );
        }



        openAddChildButton
            ?.addEventListener(
                'click',
                function () {

                    resetChildForm();


                    childForm
                        ?.classList
                        .add(
                            'show'
                        );


                    childName
                        ?.focus();
                }
            );



        cancelChildButton
            ?.addEventListener(
                'click',
                resetChildForm
            );



        /* =====================================================
           CHILDREN RENDER
        ====================================================== */

        function renderChildren() {

            if (
                !childrenContainer
            ) {
                return;
            }


            childrenContainer.innerHTML =
                '';


            if (
                !children.length
            ) {

                childrenEmptyState
                    ?.classList
                    .remove(
                        'd-none'
                    );


                return;
            }


            childrenEmptyState
                ?.classList
                .add(
                    'd-none'
                );



            children.forEach(
                function (
                    child
                ) {

                    const age =
                        calculateAge(
                            child.birth_date
                        );


                    const card =
                        document.createElement(
                            'article'
                        );


                    card.className =
                        'pf-child-card';


                    card.innerHTML = `

                        <button
                            type="button"
                            class="pf-child-more"
                            aria-label="خيارات الطفل"
                        >
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>


                        <div class="pf-child-menu">

                            <button
                                type="button"
                                class="edit-child"
                            >
                                <i class="bi bi-pencil"></i>
                                تعديل
                            </button>

                            <button
                                type="button"
                                class="danger delete-child"
                            >
                                <i class="bi bi-trash"></i>
                                حذف
                            </button>

                        </div>


                        <div class="pf-child-avatar">

                            <i class="bi bi-person"></i>

                        </div>


                        <div>

                            <h3>
                                ${escapeHtml(
                                    child.name
                                )}
                            </h3>

                            <span class="pf-child-gender">

                                ${escapeHtml(
                                    genderText(
                                        child.gender
                                    )
                                )}

                            </span>


                            ${
                                age !== null

                                    ? `
                                        <p>
                                            العمر:
                                            ${age}
                                            سنة
                                        </p>
                                    `

                                    : ''
                            }


                            ${
                                child.notes

                                    ? `
                                        <p>
                                            ${escapeHtml(
                                                child.notes
                                            )}
                                        </p>
                                    `

                                    : ''
                            }

                        </div>
                    `;



                    const menuButton =
                        card.querySelector(
                            '.pf-child-more'
                        );


                    const menu =
                        card.querySelector(
                            '.pf-child-menu'
                        );



                    menuButton
                        ?.addEventListener(
                            'click',
                            function (
                                event
                            ) {

                                event.stopPropagation();


                                document
                                    .querySelectorAll(
                                        '.pf-child-menu.show'
                                    )
                                    .forEach(
                                        function (
                                            openedMenu
                                        ) {

                                            if (
                                                openedMenu !==
                                                menu
                                            ) {

                                                openedMenu
                                                    .classList
                                                    .remove(
                                                        'show'
                                                    );
                                            }
                                        }
                                    );


                                menu
                                    ?.classList
                                    .toggle(
                                        'show'
                                    );
                            }
                        );



                    card
                        .querySelector(
                            '.edit-child'
                        )
                        ?.addEventListener(
                            'click',
                            function () {

                                if (
                                    childId
                                ) {

                                    childId.value =
                                        child.id;
                                }


                                childName.value =
                                    child.name ||
                                    '';


                                childBirthDate.value =
                                    child.birth_date
                                        ? String(
                                            child.birth_date
                                        ).slice(
                                            0,
                                            10
                                        )
                                        : '';


                                childGender.value =
                                    child.gender ||
                                    '';


                                childNotes.value =
                                    child.notes ||
                                    '';


                                childForm
                                    ?.classList
                                    .add(
                                        'show'
                                    );


                                menu
                                    ?.classList
                                    .remove(
                                        'show'
                                    );


                                childForm
                                    ?.scrollIntoView({
                                        behavior:
                                            'smooth',

                                        block:
                                            'center',
                                    });
                            }
                        );



                    card
                        .querySelector(
                            '.delete-child'
                        )
                        ?.addEventListener(
                            'click',
                            async function () {

                                const confirmed =
                                    window.confirm(
                                        `هل تريد حذف ${child.name}؟`
                                    );


                                if (!confirmed) {
                                    return;
                                }


                                await deleteChild(
                                    child.id
                                );
                            }
                        );



                    childrenContainer
                        .appendChild(
                            card
                        );
                }
            );
        }



        /* =====================================================
           LOAD CHILDREN
        ====================================================== */

        async function loadChildren() {

            childrenLoading
                ?.classList
                .remove(
                    'd-none'
                );


            try {

                const response =
                    await fetch(
                        childrenUrl,
                        {

                            method:
                                'GET',

                            headers:
                                getHeaders(),
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (
                    response.status ===
                    401
                ) {

                    clearAuthentication();

                    window.location.href =
                        loginUrl;

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر تحميل الأطفال.'
                    );
                }


                const list =
                    Array.isArray(
                        data
                    )
                        ? data
                        : (
                            data.children ||
                            data.data ||
                            []
                        );


                children =
                    Array.isArray(
                        list
                    )
                        ? list
                        : [];


                renderChildren();


            } catch (error) {

                console.error(
                    'Children load error:',
                    error
                );


                showToast(
                    error.message ||
                    'تعذر تحميل الأطفال.',
                    'error'
                );


            } finally {

                childrenLoading
                    ?.classList
                    .add(
                        'd-none'
                    );
            }
        }



        /* =====================================================
           SAVE CHILD
        ====================================================== */

        childForm
            ?.addEventListener(
                'submit',
                async function (
                    event
                ) {

                    event.preventDefault();


                    const name =
                        childName
                            .value
                            .trim();


                    if (!name) {

                        showToast(
                            'يرجى إدخال اسم الطفل.',
                            'warning'
                        );

                        return;
                    }


                    const editingId =
                        childId.value;


                    const url =
                        editingId

                            ? `${childrenUrl}/${editingId}`

                            : childrenUrl;


                    const method =
                        editingId

                            ? 'PUT'

                            : 'POST';



                    const payload = {

                        name:
                            name,

                        birth_date:
                            childBirthDate.value ||
                            null,

                        gender:
                            childGender.value ||
                            null,

                        notes:
                            childNotes
                                .value
                                .trim() ||
                            null,
                    };



                    try {

                        const response =
                            await fetch(
                                url,
                                {

                                    method:
                                        method,

                                    headers:
                                        getHeaders({
                                            'Content-Type':
                                                'application/json',
                                        }),

                                    body:
                                        JSON.stringify(
                                            payload
                                        ),
                                }
                            );


                        const data =
                            await response
                                .json()
                                .catch(
                                    () => ({})
                                );


                        if (
                            response.status ===
                            422
                        ) {

                            const firstError =
                                Object
                                    .values(
                                        data.errors ||
                                        {}
                                    )
                                    .flat()[0];


                            showToast(
                                firstError ||
                                'راجعي بيانات الطفل.',
                                'warning'
                            );


                            return;
                        }


                        if (!response.ok) {

                            throw new Error(
                                data.message ||
                                'تعذر حفظ بيانات الطفل.'
                            );
                        }


                        showToast(

                            editingId

                                ? 'تم تعديل بيانات الطفل بنجاح.'

                                : 'تمت إضافة الطفل بنجاح.',

                            'success'
                        );


                        resetChildForm();


                        await loadChildren();


                    } catch (error) {

                        console.error(
                            'Child save error:',
                            error
                        );


                        showToast(
                            error.message ||
                            'تعذر حفظ الطفل.',
                            'error'
                        );
                    }
                }
            );



        /* =====================================================
           DELETE CHILD
        ====================================================== */

        async function deleteChild(
            id
        ) {

            try {

                const response =
                    await fetch(
                        `${childrenUrl}/${id}`,
                        {

                            method:
                                'DELETE',

                            headers:
                                getHeaders(),
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'تعذر حذف الطفل.'
                    );
                }


                showToast(
                    data.message ||
                    'تم حذف الطفل بنجاح.',
                    'success'
                );


                await loadChildren();


            } catch (error) {

                console.error(
                    'Delete child error:',
                    error
                );


                showToast(
                    error.message ||
                    'تعذر حذف الطفل.',
                    'error'
                );
            }
        }



        /* =====================================================
           PASSWORD
        ====================================================== */

        changePasswordForm
            ?.addEventListener(
                'submit',
                async function (
                    event
                ) {

                    event.preventDefault();


                    if (
                        !currentPassword.value ||
                        !newPassword.value ||
                        !newPasswordConfirmation.value
                    ) {

                        showToast(
                            'يرجى تعبئة جميع حقول كلمة المرور.',
                            'warning'
                        );

                        return;
                    }


                    if (
                        newPassword.value !==
                        newPasswordConfirmation.value
                    ) {

                        showToast(
                            'كلمتا المرور الجديدتان غير متطابقتين.',
                            'warning'
                        );

                        return;
                    }


                    if (
                        newPassword.value.length <
                        8
                    ) {

                        showToast(
                            'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
                            'warning'
                        );

                        return;
                    }


                    changePasswordButton.disabled =
                        true;


                    changePasswordText.textContent =
                        'جاري التغيير...';



                    try {

                        const response =
                            await fetch(
                                passwordUrl,
                                {

                                    method:
                                        'PUT',

                                    headers:
                                        getHeaders({
                                            'Content-Type':
                                                'application/json',
                                        }),

                                    body:
                                        JSON.stringify({

                                            current_password:
                                                currentPassword.value,

                                            password:
                                                newPassword.value,

                                            password_confirmation:
                                                newPasswordConfirmation.value,
                                        }),
                                }
                            );


                        const data =
                            await response
                                .json()
                                .catch(
                                    () => ({})
                                );


                        if (!response.ok) {

                            const firstError =
                                Object
                                    .values(
                                        data.errors ||
                                        {}
                                    )
                                    .flat()[0];


                            throw new Error(
                                firstError ||
                                data.message ||
                                'تعذر تغيير كلمة المرور.'
                            );
                        }


                        changePasswordForm.reset();


                        showToast(
                            data.message ||
                            'تم تغيير كلمة المرور بنجاح.',
                            'success'
                        );


                    } catch (error) {

                        console.error(
                            'Password error:',
                            error
                        );


                        showToast(
                            error.message ||
                            'تعذر تغيير كلمة المرور.',
                            'error'
                        );


                    } finally {

                        changePasswordButton.disabled =
                            false;


                        changePasswordText.textContent =
                            'تغيير كلمة المرور';
                    }
                }
            );



        /* =====================================================
           PASSWORD EYES
        ====================================================== */

        document
            .querySelectorAll(
                '.pf-pass-field i'
            )
            .forEach(
                function (
                    eye
                ) {

                    eye.addEventListener(
                        'click',
                        function () {

                            const input =
                                eye
                                    .closest(
                                        '.pf-pass-field'
                                    )
                                    ?.querySelector(
                                        'input'
                                    );


                            if (!input) {
                                return;
                            }


                            const isHidden =
                                input.type ===
                                'password';


                            input.type =
                                isHidden
                                    ? 'text'
                                    : 'password';


                            eye.classList.toggle(
                                'bi-eye',
                                !isHidden
                            );


                            eye.classList.toggle(
                                'bi-eye-slash',
                                isHidden
                            );
                        }
                    );
                }
            );



        /* =====================================================
           PROFILE TABS
        ====================================================== */

        document
            .querySelectorAll(
                '.pf-profile-tabs a'
            )
            .forEach(
                function (
                    link
                ) {

                    link.addEventListener(
                        'click',
                        function () {

                            document
                                .querySelectorAll(
                                    '.pf-profile-tabs a'
                                )
                                .forEach(
                                    item =>
                                        item.classList
                                            .remove(
                                                'active'
                                            )
                                );


                            link.classList.add(
                                'active'
                            );
                        }
                    );
                }
            );



        /* =====================================================
           CHILD MENUS CLOSE
        ====================================================== */

        document.addEventListener(
            'click',
            function () {

                document
                    .querySelectorAll(
                        '.pf-child-menu.show'
                    )
                    .forEach(
                        menu =>
                            menu.classList
                                .remove(
                                    'show'
                                )
                    );
            }
        );



        /* =====================================================
           MOBILE SIDEBAR
        ====================================================== */

        function openSidebar() {

            sidebar
                ?.classList
                .add(
                    'show'
                );


            sidebarOverlay
                ?.classList
                .add(
                    'show'
                );
        }



        function closeSidebar() {

            sidebar
                ?.classList
                .remove(
                    'show'
                );


            sidebarOverlay
                ?.classList
                .remove(
                    'show'
                );
        }



        mobileMenuButton
            ?.addEventListener(
                'click',
                function () {

                    if (
                        sidebar
                            ?.classList
                            .contains(
                                'show'
                            )
                    ) {

                        closeSidebar();

                    } else {

                        openSidebar();
                    }
                }
            );



        sidebarOverlay
            ?.addEventListener(
                'click',
                closeSidebar
            );



        document
            .querySelectorAll(
                '.pf-menu-link'
            )
            .forEach(
                function (
                    link
                ) {

                    link.addEventListener(
                        'click',
                        function () {

                            if (
                                window.innerWidth <=
                                850
                            ) {

                                closeSidebar();
                            }
                        }
                    );
                }
            );



        /* =====================================================
           LOGOUT
        ====================================================== */

        logoutButton
            ?.addEventListener(
                'click',
                async function () {

                    logoutButton.disabled =
                        true;


                    try {

                        await fetch(
                            logoutUrl,
                            {

                                method:
                                    'POST',

                                headers:
                                    getHeaders(),
                            }
                        );


                    } catch (error) {

                        console.error(
                            'Logout error:',
                            error
                        );


                    } finally {

                        clearAuthentication();


                        window.location.href =
                            loginUrl;
                    }
                }
            );



        /* =====================================================
           RETRY
        ====================================================== */

        retryProfileButton
            ?.addEventListener(
                'click',
                async function () {

                    const loaded =
                        await loadProfile();


                    if (loaded) {

                        await loadChildren();
                    }
                }
            );



        /* =====================================================
           START
        ====================================================== */

        async function startPage() {

            const loaded =
                await loadProfile();


            if (!loaded) {
                return;
            }


            await loadChildren();
        }


        startPage();


    }
);