<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PublicOrganizerController;
use App\Http\Controllers\ContactMessageController;

use App\Http\Controllers\AdminController;

use App\Http\Controllers\OrganizerController;
use App\Http\Controllers\OrganizerPreferenceController;
use App\Http\Controllers\OrganizerNotificationController;

use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ParentController;
use App\Http\Controllers\ChildController;
use App\Http\Controllers\NotificationController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post(
    '/register',
    [AuthController::class, 'register']
);

Route::post(
    '/login',
    [AuthController::class, 'login']
);

Route::post(
    '/contact',
    [ContactMessageController::class, 'store']
);

Route::get(
    '/events',
    [EventController::class, 'index']
);

Route::get(
    '/events/{event}',
    [EventController::class, 'show']
);

Route::get(
    '/categories',
    [CategoryController::class, 'index']
);

Route::get(
    '/organizers',
    [PublicOrganizerController::class, 'index']
);


/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(
    'auth:sanctum'
)->group(function () {

    Route::get(
        '/me',
        [AuthController::class, 'me']
    );

    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );

    Route::get(
        '/profile',
        [ProfileController::class, 'show']
    );

    Route::put(
        '/profile',
        [ProfileController::class, 'update']
    );

    Route::put(
        '/profile/password',
        [ProfileController::class, 'updatePassword']
    );
});


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:admin',
])->group(function () {

    Route::get(
        '/admin/dashboard',
        [AdminController::class, 'dashboard']
    );

    Route::get(
        '/admin/events',
        [AdminController::class, 'events']
    );

    Route::get(
        '/admin/pending-events',
        [AdminController::class, 'pendingEvents']
    );

    Route::patch(
        '/admin/events/{event}/approve',
        [AdminController::class, 'approve']
    );

    Route::patch(
        '/admin/events/{event}/reject',
        [AdminController::class, 'reject']
    );

    Route::get(
        '/admin/users',
        [AdminController::class, 'users']
    );

    Route::patch(
        '/admin/users/{user}/toggle-status',
        [AdminController::class, 'toggleUserStatus']
    );

    Route::get(
        '/admin/messages',
        [ContactMessageController::class, 'index']
    );

    Route::patch(
        '/admin/messages/{contactMessage}/read',
        [ContactMessageController::class, 'markAsRead']
    );

    Route::post(
        '/admin/messages/{contactMessage}/reply',
        [ContactMessageController::class, 'reply']
    );

    Route::post(
        '/categories',
        [CategoryController::class, 'store']
    );

    Route::put(
        '/categories/{category}',
        [CategoryController::class, 'update']
    );

    Route::delete(
        '/categories/{category}',
        [CategoryController::class, 'destroy']
    );

    Route::get(
        '/registrations',
        [RegistrationController::class, 'index']
    );
});


/*
|--------------------------------------------------------------------------
| Organizer Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:organizer',
])->group(function () {

    Route::get(
        '/organizer/email-preferences',
        [OrganizerPreferenceController::class, 'show']
    );

    Route::put(
        '/organizer/email-preferences',
        [OrganizerPreferenceController::class, 'update']
    );

    Route::get(
        '/organizer/dashboard',
        [OrganizerController::class, 'dashboard']
    );

    Route::get(
        '/organizer/events',
        [OrganizerController::class, 'myEvents']
    );

    Route::post(
        '/events',
        [EventController::class, 'store']
    );

    Route::put(
        '/events/{event}',
        [EventController::class, 'update']
    );

    Route::delete(
        '/events/{event}',
        [EventController::class, 'destroy']
    );

    Route::get(
        '/organizer/events/{event}/registrations',
        [OrganizerController::class, 'eventRegistrations']
    );

    Route::get(
        '/organizer/registration-requests',
        [RegistrationController::class, 'organizerPendingRequests']
    );

    Route::patch(
        '/organizer/registrations/{registration}/approve',
        [RegistrationController::class, 'approve']
    );

    Route::patch(
        '/organizer/registrations/{registration}/reject',
        [RegistrationController::class, 'reject']
    );

    Route::get(
        '/organizer/reports',
        [OrganizerController::class, 'reports']
    );

    Route::get(
        '/organizer/notifications',
        [OrganizerNotificationController::class, 'index']
    );

    Route::put(
        '/organizer/notifications/read-all',
        [OrganizerNotificationController::class, 'markAllAsRead']
    );

    Route::put(
        '/organizer/notifications/{notification}/read',
        [OrganizerNotificationController::class, 'markAsRead']
    );
});


/*
|--------------------------------------------------------------------------
| Parent Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:parent',
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Registrations
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/registrations',
        [RegistrationController::class, 'store']
    );

    Route::patch(
        '/registrations/{registration}/cancel',
        [RegistrationController::class, 'cancel']
    );

    Route::get(
        '/parent/registrations',
        [ParentController::class, 'myRegistrations']
    );


    /*
    |--------------------------------------------------------------------------
    | Children
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/children',
        [ChildController::class, 'index']
    );

    Route::post(
        '/children',
        [ChildController::class, 'store']
    );

    Route::get(
        '/children/{child}',
        [ChildController::class, 'show']
    );

    Route::put(
        '/children/{child}',
        [ChildController::class, 'update']
    );

    Route::delete(
        '/children/{child}',
        [ChildController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | Parent Notifications
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    );

    Route::get(
        '/notifications/unread-count',
        [NotificationController::class, 'unreadCount']
    );

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    );

    Route::delete(
        '/notifications/delete-all',
        [NotificationController::class, 'destroyAll']
    );

    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    );

    Route::delete(
        '/notifications/{notification}',
        [NotificationController::class, 'destroy']
    );
});






