<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        طلب تسجيل جديد
    </title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f5f4fb;
        font-family:Arial,Tahoma,sans-serif;
        direction:rtl;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#f5f4fb;
        padding:30px 15px;
    "
>

    <tr>

        <td align="center">

            <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                    max-width:600px;
                    width:100%;
                    background:#ffffff;
                    border-radius:18px;
                    overflow:hidden;
                    box-shadow:
                        0 8px 25px
                        rgba(77,66,120,0.08);
                "
            >


                {{-- Header --}}

                <tr>

                    <td
                        style="
                            background:#7554e8;
                            padding:28px;
                            text-align:center;
                            color:#ffffff;
                        "
                    >

                        <h1
                            style="
                                margin:0;
                                font-size:25px;
                            "
                        >
                            فرحة
                        </h1>

                        <p
                            style="
                                margin:8px 0 0;
                                font-size:14px;
                                opacity:.9;
                            "
                        >
                            طلب تسجيل جديد
                        </p>

                    </td>

                </tr>


                {{-- Content --}}

                <tr>

                    <td
                        style="
                            padding:30px;
                            color:#333333;
                        "
                    >

                        <h2
                            style="
                                margin:0 0 14px;
                                font-size:21px;
                                color:#2f2b3d;
                            "
                        >
                            وصلك طلب تسجيل جديد 🎉
                        </h2>


                        <p
                            style="
                                margin:0 0 24px;
                                color:#777184;
                                line-height:1.8;
                                font-size:14px;
                            "
                        >
                            قام ولي أمر بإرسال طلب تسجيل طفل
                            في إحدى فعالياتك.
                        </p>


                        {{-- Event --}}

                        <div
                            style="
                                padding:16px;
                                background:#f8f6ff;
                                border-radius:12px;
                                margin-bottom:14px;
                            "
                        >

                            <strong
                                style="
                                    color:#7554e8;
                                    font-size:13px;
                                "
                            >
                                الفعالية
                            </strong>

                            <p
                                style="
                                    margin:6px 0 0;
                                    font-size:16px;
                                    font-weight:bold;
                                "
                            >
                                {{ $registration->event->title ?? 'فعالية' }}
                            </p>

                        </div>


                        {{-- Child --}}

                        <div
                            style="
                                padding:16px;
                                border:1px solid #ece9f5;
                                border-radius:12px;
                                margin-bottom:14px;
                            "
                        >

                            <strong
                                style="
                                    color:#777184;
                                    font-size:13px;
                                "
                            >
                                الطفل
                            </strong>

                            <p
                                style="
                                    margin:6px 0 0;
                                    font-size:15px;
                                "
                            >
                                {{ $registration->child->name ?? 'غير محدد' }}
                            </p>

                        </div>


                        {{-- Parent --}}

                        <div
                            style="
                                padding:16px;
                                border:1px solid #ece9f5;
                                border-radius:12px;
                                margin-bottom:14px;
                            "
                        >

                            <strong
                                style="
                                    color:#777184;
                                    font-size:13px;
                                "
                            >
                                ولي الأمر
                            </strong>

                            <p
                                style="
                                    margin:6px 0 0;
                                    font-size:15px;
                                "
                            >
                                {{ $registration->parent->name ?? 'غير محدد' }}
                            </p>

                        </div>


                        {{-- Status --}}

                        <div
                            style="
                                padding:15px;
                                background:#fff8e8;
                                border-radius:12px;
                                text-align:center;
                                margin-top:20px;
                            "
                        >

                            <span
                                style="
                                    color:#b97b00;
                                    font-weight:bold;
                                    font-size:14px;
                                "
                            >
                                حالة الطلب:
                                قيد الانتظار
                            </span>

                        </div>


                        <p
                            style="
                                margin:24px 0 0;
                                font-size:13px;
                                color:#858091;
                                line-height:1.8;
                                text-align:center;
                            "
                        >
                            ادخل إلى لوحة تحكم المنظم
                            لمراجعة الطلب وقبوله أو رفضه.
                        </p>

                    </td>

                </tr>


                {{-- Footer --}}

                <tr>

                    <td
                        style="
                            border-top:1px solid #eeeaf6;
                            padding:18px;
                            text-align:center;
                            color:#aaa5b3;
                            font-size:12px;
                        "
                    >

                        منصة فرحة

                    </td>

                </tr>


            </table>

        </td>

    </tr>

</table>

</body>

</html>