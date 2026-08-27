<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use App\Models\Notification;
use App\Mail\OrganizerRegistrationUpdateMail;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;


class RegistrationController extends Controller
{

    /* =========================================================
       Admin - All Registrations
    ========================================================= */

    public function index()
    {
        $registrations =
            Registration::with([
                'parent',
                'event.category',
                'child',
            ])
            ->latest()
            ->get();


        return response()->json([
            'registrations' =>
                $registrations,
        ]);
    }



    /* =========================================================
       Parent - Register Child
    ========================================================= */

    public function store(Request $request)
    {
        $validated =
            $request->validate([

                'event_id' => [
                    'required',
                    'exists:events,id',
                ],

                'child_id' => [
                    'required',
                    'exists:children,id',
                ],

            ]);


        $parent =
            $request->user();


        $event =
            Event::findOrFail(
                $validated['event_id']
            );


        /* ---------------------------------------------------------
           Event must be approved
        --------------------------------------------------------- */

        if (
            $event->status !==
            'approved'
        ) {

            return response()->json([
                'message' =>
                    'هذه الفعالية غير متاحة للتسجيل.',
            ], 422);
        }



        /* ---------------------------------------------------------
           Event must not be expired
        --------------------------------------------------------- */

        if (
            Carbon::parse(
                $event->event_date
            )->lt(
                Carbon::today()
            )
        ) {

            return response()->json([
                'message' =>
                    'انتهى موعد التسجيل في هذه الفعالية.',
            ], 422);
        }



        /* ---------------------------------------------------------
           Child must belong to current parent
        --------------------------------------------------------- */

        $childBelongsToParent =
            $parent
                ->children()
                ->where(
                    'children.id',
                    $validated['child_id']
                )
                ->exists();


        if (
            !$childBelongsToParent
        ) {

            return response()->json([
                'message' =>
                    'الطفل المحدد غير تابع لهذا الحساب.',
            ], 403);
        }



        /* ---------------------------------------------------------
           Search for existing registration

           Unique:
           parent_id + event_id + child_id
        --------------------------------------------------------- */

        $existingRegistration =
            Registration::where(
                'parent_id',
                $parent->id
            )
            ->where(
                'event_id',
                $event->id
            )
            ->where(
                'child_id',
                $validated['child_id']
            )
            ->first();



        /* ---------------------------------------------------------
           Prevent duplicate active request
        --------------------------------------------------------- */

        if (
            $existingRegistration &&
            !in_array(
                strtolower(
                    $existingRegistration->status
                ),
                [
                    'cancelled',
                    'canceled',
                    'rejected',
                ]
            )
        ) {

            return response()->json([
                'message' =>
                    'هذا الطفل لديه طلب تسجيل مسبق في هذه الفعالية.',
            ], 409);
        }



        /* ---------------------------------------------------------
           Capacity

           pending + confirmed + registered
           يعتبروا مقاعد محجوزة.

           cancelled / canceled / rejected
           لا يحجزوا مقعد.
        --------------------------------------------------------- */

        $registeredCount =
            Registration::where(
                'event_id',
                $event->id
            )
            ->whereNotIn(
                'status',
                [
                    'cancelled',
                    'canceled',
                    'rejected',
                ]
            )
            ->count();


        if (
            $event->capacity !== null &&
            $registeredCount >=
            $event->capacity
        ) {

            return response()->json([
                'message' =>
                    'عذرًا، جميع المقاعد ممتلئة.',
            ], 422);
        }



        /* ---------------------------------------------------------
           Re-submit old cancelled/rejected request
        --------------------------------------------------------- */

        if (
            $existingRegistration &&
            in_array(
                strtolower(
                    $existingRegistration->status
                ),
                [
                    'cancelled',
                    'canceled',
                    'rejected',
                ]
            )
        ) {

            $existingRegistration->update([
                'status' =>
                    'pending',
            ]);


            /*
             * مهم:
             * نحمل organizer حتى نعرف
             * لمن سنرسل البريد.
             */

            $existingRegistration->load([
                'parent',
                'child',
                'event.category',
                'event.organizer',
            ]);


            /* -----------------------------------------------------
               Send organizer email
            ----------------------------------------------------- */

            $this->sendRegistrationEmailToOrganizer(
                $existingRegistration
            );


            $this->createParentNotification(
                $existingRegistration,
                'تم إرسال طلب التسجيل',
                'تم إرسال طلب التسجيل في فعالية ' .
                ($existingRegistration->event?->title ?? 'الفعالية') .
                ' وبانتظار موافقة المنظم.'
            );


            return response()->json([

                'message' =>
                    'تم إرسال طلب التسجيل للمنظم وبانتظار الموافقة.',

                'registration' =>
                    $existingRegistration,

            ]);
        }



        /* ---------------------------------------------------------
           Create new pending registration
        --------------------------------------------------------- */

        $registration =
            Registration::create([

                'parent_id' =>
                    $parent->id,

                'event_id' =>
                    $event->id,

                'child_id' =>
                    $validated['child_id'],

                'status' =>
                    'pending',

            ]);



        /*
         * نحمّل المنظم أيضًا
         * لإرسال البريد له.
         */

        $registration->load([
            'parent',
            'child',
            'event.category',
            'event.organizer',
        ]);



        /* ---------------------------------------------------------
           Send organizer email
        --------------------------------------------------------- */

        $this->sendRegistrationEmailToOrganizer(
            $registration
        );


        $this->createParentNotification(
            $registration,
            'تم إرسال طلب التسجيل',
            'تم إرسال طلب التسجيل في فعالية ' .
            ($registration->event?->title ?? 'الفعالية') .
            ' وبانتظار موافقة المنظم.'
        );


        return response()->json([

            'message' =>
                'تم إرسال طلب التسجيل للمنظم وبانتظار الموافقة.',

            'registration' =>
                $registration,

        ], 201);
    }



    /* =========================================================
       Send Registration Email To Organizer
    ========================================================= */

   private function sendRegistrationEmailToOrganizer(
    Registration $registration
): void {

    $organizer =
        $registration
            ->event
            ?->organizer;


    if (!$organizer) {

        Log::warning(
            'Registration notification not sent: organizer not found.',
            [
                'registration_id' =>
                    $registration->id,

                'event_id' =>
                    $registration->event_id,
            ]
        );

        return;
    }



    /* =========================================================
       1. Website Notification
       نستخدم جدول notifications المخصص في مشروع فرحة.
    ========================================================= */

    try {

        Notification::create([
            'user_id' => $organizer->id,
            'title' => 'طلب تسجيل جديد',
            'message' =>
                'تم إرسال طلب تسجيل جديد للطفل ' .
                ($registration->child?->name ?? 'طفل') .
                ' في فعالية ' .
                ($registration->event?->title ?? 'الفعالية') .
                '.',
            'type' => 'registrations',
            'is_read' => false,
            'url' => '/organizer/registration-requests',
        ]);

    } catch (\Throwable $exception) {

        Log::error(
            'Failed to create organizer website notification.',
            [
                'registration_id' =>
                    $registration->id,

                'organizer_id' =>
                    $organizer->id,

                'error' =>
                    $exception->getMessage(),
            ]
        );
    }



    /* =========================================================
       2. Email Notification
    ========================================================= */

    if (!$organizer->email) {
        return;
    }


    if (!$organizer->email_registration_updates) {
        return;
    }


    try {

        Mail::to(
            $organizer->email
        )->send(
            new OrganizerRegistrationUpdateMail(
                $registration
            )
        );

    } catch (\Throwable $exception) {

        Log::error(
            'Failed to send organizer registration email.',
            [
                'registration_id' =>
                    $registration->id,

                'organizer_id' =>
                    $organizer->id,

                'error' =>
                    $exception->getMessage(),
            ]
        );
    }
}

    /* =========================================================
       Create Parent Website Notification
    ========================================================= */

    private function createParentNotification(
        Registration $registration,
        string $title,
        string $message
    ): void {

        try {

            Notification::create([
                'user_id' => $registration->parent_id,
                'title' => $title,
                'message' => $message,
                'type' => 'registrations',
                'is_read' => false,
                'url' => '/parent/my-events',
            ]);

        } catch (\Throwable $exception) {

            Log::error(
                'Failed to create parent website notification.',
                [
                    'registration_id' => $registration->id,
                    'parent_id' => $registration->parent_id,
                    'error' => $exception->getMessage(),
                ]
            );
        }
    }


    /* =========================================================
       Parent - Cancel Registration
    ========================================================= */

    public function cancel(
        Request $request,
        Registration $registration
    ) {

        $parentId =
            $request
                ->user()
                ->id;



        /* ---------------------------------------------------------
           Must belong to current parent
        --------------------------------------------------------- */

        if (
            (int) $registration->parent_id !==
            (int) $parentId
        ) {

            return response()->json([
                'message' =>
                    'ليس لديك صلاحية لإلغاء هذا التسجيل.',
            ], 403);
        }



        /* ---------------------------------------------------------
           Already cancelled
        --------------------------------------------------------- */

        if (
            in_array(
                strtolower(
                    $registration->status
                ),
                [
                    'cancelled',
                    'canceled',
                ]
            )
        ) {

            return response()->json([
                'message' =>
                    'هذا التسجيل ملغي مسبقًا.',
            ], 422);
        }



        /* ---------------------------------------------------------
           Cancel
        --------------------------------------------------------- */

        $registration->update([
            'status' =>
                'cancelled',
        ]);


        $registration->load([
            'event.category',
            'child',
        ]);


        return response()->json([

            'message' =>
                'تم إلغاء التسجيل بنجاح.',

            'registration' =>
                $registration,

        ]);
    }



    /* =========================================================
       Organizer - Pending Registration Requests
    ========================================================= */

    public function organizerPendingRequests(
        Request $request
    ) {

        $organizerId =
            $request
                ->user()
                ->id;



        /*
         * فقط الطلبات المعلقة
         * للفعاليات التابعة للمنظم الحالي.
         */

        $registrations =
            Registration::with([
                'parent',
                'child',
                'event.category',
            ])
            ->where(
                'status',
                'pending'
            )
            ->whereHas(
                'event',
                function ($query) use (
                    $organizerId
                ) {

                    $query->where(
                        'organizer_id',
                        $organizerId
                    );
                }
            )
            ->latest()
            ->get();


        return response()->json([
            'registrations' =>
                $registrations,
        ]);
    }



    /* =========================================================
       Organizer - Approve Registration
    ========================================================= */

    public function approve(
        Request $request,
        Registration $registration
    ) {

        $organizerId =
            $request
                ->user()
                ->id;


        $registration->load([
            'event',
            'parent',
            'child',
        ]);



        /* ---------------------------------------------------------
           Registration must belong to organizer's event
        --------------------------------------------------------- */

        if (
            !$registration->event ||
            (int) $registration->event->organizer_id !==
            (int) $organizerId
        ) {

            return response()->json([
                'message' =>
                    'ليس لديك صلاحية لقبول هذا الطلب.',
            ], 403);
        }



        /* ---------------------------------------------------------
           Request must still be pending
        --------------------------------------------------------- */

        if (
            strtolower(
                $registration->status
            ) !== 'pending'
        ) {

            return response()->json([
                'message' =>
                    'هذا الطلب لم يعد قيد الانتظار.',
            ], 422);
        }



        /* ---------------------------------------------------------
           Approve
        --------------------------------------------------------- */

        $registration->update([
            'status' =>
                'confirmed',
        ]);


        $registration->load([
            'parent',
            'child',
            'event.category',
        ]);


        $this->createParentNotification(
            $registration,
            'تم قبول طلب التسجيل',
            'تم قبول تسجيل ' .
            ($registration->child?->name ?? 'طفلك') .
            ' في فعالية ' .
            ($registration->event?->title ?? 'الفعالية') .
            '.'
        );


        return response()->json([

            'message' =>
                'تم قبول طلب التسجيل بنجاح.',

            'registration' =>
                $registration,

        ]);
    }



    /* =========================================================
       Organizer - Reject Registration
    ========================================================= */

    public function reject(
        Request $request,
        Registration $registration
    ) {

        $organizerId =
            $request
                ->user()
                ->id;


        $registration->load([
            'event',
            'parent',
            'child',
        ]);



        /* ---------------------------------------------------------
           Registration must belong to organizer's event
        --------------------------------------------------------- */

        if (
            !$registration->event ||
            (int) $registration->event->organizer_id !==
            (int) $organizerId
        ) {

            return response()->json([
                'message' =>
                    'ليس لديك صلاحية لرفض هذا الطلب.',
            ], 403);
        }



        /* ---------------------------------------------------------
           Request must still be pending
        --------------------------------------------------------- */

        if (
            strtolower(
                $registration->status
            ) !== 'pending'
        ) {

            return response()->json([
                'message' =>
                    'هذا الطلب لم يعد قيد الانتظار.',
            ], 422);
        }



        /* ---------------------------------------------------------
           Reject
        --------------------------------------------------------- */

        $registration->update([
            'status' =>
                'rejected',
        ]);


        $registration->load([
            'parent',
            'child',
            'event.category',
        ]);


        $this->createParentNotification(
            $registration,
            'تم رفض طلب التسجيل',
            'تم رفض طلب تسجيل ' .
            ($registration->child?->name ?? 'طفلك') .
            ' في فعالية ' .
            ($registration->event?->title ?? 'الفعالية') .
            '.'
        );


        return response()->json([

            'message' =>
                'تم رفض طلب التسجيل.',

            'registration' =>
                $registration,

        ]);
    }
}