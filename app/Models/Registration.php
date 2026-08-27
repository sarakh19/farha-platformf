<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
    'parent_id',
    'event_id',
 'child_id',
    'status',
];
    public function parent(){
        return $this->belongsTo(User::class,'parent_id');
    }
    public function event(){
        return $this->belongsTo(Event::class);
    }
public function child()
{
    return $this->belongsTo(
        Child::class,
        'child_id'
    );
}
}
