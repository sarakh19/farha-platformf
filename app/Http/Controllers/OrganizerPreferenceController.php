<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrganizerPreferenceController extends Controller
{
    public function show(Request $request)
    {
        $user =
            $request->user();

        return response()->json([
            'preferences' => [
                'new_events' =>
                    (bool) $user->email_new_events,

                'event_reminder' =>
                    (bool) $user->email_event_reminder,

                'registration_updates' =>
                    (bool) $user->email_registration_updates,
            ],
        ]);
    }


    public function update(Request $request)
    {
        $validated =
            $request->validate([
                'new_events' =>
                    ['required', 'boolean'],

                'event_reminder' =>
                    ['required', 'boolean'],

                'registration_updates' =>
                    ['required', 'boolean'],
            ]);


        $user =
            $request->user();


        $user->update([
            'email_new_events' =>
                $validated['new_events'],

            'email_event_reminder' =>
                $validated['event_reminder'],

            'email_registration_updates' =>
                $validated['registration_updates'],
        ]);


        return response()->json([
            'message' =>
                'تم حفظ تفضيلات البريد الإلكتروني بنجاح.',

            'preferences' => [
                'new_events' =>
                    (bool) $user->email_new_events,

                'event_reminder' =>
                    (bool) $user->email_event_reminder,

                'registration_updates' =>
                    (bool) $user->email_registration_updates,
            ],
        ]);
    }
}