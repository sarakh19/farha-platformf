<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrganizerRegistrationUpdateMail extends Mailable
{
    use Queueable, SerializesModels;

    public Registration $registration;

    public function __construct(
        Registration $registration
    ) {
        $this->registration =
            $registration;
    }

    public function build()
    {
        return $this
            ->subject(
                'طلب تسجيل جديد - فرحة'
            )
            ->view(
                'emails.organizer-registration-update'
            );
    }
}