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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
             $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
             $table->string('title');
             $table->text('description');
             $table->date('event_date');
$table->time('start_time');
$table->time('end_time');
$table->enum('event_type', ['حضورية', 'أونلاين']);
$table->string('location');
$table->string('address')->nullable();//عنوان تفصيلي
$table->string('age_group');
$table->text('requirements')->nullable();
             $table->string('image')->nullable();
             $table->integer('capacity');//عدد المقاعد
             $table->enum('status',['draft','pending','approved','rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
