<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE registrations
            MODIFY status ENUM(
                'pending',
                'registered',
                'confirmed',
                'approved',
                'accepted',
                'rejected',
                'cancelled',
                'canceled'
            )
            NOT NULL
            DEFAULT 'pending'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE registrations
            MODIFY status ENUM(
                'registered',
                'cancelled'
            )
            NOT NULL
            DEFAULT 'registered'
        ");
    }
};