<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class FarhaDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,

            // يحذف كل الفعاليات والتسجيلات والتصنيفات القديمة
            // ثم ينشئ 4 تصنيفات + 3 مؤسسات + 9 فعاليات جديدة
            RealOrganizationsSeeder::class,

            ContactMessageSeeder::class,
        ]);
    }
}