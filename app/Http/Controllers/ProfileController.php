<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:255'],
 'birth_date' => ['nullable', 'date'],
    'gender' => ['nullable', 'in:male,female'],
    'address' => ['nullable', 'string', 'max:255'],

            'profile_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        if ($request->hasFile('profile_image')) {

            // حذف الصورة القديمة إن وجدت
            if ($user->profile_image) {
                Storage::disk('public')->delete(
                    $user->profile_image
                );
            }

            $validated['profile_image'] = $request
                ->file('profile_image')
                ->store('profiles', 'public');
        }

        $user->update($validated);

        return response()->json([
            'message' => 'تم تحديث الملف الشخصي بنجاح.',
            'user' => $user->fresh(),
        ]);
    }
    public function updatePassword(Request $request)
{
    $validated = $request->validate([
        'current_password' => [
            'required',
            'string',
        ],

        'password' => [
            'required',
            'string',
            'min:8',
            'confirmed',
        ],
    ]);


    $user = $request->user();


    if (
        !Hash::check(
            $validated['current_password'],
            $user->password
        )
    ) {
        return response()->json([
            'message' => 'كلمة المرور الحالية غير صحيحة.',

            'errors' => [
                'current_password' => [
                    'كلمة المرور الحالية غير صحيحة.',
                ],
            ],
        ], 422);
    }


    $user->password =
        Hash::make(
            $validated['password']
        );

    $user->save();


    return response()->json([
        'message' =>
            'تم تغيير كلمة المرور بنجاح.',
    ]);
}
}