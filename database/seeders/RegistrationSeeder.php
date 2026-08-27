<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Registration;

class RegistrationSeeder extends Seeder
{
    public function run(): void
    {
        
$registrations = [
            [//1
                'parent_id' => 5,
                'event_id' => 1,
                'status' => 'registered',
            ],
            [//2
                'parent_id' => 5,
                'event_id' => 2,
                'status' => 'registered',
            ],
            [//3
                'parent_id' => 6,
                'event_id' => 1,
                'status' => 'registered',
            ],
            [//4
                'parent_id' => 6,
                'event_id' => 3,
                'status' => 'cancelled',
            ],
            [//5
                'parent_id' => 7,
                'event_id' => 2,
                'status' => 'registered',
            ],
            [//6
                'parent_id' => 7,
                'event_id' => 4,
                'status' => 'registered',
            ],
            [//7
                'parent_id' => 8,
                'event_id' => 5,
                'status' => 'registered',
            ],
        ];

        foreach ($registrations as $registration) {
            Registration::updateOrCreate(//واستخدمنا updateOrCreate عشان لو شغلت السيدر أكثر من مرة ما يضرب خطأ بسبب:$table->unique(['parent_id', 'event_id']);
                [
                    'parent_id' => $registration['parent_id'],
                    'event_id' => $registration['event_id'],
                ],
                [
                    'status' => $registration['status'],
                ]
            );
        }
    }
}