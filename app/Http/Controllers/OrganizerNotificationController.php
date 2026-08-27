<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class OrganizerNotificationController extends Controller
{
    /* =========================================================
       Get Organizer Notifications
    ========================================================= */

    public function index(Request $request)
    {
        $user =
            $request->user();


        $notifications =
            Notification::where(
                'user_id',
                $user->id
            )
            ->latest()
            ->take(15)
            ->get();


        $unreadCount =
            Notification::where(
                'user_id',
                $user->id
            )
            ->where(
                'is_read',
                false
            )
            ->count();


        return response()->json([

            'unread_count' =>
                $unreadCount,

            'notifications' =>
                $notifications,

        ]);
    }


    /* =========================================================
       Mark One Notification As Read
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


        $notification->update([
            'is_read' => true,
        ]);


        return response()->json([
            'message' =>
                'تمت قراءة الإشعار.',
        ]);
    }


    /* =========================================================
       Mark All As Read
    ========================================================= */

    public function markAllAsRead(
        Request $request
    ) {

        Notification::where(
            'user_id',
            $request->user()->id
        )
        ->where(
            'is_read',
            false
        )
        ->update([
            'is_read' => true,
        ]);


        return response()->json([
            'message' =>
                'تمت قراءة جميع الإشعارات.',
        ]);
    }
}