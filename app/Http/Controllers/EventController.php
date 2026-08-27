<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class EventController extends Controller
{
    /* =========================================================
       Public - All Approved Events
    ========================================================= */

    public function index(Request $request)
    {
        $events = Event::with([
                'category',
                'organizer',
            ])
            ->withCount([
                'registrations as registrations_count' => function ($query) {
                    $query->whereNotIn('status', [
                        'cancelled',
                        'canceled',
                        'rejected',
                    ]);
                }
            ])
            ->where('status', 'approved')

            /* البحث بالاسم */
            ->when(
                $request->search,
                function ($query, $search) {
                    $query->where(
                        'title',
                        'like',
                        '%' . $search . '%'
                    );
                }
            )

            /* التصفية حسب الفئة */
            ->when(
                $request->category_id,
                function ($query, $categoryId) {
                    $query->where(
                        'category_id',
                        $categoryId
                    );
                }
            )

            /* التصفية حسب التاريخ */
            ->when(
                $request->date,
                function ($query, $date) {
                    $query->whereDate(
                        'event_date',
                        $date
                    );
                }
            )

            /* التصفية حسب المنظم */
            ->when(
                $request->organizer_id,
                function ($query, $organizerId) {
                    $query->where(
                        'organizer_id',
                        $organizerId
                    );
                }
            )

            /* التصفية حسب نوع الفعالية */
            ->when(
                $request->event_type,
                function ($query, $eventType) {
                    $query->where(
                        'event_type',
                        $eventType
                    );
                }
            )

            ->orderBy('event_date')
            ->orderBy('start_time')
            ->get();


        /*
         * نضيف بيانات محسوبة لكل فعالية
         */
        $events->transform(
            function ($event) {

                $event->seats_left =
                    max(
                        $event->capacity -
                        $event->registrations_count,
                        0
                    );


                $event->is_expired =
                    $this->eventIsExpired(
                        $event
                    );


                $event->registration_open =
                    !$event->is_expired &&
                    $event->seats_left > 0 &&
                    $event->status === 'approved';


                return $event;
            }
        );


        return response()->json(
            $events
        );
    }


    /* =========================================================
       Public - Show Single Event
    ========================================================= */

    public function show(Event $event)
    {
        $event->load([
            'category',
            'organizer',
        ]);


        $event->loadCount([
            'registrations as registrations_count' => function ($query) {
                $query->whereNotIn('status', [
                    'cancelled',
                    'canceled',
                    'rejected',
                ]);
            }
        ]);


        /*
         * حساب المقاعد المتبقية
         */
        $event->seats_left =
            max(
                $event->capacity -
                $event->registrations_count,
                0
            );


        /*
         * هل انتهى موعد الفعالية؟
         */
        $event->is_expired =
            $this->eventIsExpired(
                $event
            );


        /*
         * هل التسجيل مفتوح؟
         */
        $event->registration_open =
            !$event->is_expired &&
            $event->seats_left > 0 &&
            $event->status === 'approved';


        return response()->json(
            $event
        );
    }


    /* =========================================================
       Organizer - Store Event
    ========================================================= */

    public function store(Request $request)
    {
        $validated =
            $request->validate([
                'category_id' => [
                    'required',
                    'exists:categories,id',
                ],

                'title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'required',
                    'string',
                ],

                'event_type' => [
                    'required',
                    'in:حضورية,أونلاين',
                ],

                'event_date' => [
                    'required',
                    'date',
                    'after_or_equal:today',
                ],

                'start_time' => [
                    'required',
                    'date_format:H:i',
                ],

                'end_time' => [
                    'required',
                    'date_format:H:i',
                    'after:start_time',
                ],

                'location' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'address' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'age_group' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'capacity' => [
                    'required',
                    'integer',
                    'min:1',
                ],

                'requirements' => [
                    'nullable',
                    'string',
                ],

                'image' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:2048',
                ],

                'status' => [
                    'nullable',
                    'in:draft,pending',
                ],
            ]);


        /* حفظ الصورة */

        if (
            $request->hasFile(
                'image'
            )
        ) {

            $validated['image'] =
                $request
                    ->file('image')
                    ->store(
                        'events',
                        'public'
                    );
        }


        /* ربط المنظم */

        $validated['organizer_id'] =
            $request->user()->id;


        /* الحالة الافتراضية */

        $validated['status'] =
            $validated['status'] ??
            'pending';


        $event =
            Event::create(
                $validated
            );


        $event->load([
            'category',
            'organizer',
        ]);


        return response()->json([
            'message' =>
                $event->status === 'draft'
                    ? 'تم حفظ الفعالية كمسودة بنجاح.'
                    : 'تم إرسال الفعالية للمراجعة بنجاح.',

            'event' =>
                $event,
        ], 201);
    }


    /* =========================================================
       Organizer - Update Event
    ========================================================= */

    public function update(
        Request $request,
        Event $event
    ) {
        if (
            (int) $event->organizer_id !==
            (int) $request->user()->id
        ) {

            return response()->json([
                'message' =>
                    'ليس لديك صلاحية لتعديل هذه الفعالية.',
            ], 403);
        }


        $validated =
            $request->validate([
                'category_id' => [
                    'sometimes',
                    'required',
                    'exists:categories,id',
                ],

                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'sometimes',
                    'required',
                    'string',
                ],

                'event_type' => [
                    'sometimes',
                    'required',
                    'in:حضورية,أونلاين',
                ],

                'event_date' => [
                    'sometimes',
                    'required',
                    'date',
                    'after_or_equal:today',
                ],

                'start_time' => [
                    'sometimes',
                    'required',
                    'date_format:H:i',
                ],

                'end_time' => [
                    'sometimes',
                    'required',
                    'date_format:H:i',
                ],

                'location' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                ],

                'address' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'age_group' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:100',
                ],

                'capacity' => [
                    'sometimes',
                    'required',
                    'integer',
                    'min:1',
                ],

                'requirements' => [
                    'nullable',
                    'string',
                ],

                'image' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:2048',
                ],

                'status' => [
                    'sometimes',
                    'in:draft,pending',
                ],
            ]);


        $startTime =
            $validated['start_time'] ??
            $event->start_time;


        $endTime =
            $validated['end_time'] ??
            $event->end_time;


        if (
            $startTime &&
            $endTime &&
            $endTime <= $startTime
        ) {

            return response()->json([
                'message' =>
                    'وقت النهاية يجب أن يكون بعد وقت البداية.',

                'errors' => [
                    'end_time' => [
                        'وقت النهاية يجب أن يكون بعد وقت البداية.',
                    ],
                ],
            ], 422);
        }


        /* استبدال الصورة */

        if (
            $request->hasFile(
                'image'
            )
        ) {

            if (
                $event->image
            ) {

                Storage::disk(
                    'public'
                )
                    ->delete(
                        $event->image
                    );
            }


            $validated['image'] =
                $request
                    ->file('image')
                    ->store(
                        'events',
                        'public'
                    );
        }


        $event->update(
            $validated
        );


        $event->load([
            'category',
            'organizer',
        ]);


        return response()->json([
            'message' =>
                'تم تحديث الفعالية بنجاح.',

            'event' =>
                $event,
        ]);
    }


    /* =========================================================
       Organizer - Delete Event
    ========================================================= */

    public function destroy(
        Request $request,
        Event $event
    ) {
        if (
            (int) $event->organizer_id !==
            (int) $request->user()->id
        ) {

            return response()->json([
                'message' =>
                    'ليس لديك صلاحية لحذف هذه الفعالية.',
            ], 403);
        }


        if (
            $event->image
        ) {

            Storage::disk(
                'public'
            )
                ->delete(
                    $event->image
                );
        }


        $event->delete();


        return response()->json([
            'message' =>
                'تم حذف الفعالية بنجاح.',
        ]);
    }


    /* =========================================================
       Helper - Check if Event Expired
    ========================================================= */

    private function eventIsExpired(
        Event $event
    ): bool {

        if (
            !$event->event_date
        ) {

            return true;
        }


        $date =
            Carbon::parse(
                $event->event_date
            );


        /*
         * إذا عندنا وقت نهاية،
         * نعتبر الفعالية منتهية بعد وقت النهاية.
         */

        if (
            $event->end_time
        ) {

            $dateTime =
                Carbon::parse(
                    $date->format('Y-m-d') .
                    ' ' .
                    Carbon::parse(
                        $event->end_time
                    )->format('H:i:s')
                );


            return $dateTime->isPast();
        }


        /*
         * إذا لا يوجد وقت نهاية،
         * تعتبر منتهية بعد نهاية اليوم.
         */

        return $date
            ->endOfDay()
            ->isPast();
    }
}