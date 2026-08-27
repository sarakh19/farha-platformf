<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * إرسال المستخدم إلى Google.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->scopes([
                'openid',
                'profile',
                'email',
            ])
            ->redirect();
    }

    /**
     * استقبال المستخدم بعد تسجيل الدخول من Google.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {

            $googleUser = Socialite::driver('google')->user();

            /*
            |--------------------------------------------------------------------------
            | التأكد من وجود البريد
            |--------------------------------------------------------------------------
            */

            if (!$googleUser->getEmail()) {

                return redirect('/login')
                    ->with(
                        'google_error',
                        'تعذر الحصول على البريد الإلكتروني من Google.'
                    );
            }

            $email = strtolower(
                trim($googleUser->getEmail())
            );

            /*
            |--------------------------------------------------------------------------
            | البحث عن حساب موجود
            |--------------------------------------------------------------------------
            */

            $user = User::where('email', $email)->first();

            /*
            |--------------------------------------------------------------------------
            | إذا لم يوجد الحساب ننشئ Parent جديد
            |--------------------------------------------------------------------------
            */

            if (!$user) {

                $userData = [
                    'name' => $googleUser->getName()
                        ?: $googleUser->getNickname()
                        ?: 'مستخدم فرحة',

                    'email' => $email,

                    /*
                     * كلمة مرور عشوائية لأن المستخدم يدخل بواسطة Google.
                     */
                    'password' => Hash::make(
                        Str::random(40)
                    ),

                    'role' => 'parent',
                ];

                /*
                |--------------------------------------------------------------------------
                | حقول اختيارية حسب قاعدة البيانات الموجودة عندك
                |--------------------------------------------------------------------------
                */

                if (
                    Schema::hasColumn(
                        'users',
                        'email_verified_at'
                    )
                ) {
                    $userData['email_verified_at'] = now();
                }

                if (
                    Schema::hasColumn(
                        'users',
                        'google_id'
                    )
                ) {
                    $userData['google_id'] =
                        $googleUser->getId();
                }

                if (
                    Schema::hasColumn(
                        'users',
                        'profile_image'
                    )
                ) {
                    $userData['profile_image'] =
                        $googleUser->getAvatar();
                }

                if (
                    Schema::hasColumn(
                        'users',
                        'is_active'
                    )
                ) {
                    $userData['is_active'] = true;
                }

                $user = User::create(
                    $userData
                );

            } else {

                /*
                |--------------------------------------------------------------------------
                | الحساب موجود - تحديث بيانات Google الاختيارية
                |--------------------------------------------------------------------------
                */

                $updateData = [];

                if (
                    Schema::hasColumn(
                        'users',
                        'google_id'
                    )
                ) {
                    $updateData['google_id'] =
                        $googleUser->getId();
                }

                if (
                    Schema::hasColumn(
                        'users',
                        'profile_image'
                    ) &&
                    $googleUser->getAvatar()
                ) {
                    /*
                     * إذا عند المستخدم صورة موجودة ونريد المحافظة عليها،
                     * لا نستبدلها إلا إذا كانت فارغة.
                     */
                    if (empty($user->profile_image)) {
                        $updateData['profile_image'] =
                            $googleUser->getAvatar();
                    }
                }

                if (
                    Schema::hasColumn(
                        'users',
                        'email_verified_at'
                    ) &&
                    empty($user->email_verified_at)
                ) {
                    $updateData['email_verified_at'] =
                        now();
                }

                if (!empty($updateData)) {
                    $user->update(
                        $updateData
                    );
                }
            }

            /*
            |--------------------------------------------------------------------------
            | منع الحساب غير النشط
            |--------------------------------------------------------------------------
            */

            if (
                Schema::hasColumn(
                    'users',
                    'is_active'
                ) &&
                !$user->is_active
            ) {

                return redirect('/login')
                    ->with(
                        'google_error',
                        'هذا الحساب غير فعال.'
                    );
            }

            /*
            |--------------------------------------------------------------------------
            | إنشاء Sanctum Token
            |--------------------------------------------------------------------------
            */

            $user->tokens()
                ->where(
                    'name',
                    'google-login'
                )
                ->delete();

            $token = $user
                ->createToken(
                    'google-login'
                )
                ->plainTextToken;

            /*
            |--------------------------------------------------------------------------
            | إرسال المستخدم إلى صفحة مؤقتة
            |
            | السبب:
            | Laravel لا يستطيع الكتابة مباشرة في localStorage،
            | لذلك نرسل token/user إلى Blade ثم JavaScript يحفظهما.
            |--------------------------------------------------------------------------
            */

            return view(
                'auth.google-callback',
                [
                    'token' => $token,

                    'user' => $user,
                ]
            );

        } catch (Throwable $e) {

            report($e);

            return redirect('/login')
                ->with(
                    'google_error',
                    'تعذر تسجيل الدخول باستخدام Google. حاول مرة أخرى.'
                );
        }
    }
}