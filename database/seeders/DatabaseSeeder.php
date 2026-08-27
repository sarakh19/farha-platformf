<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([//هنا بضيف السيدر الي انا عملتهم عشان لارفل يفعلهم لو ماضفتهم ما هيشتغلو السيدر ولارفل هيشغل السيدر التلقائي تاعه 
        UserSeeder::class,
        CategorySeeder::class,
         EventSeeder::class,
         RegistrationSeeder::class,
         ContactMessageSeeder::class,

        ]);
    }
}