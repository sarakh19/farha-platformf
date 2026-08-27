<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        تحديث حالة الفعالية
    </title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f6f5fb;
        font-family:Arial,Tahoma,sans-serif;
        direction:rtl;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:30px 15px;"
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
                "
            >

                <tr>
                    <td
                        style="
                            background:#7554e8;
                            padding:28px;
                            text-align:center;
                            color:#ffffff;
                        "
                    >
                        <h1 style="margin:0;">
                            فرحة
                        </h1>

                        <p style="margin:8px 0 0;">
                            تحديث حالة الفعالية
                        </p>
                    </td>
                </tr>


                <tr>
                    <td
                        style="
                            padding:30px;
                            color:#333333;
                        "
                    >

                        @if($status === 'approved')

                            <h2 style="color:#22a961;">
                                تم قبول فعاليتك 🎉
                            </h2>

                            <p>
                                تمت الموافقة على الفعالية وأصبحت متاحة للمستخدمين.
                            </p>

                        @else

                            <h2 style="color:#d9534f;">
                                تم رفض الفعالية
                            </h2>

                            <p>
                                لم تتم الموافقة على الفعالية الحالية.
                            </p>

                        @endif


                        <div
                            style="
                                margin-top:20px;
                                padding:18px;
                                background:#f8f6ff;
                                border-radius:12px;
                            "
                        >

                            <strong>
                                اسم الفعالية
                            </strong>

                            <p style="margin:7px 0 0;">
                                {{ $event->title }}
                            </p>

                        </div>

                    </td>
                </tr>


                <tr>
                    <td
                        style="
                            text-align:center;
                            padding:18px;
                            border-top:1px solid #eee;
                            color:#aaa;
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