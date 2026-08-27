<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table
                ->boolean('email_new_events')
                ->default(true);

            $table
                ->boolean('email_event_reminder')
                ->default(true);

            $table
                ->boolean('email_registration_updates')
                ->default(true);
        });
    }


    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'email_new_events',
                'email_event_reminder',
                'email_registration_updates',
            ]);
        });
    }
};