<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;

class ContactMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
$messages = [
            [//1
                'name' => 'محمد أحمد',
                'email' => 'mohammed@example.com',
                'subject' => 'استفسار عن التسجيل',
                'message' => 'أرغب بمعرفة كيفية تسجيل طفلي في الفعاليات.',
                'status' => 'new',
            ],
            [//2
                'name' => 'سارة خالد',
                'email' => 'sara@example.com',
                'subject' => 'مشكلة في الحساب',
                'message' => 'لا أستطيع تسجيل الدخول إلى حسابي.',
                'status' => 'new',
            ],
            [//3
                'name' => 'أحمد محمود',
                'email' => 'ahmed@example.com',
                'subject' => 'اقتراح',
                'message' => 'أتمنى إضافة فعاليات للأطفال الأصغر سنًا.',
                'status' => 'read',
            ],
            [//4
                'name' => 'ريم يوسف',
                'email' => 'reem@example.com',
                'subject' => 'شكر',
                'message' => 'شكرًا لكم على هذه المبادرة الرائعة.',
                'status' => 'read',
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::updateOrCreate(
                ['email' => $message['email'], 'subject' => $message['subject']],
                $message
            );
        }
    }
}
