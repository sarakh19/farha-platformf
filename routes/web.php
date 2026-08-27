<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;

/*
|--------------------------------------------------------------------------
| Public / Home
|--------------------------------------------------------------------------
*/

Route::view(
    '/',
    'home'
)->name('home');


Route::view(
    '/home',
    'home'
)->name('home.page');


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::view(
    '/login',
    'auth.login'
)->name('login');


Route::view(
    '/register',
    'auth.register'
)->name('register');

Route::get(
    '/auth/google',
    [GoogleAuthController::class, 'redirectToGoogle']
)->name('google.redirect');


Route::get(
    '/auth/google/callback',
    [GoogleAuthController::class, 'handleGoogleCallback']
)->name('google.callback');
/*
|--------------------------------------------------------------------------
| Organizer
|--------------------------------------------------------------------------
*/

Route::view(
    '/organizer/dashboard',
    'organizer.dashboard'
)->name('organizer.dashboard');


Route::view(
    '/organizer/events/create',
    'organizer.add-event'
)->name('organizer.events.create');


Route::view(
    '/organizer/events',
    'organizer.organizer-events'
)->name('organizer.events');


Route::view(
    '/organizer/events/{event}/edit',
    'organizer.edit-event'
)->name('organizer.events.edit');


Route::view(
    '/organizer/reports',
    'organizer.reports'
)->name('organizer.reports');


Route::view(
    '/organizer/settings',
    'organizer.settings'
)->name('organizer.settings');


/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::view(
    '/admin/dashboard',
    'admin.dashboard'
)->name('admin.dashboard');


Route::view(
    '/admin/events',
    'admin.review-events'
)->name('admin.review-events');


Route::view(
    '/admin/users',
    'admin.users'
)->name('admin.users');


Route::view(
    '/admin/categories',
    'admin.categories'
)->name('admin.categories');


Route::view(
    '/admin/registrations',
    'admin.registrations'
)->name('admin.registrations');


/*
|--------------------------------------------------------------------------
| Parent
|--------------------------------------------------------------------------
*/

Route::view(
    '/parent/profile',
    'parent.profile'
)->name('parent.profile');


Route::view(
    '/parent/my-events',
    'parent.my-events'
)->name('parent.my-events');


Route::view(
    '/parent/notifications',
    'parent.notifications'
)->name('parent.notifications');


/*
|--------------------------------------------------------------------------
| Events
|--------------------------------------------------------------------------
*/

Route::view(
    '/events',
    'events.index'
)->name('events.index');


Route::get(
    '/events/{eventId}',
    function ($eventId) {

        return view(
            'events.event-detail',
            [
                'eventId' => $eventId,
            ]
        );
    }
)
    ->whereNumber('eventId')
    ->name('events.show');


/*
|--------------------------------------------------------------------------
| General Pages
|--------------------------------------------------------------------------
*/

Route::view(
    '/about',
    'about'
)->name('about');


Route::view(
    '/organizers',
    'organizers'
)->name('organizers');


Route::view(
    '/contact',
    'contact'
)->name('contact');


Route::view(
    '/faq',
    'faq'
)->name('faq');