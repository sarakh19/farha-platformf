<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('registrations', function (Blueprint $table) {

            // نضيف indexes مستقلة للـ foreign keys
            $table->index('parent_id', 'registrations_parent_id_index');
            $table->index('event_id', 'registrations_event_id_index');

            // نحذف الـ unique القديم:
            // parent_id + event_id
            $table->dropUnique('registrations_parent_id_event_id_unique');

            // نضيف الـ unique الجديد:
            // parent_id + event_id + child_id
            $table->unique(
                ['parent_id', 'event_id', 'child_id'],
                'registrations_parent_event_child_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $table) {

            // نحذف الـ unique الجديد
            $table->dropUnique('registrations_parent_event_child_unique');

            // نرجع الـ unique القديم
            $table->unique(
                ['parent_id', 'event_id'],
                'registrations_parent_id_event_id_unique'
            );

            // نحذف الـ indexes الإضافية
            $table->dropIndex('registrations_parent_id_index');
            $table->dropIndex('registrations_event_id_index');
        });
    }
};