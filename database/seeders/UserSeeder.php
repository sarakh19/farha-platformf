<?php

namespace Database\Seeders;
use App\Models\User;
use Illuminate\Support\Facades\Hash;//لتشفير كلمات المرور
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $users = [
            //الادمن 
           [
    'name' => 'مدير النظام',
    'email' => 'admin@farha.com',
    'phone' => '0599000001',
    'city' => 'غزة',
    'profile_image' => null,
    'role' => 'admin',
    'is_active' => true,
    'password' => Hash::make('password123'),
],
//المنظمون
[
    'name' => 'جمعية الأمل',
    'email' => 'organizer1@farha.com',
    'phone' => '0599000002',
    'city' => 'غزة',
    'profile_image' => null,
    'role' => 'organizer',
    'is_active' => true,
    'password' => Hash::make('password123'),
],
//
[
                'name' => 'فريق بسمة',
                'email' => 'organizer2@farha.com',
                'phone' => '0599000003',
                'city' => 'خان يونس',
                'profile_image' => null,
                'role' => 'organizer',
                'is_active' => true,
                'password' => Hash::make('password123'),
            ],
 [
                'name' => 'مبادرة الغد',
                'email' => 'organizer3@farha.com',
                'phone' => '0599000004',
                'city' => 'رفح',
                'profile_image' => null,
                'role' => 'organizer',
                'is_active' => true,
                'password' => Hash::make('password123'),
            ],
            //أولياء الأمور
             [
                'name' => 'محمد أحمد',
                'email' => 'parent1@farha.com',
                'phone' => '0599000005',
                'city' => 'غزة',
                'profile_image' => null,
                'role' => 'parent',
                'is_active' => true,
                'password' => Hash::make('password123'),
            ],
             [
                'name' => 'سارة خالد',
                'email' => 'parent2@farha.com',
                'phone' => '0599000006',
                'city' => 'دير البلح',
                'profile_image' => null,
                'role' => 'parent',
                'is_active' => true,
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'أحمد محمود',
                'email' => 'parent3@farha.com',
                'phone' => '0599000007',
                'city' => 'خان يونس',
                'profile_image' => null,
                'role' => 'parent',
                'is_active' => true,
                'password' => Hash::make('password123'),
            ],

            [
                'name' => 'ريم يوسف',
                'email' => 'parent4@farha.com',
                'phone' => '0599000008',
                'city' => 'رفح',
                'profile_image' => null,
                'role' => 'parent',
                'is_active' => true,
                'password' => Hash::make('password123'),
            ],
            ];

        foreach ($users as $user) {
            User::updateOrCreate//لجعل السيدر قابل للتشغيل اكثر من مرة
            (
                ['email' => $user['email']],//جيبلي اليوزر من ايميله
                $user
            );
        }

    }
}
