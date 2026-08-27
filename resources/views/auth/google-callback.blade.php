<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        جاري تسجيل الدخول - فرحة
    </title>

</head>

<body>

<script>

    /*
    |--------------------------------------------------------------------------
    | بيانات تسجيل الدخول القادمة من Laravel
    |--------------------------------------------------------------------------
    */

    const token = @json($token);

    const user = @json($user);


    /*
    |--------------------------------------------------------------------------
    | تنظيف أي تسجيل دخول قديم
    |--------------------------------------------------------------------------
    */

    window.localStorage.removeItem(
        'farha_token'
    );

    window.localStorage.removeItem(
        'farha_user'
    );

    window.sessionStorage.removeItem(
        'farha_token'
    );

    window.sessionStorage.removeItem(
        'farha_user'
    );


    /*
    |--------------------------------------------------------------------------
    | Google Login يبقى محفوظ مثل Remember Me
    |--------------------------------------------------------------------------
    */

    window.localStorage.setItem(
        'farha_token',
        token
    );

    window.localStorage.setItem(
        'farha_user',
        JSON.stringify(user)
    );


    /*
    |--------------------------------------------------------------------------
    | تحديد الصفحة حسب دور المستخدم
    |--------------------------------------------------------------------------
    */

    let redirectUrl = '/home';


    if (user.role === 'admin') {

        redirectUrl =
            '/admin/dashboard';

    } else if (
        user.role === 'organizer'
    ) {

        redirectUrl =
            '/organizer/dashboard';

    } else if (
        user.role === 'parent'
    ) {

        redirectUrl =
            '/home';
    }


    /*
    |--------------------------------------------------------------------------
    | التحويل
    |--------------------------------------------------------------------------
    */

    window.location.replace(
        redirectUrl
    );

</script>

</body>

</html>