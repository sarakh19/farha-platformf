<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;//بستخدمع عشان اشفر كلمة المرور

class AuthController extends Controller
{
     public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],//يجب أن يرسل المستخدم حقلًا ثانيًا اسمه password_confirmationويكون بطابق كلمة المرور
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:255'],
            'role' => ['required', 'in:parent,organizer'],
        ]);
           $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'role' => $validated['role'],
        ]);
         $token = $user->createToken('farha-token')->plainTextToken;//هنا التوكن بمثابة بطاقة تعريق مؤقتة للنظام يعني لو المستخدم اجا يسجل بفعالية رح يرسل التوكن مع الطلب  فيعرف النظام 
//plainTextToken يعطينا نسخة الـ Token التي سنرسلها للفرونت أو نستخدمها في Postman.
        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح.',
            'user' => $user,
            'token' => $token,
        ], 201);//HTTP Status Code معناه تم انشاء مورد بنجاح
    }




    //تسجيل الدخول
    public function login(Request $request)
{
    $validated = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = User::where('email', $validated['email'])->first();//يجيب المستخدم من برده الالكتروني

    if (!$user || !Hash::check($validated['password'], $user->password)) {//يقارن كلمة المرور المكتوبة مع كلمة المرور المشفرة في قاعدة البيانات
        return response()->json([
            'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        ], 401);
    }

    if (!$user->is_active) {//يمنع المستخدم من الدخول اذا الادمن عطل حسابه
        return response()->json([
            'message' => 'هذا الحساب غير مفعل.',
        ], 403);
    }

    $user->tokens()->delete();//رح يحذف التوكنز القديمة حتى يتبقى للمستخدم توكن واحد يقدر يسجل فيه دخوله

    $token = $user->createToken('farha-token')->plainTextToken;//رح يرجع ينشء توكن لاستخدامه في الطلبات المحمية

    return response()->json([
        'message' => 'تم تسجيل الدخول بنجاح.',
        'user' => $user,
        'token' => $token,
    ]);
}
//هاي الخطوة عشان يقدر النظام يعرف مين المستخدم الي عمل تسجيل دخول ويحوله على الداشبورد الخاصة فيه مباشرة
public function me(Request $request)
{
    return response()->json([
        'user' => $request->user(),
    ]);
}

//تسجيل الخروج
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'تم تسجيل الخروج بنجاح.',
    ]);
}
}
