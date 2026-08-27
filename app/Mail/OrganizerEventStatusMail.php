<?php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrganizerEventStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public Event $event;
    public string $status;

    public function __construct(
        Event $event,
        string $status
    ) {
        $this->event = $event;
        $this->status = $status;
    }

    public function build()
    {
        $subject =
            $this->status === 'approved'
                ? 'تم قبول فعاليتك - فرحة'
                : 'تم رفض فعاليتك - فرحة';

        return $this
            ->subject($subject)
            ->view(
                'emails.organizer-event-status'
            );
    }
}