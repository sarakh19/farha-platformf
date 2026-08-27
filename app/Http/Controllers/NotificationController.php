<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /* =========================================================
       Parent - Get All Notifications
    ========================================================= */

    public function index(Request $request)
    {
        $userId =
            $request
                ->user()
                ->id;

        $notifications =
            Notification::query()
                ->where(
                    'user_id',
                    $userId
                )
                ->latest()
                ->get();

        return response()->json([

            'notifications' =>
                $notifications,

            'counts' => [

                'all' =>
                    $notifications->count(),

                'unread' =>
                    $notifications
                        ->where(
                            'is_read',
                            false
                        )
                        ->count(),

                'events' =>
                    $notifications
                        ->where(
                            'type',
                            'events'
                        )
                        ->count(),

                'registrations' =>
                    $notifications
                        ->where(
                            'type',
                            'registrations'
                        )
                        ->count(),

                'system' =>
                    $notifications
                        ->where(
                            'type',
                            'system'
                        )
                        ->count(),
            ],
        ]);
    }


    /* =========================================================
       Parent - Unread Count
    ========================================================= */

    public function unreadCount(Request $request)
    {
        $count =
            Notification::query()
                ->where(
                    'user_id',
                    $request
                        ->user()
                        ->id
                )
                ->where(
                    'is_read',
                    false
                )
                ->count();

        return response()->json([

            'unread_count' =>
                $count,
        ]);
    }


    /* =========================================================
       Parent - Mark One Notification As Read
    ========================================================= */

    public function markAsRead(
        Request $request,
        Notification $notification
    ) {
        if (
            (int) $notification->user_id !==
            (int) $request->user()->id
        ) {

            return response()->json([

                'message' =>
                    'ليس لديك صلاحية للوصول إلى هذا الإشعار.',

            ], 403);
        }


        if (
            !$notification->is_read
        ) {

            $notification->update([

                'is_read' =>
                    true,
            ]);
        }


        return response()->json([

            'message' =>
                'تم تحديد الإشعار كمقروء.',

            'notification' =>
                $notification->fresh(),
        ]);
    }


    /* =========================================================
       Parent - Mark All Notifications As Read
    ========================================================= */

    public function markAllAsRead(Request $request)
    {
        Notification::query()
            ->where(
                'user_id',
                $request
                    ->user()
                    ->id
            )
            ->where(
                'is_read',
                false
            )
            ->update([

                'is_read' =>
                    true,
            ]);


        return response()->json([

            'message' =>
                'تم تحديد جميع الإشعارات كمقروءة.',
        ]);
    }


    /* =========================================================
       Parent - Delete One Notification
    ========================================================= */

    public function destroy(
        Request $request,
        Notification $notification
    ) {
        if (
            (int) $notification->user_id !==
            (int) $request->user()->id
        ) {

            return response()->json([

                'message' =>
                    'ليس لديك صلاحية لحذف هذا الإشعار.',

            ], 403);
        }


        $notification->delete();


        return response()->json([

            'message' =>
                'تم حذف الإشعار بنجاح.',
        ]);
    }


    /* =========================================================
       Parent - Delete All Notifications
    ========================================================= */

    public function destroyAll(Request $request)
    {
        Notification::query()
            ->where(
                'user_id',
                $request
                    ->user()
                    ->id
            )
            ->delete();


        return response()->json([

            'message' =>
                'تم حذف جميع الإشعارات بنجاح.',
        ]);
    }
}