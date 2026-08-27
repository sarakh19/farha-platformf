<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'city',
        'profile_image',
        'role',
        'is_active',
        'birth_date',
        'gender',
        'address',
        'email_new_events',
'email_event_reminder',
'email_registration_updates',
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
protected $casts = [
    'email_new_events' => 'boolean',
    'email_event_reminder' => 'boolean',
    'email_registration_updates' => 'boolean',
];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'birth_date' => 'date',
        ];
    }


    /* =========================================================
       Organizer Events
    ========================================================= */

    public function events()
    {
        return $this->hasMany(
            Event::class,
            'organizer_id'
        );
    }


    /* =========================================================
       Parent Registrations
    ========================================================= */

    public function registrations()
    {
        return $this->hasMany(
            Registration::class,
            'parent_id'
        );
    }


    /* =========================================================
       Parent Children
    ========================================================= */

    public function children()
    {
        return $this->hasMany(
            Child::class,
            'user_id'
        );
    }
}