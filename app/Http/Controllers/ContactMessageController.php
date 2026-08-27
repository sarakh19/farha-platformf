<?php

namespace App\Http\Controllers;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    //الزائر سيقوم بارسال رسالة 

     public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);
         $contactMessage = ContactMessage::create($validated);

        return response()->json([
            'message' => 'تم إرسال رسالتك بنجاح.',
            'contact_message' => $contactMessage,
        ], 201);
    }
    //الأدمن يرى جميع الرسائل
     public function index()
    {
        $messages = ContactMessage::latest()->get();

        return response()->json($messages);
    }
    //الأدمن يعلّم الرسالة كمقروءة
      public function markAsRead(ContactMessage $contactMessage)
    {
        $contactMessage->status = 'read';
        $contactMessage->save();

        return response()->json([
            'message' => 'تم تحديث حالة الرسالة.',
            'contact_message' => $contactMessage,
        ]);
    }

}
