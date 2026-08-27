<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OrganizerController extends Controller
{
    /* =========================================================
       Organizer Dashboard
    ========================================================= */

    public function dashboard(Request $request)
    {
        $organizer =
            $request->user();


        /* ---------------------------------------------------------
           Organizer Events
        --------------------------------------------------------- */

        $events =
            Event::where(
                'organizer_id',
                $organizer->id
            )
            ->withCount([
                'registrations as registrations_count' =>
                    function ($query) {

                        /*
                         * pending ينحسب مباشرة.
                         * confirmed / registered ينحسبوا كذلك.
                         *
                         * cancelled / rejected
                         * لا ينحسبوا.
                         */

                        $query->whereNotIn(
                            'status',
                            [
                                'cancelled',
                                'canceled',
                                'rejected',
                            ]
                        );
                    }
            ])
            ->get();


        /* ---------------------------------------------------------
           Total events
        --------------------------------------------------------- */

        $totalEvents =
            $events->count();


        /* ---------------------------------------------------------
           Upcoming events
        --------------------------------------------------------- */

        $upcomingEvents =
            $events
                ->filter(
                    function ($event) {

                        if (
                            !$event->event_date
                        ) {
                            return false;
                        }


                        $date =
                            Carbon::parse(
                                $event->event_date
                            );


                        return $date
                            ->gte(
                                Carbon::today()
                            );
                    }
                )
                ->count();


        /* ---------------------------------------------------------
           Finished events
        --------------------------------------------------------- */

        $finishedEvents =
            $events
                ->filter(
                    function ($event) {

                        if (
                            !$event->event_date
                        ) {
                            return false;
                        }


                        $date =
                            Carbon::parse(
                                $event->event_date
                            );


                        return $date
                            ->lt(
                                Carbon::today()
                            );
                    }
                )
                ->count();


        /* ---------------------------------------------------------
           Total active registrations

           pending is included immediately.
        --------------------------------------------------------- */

        $totalRegistrations =
            Registration::whereHas(
                'event',
                function ($query) use (
                    $organizer
                ) {

                    $query->where(
                        'organizer_id',
                        $organizer->id
                    );
                }
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


        /* ---------------------------------------------------------
           Pending registration requests
        --------------------------------------------------------- */

        $pendingRegistrations =
            Registration::whereHas(
                'event',
                function ($query) use (
                    $organizer
                ) {

                    $query->where(
                        'organizer_id',
                        $organizer->id
                    );
                }
            )
            ->where(
                'status',
                'pending'
            )
            ->count();


        return response()->json([

            'organizer' =>
                $organizer,

            'stats' => [

                'total_events' =>
                    $totalEvents,

                'upcoming_events' =>
                    $upcomingEvents,

                'total_registrations' =>
                    $totalRegistrations,

                'finished_events' =>
                    $finishedEvents,

                'pending_registrations' =>
                    $pendingRegistrations,

            ],

        ]);
    }


    /* =========================================================
       Organizer - My Events
    ========================================================= */

    public function myEvents(Request $request)
    {
        $organizerId =
            $request
                ->user()
                ->id;


        /*
         * registrations_count
         * هنا يحسب pending أيضًا.
         */

        $events =
            Event::with([
                'category',
            ])
            ->withCount([
                'registrations as registrations_count' =>
                    function ($query) {

                        $query->whereNotIn(
                            'status',
                            [
                                'cancelled',
                                'canceled',
                                'rejected',
                            ]
                        );
                    }
            ])
            ->where(
                'organizer_id',
                $organizerId
            )
            ->latest()
            ->get();


        /*
         * بيانات مساعدة للواجهة
         */

        $events->transform(
            function ($event) {

                $event->is_expired =
                    $event->event_date
                        ? Carbon::parse(
                            $event->event_date
                        )
                        ->lt(
                            Carbon::today()
                        )
                        : false;


                if (
                    $event->capacity !==
                    null
                ) {

                    $event->seats_left =
                        max(
                            $event->capacity -
                            $event->registrations_count,
                            0
                        );
                }


                return $event;
            }
        );


        return response()->json([
            'events' =>
                $events,
        ]);
    }


    /* =========================================================
       Organizer - Event Registrations
    ========================================================= */

    public function eventRegistrations(
        Request $request,
        Event $event
    ) {
        $organizerId =
            $request
                ->user()
                ->id;


        /* ---------------------------------------------------------
           Event belongs to organizer
        --------------------------------------------------------- */

        if (
            (int) $event->organizer_id !==
            (int) $organizerId
        ) {

            return response()->json([
                'message' =>
                    'ليس لديك صلاحية لعرض تسجيلات هذه الفعالية.',
            ], 403);
        }


        /* ---------------------------------------------------------
           All registrations for event
        --------------------------------------------------------- */

        $registrations =
            Registration::with([
                'parent',
                'child',
                'event.category',
            ])
            ->where(
                'event_id',
                $event->id
            )
            ->latest()
            ->get();


        return response()->json([

            'event' =>
                $event,

            'registrations' =>
                $registrations,

        ]);
    }


    /* =========================================================
       Organizer Reports
    ========================================================= */

    public function reports(Request $request)
    {
        $organizer =
            $request->user();


        $organizerId =
            $organizer->id;


        /* =========================================================
           Period
        ========================================================= */

        $period =
            $request->query(
                'period',
                '30'
            );


        $allowedPeriods = [
            '7',
            '30',
            '90',
            '365',
            'all',
        ];


        if (
            !in_array(
                (string) $period,
                $allowedPeriods,
                true
            )
        ) {

            $period =
                '30';
        }


        $fromDate =
            null;


        if (
            $period !==
            'all'
        ) {

            $fromDate =
                now()
                    ->subDays(
                        (int) $period
                    )
                    ->startOfDay();
        }


        /* =========================================================
           Events in selected period
        ========================================================= */

        $eventsQuery =
            Event::where(
                'organizer_id',
                $organizerId
            )
            ->with([
                'category',
            ]);


        if (
            $fromDate
        ) {

            $eventsQuery
                ->whereBetween(
                    'created_at',
                    [
                        $fromDate,
                        now(),
                    ]
                );
        }


        $events =
            $eventsQuery
                ->get();


        /* =========================================================
           All organizer event ids
        ========================================================= */

        $allOrganizerEventIds =
            Event::where(
                'organizer_id',
                $organizerId
            )
            ->pluck(
                'id'
            );


        /* =========================================================
           Registrations in selected period
        ========================================================= */

        $registrationsQuery =
            Registration::whereIn(
                'event_id',
                $allOrganizerEventIds
            );


        if (
            $fromDate
        ) {

            $registrationsQuery
                ->whereBetween(
                    'created_at',
                    [
                        $fromDate,
                        now(),
                    ]
                );
        }


        $registrations =
            $registrationsQuery
                ->get();


        /* =========================================================
           Registration Statistics
        ========================================================= */

        $pending =
            $registrations
                ->where(
                    'status',
                    'pending'
                )
                ->count();


        $confirmed =
            $registrations
                ->whereIn(
                    'status',
                    [
                        'confirmed',
                        'registered',
                        'approved',
                        'accepted',
                    ]
                )
                ->count();


        $cancelled =
            $registrations
                ->whereIn(
                    'status',
                    [
                        'cancelled',
                        'canceled',
                    ]
                )
                ->count();


        $rejected =
            $registrations
                ->where(
                    'status',
                    'rejected'
                )
                ->count();


        $totalRegistrations =
            $registrations
                ->count();


        /* =========================================================
           Acceptance Rate
        ========================================================= */

        $acceptanceRate =
            $totalRegistrations > 0
                ? round(
                    (
                        $confirmed /
                        $totalRegistrations
                    ) * 100
                )
                : 0;


        /* =========================================================
           Categories
        ========================================================= */

        $categories =
            $events
                ->groupBy(
                    function ($event) {

                        return optional(
                            $event->category
                        )->name
                            ??
                            'بدون فئة';
                    }
                )
                ->map(
                    function (
                        $items,
                        $name
                    ) {

                        return [

                            'name' =>
                                $name,

                            'count' =>
                                $items->count(),

                        ];
                    }
                )
                ->sortByDesc(
                    'count'
                )
                ->values();


        /* =========================================================
           Top Events by Registrations
        ========================================================= */

        $topEventsQuery =
            Event::where(
                'organizer_id',
                $organizerId
            )
            ->with([
                'category',
            ])
            ->withCount([
                'registrations as registrations_count' =>
                    function ($query) use (
                        $fromDate
                    ) {

                        if (
                            $fromDate
                        ) {

                            $query
                                ->whereBetween(
                                    'created_at',
                                    [
                                        $fromDate,
                                        now(),
                                    ]
                                );
                        }
                    }
            ]);


        if (
            $fromDate
        ) {

            $topEventsQuery
                ->whereBetween(
                    'created_at',
                    [
                        $fromDate,
                        now(),
                    ]
                );
        }


        $topEvents =
            $topEventsQuery
                ->orderByDesc(
                    'registrations_count'
                )
                ->limit(
                    5
                )
                ->get()
                ->map(
                    function ($event) {

                        return [

                            'id' =>
                                $event->id,

                            'title' =>
                                $event->title,

                            'category_name' =>
                                optional(
                                    $event->category
                                )->name
                                    ??
                                    'بدون فئة',

                            'event_date' =>
                                $event->event_date,

                            'location' =>
                                $event->location,

                            'registrations_count' =>
                                $event
                                    ->registrations_count,

                        ];
                    }
                )
                ->values();


        /* =========================================================
           Final Response
        ========================================================= */

        return response()->json([

            'organizer' => [

                'id' =>
                    $organizer->id,

                'name' =>
                    $organizer->name,

                'email' =>
                    $organizer->email,

            ],


            'summary' => [

                'total_events' =>
                    $events
                        ->count(),

                'total_registrations' =>
                    $totalRegistrations,

                'confirmed_registrations' =>
                    $confirmed,

                'pending_registrations' =>
                    $pending,

                'rejected_registrations' =>
                    $rejected,

                'cancelled_registrations' =>
                    $cancelled,

                'acceptance_rate' =>
                    $acceptanceRate,

            ],


            'categories' =>
                $categories,


            'top_events' =>
                $topEvents,

        ]);
    }
}