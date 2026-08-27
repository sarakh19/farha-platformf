<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /* =========================================================
       Fillable
    ========================================================= */

    protected $fillable = [
        'organizer_id',
        'category_id',
        'title',
        'description',
        'event_type',
        'event_date',
        'start_time',
        'end_time',
        'location',
        'address',
        'age_group',
        'capacity',
        'requirements',
        'image',
        'status',
    ];


    /* =========================================================
       Casts
    ========================================================= */

    protected $casts = [
        'event_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'capacity' => 'integer',
    ];


    /* =========================================================
       Category
    ========================================================= */

    public function category()
    {
        return $this->belongsTo(
            Category::class
        );
    }


    /* =========================================================
       Organizer
    ========================================================= */

    public function organizer()
    {
        return $this->belongsTo(
            User::class,
            'organizer_id'
        );
    }


    /* =========================================================
       Registrations
    ========================================================= */

    public function registrations()
    {
        return $this->hasMany(
            Registration::class,
            'event_id'
        );
    }
}