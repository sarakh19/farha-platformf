<?php

namespace App\Notifications;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewRegistrationNotification extends Notification
{
    use Queueable;

    public Registration $registration;

    public function __construct(Registration $registration)
    {
        $this->registration = $registration;
    }

    public function via(object $notifiable): array
    {
        /*
         * database فقط هنا.
         *
         * الإيميل عندنا أصلًا يتم إرساله
         * من RegistrationController إلى Mailtrap.
         */
        return [
            'database',
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [

            'type' =>
                'new_registration',

            'title' =>
                'طلب تسجيل جديد',

            'message' =>
                'تم إرسال طلب تسجيل جديد لفعالية '
                . (
                    $this->registration
                        ->event
                        ->title
                    ?? 'فعالية'
                ),

            'registration_id' =>
                $this->registration->id,

            'event_id' =>
                $this->registration->event_id,

            'event_title' =>
                $this->registration
                    ->event
                    ->title
                ?? null,

            'parent_name' =>
                $this->registration
                    ->parent
                    ->name
                ?? null,

            'child_name' =>
                $this->registration
                    ->child
                    ->name
                ?? null,

        ];
    }
}