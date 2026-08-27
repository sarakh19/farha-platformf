<?php

namespace App\Http\Controllers;

use App\Mail\OrganizerEventStatusMail;

use App\Models\Category;
use App\Models\Event;
use App\Models\Notification;
use App\Models\Registration;
use App\Models\User;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    /* =========================================================
       Dashboard
    ========================================================= */

    public function dashboard(Request $request)
    {
        $admin =
            $request->user();


        /* =====================================================
           Users Statistics
        ===================================================== */

        $usersCount =
            User::whereIn(
                'role',
                [
                    'parent',
                    'organizer',
                ]
            )
            ->count();


        $parentsCount =
            User::where(
                'role',
                'parent'
            )
            ->count();


        $organizersCount =
            User::where(
                'role',
                'organizer'
            )
            ->count();


        /* =====================================================
           Events Statistics
        ===================================================== */

        $eventsCount =
            Event::count();


        $pendingEventsCount =
            Event::where(
                'status',
                'pending'
            )
            ->count();


        $approvedEventsCount =
            Event::where(
                'status',
                'approved'
            )
            ->count();


        $rejectedEventsCount =
            Event::where(
                'status',
                'rejected'
            )
            ->count();


        /* =====================================================
           Registrations Count
        ===================================================== */

        $registrationsCount =
            Registration::whereNotIn(
                'status',
                [
                    'cancelled',
                    'canceled',
                    'rejected',
                ]
            )
            ->count();


        /* =====================================================
           Events By Category
        ===================================================== */

        $eventsByCategory =
            Category::withCount(
                'events'
            )
            ->orderByDesc(
                'events_count'
            )
            ->get()
            ->map(
                function ($category) {

                    return [

                        'id' =>
                            $category->id,

                        'name' =>
                            $category->name,

                        'count' =>
                            $category->events_count,

                    ];
                }
            )
            ->values();


        /* =====================================================
           Latest Events
        ===================================================== */

        $latestEvents =
            Event::with([
                'category',
                'organizer',
            ])
            ->latest()
            ->take(4)
            ->get();


        /* =====================================================
           Latest Registrations
        ===================================================== */

        $latestRegistrations =
            Registration::with([
                'parent',
                'child',
                'event.category',
            ])
            ->latest()
            ->take(4)
            ->get();


        /* =====================================================
           Registrations Chart
           آخر 30 يوم
        ===================================================== */

        $startDate =
            Carbon::today()
                ->subDays(29);


        $endDate =
            Carbon::today();


        $registrationRows =
            Registration::selectRaw(
                'DATE(created_at) as registration_date, COUNT(*) as total'
            )
            ->whereDate(
                'created_at',
                '>=',
                $startDate->toDateString()
            )
            ->whereDate(
                'created_at',
                '<=',
                $endDate->toDateString()
            )
            ->groupByRaw(
                'DATE(created_at)'
            )
            ->orderByRaw(
                'DATE(created_at)'
            )
            ->get();


        $registrationsMap =
            $registrationRows
                ->pluck(
                    'total',
                    'registration_date'
                );


        $registrationsChart =
            collect();


        for (
            $date = $startDate->copy();
            $date->lte($endDate);
            $date->addDay()
        ) {

            $dateString =
                $date->toDateString();


            $registrationsChart->push([

                'date' =>
                    $dateString,

                'count' =>
                    (int) (
                        $registrationsMap[
                            $dateString
                        ]
                        ?? 0
                    ),

            ]);
        }


        /* =====================================================
           Response
        ===================================================== */

        return response()->json([

            'admin' => [

                'id' =>
                    $admin->id,

                'name' =>
                    $admin->name,

                'email' =>
                    $admin->email,

                'profile_image' =>
                    $admin->profile_image
                    ?? null,

            ],


            'statistics' => [

                'users_count' =>
                    $usersCount,

                'parents_count' =>
                    $parentsCount,

                'organizers_count' =>
                    $organizersCount,

                'events_count' =>
                    $eventsCount,

                'pending_events_count' =>
                    $pendingEventsCount,

                'approved_events_count' =>
                    $approvedEventsCount,

                'rejected_events_count' =>
                    $rejectedEventsCount,

                'registrations_count' =>
                    $registrationsCount,

            ],


            'events_by_category' =>
                $eventsByCategory,


            'registrations_chart' =>
                $registrationsChart,


            'latest_events' =>
                $latestEvents,


            'latest_registrations' =>
                $latestRegistrations,

        ]);
    }


    /* =========================================================
       Admin Events Page
       جميع الفعاليات
    ========================================================= */

    public function events(Request $request)
    {
        $admin =
            $request->user();


        $events =
            Event::with([
                'category',
                'organizer',
            ])
            ->latest()
            ->get();


        return response()->json([

            'admin' => [

                'id' =>
                    $admin->id,

                'name' =>
                    $admin->name,

                'email' =>
                    $admin->email,

                'profile_image' =>
                    $admin->profile_image
                    ?? null,

            ],


            'statistics' => [

                'total' =>
                    $events->count(),

                'pending' =>
                    $events
                        ->where(
                            'status',
                            'pending'
                        )
                        ->count(),

                'approved' =>
                    $events
                        ->where(
                            'status',
                            'approved'
                        )
                        ->count(),

                'rejected' =>
                    $events
                        ->where(
                            'status',
                            'rejected'
                        )
                        ->count(),

            ],


            'events' =>
                $events,

        ]);
    }


    /* =========================================================
       Pending Events
       نخليها لأنها قد تكون مستخدمة بمكان ثاني
    ========================================================= */

    public function pendingEvents()
    {
        $events =
            Event::with([
                'category',
                'organizer',
            ])
            ->where(
                'status',
                'pending'
            )
            ->latest()
            ->get();


        return response()->json(
            $events
        );
    }


    /* =========================================================
       Approve Event
    ========================================================= */

    public function approve(Event $event)
    {
        $event->status =
            'approved';


        $event->save();


        /*
         * إشعار داخل الموقع
         * + بريد للمنظم إذا كان مفعّل
         */

        $this->sendEventStatusNotification(
            $event,
            'approved'
        );


        $event->load([
            'category',
            'organizer',
        ]);


        return response()->json([

            'message' =>
                'تم قبول الفعالية ونشرها بنجاح.',

            'event' =>
                $event,

        ]);
    }


    /* =========================================================
       Reject Event
    ========================================================= */

    public function reject(
        Request $request,
        Event $event
    ) {

        $request->validate([

            'rejection_reason' => [
                'nullable',
                'string',
                'max:1000',
            ],

        ]);


        $event->status =
            'rejected';


        $event->save();


        /*
         * إشعار داخل الموقع
         * + بريد للمنظم إذا كان مفعّل
         */

        $this->sendEventStatusNotification(
            $event,
            'rejected'
        );


        $event->load([
            'category',
            'organizer',
        ]);


        return response()->json([

            'message' =>
                'تم رفض الفعالية بنجاح.',

            'event' =>
                $event,

        ]);
    }


    /* =========================================================
       Event Status Notification
    ========================================================= */

    private function sendEventStatusNotification(
        Event $event,
        string $status
    ): void {

        $event->load(
            'organizer'
        );


        $organizer =
            $event->organizer;


        if (!$organizer) {
            return;
        }


        $approved =
            $status ===
            'approved';


        /* =====================================================
           Website Notification
        ===================================================== */

        try {

            Notification::create([

                'user_id' =>
                    $organizer->id,

                'title' =>
                    $approved
                        ?
                        'تم قبول الفعالية'
                        :
                        'تم رفض الفعالية',

                'message' =>
                    $approved
                        ?
                        'تم قبول فعالية '
                        . $event->title
                        . ' وأصبحت منشورة.'
                        :
                        'تم رفض فعالية '
                        . $event->title
                        . '.',

                'type' =>
                    'events',

                'is_read' =>
                    false,

                'url' =>
                    '/organizer/events',

            ]);


        } catch (\Throwable $exception) {

            Log::error(
                'Failed to create event status notification.',
                [

                    'event_id' =>
                        $event->id,

                    'organizer_id' =>
                        $organizer->id,

                    'error' =>
                        $exception->getMessage(),

                ]
            );
        }


        /* =====================================================
           Email Notification
        ===================================================== */

        if (
            !$organizer->email
        ) {
            return;
        }


        if (
            !$organizer->email_new_events
        ) {
            return;
        }


        try {

            Mail::to(
                $organizer->email
            )
            ->send(
                new OrganizerEventStatusMail(
                    $event,
                    $status
                )
            );


        } catch (\Throwable $exception) {

            Log::error(
                'Failed to send event status email.',
                [

                    'event_id' =>
                        $event->id,

                    'organizer_id' =>
                        $organizer->id,

                    'error' =>
                        $exception->getMessage(),

                ]
            );
        }
    }


    /* =========================================================
       Users Management Page
    ========================================================= */

    public function users(
        Request $request
    ) {

        $admin =
            $request->user();


        /*
         * نرجع جميع المستخدمين
         * Parent
         * Organizer
         * Admin
         */

        $users =
            User::latest()
                ->get();


        /* =====================================================
           Statistics
        ===================================================== */

        $totalUsers =
            User::count();


        $parents =
            User::where(
                'role',
                'parent'
            )
            ->count();


        $organizers =
            User::where(
                'role',
                'organizer'
            )
            ->count();


        $admins =
            User::where(
                'role',
                'admin'
            )
            ->count();


        $active =
            User::where(
                'is_active',
                true
            )
            ->count();


        $inactive =
            User::where(
                'is_active',
                false
            )
            ->count();


        return response()->json([

            /* ---------- Admin ---------- */

            'admin' => [

                'id' =>
                    $admin->id,

                'name' =>
                    $admin->name,

                'email' =>
                    $admin->email,

                'profile_image' =>
                    $admin->profile_image
                    ?? null,

            ],


            /* ---------- Statistics ---------- */

            'statistics' => [

                'total' =>
                    $totalUsers,

                'parents' =>
                    $parents,

                'organizers' =>
                    $organizers,

                'admins' =>
                    $admins,

                'active' =>
                    $active,

                'inactive' =>
                    $inactive,

            ],


            /* ---------- Users ---------- */

            'users' =>
                $users,

        ]);
    }


    /* =========================================================
       Toggle User Status
    ========================================================= */

    public function toggleUserStatus(
        User $user
    ) {
 
if ($user->role === 'admin') {
    return response()->json([
        'message' => 'لا يمكن حذف حساب مدير النظام.',
    ], 403);
}
        /*
         * لا يمكن تعطيل مدير النظام
         */

        if (
            $user->role ===
            'admin'
        ) {

            return response()->json([

                'message' =>
                    'لا يمكن تعطيل حساب مدير النظام.',

            ], 403);
        }


        /*
         * Toggle
         */

        $user->is_active =
            !$user->is_active;


        $user->save();


        return response()->json([

            'message' =>
                $user->is_active
                    ?
                    'تم تفعيل الحساب بنجاح.'
                    :
                    'تم تعطيل الحساب بنجاح.',

            'user' =>
                $user->fresh(),

        ]);

    }
}